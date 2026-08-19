# CTI Multi-Agent Pipeline

An agentic Cyber Threat Intelligence (CTI) pipeline built with **LangGraph**, **Ollama**, and **STIX 2.1**. Ingests text from historical threat dumps (such as Agora Marketplace), extracts entities (cryptocurrency wallets, PGP keys, threat actor aliases), classifies threat severity (`Legit` / `Scam` / `Illicit`), enriches flagged crypto indicators via blockchain and threat intelligence APIs, and outputs standardized OASIS STIX 2.1 JSON bundles with Discord/Slack webhook alerting.

---

## 🔒 Responsible CTI Policy
**Strict Constraint:** This tool is designed exclusively for defense and threat intelligence operations. It operates strictly on public, historical, or synthetic labeled datasets. No live darknet/Tor scraping or illicit channels are targeted.

---

## 🏗 Architecture & Flow

```
[Agora Dataset / Text Input]
            ↓
    [Extraction Agent]       (Regex + Ollama JSON Schema Entity Extraction)
            ↓
  [Classification Agent]     (Few-Shot Calibrated Prompting: Legit/Scam/Illicit)
            ↓
     (Gate: Illicit & Confidence ≥ 0.85 & Wallets present?)
       ├── YES ──→ [Enrichment Agent]   (Blockchain APIs & Threat Intel Feeds) ──┐
       └── NO  ──────────────────────────────────────────────────────────────────┤
                                                                                 ↓
                                                                          [Report Agent]
                                                                (STIX 2.1 Bundle + Webhook Alert)
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.10+
- [Ollama](https://ollama.com/) running locally:
  ```bash
  ollama run qwen2.5:7b
  ```

### 2. Installation
```bash
pip install -r requirements.txt
cp .env.example .env
```

### 3. Running the Pipeline on Historical Datasets

#### Ingest directly from Agora Marketplace Dump (`Agora.csv`):
```bash
# Ingest 5 hacking listings from Agora
python -m src.cli --agora --agora-category "Services/Hacking" --limit 5

# Ingest and search for keyword
python -m src.cli --agora --agora-query "bitcoin" --limit 3
```

#### Run on Sample JSON Dataset:
```bash
python -m src.cli --sample
```

#### Run on a Custom File:
```bash
python -m src.cli --file path/to/listings.json
```

#### Analyze a Raw Text Snippet:
```bash
python -m src.cli --text "Vendor: ShadowX. Selling enterprise DB dumps for 0.5 BTC: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
```

---

## 📁 Output Artifacts
STIX 2.1 threat intelligence bundles are automatically generated and saved under `output/`:
- `output/stix_<LISTING_ID>.json`

Each bundle contains OASIS STIX 2.1 objects:
- `Identity` (Reporting system)
- `ThreatActor` (Extracted alias and threat classification)
- `Indicator` (Crypto wallets, onion URLs, infrastructure)
- `Relationship` (Attribution and indicator linkage)
