export type ClassificationType = 'ILLICIT' | 'SCAM' | 'LEGIT';

export interface CryptoWalletEntity {
  currency: 'BTC' | 'ETH' | 'XMR' | 'USDT';
  address: string;
  isTainted: boolean;
  balanceBtc?: number;
  balanceUsd?: number;
  txCount?: number;
  firstSeen?: string;
  lastSeen?: string;
  clusterTag?: string;
}

export interface ExtractedData {
  vendorAlias: string;
  productService: string;
  wallets: CryptoWalletEntity[];
  commsHandles: string[];
  onionUrls: string[];
  pgpKey?: {
    fingerprint: string;
    keyId: string;
    status: 'Verified' | 'Unverified' | 'Expired';
    rawSnippet: string;
  };
  deliveryLocation?: string;
}

export interface EnrichmentData {
  threatScore: number;
  onChainVolumeUsd: number;
  txCount: number;
  isTainted: boolean;
  taintScore: number;
  riskFlags: string[];
  threatIntelMatches: string[];
  mixerHopsDetected: number;
  sanctionProximityScore: number;
}

export interface PipelineStep {
  id: 'extract' | 'classify' | 'enrich' | 'report';
  name: string;
  subtext: string;
  status: 'DONE' | 'ENRICHED' | 'BYPASSED' | 'RUNNING' | 'PENDING';
  timestamp: string;
  durationMs: number;
  details: string;
}

export interface CTIListing {
  id: string;
  vendor: string;
  category: 'Drugs/RCs' | 'Forgeries' | 'Weapons/Exploits' | 'Services' | 'Benign/Donation';
  itemTitle: string;
  classification: ClassificationType;
  confidence: number;
  rawText: string;
  source: string;
  discoveredAt: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  extracted: ExtractedData;
  enrichment?: EnrichmentData;
  pipelineTrace: PipelineStep[];
  stixBundleId: string;
}

export interface KPIMetrics {
  totalIngested: number;
  illicitListings: number;
  scamListings: number;
  benignTraffic: number;
  activeDarknetNodes: number;
  averageConfidence: number;
  stixBundlesGenerated: number;
}
