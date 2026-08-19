import logging
import requests
from typing import List, Optional
from src.models.schemas import CryptoWallet, WalletEnrichment, EnrichmentReport
from src import config

logger = logging.getLogger("cti_pipeline.enricher")

# Known public threat indicators / sanctions / darknet historical seeds for offline/fast cross-referencing
KNOWN_HIGH_RISK_INDICATORS = {
    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa": ["Genesis_Block_Historical_Tag", "High_Profile_Monitoring"],
    "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy": ["High_Volume_Exchange_Hotwallet", "Scam_Lure_Target"],
    "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo": ["Top_10_Whale_Address", "High_Profile_Wallet"],
    "0x52908400098527886E0F7030069857D2E4169EE7": ["Known_Malicious_Deployer_Watchlist"],
}


class EnrichmentAgent:
    def __init__(self, api_token: Optional[str] = config.BLOCKCYPHER_API_TOKEN):
        self.api_token = api_token
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "CTI-Pipeline-Enricher/1.0"})

    def query_blockchain_info(self, address: str) -> Optional[dict]:
        """Query Blockchain.com public API (BTC)."""
        try:
            url = f"https://blockchain.info/rawaddr/{address}?limit=0"
            resp = self.session.get(url, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                return {
                    "balance_satoshi": data.get("final_balance"),
                    "total_received_satoshi": data.get("total_received"),
                    "total_sent_satoshi": data.get("total_sent"),
                    "tx_count": data.get("n_tx"),
                    "source": "blockchain.info"
                }
        except Exception as e:
            logger.debug(f"Blockchain.info lookup failed for {address}: {e}")
        return None

    def query_blockcypher(self, address: str, currency: str = "btc") -> Optional[dict]:
        """Query Blockcypher public API."""
        coin = "btc" if currency.upper() == "BTC" else "eth" if currency.upper() == "ETH" else "btc"
        chain = "main"
        url = f"https://api.blockcypher.com/v1/{coin}/{chain}/addrs/{address}/balance"
        params = {}
        if self.api_token:
            params["token"] = self.api_token

        try:
            resp = self.session.get(url, params=params, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                return {
                    "balance_satoshi": data.get("final_balance", data.get("balance")),
                    "total_received_satoshi": data.get("total_received"),
                    "total_sent_satoshi": data.get("total_sent"),
                    "tx_count": data.get("n_tx", data.get("final_n_tx")),
                    "source": "blockcypher"
                }
        except Exception as e:
            logger.debug(f"Blockcypher lookup failed for {address}: {e}")
        return None

    def enrich_wallet(self, wallet: CryptoWallet) -> WalletEnrichment:
        address = wallet.address
        currency = wallet.currency.upper()
        
        chain_data = None
        # Attempt Blockchain.info first for BTC, then Blockcypher
        if currency == "BTC":
            chain_data = self.query_blockchain_info(address)
        
        if not chain_data:
            chain_data = self.query_blockcypher(address, currency)

        risk_flags = []
        threat_matches = []
        is_tainted = False

        # Threat Intel Cross-referencing
        if address in KNOWN_HIGH_RISK_INDICATORS:
            threat_matches.extend(KNOWN_HIGH_RISK_INDICATORS[address])
            risk_flags.append("THREAT_FEED_MATCH")
            is_tainted = True

        # Heuristic Risk Analysis
        if chain_data:
            tx_count = chain_data.get("tx_count", 0) or 0
            total_received = chain_data.get("total_received_satoshi", 0) or 0
            
            if tx_count > 1000:
                risk_flags.append("HIGH_VELOCITY_TX_VOLUME")
            if total_received > 10_000_000_000: # > 100 BTC
                risk_flags.append("HIGH_VALUE_WALLET")
            if tx_count == 0:
                risk_flags.append("FRESH_UNSPENT_ADDRESS")

            return WalletEnrichment(
                address=address,
                currency=currency,
                balance_satoshi=chain_data.get("balance_satoshi"),
                total_received_satoshi=chain_data.get("total_received_satoshi"),
                total_sent_satoshi=chain_data.get("total_sent_satoshi"),
                tx_count=chain_data.get("tx_count"),
                is_tainted=is_tainted,
                risk_flags=risk_flags,
                threat_intel_matches=threat_matches,
                raw_api_response=chain_data
            )
        else:
            # Fallback if offline / rate-limited
            if not risk_flags:
                risk_flags.append("OFFLINE_OR_UNINDEXED_WALLET")
            return WalletEnrichment(
                address=address,
                currency=currency,
                is_tainted=is_tainted,
                risk_flags=risk_flags,
                threat_intel_matches=threat_matches
            )

    def enrich(self, wallets: List[CryptoWallet]) -> EnrichmentReport:
        enriched_list: List[WalletEnrichment] = []
        tainted_count = 0
        total_risk_score = 0.0

        for w in wallets:
            enriched = self.enrich_wallet(w)
            enriched_list.append(enriched)
            if enriched.is_tainted:
                tainted_count += 1
                total_risk_score += 0.9
            elif enriched.risk_flags and "FRESH_UNSPENT_ADDRESS" not in enriched.risk_flags:
                total_risk_score += 0.5

        overall_score = min(1.0, (total_risk_score / max(1, len(wallets)))) if wallets else 0.0
        
        summary = (
            f"Enriched {len(wallets)} wallet(s). "
            f"Tainted/Monitored: {tainted_count}. "
            f"Overall wallet threat score: {overall_score:.2f}."
        )

        return EnrichmentReport(
            enriched_wallets=enriched_list,
            overall_threat_score=overall_score,
            summary=summary
        )
