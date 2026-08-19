# CTI Multi-Agent Pipeline — MVP Build Plan

## Project Summary
An agentic Cyber Threat Intelligence (CTI) pipeline that ingests text from public/historical datasets (and optionally public Telegram channels), extracts entities (vendor names, crypto wallets, PGP keys), classifies content (Legit / Scam / Illicit), enriches flagged crypto wallets against blockchain + threat-intel APIs, and outputs a STIX 2.1 threat intelligence bundle delivered via a Discord/Slack webhook.

**Hard constraint (non-negotiable):** No live dark net / Tor scraping. No targeting real illicit Telegram channels. Use public, historical, or synthetic labeled datasets only. This is a design choice to demonstrate responsible CTI tooling — state this explicitly in any demo or writeup.

---

## Architecture

```
[Dataset / Public Telegram] → [Extraction Agent] → [Classification Agent] → [Enrichment Agent] → [Report Agent] → [Webhook / STIX Output]
```

Orchestration: LangGraph (preferred) or CrewAI, connecting each stage as a node/agent with explicit handoff logic (e.g., only route to Enrichment Agent if classification confidence > 85% for "Illicit").

---

## Stage-by-Stage Plan

### Stage 0 — Environment Setup
- [ ] Install Ollama, pull `phi3:mini` or `llama3:8b`
- [ ] Python env: `langgraph` (or `crewai`), `outlines` or `instructor`, `stix2`, `requests`, `python-dotenv`
- [ ] Get free API access: Blockcypher (no key needed for basic tier), Blockchain.com API
- [ ] Create a Discord server + webhook URL for report delivery (10 min setup)

### Stage 1 — Data Source
- [ ] Download a Kaggle dark web marketplace dataset (e.g., "Dark Web Market" / "Agora Marketplace" listing dumps)
- [ ] Load into a simple local store (SQLite or just JSON/CSV — no need for a real DB at MVP stage)
- [ ] (Optional, later) Telethon script pulling from 1-2 public, legal crypto/OSINT Telegram channels for a "live ingestion" demo moment — keep these separate from the illicit-labeled dataset

### Stage 2 — Extraction Agent
- [ ] Prompt Ollama model with structured JSON schema output (via `outlines` or `instructor`) to extract:
  - Vendor/entity name
  - Crypto wallet address (regex-assisted: BTC `^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$`, ETH `^0x[a-fA-F0-9]{40}$`)
  - PGP key block (regex: `-----BEGIN PGP PUBLIC KEY BLOCK-----`)
  - Platform/URL references
- [ ] Test on 5-10 sample listings, validate JSON output is consistently well-formed

### Stage 3 — Classification Agent
- [ ] MVP: few-shot prompt the same Ollama model to classify each item as `Legit` / `Scam` / `Illicit` with a confidence score
- [ ] Stretch goal: fine-tune DistilBERT on labeled dataset (Colab free GPU) to replace the few-shot approach
- [ ] Define the routing rule: `Illicit` + confidence > 85% → trigger Enrichment Agent

### Stage 4 — Enrichment Agent (crypto wallets)
- [ ] Query Blockcypher API for transaction volume + address age on flagged wallets
- [ ] Cross-reference address against public threat-intel sources (Chainabuse public lookup, abuse.ch feeds)
- [ ] Flag as "tainted/monitored" if matches found

### Stage 5 — Report Agent
- [ ] Compile extracted + enriched data into a STIX 2.1 bundle using the `stix2` Python SDK (Indicator, ThreatActor, Relationship objects)
- [ ] Generate a short executive summary (can reuse the local LLM for this)
- [ ] POST the summary + key IOCs to the Discord webhook

### Stage 6 — Orchestration Layer
- [ ] Wire Stages 2-5 as nodes in a LangGraph graph with explicit conditional edges (classification confidence gate)
- [ ] Add basic logging at each node so the pipeline's decisions are visible/debuggable

### Stage 7 — Polish (only if time remains)
- [ ] Simple CLI or minimal web UI (Streamlit) to trigger a run and show results
- [ ] Swap few-shot classifier for fine-tuned DistilBERT
- [ ] Add live Telethon ingestion path

---

## Suggested Build Order (priority)

1. Ollama + Phi-3 extraction working on sample data
2. Extraction → few-shot classification
3. Flagged wallet → Blockcypher lookup → printed result
4. Result → STIX bundle → Discord webhook
5. LangGraph orchestration tying it together
6. Stretch: fine-tuned classifier, live Telegram ingestion, UI

---

## Key Resources / Libraries

| Purpose | Tool |
|---|---|
| Local LLM | Ollama (Phi-3-mini / Llama-3-8B) |
| Structured LLM output | `outlines` or `instructor` |
| Classification (stretch) | DistilBERT (HuggingFace) |
| Blockchain lookup | Blockcypher API, Blockchain.com API |
| Threat intel cross-ref | Chainabuse, abuse.ch |
| Orchestration | LangGraph or CrewAI |
| Report format | `stix2` (official OASIS SDK) |
| Alerting | Discord webhook (`requests.post`) |
| Datasets | Kaggle Dark Web Market dumps, DUTA-10K / CoDA corpus |

---

## Notes for the AI IDE

- Prioritize getting one end-to-end path working (dataset → extraction → classification → enrichment → webhook) before adding orchestration polish.
- Keep all "illicit" example data confined to the pre-labeled dataset — do not write code that live-scrapes dark net markets or targets real illicit Telegram channels.
- Favor free-tier / local-only tools throughout (Ollama over paid LLM APIs, free-tier blockchain APIs) to keep this fully runnable offline/without billing during the hackathon.
