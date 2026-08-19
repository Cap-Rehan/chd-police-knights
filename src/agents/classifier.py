import json
import logging
from typing import Dict, Any
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage

from src.models.schemas import ClassificationResult, ClassificationCategory, ExtractedEntities
from src import config

logger = logging.getLogger("cti_pipeline.classifier")

FEW_SHOT_SYSTEM_PROMPT = """You are an expert Cyber Threat Intelligence (CTI) classification agent.
Your objective is to classify listings, posts, or messages into one of three strict categories:
1. "Illicit": Contraband, weaponized exploits, stolen credentials, leaked databases, ransomware extortion, hacking services, illegal goods.
2. "Scam": Deceptive fraudulent schemes, fake crypto giveaways (e.g. "send 1 BTC get 2 BTC back"), phishing lures, advance-fee fraud, counterfeit claims.
3. "Legit": Legitimate open-source projects, donation solicitations, legal commercial services, standard community discussions, benign crypto usage.

Provide your classification in strictly valid JSON format matching this schema:
{
  "category": "Legit" | "Scam" | "Illicit",
  "confidence": float between 0.0 and 1.0 (e.g. 0.95),
  "reasoning": "Concise technical explanation of why this category was assigned",
  "indicators": ["list", "of", "specific", "flags", "identified"]
}

Examples:
- "Selling enterprise Pulse Secure VPN credentials and domain hashes for 0.5 BTC" -> Illicit (0.95 confidence)
- "Send 0.5 BTC to Elon Musk promo address and receive 1.0 BTC immediately" -> Scam (0.98 confidence)
- "Support our open-source threat intelligence library with BTC donations" -> Legit (0.92 confidence)

Return ONLY the JSON object. Do not include markdown code fences or explanatory text.
"""


class ClassificationAgent:
    def __init__(self, model_name: str = config.OLLAMA_MODEL, base_url: str = config.OLLAMA_BASE_URL):
        self.model_name = model_name
        self.base_url = base_url
        try:
            self.llm = ChatOllama(
                model=model_name,
                base_url=base_url,
                temperature=0.0,
                format="json"
            )
        except Exception as e:
            logger.warning(f"Failed to initialize ChatOllama with format='json': {e}")
            self.llm = ChatOllama(model=model_name, base_url=base_url, temperature=0.0)

    def classify(self, text: str, extracted: ExtractedEntities = None) -> ClassificationResult:
        context_str = f"Raw Text:\n{text}\n"
        if extracted:
            context_str += f"\nExtracted Context:\n- Vendor: {extracted.vendor_alias}\n- Products: {extracted.product_services}\n- Handles: {extracted.communication_handles}\n- URLs: {extracted.urls_and_mirrors}"

        try:
            response = self.llm.invoke([
                SystemMessage(content=FEW_SHOT_SYSTEM_PROMPT),
                HumanMessage(content=context_str)
            ])
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]

            data = json.loads(content.strip())
            
            # Sanitize category
            category_raw = data.get("category", "Illicit").capitalize()
            if category_raw not in [c.value for c in ClassificationCategory]:
                if "scam" in category_raw.lower():
                    category_val = ClassificationCategory.SCAM
                elif "legit" in category_raw.lower():
                    category_val = ClassificationCategory.LEGIT
                else:
                    category_val = ClassificationCategory.ILLICIT
            else:
                category_val = ClassificationCategory(category_raw)

            confidence = float(data.get("confidence", 0.8))
            confidence = max(0.0, min(1.0, confidence))

            return ClassificationResult(
                category=category_val,
                confidence=confidence,
                reasoning=data.get("reasoning", "Classified based on contextual threat indicators."),
                indicators=data.get("indicators", [])
            )

        except Exception as e:
            logger.error(f"Classification failed: {e}. Defaulting to conservative fallback.")
            return ClassificationResult(
                category=ClassificationCategory.ILLICIT,
                confidence=0.5,
                reasoning=f"LLM Classification fallback triggered due to parsing error: {e}",
                indicators=["classification_error_fallback"]
            )
