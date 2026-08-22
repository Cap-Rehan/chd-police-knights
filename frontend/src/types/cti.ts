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
  id: 'extract' | 'classify' | 'route' | 'enrich' | 'report';
  name: string;
  subtext: string;
  status: 'DONE' | 'ENRICHED' | 'BYPASSED' | 'RUNNING' | 'PENDING';
  timestamp: string;
  durationMs: number;
  details: string;
}

export interface LinkedAlias {
  alias: string;
  platform: 'Telegram' | 'Agora Market' | 'Bohemia Mirror' | 'Exploit.in' | 'WhiteHouse Market' | 'Hydra Historical';
  matchReason: 'SHARED_PGP_KEY' | 'SHARED_CRYPTO_WALLET' | 'COMMUNICATION_HANDLE' | 'GEOGRAPHIC_MUNICIPAL_CORRELATION';
  confidence: number;
  matchedIndicator: string; // e.g. "PGP: 0xB8C24D90" or "Wallet: bc1q9d8sf..."
  discoveredDate: string;
  activeStatus: 'ACTIVE' | 'MIGRATED' | 'TAKEN_DOWN';
}

export interface CopilotIntelligence {
  plainEnglishSummary: string;
  threatAssessment: string;
  recommendedActions: {
    priority: 'URGENT' | 'HIGH' | 'MEDIUM';
    action: string;
    target: string;
    justification: string;
  }[];
  chainOfCustodyHash: string;
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
  // TorIntel Entity Resolution additions:
  rebrandDetected?: boolean;
  resolvedIdentityCluster?: string;
  linkedAliases?: LinkedAlias[];
  copilot?: CopilotIntelligence;
}

export interface KPIMetrics {
  entitiesResolved: number;
  totalIngested: number;
  illicitListings: number;
  scamListings: number;
  trackedWallets: number;
  stixBundlesGenerated: number;
}

// Graph Visualization Types
export interface NetworkNode {
  id: string;
  label: string;
  sublabel?: string;
  type: 'vendor' | 'alias' | 'pgp' | 'wallet' | 'platform' | 'location';
  isFlagged?: boolean;
  threatScore?: number;
  meta?: Record<string, unknown>;
  x?: number;
  y?: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type?: 'strong' | 'dashed' | 'alert';
}
