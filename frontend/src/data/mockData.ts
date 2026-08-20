import type { CTIListing, KPIMetrics, NetworkNode, NetworkEdge } from '../types/cti';

export const mockKPIMetrics: KPIMetrics = {
  entitiesResolved: 247,
  totalIngested: 84120,
  illicitListings: 6180,
  scamListings: 4320,
  trackedWallets: 1892,
  stixBundlesGenerated: 9410,
};

export const mockListings: CTIListing[] = [
  {
    id: 'DS-2024-8841',
    vendor: 'PunjabSynthetics_01',
    category: 'Drugs/RCs',
    itemTitle: 'High Purity Chemical Reagents & Pharmaceutical Intermediates (Sector Dead Drop)',
    classification: 'ILLICIT',
    confidence: 0.98,
    rawText: 'Offering batch certified pharmaceutical grade research chemicals and synthetic precursor materials. Direct drop in designated coordinates across Punjab/Chandigarh tri-city region. Escrow accepted via BTC / XMR. Contact via Telegram @punjab_synth_secure or Session ID 05f42b... PGP Key signed for verification.',
    source: 'Agora Darknet Market v3',
    discoveredAt: '10:55:12 UTC',
    urgency: 'CRITICAL',
    rebrandDetected: true,
    resolvedIdentityCluster: 'CLUSTER-CHD-SYNTH-ALPHA',
    extracted: {
      vendorAlias: 'PunjabSynthetics_01',
      productService: 'Synthetic Precursors & Controlled Chemical Compounds',
      wallets: [
        {
          currency: 'BTC',
          address: 'bc1q9d8sf78we4f2k0d8g7e9as7d9f7we4fk',
          isTainted: true,
          balanceBtc: 14.85,
          balanceUsd: 965250,
          txCount: 1482,
          firstSeen: '2023-04-11',
          lastSeen: '2024-08-19',
          clusterTag: 'High_Volume_Darknet_Vendor_Treasury',
        },
        {
          currency: 'XMR',
          address: '48edfHu7V9Z84HXn32Gq1m9K3oP7q2e1r4t8y9u0i1o2p3a4s5d6f7g8h9j0k1l2z3x4c5v6b7n8m9',
          isTainted: true,
          balanceBtc: 0,
          balanceUsd: 420000,
          txCount: 520,
          firstSeen: '2023-09-02',
          lastSeen: '2024-08-18',
          clusterTag: 'Privacy_Pool_Mixer_Output',
        }
      ],
      commsHandles: ['@punjab_synth_secure', 'session:05f42b9182cd9418', 'jabber:psynth@exploit.im'],
      onionUrls: ['http://agora3synth7wkqyq5j2kfd.onion/listing/88419', 'http://mirr2punjab98we.onion'],
      pgpKey: {
        fingerprint: '4A7B 89C1 E23F 9012 55BA 7821 DE45 1109 B8C2 4D90',
        keyId: '0xB8C24D90',
        status: 'Verified',
        rawSnippet: '-----BEGIN PGP PUBLIC KEY BLOCK-----\nmQENBF+...4A7B89C1...-----END PGP PUBLIC KEY BLOCK-----',
      },
      deliveryLocation: 'Chandigarh Sector 17 / Sector 35 / Mohali Phase 7',
    },
    enrichment: {
      threatScore: 94,
      onChainVolumeUsd: 1385250,
      txCount: 2002,
      isTainted: true,
      taintScore: 92,
      riskFlags: [
        'HIGH_VELOCITY_TX_VOLUME',
        'MIXER_HOP_DETECTED',
        'THREAT_FEED_MATCH',
        'SANCTIONS_CLUSTER_PROXIMITY'
      ],
      threatIntelMatches: [
        'OFAC_Sanction_Proximity_Tier2',
        'Chainalysis_High_Risk_Exchange_Deposit',
        'LE_Seizure_Case_Reference_CHD_2024'
      ],
      mixerHopsDetected: 3,
      sanctionProximityScore: 88,
    },
    linkedAliases: [
      {
        alias: '@punjab_synth_secure',
        platform: 'Telegram',
        matchReason: 'SHARED_PGP_KEY',
        confidence: 0.99,
        matchedIndicator: 'PGP Fingerprint: 4A7B 89C1... B8C2 4D90',
        discoveredDate: '2024-07-28',
        activeStatus: 'ACTIVE'
      },
      {
        alias: 'Chd_DarkPharma',
        platform: 'Bohemia Mirror',
        matchReason: 'SHARED_CRYPTO_WALLET',
        confidence: 0.96,
        matchedIndicator: 'BTC Wallet: bc1q9d8sf78w...',
        discoveredDate: '2024-05-14',
        activeStatus: 'MIGRATED'
      },
      {
        alias: 'NorthernApex_Chem',
        platform: 'Hydra Historical',
        matchReason: 'SHARED_PGP_KEY',
        confidence: 0.94,
        matchedIndicator: 'PGP Key ID: 0xB8C24D90',
        discoveredDate: '2022-09-10',
        activeStatus: 'TAKEN_DOWN'
      }
    ],
    copilot: {
      plainEnglishSummary: 'DarkScope Entity Resolution Engine has connected vendor "PunjabSynthetics_01" (operating on Agora) with Telegram handle "@punjab_synth_secure" and historical Bohemia profile "Chd_DarkPharma". Both profiles share the identical 4096-bit PGP fingerprint and deposit into the same high-velocity Bitcoin wallet with over $1.38M USD in on-chain turnover.',
      threatAssessment: 'CRITICAL HIGH RISK. Active local distribution syndicate distributing synthetic controlled precursors in Chandigarh Tri-City. 3 mixer hops detected across Wasabi/Tornado pools.',
      recommendedActions: [
        {
          priority: 'URGENT',
          action: 'Emergency Preservation & Freeze Request',
          target: 'Telegram Handle @punjab_synth_secure & Associated Session ID',
          justification: 'Active broadcast channel for dead-drop coordinate transmissions in Sector 17/35.'
        },
        {
          priority: 'HIGH',
          action: 'Crypto Exchange Subpoena / Blacklist Notice',
          target: 'Wallet bc1q9d8sf78we4f2k0d8g7e9as7d9f7we4fk',
          justification: 'Funds flagged routing through KYC-gated off-ramps in Tier-1 exchange cluster.'
        },
        {
          priority: 'HIGH',
          action: 'Physical Surveillance Operation',
          target: 'Designated Dead-Drop Coordinates (Sector 35 & Mohali Phase 7)',
          justification: 'Vendor operates scheduled physical courier handoffs between 22:00-02:00 IST.'
        }
      ],
      chainOfCustodyHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    },
    pipelineTrace: [
      {
        id: 'extract',
        name: 'ENTITY EXTRACTION',
        subtext: 'Regex + Local Ollama (qwen2.5:7b)',
        status: 'DONE',
        timestamp: '10:55:14 UTC',
        durationMs: 420,
        details: 'Extracted 2 crypto wallets (BTC/XMR), 3 comms handles, 1 PGP 4096-bit fingerprint, 2 onion endpoints.',
      },
      {
        id: 'classify',
        name: 'FEW-SHOT CLASSIFICATION',
        subtext: 'Zero-cloud calibrated prompt',
        status: 'DONE',
        timestamp: '10:55:16 UTC',
        durationMs: 380,
        details: 'Classified as ILLICIT (98% confidence). Category: Controlled chemical precursor with localized distribution.',
      },
      {
        id: 'route',
        name: 'CROSS-PLATFORM RESOLUTION',
        subtext: 'Graph Entity Resolution Gate',
        status: 'DONE',
        timestamp: '10:55:17 UTC',
        durationMs: 210,
        details: 'Matched 3 historical aliases via PGP fingerprint 0xB8C24D90 and BTC wallet overlap. Cluster established.',
      },
      {
        id: 'enrich',
        name: 'ON-CHAIN FORENSICS',
        subtext: 'Blockchain.info / BlockCypher APIs',
        status: 'ENRICHED',
        timestamp: '10:55:18 UTC',
        durationMs: 640,
        details: 'Calculated $1.38M USD volume, detected 3 mixer hops, OFAC sanctions proximity score 88/100.',
      },
      {
        id: 'report',
        name: 'STIX 2.1 BUNDLE & COPILOT',
        subtext: 'OASIS Standard Serializer',
        status: 'DONE',
        timestamp: '10:55:20 UTC',
        durationMs: 190,
        details: 'Serialized OASIS STIX 2.1 ThreatActor, Indicators, and Relationships into bundle--9e4c8f12.',
      }
    ],
    stixBundleId: 'bundle--9e4c8f12-58e1-4b5c-a812-78d1f2e345b1',
  },
  {
    id: 'DS-2024-8842',
    vendor: 'Chd_DarkPharma',
    category: 'Drugs/RCs',
    itemTitle: 'High Quality MDMA Tablets (Sector 17 / Mohali Phase 7 Dead Drop)',
    classification: 'ILLICIT',
    confidence: 0.95,
    rawText: 'Fresh batch of pressed party supplies and MDMA 280mg. Available for fast courier dispatch or verified geo-drop around Sector 17, Sector 35, and Mohali phase 7. Bitcoin only. Auto-finalize escrow with 5-star seller rating on WhiteHouse and Bohemia mirrors.',
    source: 'Bohemia Market Mirror 2',
    discoveredAt: '10:48:30 UTC',
    urgency: 'HIGH',
    rebrandDetected: true,
    resolvedIdentityCluster: 'CLUSTER-CHD-SYNTH-ALPHA',
    extracted: {
      vendorAlias: 'Chd_DarkPharma',
      productService: 'MDMA / Party Tablets / Fast Courier Dispatch',
      wallets: [
        {
          currency: 'BTC',
          address: 'bc1q9d8sf78we4f2k0d8g7e9as7d9f7we4fk',
          isTainted: true,
          balanceBtc: 8.42,
          balanceUsd: 547300,
          txCount: 890,
          firstSeen: '2023-11-15',
          lastSeen: '2024-08-19',
          clusterTag: 'High_Volume_Darknet_Vendor_Treasury',
        }
      ],
      commsHandles: ['@chd_pharma_bot', 'jabber:darkpharma_chd@xmpp.is'],
      onionUrls: ['http://bohemiamark7x91k2s.onion/usr/chd_darkpharma'],
      pgpKey: {
        fingerprint: '4A7B 89C1 E23F 9012 55BA 7821 DE45 1109 B8C2 4D90',
        keyId: '0xB8C24D90',
        status: 'Verified',
        rawSnippet: '-----BEGIN PGP PUBLIC KEY BLOCK-----\nmQENB...4A7B89C1...-----END PGP PUBLIC KEY BLOCK-----',
      },
      deliveryLocation: 'Sector 17 / Sector 35 / Mohali Phase 7',
    },
    enrichment: {
      threatScore: 89,
      onChainVolumeUsd: 547300,
      txCount: 890,
      isTainted: true,
      taintScore: 86,
      riskFlags: [
        'HIGH_VELOCITY_TX_VOLUME',
        'THREAT_FEED_MATCH',
        'UNHOSTED_WALLET_INTERACTION'
      ],
      threatIntelMatches: [
        'Darknet_Vendor_Telemetry_DB',
        'Chandigarh_Narcotics_Investigation_Lead_44'
      ],
      mixerHopsDetected: 2,
      sanctionProximityScore: 72,
    },
    linkedAliases: [
      {
        alias: 'PunjabSynthetics_01',
        platform: 'Agora Market',
        matchReason: 'SHARED_CRYPTO_WALLET',
        confidence: 0.98,
        matchedIndicator: 'BTC: bc1q9d8sf78w...',
        discoveredDate: '2024-08-19',
        activeStatus: 'ACTIVE'
      },
      {
        alias: '@punjab_synth_secure',
        platform: 'Telegram',
        matchReason: 'SHARED_PGP_KEY',
        confidence: 0.97,
        matchedIndicator: 'PGP: 0xB8C24D90',
        discoveredDate: '2024-07-28',
        activeStatus: 'ACTIVE'
      }
    ],
    copilot: {
      plainEnglishSummary: 'Historical Bohemia marketplace alias for CLUSTER-CHD-SYNTH-ALPHA. Links directly to Agora profile "PunjabSynthetics_01" via common Bitcoin deposit wallet and PGP key signature.',
      threatAssessment: 'High-confidence linked persona. Facilitates municipal retail orders in Chandigarh.',
      recommendedActions: [
        {
          priority: 'URGENT',
          action: 'Cross-Correlate Incident Reports',
          target: 'Chandigarh Police FIR #114/2024',
          justification: 'Physical dead-drop packaging matches seizures made in Sector 17.'
        }
      ],
      chainOfCustodyHash: 'sha256:3a11b899721044e290118891ac4101e428410294bfa'
    },
    pipelineTrace: [
      {
        id: 'extract',
        name: 'ENTITY EXTRACTION',
        subtext: 'Regex + Local Ollama',
        status: 'DONE',
        timestamp: '10:48:32 UTC',
        durationMs: 390,
        details: 'Extracted 1 shared BTC wallet, 2 handles (@chd_pharma_bot), 1 PGP key.',
      },
      {
        id: 'classify',
        name: 'FEW-SHOT CLASSIFICATION',
        subtext: 'Few-Shot Classifier',
        status: 'DONE',
        timestamp: '10:48:34 UTC',
        durationMs: 310,
        details: 'Classified as ILLICIT (95% confidence).',
      },
      {
        id: 'route',
        name: 'CROSS-PLATFORM RESOLUTION',
        subtext: 'Cluster Matched',
        status: 'DONE',
        timestamp: '10:48:35 UTC',
        durationMs: 150,
        details: 'Unified into CLUSTER-CHD-SYNTH-ALPHA.',
      },
      {
        id: 'enrich',
        name: 'ON-CHAIN FORENSICS',
        subtext: 'Blockchain APIs',
        status: 'ENRICHED',
        timestamp: '10:48:36 UTC',
        durationMs: 510,
        details: 'Wallet enriched: 8.42 BTC final balance, active cluster history.',
      },
      {
        id: 'report',
        name: 'STIX 2.1 BUNDLE',
        subtext: 'OASIS STIX Serializer',
        status: 'DONE',
        timestamp: '10:48:38 UTC',
        durationMs: 180,
        details: 'STIX 2.1 bundle generated (bundle--3a11b8...). Tactical alert dispatched.',
      }
    ],
    stixBundleId: 'bundle--3a11b899-7210-44e2-9011-8891ac4101e4',
  },
  {
    id: 'DS-2024-8843',
    vendor: 'ShadowBroker_Vault',
    category: 'Weapons/Exploits',
    itemTitle: 'Zero-Day RCE Exploit Kit & Pulse Secure VPN Credentials Dump',
    classification: 'ILLICIT',
    confidence: 0.97,
    rawText: 'Full corporate enterprise network access package: unpatched remote code execution POC, domain admin NTDS.dit hashes, active Fortinet/Pulse VPN auth sessions. 50,000 corporate records included. Payment strictly in Monero or BTC multi-sig.',
    source: 'Exploit.in Mirror / Russian Underground',
    discoveredAt: '10:15:40 UTC',
    urgency: 'CRITICAL',
    rebrandDetected: true,
    resolvedIdentityCluster: 'CLUSTER-RANSOM-SHADOW-01',
    extracted: {
      vendorAlias: 'ShadowBroker_Vault',
      productService: '0-Day Exploits & Enterprise Credential Access',
      wallets: [
        {
          currency: 'BTC',
          address: '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo',
          isTainted: true,
          balanceBtc: 32.10,
          balanceUsd: 2086500,
          txCount: 4120,
          firstSeen: '2022-01-19',
          lastSeen: '2024-08-19',
          clusterTag: 'Ransomware_Affiliate_Treasury',
        }
      ],
      commsHandles: ['@shadowbroker_leaks', 'jabber:sbvault@thesecure.biz'],
      onionUrls: ['http://shadowvault7x81920k.onion/listing/4910'],
      pgpKey: {
        fingerprint: '3810 AA11 8812 77BC 9901 2291 CC44 8810 551A B781',
        keyId: '0x551AB781',
        status: 'Verified',
        rawSnippet: '-----BEGIN PGP PUBLIC KEY BLOCK-----\nmQENB...3810AA11...-----END PGP PUBLIC KEY BLOCK-----',
      },
      deliveryLocation: 'Encrypted Mega.nz / Keybase Drop',
    },
    enrichment: {
      threatScore: 97,
      onChainVolumeUsd: 2086500,
      txCount: 4120,
      isTainted: true,
      taintScore: 98,
      riskFlags: [
        'HIGH_VELOCITY_TX_VOLUME',
        'HIGH_VALUE_WALLET',
        'MIXER_HOP_DETECTED',
        'THREAT_FEED_MATCH'
      ],
      threatIntelMatches: [
        'Ransomware_Tainted_Address_Feed',
        'Interpol_Cybercrime_Red_Notice_Associated_Cluster'
      ],
      mixerHopsDetected: 5,
      sanctionProximityScore: 95,
    },
    linkedAliases: [
      {
        alias: '@shadowbroker_leaks',
        platform: 'Telegram',
        matchReason: 'SHARED_PGP_KEY',
        confidence: 0.99,
        matchedIndicator: 'PGP: 0x551AB781',
        discoveredDate: '2024-06-11',
        activeStatus: 'ACTIVE'
      },
      {
        alias: 'RedCipher0x',
        platform: 'Exploit.in',
        matchReason: 'SHARED_CRYPTO_WALLET',
        confidence: 0.95,
        matchedIndicator: 'BTC: 34xp4vRoCG...',
        discoveredDate: '2023-10-04',
        activeStatus: 'MIGRATED'
      }
    ],
    copilot: {
      plainEnglishSummary: 'High-severity Initial Access Broker (IAB) and exploit vendor. Linked across Exploit.in and Telegram channel "@shadowbroker_leaks". On-chain activity links to confirmed ransomware extortions.',
      threatAssessment: 'CRITICAL CYBER THREAT. PGP fingerprint verified on Russian underground forums.',
      recommendedActions: [
        {
          priority: 'URGENT',
          action: 'CERT-In / NCIIPC Threat Notification',
          target: 'Compromised VPN appliance hashes',
          justification: 'Vulnerable VPN credentials include critical infrastructure endpoints.'
        }
      ],
      chainOfCustodyHash: 'sha256:a78e12819920410a8812337190bcda11'
    },
    pipelineTrace: [
      {
        id: 'extract',
        name: 'ENTITY EXTRACTION',
        status: 'DONE',
        timestamp: '10:15:42 UTC',
        durationMs: 450,
        subtext: 'Regex & Local LLM',
        details: 'Extracted 1 high-value BTC wallet, 2 handles, 1 PGP key, exploit weaponization tags.',
      },
      {
        id: 'classify',
        name: 'FEW-SHOT CLASSIFICATION',
        status: 'DONE',
        timestamp: '10:15:44 UTC',
        durationMs: 380,
        subtext: 'Illicit Exploit Kit',
        details: 'Classified as ILLICIT (97% confidence).',
      },
      {
        id: 'route',
        name: 'CROSS-PLATFORM RESOLUTION',
        status: 'DONE',
        timestamp: '10:15:45 UTC',
        durationMs: 180,
        subtext: 'IAB Cluster Match',
        details: 'Linked to CLUSTER-RANSOM-SHADOW-01.',
      },
      {
        id: 'enrich',
        name: 'ON-CHAIN FORENSICS',
        status: 'ENRICHED',
        timestamp: '10:15:47 UTC',
        durationMs: 680,
        subtext: 'Tainted Address Feed Match',
        details: 'High-risk wallet enriched: $2.08M USD on-chain volume, 5 mixer hops, sanctions match: 97/100.',
      },
      {
        id: 'report',
        name: 'STIX 2.1 BUNDLE',
        status: 'DONE',
        timestamp: '10:15:49 UTC',
        durationMs: 190,
        subtext: 'STIX Serialized',
        details: 'STIX 2.1 bundle generated (bundle--a78e12...). High-severity cyber notice generated.',
      }
    ],
    stixBundleId: 'bundle--a78e1281-9920-410a-8812-337190bcda11',
  },
  {
    id: 'DS-2024-8844',
    vendor: 'CryptoElonBot',
    category: 'Services',
    itemTitle: '5000 BTC Official Giveaway - Send 0.1 BTC Get 0.2 BTC Back Instantly',
    classification: 'SCAM',
    confidence: 0.99,
    rawText: 'SPECIAL CELEBRATION EVENT: To accelerate decentralized adoption, our foundation is giving away 5,000 BTC. Send between 0.05 BTC and 2.0 BTC to the promotional address below and receive 2x back automatically within 5 minutes. Guaranteed transaction smart contract.',
    source: 'Telegram Public Infiltration Feeds',
    discoveredAt: '10:32:05 UTC',
    urgency: 'MEDIUM',
    rebrandDetected: false,
    extracted: {
      vendorAlias: 'CryptoElonBot',
      productService: 'Advance Fee Fraud / Crypto Doubler Scam',
      wallets: [
        {
          currency: 'BTC',
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          isTainted: false,
          balanceBtc: 0.00,
          balanceUsd: 0,
          txCount: 12,
          firstSeen: '2024-08-01',
          lastSeen: '2024-08-19',
          clusterTag: 'Advance_Fee_Scam_Lure',
        }
      ],
      commsHandles: ['@elon_giveaway_support', '@crypto_airdrop_live'],
      onionUrls: [],
      pgpKey: undefined,
      deliveryLocation: 'Online Digital Campaign',
    },
    enrichment: {
      threatScore: 65,
      onChainVolumeUsd: 14200,
      txCount: 12,
      isTainted: false,
      taintScore: 60,
      riskFlags: [
        'FRESH_UNSPENT_ADDRESS',
        'SOCIAL_ENGINEERING_INDICATOR'
      ],
      threatIntelMatches: [
        'Known_Giveaway_Scam_Template_V4'
      ],
      mixerHopsDetected: 0,
      sanctionProximityScore: 10,
    },
    copilot: {
      plainEnglishSummary: 'Automated social engineering bot running advance-fee crypto doubler scams across public Telegram groups.',
      threatAssessment: 'Financial fraud lure targeting retail victims.',
      recommendedActions: [
        {
          priority: 'MEDIUM',
          action: 'Domain & Telegram Channel Takedown',
          target: 'elon-musk-spacex-promo-bonus2024.xyz',
          justification: 'Active phishing portal collecting unspent outputs.'
        }
      ],
      chainOfCustodyHash: 'sha256:f84e109111924911b01a77c8911029ab'
    },
    pipelineTrace: [
      {
        id: 'extract',
        name: 'ENTITY EXTRACTION',
        status: 'DONE',
        timestamp: '10:32:06 UTC',
        durationMs: 310,
        subtext: 'Regex Extractor',
        details: 'Extracted 1 BTC address, 2 Telegram handles. No PGP signature present.',
      },
      {
        id: 'classify',
        name: 'FEW-SHOT CLASSIFICATION',
        status: 'DONE',
        timestamp: '10:32:08 UTC',
        durationMs: 290,
        subtext: 'Scam Confidence 99%',
        details: 'Classified as SCAM (Confidence 0.99). High-confidence match on advance-fee double payout scam lure.',
      },
      {
        id: 'route',
        name: 'CROSS-PLATFORM RESOLUTION',
        status: 'BYPASSED',
        timestamp: '10:32:09 UTC',
        durationMs: 15,
        subtext: 'Isolated Lure',
        details: 'No cross-platform PGP key present. Standalone phishing node.',
      },
      {
        id: 'enrich',
        name: 'ON-CHAIN FORENSICS',
        status: 'BYPASSED',
        timestamp: '10:32:09 UTC',
        durationMs: 20,
        subtext: 'Bypassed by Gate',
        details: 'Routing condition not met (Category=Scam). Forensic enrichment bypassed.',
      },
      {
        id: 'report',
        name: 'STIX 2.1 BUNDLE',
        status: 'DONE',
        timestamp: '10:32:10 UTC',
        durationMs: 150,
        subtext: 'STIX Recorded',
        details: 'STIX 2.1 bundle generated (bundle--f84e10...). Fraud database record logged.',
      }
    ],
    stixBundleId: 'bundle--f84e1091-1192-4911-b01a-77c8911029ab',
  },
  {
    id: 'DS-2024-8845',
    vendor: 'TorProject_Support',
    category: 'Benign/Donation',
    itemTitle: 'Official Tor Project Node Operator Infrastructure Donations',
    classification: 'LEGIT',
    confidence: 0.96,
    rawText: 'Support open-source privacy infrastructure and maintain high-speed exit relays across the globe. We accept transparent non-profit tax deductible donations in Bitcoin, Ethereum, and Monero.',
    source: 'Tor Project Official Onion Mirror',
    discoveredAt: '09:50:18 UTC',
    urgency: 'LOW',
    rebrandDetected: false,
    extracted: {
      vendorAlias: 'TorProject_Support',
      productService: 'Non-Profit Infrastructure Donations',
      wallets: [
        {
          currency: 'BTC',
          address: 'bc1qabcf67891234567890abcdef1234567890ab',
          isTainted: false,
          balanceBtc: 2.14,
          balanceUsd: 139100,
          txCount: 310,
          firstSeen: '2021-05-12',
          lastSeen: '2024-08-19',
          clusterTag: 'Non_Profit_Public_Donation_Address',
        }
      ],
      commsHandles: ['@torproject', 'email:donations@torproject.org'],
      onionUrls: ['http://2gzyxa5ihm7nsggfxnu52r2gzux42upoxjfa5h7em2q3vimtuj2b6xyd.onion'],
      pgpKey: {
        fingerprint: '1234 5678 90AB CDEF 1122 3344 5566 7788 9900 AABB',
        keyId: '0x9900AABB',
        status: 'Verified',
        rawSnippet: '-----BEGIN PGP PUBLIC KEY BLOCK-----\nmQENB...12345678...-----END PGP PUBLIC KEY BLOCK-----',
      },
      deliveryLocation: 'Global Open-Source Nodes',
    },
    enrichment: {
      threatScore: 8,
      onChainVolumeUsd: 139100,
      txCount: 310,
      isTainted: false,
      taintScore: 5,
      riskFlags: [],
      threatIntelMatches: [],
      mixerHopsDetected: 0,
      sanctionProximityScore: 0,
    },
    copilot: {
      plainEnglishSummary: 'Verified legitimate non-profit privacy infrastructure donation node. No illicit associations found.',
      threatAssessment: 'BENIGN. Safe open-source relay funding.',
      recommendedActions: [
        {
          priority: 'MEDIUM',
          action: 'Whitelist Address',
          target: 'bc1qabcf67891234567890abcdef1234567890ab',
          justification: 'Publicly audited non-profit donation address.'
        }
      ],
      chainOfCustodyHash: 'sha256:00192a448819410a9912771190bc1290'
    },
    pipelineTrace: [
      {
        id: 'extract',
        name: 'ENTITY EXTRACTION',
        status: 'DONE',
        timestamp: '09:50:19 UTC',
        durationMs: 280,
        subtext: 'Regex Extractor',
        details: 'Extracted 1 official donation wallet, 2 handles, 1 PGP signature.',
      },
      {
        id: 'classify',
        name: 'FEW-SHOT CLASSIFICATION',
        status: 'DONE',
        timestamp: '09:50:21 UTC',
        durationMs: 310,
        subtext: 'Legit Confidence 96%',
        details: 'Classified as LEGIT (Confidence 0.96). Context: Public charity and legitimate privacy infrastructure donation.',
      },
      {
        id: 'route',
        name: 'CROSS-PLATFORM RESOLUTION',
        status: 'DONE',
        timestamp: '09:50:21 UTC',
        durationMs: 90,
        subtext: 'Known Non-Profit',
        details: 'Address matched verified Tor Project directory.',
      },
      {
        id: 'enrich',
        name: 'ON-CHAIN FORENSICS',
        status: 'BYPASSED',
        timestamp: '09:50:22 UTC',
        durationMs: 15,
        subtext: 'Bypassed by Gate',
        details: 'Enrichment bypassed: Benign classification does not require active threat investigation.',
      },
      {
        id: 'report',
        name: 'STIX 2.1 BUNDLE',
        status: 'DONE',
        timestamp: '09:50:23 UTC',
        durationMs: 140,
        subtext: 'STIX Recorded',
        details: 'STIX 2.1 bundle recorded (bundle--00192a...). Classified as benign indicator.',
      }
    ],
    stixBundleId: 'bundle--00192a44-8819-410a-9912-771190bc1290',
  }
];

// Pre-built Network Graph for the Criminal Infrastructure visualization
export const mockNetworkNodes: NetworkNode[] = [
  // Cluster Alpha: Punjab Synthetics Rebrand Syndicate
  { id: 'v-punjab', label: 'PunjabSynthetics_01', sublabel: 'Agora Market v3', type: 'vendor', isFlagged: true, threatScore: 94, x: 260, y: 150 },
  { id: 'a-tg-punjab', label: '@punjab_synth_secure', sublabel: 'Telegram Channel', type: 'alias', isFlagged: true, threatScore: 92, x: 500, y: 120 },
  { id: 'v-chd-pharma', label: 'Chd_DarkPharma', sublabel: 'Bohemia Market', type: 'vendor', isFlagged: true, threatScore: 89, x: 380, y: 320 },
  { id: 'a-hydra', label: 'NorthernApex_Chem', sublabel: 'Hydra (Historical)', type: 'alias', isFlagged: false, threatScore: 75, x: 120, y: 260 },
  
  // Shared Infrastructure Nodes
  { id: 'pgp-b8c2', label: 'PGP: 0xB8C24D90', sublabel: '4096-bit RSA Fingerprint', type: 'pgp', isFlagged: true, threatScore: 98, x: 360, y: 210 },
  { id: 'btc-bc1q', label: 'BTC: bc1q9d8sf...', sublabel: '$1.38M Vol (3 Mixer Hops)', type: 'wallet', isFlagged: true, threatScore: 94, x: 440, y: 250 },
  { id: 'xmr-48ed', label: 'XMR: 48edfHu7...', sublabel: 'Privacy Pool Mixer Output', type: 'wallet', isFlagged: true, threatScore: 90, x: 180, y: 110 },
  { id: 'loc-chd', label: 'Chandigarh Sector 17/35', sublabel: 'Municipal Dead-Drops', type: 'location', isFlagged: true, threatScore: 85, x: 540, y: 340 },

  // Cluster Beta: ShadowBroker Exploit Ring
  { id: 'v-shadow', label: 'ShadowBroker_Vault', sublabel: 'Exploit.in Mirror', type: 'vendor', isFlagged: true, threatScore: 97, x: 740, y: 170 },
  { id: 'a-tg-shadow', label: '@shadowbroker_leaks', sublabel: 'Telegram Leaks', type: 'alias', isFlagged: true, threatScore: 95, x: 880, y: 130 },
  { id: 'pgp-551a', label: 'PGP: 0x551AB781', sublabel: 'IAB Exploit Key', type: 'pgp', isFlagged: true, threatScore: 96, x: 800, y: 240 },
  { id: 'btc-34xp', label: 'BTC: 34xp4vRo...', sublabel: '$2.08M Ransomware Treasury', type: 'wallet', isFlagged: true, threatScore: 98, x: 760, y: 330 },
];

export const mockNetworkEdges: NetworkEdge[] = [
  // Cluster Alpha Links
  { id: 'e1', source: 'v-punjab', target: 'pgp-b8c2', label: 'SIGNS_WITH', type: 'strong' },
  { id: 'e2', source: 'a-tg-punjab', target: 'pgp-b8c2', label: 'SHARES_KEY', type: 'alert' },
  { id: 'e3', source: 'v-chd-pharma', target: 'pgp-b8c2', label: 'MATCHED_KEY', type: 'alert' },
  { id: 'e4', source: 'a-hydra', target: 'pgp-b8c2', label: 'HISTORICAL_KEY', type: 'dashed' },
  
  { id: 'e5', source: 'v-punjab', target: 'btc-bc1q', label: 'DEPOSITS_TO', type: 'strong' },
  { id: 'e6', source: 'v-chd-pharma', target: 'btc-bc1q', label: 'CO-DEPOSITS', type: 'alert' },
  { id: 'e7', source: 'v-punjab', target: 'xmr-48ed', label: 'ACCEPTS_ESCROW', type: 'strong' },
  { id: 'e8', source: 'v-chd-pharma', target: 'loc-chd', label: 'DEAD_DROP_GEO', type: 'strong' },
  { id: 'e9', source: 'v-punjab', target: 'loc-chd', label: 'DEAD_DROP_GEO', type: 'strong' },

  // Cluster Beta Links
  { id: 'e10', source: 'v-shadow', target: 'pgp-551a', label: 'SIGNS_WITH', type: 'strong' },
  { id: 'e11', source: 'a-tg-shadow', target: 'pgp-551a', label: 'CROSS_POSTED_KEY', type: 'alert' },
  { id: 'e12', source: 'v-shadow', target: 'btc-34xp', label: 'RANSOM_TREASURY', type: 'alert' },
];
