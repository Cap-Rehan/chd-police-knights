import pandas as pd
import logging
from typing import List, Dict, Any, Optional, Generator
from pathlib import Path

logger = logging.getLogger("cti_pipeline.ingestion")


class AgoraIngestion:
    """Ingestion parser for historical Agora Darknet Marketplace CSV dumps."""

    def __init__(self, csv_path: str = "Agora.csv/Agora.csv"):
        self.csv_path = Path(csv_path)

    def load_records(
        self,
        category_filter: Optional[str] = None,
        search_query: Optional[str] = None,
        limit: Optional[int] = 10,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Load and normalize Agora dataset records into pipeline-ready dictionaries."""
        if not self.csv_path.exists():
            raise FileNotFoundError(f"Agora dataset not found at {self.csv_path}")

        logger.info(f"Loading Agora dataset from {self.csv_path}...")
        df = pd.read_csv(self.csv_path, encoding="latin1")
        df.columns = [c.strip() for c in df.columns]

        # Apply category filter if requested
        if category_filter:
            df = df[df["Category"].str.contains(category_filter, case=False, na=False)]

        # Apply keyword/search filter if requested
        if search_query:
            mask = (
                df["Item"].str.contains(search_query, case=False, na=False) |
                df["Item Description"].str.contains(search_query, case=False, na=False) |
                df["Vendor"].str.contains(search_query, case=False, na=False)
            )
            df = df[mask]

        if offset:
            df = df.iloc[offset:]

        if limit:
            df = df.head(limit)

        records = []
        for idx, row in df.iterrows():
            vendor = str(row.get("Vendor", "Unknown")).strip()
            category = str(row.get("Category", "Unknown")).strip()
            item = str(row.get("Item", "Untitled Listing")).strip()
            desc = str(row.get("Item Description", "")).strip()
            price = str(row.get("Price", "N/A")).strip()
            origin = str(row.get("Origin", "Unknown")).strip()
            destination = str(row.get("Destination", "Unknown")).strip()
            rating = str(row.get("Rating", "N/A")).strip()

            # Compose formatted CTI threat intelligence text for LLM + regex processing
            raw_text = (
                f"Marketplace: Agora (Darknet Historical Dump)\n"
                f"Vendor: {vendor}\n"
                f"Category: {category}\n"
                f"Item Title: {item}\n"
                f"Price: {price}\n"
                f"Shipping/Route: {origin} -> {destination}\n"
                f"Vendor Rating: {rating}\n\n"
                f"Listing Description:\n{desc}"
            )

            record = {
                "listing_id": f"AGORA-{idx:06d}",
                "source": "Agora_Marketplace_Historical_Dump",
                "title": f"[{category}] {item}",
                "raw_text": raw_text,
                "metadata": {
                    "vendor": vendor,
                    "category": category,
                    "item": item,
                    "price": price,
                    "origin": origin,
                    "destination": destination,
                    "rating": rating,
                    "original_row_index": idx
                }
            }
            records.append(record)

        logger.info(f"Prepared {len(records)} Agora listing records for ingestion.")
        return records
