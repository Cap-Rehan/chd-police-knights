# CTI Backend Data Reference & Contract

This document provides a comprehensive specification of all data models, schemas, dataset formats, pipeline state representations, and STIX 2.1 artifacts available from the backend. Use this reference to design and architect the frontend interface.

---

## 1. Pipeline Execution & State Model (`PipelineState`)

When a listing or raw threat intelligence text is processed through the LangGraph multi-agent pipeline, it produces a structured state dictionary:

```typescript
interface PipelineState {
  listing_id: string;            // e.g. "AGORA-000042" or "LISTING-2024-001"
  source: string;                // e.g. "Agora_Marketplace", "Telegram_OSINT", "BreachForum"
  raw_text: string;              // Full original unstructured text snippet / post
  metadata: Record<string, any>; // Original item title, vendor rating, origin/destination, etc.
  extracted?: ExtractedEntities; // Stage 1 output (Entity Extraction)
  classification?: ClassificationResult; // Stage 2 output (Categorization & Confidence)
  enrichment?: EnrichmentReport; // Stage 3 output (Blockchain & Threat Intel, if triggered)
  stix_bundle?: STIX21Bundle;    // Stage 4 output (OASIS STIX 2.1 JSON)
  alert_dispatched: boolean;     // Whether external webhook was notified
  execution_logs: string[];      // Step-by-step audit logs with node timestamps
}
```

---

## 2. Extraction Agent Data Model (`ExtractedEntities`)

Extracted deterministically via regex (crypto, PGP blocks, onion URLs) and semantically via local Ollama LLM (`qwen2.5:7b`):

```typescript
interface ExtractedEntities {
  vendor_alias: string | null;           // e.g. "ShadowBroker99", "RedCipher0x"
  wallets: CryptoWallet[];               // Array of detected cryptocurrency addresses
  pgp_keys: PGPKey[];                    // Array of PGP public key blocks or fingerprints
  communication_handles: string[];       // e.g. ["@telegram_user", "vendor@jabber.calyxinstitute.org"]
  urls_and_mirrors: string[];            // e.g. ["http://marketproofs7qwdj3.onion", "https://site.com"]
  product_services: string[];            // e.g. ["VPN credentials", "0-day RCE exploit", "DB dump"]
  raw_text: string;                      // Full listing text
}

interface CryptoWallet {
  currency: "BTC" | "ETH" | "XMR" | "TRON" | string;
  address: string;                       // e.g. "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
  context?: string;                      // Index or snippet where wallet appeared
}

interface PGPKey {
  raw_key: string;                       // Full "-----BEGIN PGP PUBLIC KEY BLOCK-----..."
  fingerprint?: string;                  // e.g. "4A7B890CDEF123456789ABCDEF01234567890ABC"
}
```

---

## 3. Classification Agent Data Model (`ClassificationResult`)

Categorizes listings using a few-shot calibrated local LLM into three strict categories:

```typescript
type ClassificationCategory = "Illicit" | "Scam" | "Legit";

interface ClassificationResult {
  category: ClassificationCategory;
  confidence: number;            // Normalized float between 0.0 and 1.0 (e.g. 0.98)
  reasoning: string;             // Justification explaining why this label was assigned
  indicators: string[];          // Specific threat indicators identified (e.g. ["weaponized_exploit", "unauthenticated_rce"])
}
```

### Routing Logic Gate
- **Condition for Enrichment Agent:** `category === "Illicit"` AND `confidence >= 0.85` AND `wallets.length > 0`.
- **Otherwise:** Bypasses blockchain enrichment and proceeds directly to STIX report generation.

---

## 4. Blockchain & Threat Intel Enrichment Model (`EnrichmentReport`)

Live lookup against Blockchain.com / Blockcypher APIs and threat-intel watchlists:

```typescript
interface EnrichmentReport {
  overall_threat_score: number;  // Normalized risk score between 0.0 and 1.0 (e.g. 0.90)
  summary: string;               // Human-readable summary
  enriched_wallets: WalletEnrichment[];
}

interface WalletEnrichment {
  address: string;
  currency: string;
  balance_satoshi?: number;
  balance_usd?: number;
  total_received_satoshi?: number;
  total_sent_satoshi?: number;
  tx_count?: number;             // Total on-chain transactions
  first_seen?: string;           // ISO timestamp / date string
  last_seen?: string;            // ISO timestamp / date string
  is_tainted: boolean;           // True if found in malicious cluster or known bad feed
  risk_flags: string[];          // e.g. ["HIGH_VELOCITY_TX_VOLUME", "THREAT_FEED_MATCH", "FRESH_UNSPENT_ADDRESS"]
  threat_intel_matches: string[]; // e.g. ["Genesis_Block_Historical_Tag", "Known_Malicious_Deployer"]
  raw_api_response?: Record<string, any>;
}
```

---

## 5. Standardized STIX 2.1 Threat Bundle Model (`STIX21Bundle`)

Generated using the official OASIS `stix2` Python SDK and saved to `output/stix_<LISTING_ID>.json`:

```typescript
interface STIX21Bundle {
  type: "bundle";
  id: string; // e.g. "bundle--4f5fd367-d09a-4ba9-961a-3ae1f8261fbe"
  objects: STIXObject[];
}

type STIXObject = 
  | STIXIdentity
  | STIXThreatActor
  | STIXIndicator
  | STIXRelationship;

interface STIXIdentity {
  type: "identity";
  spec_version: "2.1";
  id: string;
  name: "CTI Multi-Agent Pipeline";
  identity_class: "system";
}

interface STIXThreatActor {
  type: "threat-actor";
  spec_version: "2.1";
  id: string;
  name: string; // e.g. "ShadowBroker99"
  threat_actor_types: ("cybercrime-vendor" | "scammer" | "threat-actor")[];
  description: string;
  aliases: string[];
}

interface STIXIndicator {
  type: "indicator";
  spec_version: "2.1";
  id: string;
  name: string; // e.g. "Cryptocurrency Wallet: BTC - 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
  pattern: string; // e.g. "[user-account:account_login = '1A1z...']" or "[url:value = 'http://...onion']"
  pattern_type: "stix";
  pattern_version: "2.1";
  valid_from: string;
}

interface STIXRelationship {
  type: "relationship";
  spec_version: "2.1";
  id: string;
  relationship_type: "indicates" | "attributed-to" | "related-to";
  source_ref: string; // Indicator ID
  target_ref: string; // ThreatActor ID
}
```

---

## 6. Available Datasets in Backend

### A. Historical Darknet Marketplace Dump (`Agora.csv/Agora.csv`)
- **Total Records:** `109,689` historical marketplace listings.
- **Columns:**
  - `Vendor` (String, e.g. "CheapPayTV", "CardMaster")
  - `Category` (String, e.g. "Services/Hacking", "Forgeries/Physical documents", "Information", "Drugs/RCs")
  - `Item` (Listing Title, e.g. "12 Month HuluPlus gift Code", "VPN 0-Day Exploit")
  - `Item Description` (Long raw text description containing contact handles, PGP keys, wallets)
  - `Price` (String, e.g. "0.05 BTC", "$25")
  - `Origin` (Country / Origin string)
  - `Destination` (Shipping route / Worldwide)
  - `Rating` (Vendor rating, e.g. "4.96/5")
  - `Remarks` (Optional notes)

### B. Curated Synthetic Samples (`data/sample_listings.json`)
Pre-validated scenarios covering all 3 threat classes:
1. `LISTING-2024-001` (**Illicit**): AD Credentials & Pulse Secure VPN leak with BTC wallet & PGP key block.
2. `LISTING-2024-002` (**Scam**): 5000 BTC Elon Musk fake giveaway / 2x return lure.
3. `LISTING-2024-003` (**Legit**): Open-source CTI tool donation request (BTC + ETH).
4. `LISTING-2024-004` (**Illicit**): Enterprise VPN 0-Day RCE exploit sale with ETH + BTC addresses & PGP fingerprint.

---

## 7. Operational Metrics & Telemetry Available for UI Ticker

| Metric Field | Type | Description / Sample Value |
|---|---|---|
| `processed_count` | Integer | Total intelligence items parsed |
| `flagged_count` | Integer | Total high-severity items (`Illicit` + `Scam`) |
| `legit_count` | Integer | Total benign / clean items |
| `scam_count` | Integer | Total fraudulent schemes |
| `illicit_count` | Integer | Total weaponized/illegal items |
| `pending_review` | Integer | Flagged items with confidence below 85% |
| `confidence_gate` | Integer / Percentage | Configured routing threshold (e.g. `85%`) |
| `pipeline_status` | Enum | `"IDLE"` \| `"RUNNING"` \| `"PROCESSING"` |
| `current_stage` | Enum | `"EXTRACT"` \| `"CLASSIFY"` \| `"ENRICH"` \| `"REPORT"` |
| `execution_logs` | Array of Strings | Chronological audit trail logs with node timestamps |

---

## 8. Relational Graph Nodes & Edges Available for Case Wall

Entities extracted across listings can be rendered as a graph:

### Node Types:
- `Vendor / Threat Actor` (attributes: alias, confidence, aliases list, first/last seen)
- `Crypto Wallet` (attributes: address, currency, is_tainted, risk_score, tx_count)
- `PGP Key` (attributes: fingerprint / key id, confidence)
- `Platform / Domain` (attributes: onion URL, domain, confidence)
- `Communication Handle` (attributes: Telegram, Session ID, Jabber email)

### Edge Connection Types:
- `uses (wallet)`: ThreatActor $\rightarrow$ Wallet
- `uses (PGP)`: ThreatActor $\rightarrow$ PGP Key
- `hosts (domain)`: ThreatActor $\rightarrow$ Platform / Onion URL
- `co-listed (market)`: ThreatActor $\leftrightarrow$ Alias
- `co-tx (blockchain)`: Wallet $\leftrightarrow$ Wallet (shared cluster / transaction flow)
- `found on (profile)`: PGP Key $\rightarrow$ Platform
