import re
import json
import logging
from typing import List, Dict, Any, Optional
from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage

from src.models.schemas import ExtractedEntities, CryptoWallet, PGPKey
from src import config

logger = logging.getLogger("cti_pipeline.extractor")

# High-precision regular expressions for crypto and CTI entities
BTC_REGEX = r"\b(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{25,62})\b"
ETH_REGEX = r"\b(0x[a-fA-F0-9]{40})\b"
XMR_REGEX = r"\b(4[0-9AB][1-9A-HJ-NP-Za-km-z]{93})\b"
PGP_BLOCK_REGEX = r"-----BEGIN PGP PUBLIC KEY BLOCK-----[\s\S]*?-----END PGP PUBLIC KEY BLOCK-----"
PGP_FINGERPRINT_REGEX = r"\b([0-9A-Fa-f]{4}[\s-]?[0-9A-Fa-f]{4}[\s-]?[0-9A-Fa-f]{4}[\s-]?[0-9A-Fa-f]{4}[\s-]?[0-9A-Fa-f]{4}[\s-]?[0-9A-Fa-f]{4}[\s-]?[0-9A-Fa-f]{4}[\s-]?[0-9A-Fa-f]{4}[\s-]?[0-9A-Fa-f]{4}[\s-]?[0-9A-Fa-f]{4})\b"
ONION_REGEX = r"\b([a-z2-7]{16,56}\.onion(?:\/[^\s]*)?)\b"
TELEGRAM_REGEX = r"(?:@|t\.me\/)([a-zA-Z0-9_]{5,32})"
EMAIL_REGEX = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"


class ExtractionAgent:
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
            logger.warning(f"Failed to initialize ChatOllama with format='json': {e}. Falling back to standard LLM.")
            self.llm = ChatOllama(model=model_name, base_url=base_url, temperature=0.0)

    def extract_with_regex(self, text: str) -> Dict[str, Any]:
        """Deterministic regex-based extraction for high-confidence IOCs."""
        wallets: List[CryptoWallet] = []
        pgp_keys: List[PGPKey] = []
        handles: List[str] = []
        urls: List[str] = []

        # Bitcoin
        for match in re.finditer(BTC_REGEX, text):
            addr = match.group(1)
            wallets.append(CryptoWallet(currency="BTC", address=addr, context=f"Regex match at index {match.start()}"))

        # Ethereum
        for match in re.finditer(ETH_REGEX, text):
            addr = match.group(1)
            wallets.append(CryptoWallet(currency="ETH", address=addr, context=f"Regex match at index {match.start()}"))

        # Monero
        for match in re.finditer(XMR_REGEX, text):
            addr = match.group(1)
            wallets.append(CryptoWallet(currency="XMR", address=addr, context=f"Regex match at index {match.start()}"))

        # PGP Blocks
        for match in re.finditer(PGP_BLOCK_REGEX, text):
            pgp_keys.append(PGPKey(raw_key=match.group(0)))

        # PGP Fingerprints
        for match in re.finditer(PGP_FINGERPRINT_REGEX, text):
            fp = match.group(1).replace(" ", "").replace("-", "")
            pgp_keys.append(PGPKey(raw_key=f"FINGERPRINT:{fp}", fingerprint=fp))

        # Onion URLs
        for match in re.finditer(ONION_REGEX, text, re.IGNORECASE):
            urls.append(match.group(1))

        # Telegram
        for match in re.finditer(TELEGRAM_REGEX, text):
            handles.append(f"@{match.group(1)}")

        # Email / Jabber
        for match in re.finditer(EMAIL_REGEX, text):
            handles.append(match.group(0))

        return {
            "wallets": wallets,
            "pgp_keys": pgp_keys,
            "handles": list(set(handles)),
            "urls": list(set(urls)),
        }

    def extract_with_llm(self, text: str) -> Dict[str, Any]:
        """Extract higher-level semantic entities (vendor aliases, products/services) using Ollama."""
        system_prompt = (
            "You are an expert Cyber Threat Intelligence (CTI) entity extraction agent.\n"
            "Analyze the provided text and extract entities in valid JSON matching this schema:\n"
            "{\n"
            '  "vendor_alias": string or null,\n'
            '  "product_services": list of strings (e.g. "VPN credentials", "exploit", "donation"),\n'
            '  "communication_handles": list of strings,\n'
            '  "urls_and_mirrors": list of strings\n'
            "}\n"
            "Return ONLY the JSON object. Do not include markdown code blocks or additional text."
        )

        try:
            response = self.llm.invoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=f"Listing Text:\n{text}")
            ])
            content = response.content.strip()
            # Clean possible markdown block if LLM wrapped it
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            
            data = json.loads(content.strip())
            return data
        except Exception as e:
            logger.error(f"LLM extraction error: {e}")
            return {
                "vendor_alias": None,
                "product_services": [],
                "communication_handles": [],
                "urls_and_mirrors": [],
            }

    def extract(self, text: str) -> ExtractedEntities:
        """Combine regex precision with LLM semantic understanding."""
        regex_res = self.extract_with_regex(text)
        llm_res = self.extract_with_llm(text)

        # Merge unique handles
        all_handles = list(set(regex_res["handles"] + llm_res.get("communication_handles", [])))
        # Merge unique URLs
        all_urls = list(set(regex_res["urls"] + llm_res.get("urls_and_mirrors", [])))

        # Deduplicate wallets by address
        unique_wallets_dict = {}
        for w in regex_res["wallets"]:
            unique_wallets_dict[w.address.lower()] = w
        unique_wallets = list(unique_wallets_dict.values())

        # Deduplicate PGP keys
        unique_pgp_dict = {}
        for p in regex_res["pgp_keys"]:
            unique_pgp_dict[p.raw_key] = p
        unique_pgp = list(unique_pgp_dict.values())

        return ExtractedEntities(
            vendor_alias=llm_res.get("vendor_alias"),
            wallets=unique_wallets,
            pgp_keys=unique_pgp,
            communication_handles=all_handles,
            urls_and_mirrors=all_urls,
            product_services=llm_res.get("product_services", []),
            raw_text=text
        )
