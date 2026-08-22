import os
import sys
import json
import argparse
import logging
from typing import Optional
from pathlib import Path
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.logging import RichHandler

from src.pipeline import CTIPipeline
from src.models.schemas import ClassificationCategory
from src.ingestion import AgoraIngestion
from src import config

# Setup Rich console and logger
console = Console()
logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL.upper(), logging.INFO),
    format="%(message)s",
    datefmt="[%X]",
    handlers=[RichHandler(console=console, rich_tracebacks=True, show_path=False)]
)
logger = logging.getLogger("cti_cli")


def print_result_summary(state: dict, output_dir: Optional[Path] = None):
    listing_id = state.get("listing_id", "N/A")
    source = state.get("source", "N/A")
    extracted = state.get("extracted", {})
    classification = state.get("classification", {})
    enrichment = state.get("enrichment")
    stix_bundle = state.get("stix_bundle")

    category = classification.get("category", "UNKNOWN")
    confidence = classification.get("confidence", 0.0)

    # Color scheme based on classification
    if category == ClassificationCategory.ILLICIT.value:
        cat_style = "bold red"
    elif category == ClassificationCategory.SCAM.value:
        cat_style = "bold yellow"
    else:
        cat_style = "bold green"

    table = Table(title=f"Pipeline Results: [{listing_id}] ({source})", show_header=True, header_style="bold magenta")
    table.add_column("Stage / Metric", style="cyan", width=25)
    table.add_column("Details", style="white")

    table.add_row("Classification", f"[{cat_style}]{category}[/{cat_style}] (Confidence: {confidence * 100:.1f}%)")
    table.add_row("Reasoning", classification.get("reasoning", "N/A"))
    
    # Extracted Details
    vendor = extracted.get("vendor_alias") or "Unknown"
    wallets = extracted.get("wallets", [])
    pgp = extracted.get("pgp_keys", [])
    handles = extracted.get("communication_handles", [])
    urls = extracted.get("urls_and_mirrors", [])
    
    wallet_str = ", ".join([f"{w.get('currency')}:{w.get('address')}" for w in wallets]) if wallets else "None detected"
    table.add_row("Extracted Vendor", vendor)
    table.add_row("Crypto Wallets", wallet_str)
    table.add_row("PGP Keys Found", str(len(pgp)))
    table.add_row("Contact Handles", ", ".join(handles) if handles else "None")
    table.add_row("URLs / Mirrors", ", ".join(urls) if urls else "None")

    # Enrichment Details
    if enrichment:
        tainted = any(ew.get("is_tainted") for ew in enrichment.get("enriched_wallets", []))
        tainted_str = "[bold red]YES[/bold red]" if tainted else "[green]NO[/green]"
        table.add_row("Enrichment Status", f"Threat Score: {enrichment.get('overall_threat_score', 0):.2f} | Tainted: {tainted_str}")
        table.add_row("Enrichment Summary", enrichment.get("summary", "N/A"))
    else:
        table.add_row("Enrichment Status", "[dim]Bypassed (Not flagged as high-confidence Illicit with wallets)[/dim]")

    # STIX Bundle Status
    if stix_bundle:
        stix_objects = len(stix_bundle.get("objects", []))
        table.add_row("STIX 2.1 Bundle", f"Generated ({stix_objects} objects)")

    console.print(table)

    # Save STIX bundle to output directory
    if output_dir and stix_bundle:
        output_dir.mkdir(parents=True, exist_ok=True)
        bundle_file = output_dir / f"stix_{listing_id}.json"
        with open(bundle_file, "w", encoding="utf-8") as f:
            json.dump(stix_bundle, f, indent=2)
        console.print(f"[dim]STIX 2.1 bundle exported to: {bundle_file}[/dim]\n")


def main():
    parser = argparse.ArgumentParser(description="TorIntel CTI Multi-Agent Pipeline CLI")
    parser.add_argument("--sample", action="store_true", help="Run pipeline on sample dataset in data/sample_listings.json")
    parser.add_argument("--agora", action="store_true", help="Ingest directly from Agora.csv/Agora.csv dataset")
    parser.add_argument("--agora-category", type=str, default=None, help="Filter Agora listings by category (e.g. 'Services/Hacking', 'Forgeries')")
    parser.add_argument("--agora-query", type=str, default=None, help="Search query to filter Agora listings (e.g. 'exploit', 'bitcoin')")
    parser.add_argument("--agora-path", type=str, default="Agora.csv/Agora.csv", help="Path to Agora.csv file")
    parser.add_argument("--limit", type=int, default=3, help="Max number of listings to process (default: 3)")
    parser.add_argument("--file", type=str, help="Path to a JSON file containing listings to process")
    parser.add_argument("--text", type=str, help="Raw text snippet to analyze directly")
    parser.add_argument("--output-dir", type=str, default="output", help="Directory to save generated STIX 2.1 JSON bundles")
    parser.add_argument("--model", type=str, default=config.OLLAMA_MODEL, help=f"Ollama model (default: {config.OLLAMA_MODEL})")

    args = parser.parse_args()
    output_path = Path(args.output_dir)

    console.print(Panel.fit(
        "[bold cyan]CTI Multi-Agent Intelligence Pipeline[/bold cyan]\n"
        f"[dim]Model: {args.model} | LangGraph Orchestration | STIX 2.1 Output[/dim]",
        border_style="cyan"
    ))

    pipeline = CTIPipeline(model_name=args.model)

    if args.text:
        console.print("[yellow]Processing direct text input...[/yellow]")
        result = pipeline.run(
            listing_id="MANUAL-001",
            raw_text=args.text,
            source="Manual_CLI_Input"
        )
        print_result_summary(result, output_dir=output_path)

    elif args.agora:
        ingestion = AgoraIngestion(csv_path=args.agora_path)
        listings = ingestion.load_records(
            category_filter=args.agora_category,
            search_query=args.agora_query,
            limit=args.limit
        )

        console.print(f"[green]Loaded {len(listings)} Agora listing(s) matching filters. Processing...[/green]\n")

        for item in listings:
            lid = item.get("listing_id", "UNKNOWN")
            raw_text = item.get("raw_text", "")
            source = item.get("source", "Agora_Dataset")
            
            result = pipeline.run(
                listing_id=lid,
                raw_text=raw_text,
                source=source,
                metadata=item.get("metadata", {})
            )
            print_result_summary(result, output_dir=output_path)

    elif args.file or args.sample:
        file_path = Path(args.file) if args.file else Path("data/sample_listings.json")
        if not file_path.exists():
            console.print(f"[bold red]File not found:[/bold red] {file_path}")
            sys.exit(1)

        with open(file_path, "r", encoding="utf-8") as f:
            listings = json.load(f)

        if args.limit:
            listings = listings[:args.limit]

        console.print(f"[green]Loaded {len(listings)} listing(s) from {file_path}. Processing...[/green]\n")
        
        for item in listings:
            lid = item.get("listing_id", "UNKNOWN")
            raw_text = item.get("raw_text", "")
            source = item.get("source", "Dataset")
            
            result = pipeline.run(
                listing_id=lid,
                raw_text=raw_text,
                source=source,
                metadata={"title": item.get("title", "")}
            )
            print_result_summary(result, output_dir=output_path)

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
