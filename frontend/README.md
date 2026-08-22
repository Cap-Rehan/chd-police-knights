# TorIntel — Frontend SOC Dashboard

A modern, high-performance Cyber Threat Intelligence (CTI) and darknet entity resolution dashboard built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Lucide Icons**, and **Recharts**.

---

## Views & Capabilities

1. **Threat Stream & Triage Table (`ThreatStreamTable.tsx`)**
   - High-density listing stream with urgency indicators, vendor aliases, confidence bars, and threat score meters.
   - Quick filters: `ALL`, `REBRANDS`, `ILLICIT`, `SCAMS`, `PGP`.
   - 1-click blockchain enrichment simulation.

2. **Criminal Network Graph Explorer (`NetworkGraphView.tsx`)**
   - Interactive SVG node-edge graph exposing shared PGP keys, common crypto wallets, Telegram handles, and rebrand migrations across historical/active darknet platforms.
   - Entity type filtering, search, zoom/pan controls, and click-to-dossier navigation.

3. **Trafficking Trends & Intelligence Analytics (`ThreatIntelligencePanels.tsx`)**
   - Recharts visual analytics: Category distribution, cryptocurrency payment preferences, ingestion velocity over time, and operational risk breakdowns.

4. **LangGraph Autonomous Multi-Agent Pipeline Simulator (`AgentSimulatorView.tsx`)**
   - Step-by-step visual LangGraph DAG execution tracer (Ingestion -> Extraction -> Classification -> Graph Rebrand Gate -> On-Chain Forensics -> STIX 2.1 Bundler).
   - Live token-generation terminal logs (`torintel-agent-terminal: ~ langgraph.log`) and 1-click execution log export.

5. **OASIS STIX 2.1 Threat Intelligence Hub (`STIXHubView.tsx`)**
   - Standardized STIX 2.1 bundle viewer, JSON schema inspector, interactive object tree (`Identity`, `ThreatActor`, `Indicator`, `Relationship`), and 1-click `.json` export.

6. **Slide-Over Investigation Dossier Drawer (`InvestigationDrawer.tsx`)**
   - Suspect dossier with AI Copilot executive summaries, prioritized law enforcement action recommendations, cross-platform linked aliases, on-chain taint telemetry, and mixer hop analysis.

7. **Theme Engine (`ThemeProvider.tsx`, `ThemeSwitcher.tsx`)**
   - 4 dark themes: `Linear Dark`, `Vercel Clean`, `Tactical Green`, `Cobalt Blue`.
   - Persistent theme state via `localStorage` (`torintel-color-theme`).

8. **Keyboard Shortcuts**
   - `[`: Toggle collapsible sidebar
   - `/`: Focus global search input
   - `Esc`: Close investigation drawer / modals

---

## Getting Started

### Development
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

### Production Build
```bash
# Typecheck and build bundle
npm run build

# Preview build locally
npm run preview
```
