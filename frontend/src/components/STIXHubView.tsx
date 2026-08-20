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
        aliases: [
          activeListing.vendor,
          ...(activeListing.linkedAliases ? activeListing.linkedAliases.map(a => a.alias) : [])
        ]
      },
      ...(activeListing.extracted.wallets.map(w => ({
        type: "indicator",
        spec_version: "2.1",
        id: `indicator--wallet-${w.address.slice(0, 10).toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        created: "2024-08-19T10:55:00.000Z",
        modified: "2024-08-19T10:55:00.000Z",
        name: `${w.currency} Deposit Wallet Indicator`,
        pattern: `[crypto-currency-wallet:address = '${w.address}']`,
        pattern_type: "stix",
        valid_from: "2024-08-19T00:00:00Z"
      }))),
      ...(activeListing.extracted.pgpKey ? [{
        type: "indicator",
        spec_version: "2.1",
        id: "indicator--pgp-fingerprint-9921b",
        created: "2024-08-19T10:55:00.000Z",
        modified: "2024-08-19T10:55:00.000Z",
        name: "PGP Public Key Fingerprint",
        pattern: `[user-account:credential_keys.pgp_key = '${activeListing.extracted.pgpKey.fingerprint}']`,
        pattern_type: "stix",
        valid_from: "2024-08-19T00:00:00Z"
      }] : []),
      {
        type: "relationship",
        spec_version: "2.1",
        id: "relationship--781f8c02-e221-4f12-881a-bb10928a8812",
        created: "2024-08-19T10:55:00.000Z",
        modified: "2024-08-19T10:55:00.000Z",
        relationship_type: "indicates",
        source_ref: `threat-actor--${activeListing.vendor.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        target_ref: "identity--c7a10291-8891-419b-b891-10298a0018f2"
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
    a.download = `stix_2.1_bundle_${activeListing.vendor.toLowerCase()}_${activeListing.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Control Strip */}
      <div
        className="rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        
        {/* Title & Schema Metadata */}
        <div className="flex items-center gap-4">
          <div
            className="h-12 w-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs"
            style={{
              backgroundColor: 'var(--bg-accent-subtle)',
              borderColor: 'var(--border-accent)',
              color: 'var(--accent-primary)',
            }}
          >
            <FileCode className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2
                className="text-lg font-bold font-sans tracking-wide"
                style={{ color: 'var(--text-primary)' }}
              >
                OASIS STIX 2.1 Interoperable Threat Intel Hub
              </h2>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                OASIS STIX 2.1 Spec
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
              className="appearance-none text-sm font-mono pl-3.5 pr-9 py-2.5 rounded-xl border focus:outline-none cursor-pointer font-medium"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              {listings.map(l => (
                <option key={l.id} value={l.id} style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                  Target: {l.vendor} ({l.id})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* View Switcher */}
          <div
            className="flex items-center p-1 rounded-xl border text-xs font-mono"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setViewMode('visual')}
              className="px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
              style={
                viewMode === 'visual'
                  ? {
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--accent-primary-content)',
                      fontWeight: 700,
                    }
                  : {
                      color: 'var(--text-secondary)',
                    }
              }
            >
              Visual Objects ({stixBundle.objects.length})
            </button>
            <button
              onClick={() => setViewMode('json')}
              className="px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
              style={
                viewMode === 'json'
                  ? {
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--accent-primary-content)',
                      fontWeight: 700,
                    }
                  : {
                      color: 'var(--text-secondary)',
                    }
              }
            >
              Raw STIX JSON
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium border transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-accent)',
              color: 'var(--accent-primary-content)',
            }}
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
              <Layers className="h-4 w-4" style={{ color: 'var(--accent-primary)' }} />
              <span
                className="font-bold uppercase tracking-wider"
                style={{ color: 'var(--text-primary)' }}
              >
                STIX 2.1 Objects in Bundle ({stixBundle.objects.length})
              </span>
            </div>
            <span>Bundle ID: <strong style={{ color: 'var(--text-primary)' }}>{stixBundle.id}</strong></span>
          </div>

          {/* Spacious Grid of STIX 2.1 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stixBundle.objects.map((obj, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border space-y-3 transition-all shadow-xs min-w-0 overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                {/* Object Card Header */}
                <div
                  className="flex items-center justify-between border-b pb-3 gap-2"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="h-8 w-8 rounded-xl border flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-subtle)',
                      }}
                    >
                      {obj.type === 'threat-actor' ? (
                        <Shield className="h-4 w-4 text-rose-400" />
                      ) : obj.type === 'indicator' ? (
                        <Coins className="h-4 w-4 text-amber-400" />
                      ) : obj.type === 'identity' ? (
                        <Fingerprint className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Network className="h-4 w-4" style={{ color: 'var(--accent-primary)' }} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span
                        className="font-bold text-sm font-mono uppercase tracking-wide truncate block"
                        style={{ color: 'var(--text-primary)' }}
                      >
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
                    <div
                      className="text-base font-bold font-sans break-anywhere leading-snug"
                      style={{ color: 'var(--text-primary)' }}
                    >
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
                          <span
                            key={aIdx}
                            className="px-2 py-0.5 rounded-md text-xs font-mono border break-all max-w-full"
                            style={{
                              backgroundColor: 'var(--bg-accent-subtle)',
                              borderColor: 'var(--border-accent)',
                              color: 'var(--accent-primary-text)',
                            }}
                          >
                            {alias}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {'pattern' in obj && (
                    <div className="pt-1 min-w-0">
                      <div className="text-[11px] font-mono text-slate-400 uppercase font-bold mb-1">STIX Indicator Pattern:</div>
                      <div
                        className="text-xs font-mono p-2.5 rounded-xl border break-all leading-relaxed whitespace-pre-wrap"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--accent-primary-text)',
                        }}
                      >
                        {obj.pattern}
                      </div>
                    </div>
                  )}

                  {'relationship_type' in obj && (
                    <div
                      className="p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between gap-2 min-w-0"
                      style={{
                        backgroundColor: 'var(--bg-accent-subtle)',
                        borderColor: 'var(--border-accent)',
                        color: 'var(--accent-primary-text)',
                      }}
                    >
                      <span className="break-all">Relationship: <strong>{obj.relationship_type}</strong></span>
                      <Share2 className="h-4 w-4 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      ) : (
        /* Full-page Raw JSON Viewer */
        <div
          className="rounded-2xl p-6 shadow-xs space-y-3 border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div
            className="flex items-center justify-between pb-3 border-b text-xs font-mono text-slate-400"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <span>Standardized OASIS STIX 2.1 JSON Schema Specification</span>
            <span style={{ color: 'var(--accent-primary-text)' }}>{stixJsonString.split('\n').length} lines</span>
          </div>
          <pre
            className="p-4 rounded-xl border text-xs font-mono overflow-x-auto leading-relaxed max-h-[600px]"
            style={{
              backgroundColor: 'var(--bg-canvas)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            {stixJsonString}
          </pre>
        </div>
      )}

    </div>
  );
};
