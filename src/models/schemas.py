from __future__ import annotations
from enum import Enum
from typing import List, Optional, Dict, Any
from typing_extensions import TypedDict
from pydantic import BaseModel, Field


class ClassificationCategory(str, Enum):
    LEGIT = "Legit"
    SCAM = "Scam"
    ILLICIT = "Illicit"


class CryptoWallet(BaseModel):
    currency: str = Field(description="Cryptocurrency symbol, e.g. BTC, ETH, XMR, LTC")
    address: str = Field(description="Wallet address string")
    context: Optional[str] = Field(default=None, description="Contextual snippet where wallet was found")


class PGPKey(BaseModel):
    raw_key: str = Field(description="PGP public key block or identifier")
    fingerprint: Optional[str] = Field(default=None, description="PGP key fingerprint if available")


class ExtractedEntities(BaseModel):
    vendor_alias: Optional[str] = Field(default=None, description="Vendor or threat actor username/alias")
    wallets: List[CryptoWallet] = Field(default_factory=list, description="Extracted crypto wallet addresses")
    pgp_keys: List[PGPKey] = Field(default_factory=list, description="Extracted PGP keys")
    communication_handles: List[str] = Field(default_factory=list, description="Telegram/XMPP/Session/Jabber handles or emails")
    urls_and_mirrors: List[str] = Field(default_factory=list, description="URLs, onion links, or market references")
    product_services: List[str] = Field(default_factory=list, description="Products, contraband, or services mentioned")
    raw_text: str = Field(default="", description="Original listing or message text")


class ClassificationResult(BaseModel):
    category: ClassificationCategory = Field(description="Category of the listing (Legit, Scam, Illicit)")
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    reasoning: str = Field(description="Justification for the classification decision")
    indicators: List[str] = Field(default_factory=list, description="Specific threat or legitimate indicators identified")


class WalletEnrichment(BaseModel):
    address: str
    currency: str
    balance_satoshi: Optional[int] = None
    balance_usd: Optional[float] = None
    total_received_satoshi: Optional[int] = None
    total_sent_satoshi: Optional[int] = None
    tx_count: Optional[int] = None
    first_seen: Optional[str] = None
    last_seen: Optional[str] = None
    is_tainted: bool = False
    risk_flags: List[str] = Field(default_factory=list)
    threat_intel_matches: List[str] = Field(default_factory=list)
    raw_api_response: Optional[Dict[str, Any]] = None


class EnrichmentReport(BaseModel):
    enriched_wallets: List[WalletEnrichment] = Field(default_factory=list)
    overall_threat_score: float = Field(ge=0.0, le=1.0, default=0.0)
    summary: str = ""


class PipelineState(TypedDict, total=False):
    listing_id: str
    raw_text: str
    source: str
    metadata: Dict[str, Any]
    extracted: Optional[Dict[str, Any]]
    classification: Optional[Dict[str, Any]]
    enrichment: Optional[Dict[str, Any]]
    stix_bundle: Optional[Dict[str, Any]]
    alert_dispatched: bool
    execution_logs: List[str]
