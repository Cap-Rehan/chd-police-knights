import json
import logging
import requests
from typing import Dict, Any, Optional
from datetime import datetime

import stix2
from stix2 import Bundle, ThreatActor, Indicator, Identity, Relationship, ObservedData

from src.models.schemas import (
    ExtractedEntities,
    ClassificationResult,
    EnrichmentReport,
    ClassificationCategory,
)
from src import config

logger = logging.getLogger("cti_pipeline.reporter")


class ReportAgent:
    def __init__(self, webhook_url: Optional[str] = config.ALERT_WEBHOOK_URL):
        self.webhook_url = webhook_url
        self.pipeline_identity = Identity(
            name="TorIntel Multi-Agent Pipeline",
            identity_class="system",
            description="Autonomous Threat Intelligence Ingestion & Classification Pipeline"
        )

    def generate_stix_bundle(
        self,
        listing_id: str,
        source: str,
        extracted: ExtractedEntities,
        classification: ClassificationResult,
        enrichment: Optional[EnrichmentReport] = None
    ) -> Dict[str, Any]:
        """Generate an OASIS STIX 2.1 compliant Threat Intelligence Bundle."""
        objects = [self.pipeline_identity]

        # 1. Threat Actor
        actor_name = extracted.vendor_alias or f"Unknown-Actor-{listing_id}"
        threat_actor = ThreatActor(
            name=actor_name,
            threat_actor_types=["cybercrime-vendor"] if classification.category == ClassificationCategory.ILLICIT else ["scammer"],
            description=f"Actor identified from {source}. Category: {classification.category.value} (Confidence: {classification.confidence:.2f})",
            aliases=[actor_name] if extracted.vendor_alias else []
        )
        objects.append(threat_actor)

        # 2. Indicators (Crypto Wallets)
        for wallet in extracted.wallets:
            pattern = f"[user-account:account_login = '{wallet.address}']"
            indicator = Indicator(
                name=f"Cryptocurrency Wallet: {wallet.currency} - {wallet.address}",
                pattern_type="stix",
                pattern=pattern,
                description=f"Flagged {wallet.currency} address associated with {actor_name} on {source}."
            )
            objects.append(indicator)

            # Relationship: Indicator -> indicates -> Threat Actor
            rel = Relationship(
                source_ref=indicator.id,
                target_ref=threat_actor.id,
                relationship_type="indicates"
            )
            objects.append(rel)

        # 3. Indicators (Onion URLs / Domains)
        for url in extracted.urls_and_mirrors:
            pattern = f"[url:value = '{url}']"
            indicator = Indicator(
                name=f"Darknet / Market URL: {url}",
                pattern_type="stix",
                pattern=pattern,
                description=f"Associated infrastructure / mirror link for {actor_name}."
            )
            objects.append(indicator)
            
            rel = Relationship(
                source_ref=indicator.id,
                target_ref=threat_actor.id,
                relationship_type="indicates"
            )
            objects.append(rel)

        # 4. STIX Bundle
        bundle = Bundle(objects=objects, allow_custom=True)
        return json.loads(bundle.serialize())

    def format_discord_payload(
        self,
        listing_id: str,
        source: str,
        extracted: ExtractedEntities,
        classification: ClassificationResult,
        enrichment: Optional[EnrichmentReport] = None
    ) -> Dict[str, Any]:
        """Format a Discord Embed / Webhook payload for real-time alerting."""
        # Color coding: Red for Illicit, Yellow for Scam, Green for Legit
        color_map = {
            ClassificationCategory.ILLICIT: 15158332, # Red
            ClassificationCategory.SCAM: 16753920,   # Orange/Yellow
            ClassificationCategory.LEGIT: 3066993,   # Green
        }
        embed_color = color_map.get(classification.category, 9807270)

        fields = [
            {"name": "Listing ID", "value": listing_id, "inline": True},
            {"name": "Source", "value": source, "inline": True},
            {"name": "Classification", "value": f"**{classification.category.value}** ({classification.confidence * 100:.1f}%)", "inline": True},
            {"name": "Vendor Alias", "value": extracted.vendor_alias or "N/A", "inline": True},
            {"name": "Reasoning", "value": classification.reasoning[:500], "inline": False},
        ]

        if extracted.wallets:
            wallet_lines = [f"• `{w.currency}`: `{w.address}`" for w in extracted.wallets]
            fields.append({"name": "Extracted Wallets", "value": "\n".join(wallet_lines)[:1000], "inline": False})

        if extracted.communication_handles:
            fields.append({"name": "Contact Handles", "value": ", ".join(extracted.communication_handles)[:500], "inline": False})

        if enrichment and enrichment.enriched_wallets:
            enrich_lines = []
            for ew in enrichment.enriched_wallets:
                flags = f" [Flags: {', '.join(ew.risk_flags)}]" if ew.risk_flags else ""
                tx_info = f" ({ew.tx_count or 0} txs)" if ew.tx_count is not None else ""
                enrich_lines.append(f"• `{ew.address[:10]}...`: Tainted={ew.is_tainted}{tx_info}{flags}")
            fields.append({"name": "Blockchain & Threat Intel Enrichment", "value": "\n".join(enrich_lines)[:1000], "inline": False})

        embed = {
            "title": f"CTI Alert: {classification.category.value} Threat Detected",
            "description": f"The multi-agent pipeline has analyzed and verified an intelligence item from `{source}`.",
            "color": embed_color,
            "fields": fields,
            "footer": {"text": "TorIntel Multi-Agent Pipeline | STIX 2.1 Standardized"},
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

        return {"embeds": [embed]}

    def dispatch_alert(
        self,
        listing_id: str,
        source: str,
        extracted: ExtractedEntities,
        classification: ClassificationResult,
        enrichment: Optional[EnrichmentReport] = None
    ) -> bool:
        """Send formatted alert to configured webhook if provided."""
        payload = self.format_discord_payload(listing_id, source, extracted, classification, enrichment)

        if not self.webhook_url:
            logger.info("No ALERT_WEBHOOK_URL set. Skipping external webhook dispatch.")
            return False

        try:
            resp = requests.post(self.webhook_url, json=payload, timeout=8)
            if resp.status_code in [200, 204]:
                logger.info(f"Successfully dispatched alert for {listing_id} to webhook.")
                return True
            else:
                logger.warning(f"Webhook dispatch returned status {resp.status_code}: {resp.text}")
                return False
        except Exception as e:
            logger.error(f"Failed to post to webhook: {e}")
            return False
