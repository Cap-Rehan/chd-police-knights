import logging
from typing import Dict, Any, Literal
from langgraph.graph import StateGraph, START, END

from src.models.schemas import (
    PipelineState,
    ExtractedEntities,
    ClassificationResult,
    EnrichmentReport,
    ClassificationCategory,
)
from src.agents.extractor import ExtractionAgent
from src.agents.classifier import ClassificationAgent
from src.agents.enricher import EnrichmentAgent
from src.agents.reporter import ReportAgent
from src import config

logger = logging.getLogger("cti_pipeline")


class CTIPipeline:
    def __init__(
        self,
        confidence_threshold: float = config.CONFIDENCE_THRESHOLD,
        model_name: str = config.OLLAMA_MODEL,
        webhook_url: str = config.ALERT_WEBHOOK_URL
    ):
        self.confidence_threshold = confidence_threshold
        self.extractor = ExtractionAgent(model_name=model_name)
        self.classifier = ClassificationAgent(model_name=model_name)
        self.enricher = EnrichmentAgent()
        self.reporter = ReportAgent(webhook_url=webhook_url)

        self.graph = self._build_graph()

    def _extract_node(self, state: PipelineState) -> Dict[str, Any]:
        """Node 1: Extract entities using regex and Ollama."""
        raw_text = state.get("raw_text", "")
        listing_id = state.get("listing_id", "UNKNOWN")
        logger.info(f"[{listing_id}] Running Extraction Agent...")

        extracted = self.extractor.extract(raw_text)
        log_msg = f"Extracted {len(extracted.wallets)} wallet(s), {len(extracted.pgp_keys)} PGP key(s), {len(extracted.communication_handles)} handle(s)."
        
        current_logs = state.get("execution_logs", [])
        return {
            "extracted": extracted.model_dump(),
            "execution_logs": current_logs + [f"ExtractNode: {log_msg}"]
        }

    def _classify_node(self, state: PipelineState) -> Dict[str, Any]:
        """Node 2: Classify text with confidence scoring."""
        raw_text = state.get("raw_text", "")
        listing_id = state.get("listing_id", "UNKNOWN")
        extracted_data = state.get("extracted")
        extracted = ExtractedEntities(**extracted_data) if extracted_data else None

        logger.info(f"[{listing_id}] Running Classification Agent...")
        classification = self.classifier.classify(raw_text, extracted)
        
        log_msg = f"Classified as '{classification.category.value}' with confidence {classification.confidence:.2f}."
        current_logs = state.get("execution_logs", [])
        return {
            "classification": classification.model_dump(),
            "execution_logs": current_logs + [f"ClassifyNode: {log_msg}"]
        }

    def _should_enrich_condition(self, state: PipelineState) -> Literal["enrich", "report"]:
        """Conditional routing gate: Illicit & Confidence > Threshold & has wallets."""
        classification_data = state.get("classification")
        extracted_data = state.get("extracted")

        if not classification_data:
            return "report"

        category = classification_data.get("category")
        confidence = float(classification_data.get("confidence", 0.0))
        wallets = extracted_data.get("wallets", []) if extracted_data else []

        if category == ClassificationCategory.ILLICIT.value and confidence >= self.confidence_threshold:
            if wallets:
                logger.info(f"Routing to Enrichment (Illicit confidence {confidence:.2f} >= {self.confidence_threshold}, {len(wallets)} wallets found).")
                return "enrich"
            else:
                logger.info("Illicit detected but no crypto wallets present to enrich. Routing directly to report.")
                return "report"
        
        logger.info(f"Bypassing Enrichment (Category: {category}, Confidence: {confidence:.2f}). Routing to report.")
        return "report"

    def _enrich_node(self, state: PipelineState) -> Dict[str, Any]:
        """Node 3: Blockchain & Threat intel enrichment for crypto wallets."""
        listing_id = state.get("listing_id", "UNKNOWN")
        extracted_data = state.get("extracted", {})
        extracted = ExtractedEntities(**extracted_data)

        logger.info(f"[{listing_id}] Running Enrichment Agent on {len(extracted.wallets)} wallet(s)...")
        enrichment_report = self.enricher.enrich(extracted.wallets)

        log_msg = f"Enriched {len(enrichment_report.enriched_wallets)} wallet(s). Overall threat score: {enrichment_report.overall_threat_score:.2f}."
        current_logs = state.get("execution_logs", [])
        return {
            "enrichment": enrichment_report.model_dump(),
            "execution_logs": current_logs + [f"EnrichNode: {log_msg}"]
        }

    def _report_node(self, state: PipelineState) -> Dict[str, Any]:
        """Node 4: STIX 2.1 generation and Webhook alerting."""
        listing_id = state.get("listing_id", "UNKNOWN")
        source = state.get("source", "Unknown_Source")
        extracted_data = state.get("extracted", {})
        classification_data = state.get("classification", {})
        enrichment_data = state.get("enrichment")

        extracted = ExtractedEntities(**extracted_data)
        classification = ClassificationResult(**classification_data)
        enrichment = EnrichmentReport(**enrichment_data) if enrichment_data else None

        logger.info(f"[{listing_id}] Running Report Agent (STIX 2.1 generation)...")
        stix_bundle = self.reporter.generate_stix_bundle(
            listing_id=listing_id,
            source=source,
            extracted=extracted,
            classification=classification,
            enrichment=enrichment
        )

        alert_sent = self.reporter.dispatch_alert(
            listing_id=listing_id,
            source=source,
            extracted=extracted,
            classification=classification,
            enrichment=enrichment
        )

        log_msg = f"Generated STIX 2.1 bundle with {len(stix_bundle.get('objects', []))} objects. Alert dispatched: {alert_sent}."
        current_logs = state.get("execution_logs", [])
        return {
            "stix_bundle": stix_bundle,
            "alert_dispatched": alert_sent,
            "execution_logs": current_logs + [f"ReportNode: {log_msg}"]
        }

    def _build_graph(self):
        builder = StateGraph(PipelineState)

        # Add Nodes
        builder.add_node("extract", self._extract_node)
        builder.add_node("classify", self._classify_node)
        builder.add_node("enrich", self._enrich_node)
        builder.add_node("report", self._report_node)

        # Add Edges
        builder.add_edge(START, "extract")
        builder.add_edge("extract", "classify")

        # Conditional Edge
        builder.add_conditional_edges(
            "classify",
            self._should_enrich_condition,
            {
                "enrich": "enrich",
                "report": "report"
            }
        )

        builder.add_edge("enrich", "report")
        builder.add_edge("report", END)

        return builder.compile()

    def run(self, listing_id: str, raw_text: str, source: str = "Dataset", metadata: dict = None) -> PipelineState:
        """Run the complete pipeline graph on a single intelligence item."""
        initial_state: PipelineState = {
            "listing_id": listing_id,
            "raw_text": raw_text,
            "source": source,
            "metadata": metadata or {},
            "execution_logs": []
        }
        final_state = self.graph.invoke(initial_state)
        return final_state
