import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Shield, 
  Coins, 
  Network, 
  Fingerprint, 
  Share2, 
  Layers,
  ChevronDown
} from 'lucide-react';
import type { CTIListing } from '../types/cti';

interface STIXHubViewProps {
  listings: CTIListing[];
  selectedListing: CTIListing | null;
  onSelectListing: (listing: CTIListing) => void;
}

export const STIXHubView: React.FC<STIXHubViewProps> = ({
  listings,
  selectedListing,
  onSelectListing,
}) => {
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');
  const [copied, setCopied] = useState(false);

  const activeListing = selectedListing || listings[0];

  // Construct STIX 2.1 Bundle
  const stixBundle = {
    type: "bundle",
    id: activeListing.stixBundleId,
    spec_version: "2.1",
    objects: [
      {
        type: "identity",
        spec_version: "2.1",
        id: "identity--c7a10291-8891-419b-b891-10298a0018f2",
        created: "2024-08-19T10:55:00.000Z",
        modified: "2024-08-19T10:55:00.000Z",
        name: "DarkScope Entity-Resolution & Threat Intelligence Engine",
        identity_class: "system",
        description: "Autonomous Darknet Ingestion & Cross-Platform Rebrand Resolution Pipeline"
      },
      {
        type: "threat-actor",
        spec_version: "2.1",
        id: `threat-actor--${activeListing.vendor.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        created: "2024-08-19T10:55:00.000Z",
        modified: "2024-08-19T10:55:00.000Z",
        name: activeListing.vendor,
        threat_actor_types: [
          activeListing.category === 'Drugs/RCs' ? 'illicit-narcotics-vendor' :
          activeListing.category === 'Weapons/Exploits' ? 'initial-access-broker' : 'fraudster'
        ],
        description: `Actor identified from ${activeListing.source}. Classification: ${activeListing.classification} (Confidence: ${(activeListing.confidence * 100).toFixed(0)}%). Cluster: ${activeListing.resolvedIdentityCluster || 'UNASSIGNED'}`,
        aliases: activeListing.linkedAliases ? activeListing.linkedAliases.map(a => `${a.alias} (${a.platform})`) : [activeListing.vendor]
      },
      ...activeListing.extracted.wallets.map((w, idx) => ({
        type: "indicator",
        spec_version: "2.1",
        id: `indicator--wallet-${idx}-${activeListing.id.toLowerCase()}`,
        created: "2024-08-19T10:55:00.000Z",
        modified: "2024-08-19T10:55:00.000Z",
        name: `Cryptocurrency Wallet: ${w.currency} - ${w.address}`,
        pattern: `[user-account:account_login = '${w.address}']`,
        pattern_type: "stix",
        pattern_version: "2.1",
        description: `Flagged ${w.currency} address associated with ${activeListing.vendor} on ${activeListing.source}. (Tainted: ${w.isTainted})`,
        valid_from: "2024-08-19T10:55:00.000Z"
      })),
      ...(activeListing.extracted.pgpKey ? [{
        type: "indicator",
        spec_version: "2.1",
        id: `indicator--pgp-${activeListing.id.toLowerCase()}`,
        created: "2024-08-19T10:55:00.000Z",
        modified: "2024-08-19T10:55:00.000Z",
        name: `PGP Fingerprint: ${activeListing.extracted.pgpKey.fingerprint}`,
        pattern: `[x509-certificate:hashes.SHA-1 = '${activeListing.extracted.pgpKey.keyId}']`,
        pattern_type: "stix",
        pattern_version: "2.1",
        description: `Cryptographic PGP 4096-bit public key used for cross-platform identity resolution and signing.`,
        valid_from: "2024-08-19T10:55:00.000Z"
      }] : []),
      {
        type: "relationship",
        spec_version: "2.1",
        id: `relationship--${activeListing.id.toLowerCase()}-attribution`,
        created: "2024-08-19T10:55:00.000Z",
        modified: "2024-08-19T10:55:00.000Z",
        relationship_type: "attributed-to",
        source_ref: `indicator--wallet-0-${activeListing.id.toLowerCase()}`,
        target_ref: `threat-actor--${activeListing.vendor.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      }
    ]
  };

  const stixJsonString = JSON.stringify(stixBundle, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(stixJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([stixJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stix2.1_${activeListing.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Case Selector */}
      <div className="bg-[#0e121a] border border-[#1c2333] rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Info */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
            <FileCode className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-100 font-sans tracking-wide">
                OASIS STIX 2.1 Threat Intel Interchange Hub
              </h2>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                COURT ADMISSIBLE
              </span>
            </div>
            <p className="text-sm text-slate-400 font-sans mt-0.5">
              Standardized cyber threat intelligence schema formatted for inter-agency coordination (Interpol, Europol, Cyber Cells).
            </p>
          </div>
        </div>

        {/* Target Case Selector */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={activeListing.id}
              onChange={(e) => {
                const found = listings.find(l => l.id === e.target.value);
                if (found) onSelectListing(found);
              }}
              aria-label="Select Target Investigation Case"
              className="appearance-none bg-[#141924] text-slate-200 text-sm font-mono pl-3.5 pr-9 py-2.5 rounded-xl border border-[#20283d] focus:border-indigo-500/60 focus:outline-none cursor-pointer font-medium"
            >
              {listings.map(l => (
                <option key={l.id} value={l.id}>
                  Target: {l.vendor} ({l.id})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* View Switcher */}
          <div className="flex items-center bg-[#141924] p-1 rounded-xl border border-[#20283d] text-xs font-mono">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'visual'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Visual Objects ({stixBundle.objects.length})
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'json'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw STIX JSON
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#141924] hover:bg-[#1b2230] text-slate-200 text-xs font-mono font-medium border border-[#20283d] transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold transition-all shadow-xs"
          >
            <Download className="h-4 w-4" />
            <span>Export .json</span>
          </button>
        </div>

      </div>

      {/* Main Content Area */}
      {viewMode === 'visual' ? (
        <div className="space-y-4">
          
          {/* Header Strip */}
          <div className="flex items-center justify-between px-1 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              <span className="font-bold uppercase tracking-wider text-slate-300">
                STIX 2.1 Objects in Bundle ({stixBundle.objects.length})
              </span>
            </div>
            <span>Bundle ID: <strong className="text-slate-200">{stixBundle.id}</strong></span>
          </div>

          {/* Spacious Grid of STIX 2.1 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stixBundle.objects.map((obj, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-[#0e121a] border border-[#1c2333] hover:border-[#2a354d] space-y-3 transition-all shadow-xs min-w-0 overflow-hidden"
              >
                {/* Object Card Header */}
                <div className="flex items-center justify-between border-b border-[#1c2333] pb-3 gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-[#141924] border border-[#20283d] flex items-center justify-center shrink-0">
                      {obj.type === 'threat-actor' ? (
                        <Shield className="h-4 w-4 text-rose-400" />
                      ) : obj.type === 'indicator' ? (
                        <Coins className="h-4 w-4 text-amber-400" />
                      ) : obj.type === 'identity' ? (
                        <Fingerprint className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Network className="h-4 w-4 text-indigo-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-sm font-mono text-slate-100 uppercase tracking-wide truncate block">
                        {obj.type}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono truncate max-w-[50%]" title={obj.id}>
                    {obj.id}
                  </span>
                </div>

                {/* Object Details */}
                <div className="space-y-2.5 text-sm min-w-0">
                  {'name' in obj && (
                    <div className="text-base font-bold text-slate-100 font-sans break-anywhere leading-snug">
                      {obj.name}
                    </div>
                  )}

                  {'description' in obj && (
                    <div className="text-xs text-slate-300 leading-relaxed font-sans break-anywhere">
                      {obj.description}
                    </div>
                  )}

                  {'aliases' in obj && obj.aliases && (
                    <div className="space-y-1.5 pt-1 min-w-0">
                      <span className="text-xs font-mono text-slate-400 uppercase font-bold">Known Aliases:</span>
                      <div className="flex flex-wrap gap-1.5 min-w-0">
                        {obj.aliases.map((alias, aIdx) => (
                          <span key={aIdx} className="px-2 py-0.5 rounded-md text-xs font-mono bg-[#141924] text-indigo-300 border border-[#20283d] break-all max-w-full">
                            {alias}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {'pattern' in obj && (
                    <div className="pt-1 min-w-0">
                      <div className="text-[11px] font-mono text-slate-400 uppercase font-bold mb-1">STIX Indicator Pattern:</div>
                      <div className="text-xs font-mono text-indigo-300 bg-black/60 p-2.5 rounded-xl border border-[#1c2333] break-all leading-relaxed whitespace-pre-wrap">
                        {obj.pattern}
                      </div>
                    </div>
                  )}

                  {'relationship_type' in obj && (
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-300 flex items-center justify-between gap-2 min-w-0">
                      <span className="break-all">Relationship: <strong>{obj.relationship_type}</strong></span>
                      <Share2 className="h-4 w-4 text-indigo-400 shrink-0" />
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      ) : (
        /* Full-page Raw JSON Viewer */
        <div className="bg-[#06080c] border border-[#1c2333] rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c2333] text-xs font-mono text-slate-400">
            <span>Standardized OASIS STIX 2.1 JSON Schema Specification</span>
            <span className="text-indigo-400">{stixJsonString.split('\n').length} lines</span>
          </div>
          <pre className="p-4 rounded-xl bg-[#080a0f] border border-[#141924] text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[600px]">
            {stixJsonString}
          </pre>
        </div>
      )}

    </div>
  );
};
