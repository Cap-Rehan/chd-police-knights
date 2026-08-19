import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText } from 'lucide-react';
import type { CTIListing } from '../types/cti';

interface STIXModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: CTIListing;
}

export const STIXModal: React.FC<STIXModalProps> = ({ isOpen, onClose, listing }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate OASIS STIX 2.1 Bundle JSON structure
  const stixBundle = {
    type: "bundle",
    id: listing.stixBundleId,
    spec_version: "2.1",
    objects: [
      {
        type: "identity",
        spec_version: "2.1",
        id: "identity--c7a10291-8891-419b-b891-10298a0018f2",
        created: "2024-01-01T00:00:00.000Z",
        modified: "2024-01-01T00:00:00.000Z",
        name: "Chandigarh Police Cyber Cell Multi-Agent CTI Pipeline",
        identity_class: "system",
        description: "Autonomous Darknet Ingestion & Threat Classification Pipeline"
      },
      {
        type: "threat-actor",
        spec_version: "2.1",
        id: `threat-actor--${listing.vendor.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        created: "2024-08-19T10:00:00.000Z",
        modified: "2024-08-19T10:55:00.000Z",
        name: listing.vendor,
        threat_actor_types: [
          listing.category === "Drugs/RCs"
            ? "narcotics-trafficker"
            : listing.category === "Weapons/Exploits"
            ? "cybercrime-vendor"
            : "fraud-actor"
        ],
        description: `Actor identified from ${listing.source}. Classification: ${listing.classification} (Confidence: ${listing.confidence * 100}%)`,
        aliases: [listing.vendor]
      },
      ...listing.extracted.wallets.map((w, idx) => ({
        type: "indicator",
        spec_version: "2.1",
        id: `indicator--wallet-${idx}-${listing.id.toLowerCase()}`,
        created: "2024-08-19T10:55:00.000Z",
        modified: "2024-08-19T10:55:00.000Z",
        name: `Cryptocurrency Wallet: ${w.currency} - ${w.address}`,
        pattern: `[user-account:account_login = '${w.address}']`,
        pattern_type: "stix",
        pattern_version: "2.1",
        description: `Flagged ${w.currency} address associated with ${listing.vendor} on ${listing.source}. (Tainted: ${w.isTainted})`,
        valid_from: "2024-08-19T10:55:00.000Z"
      }))
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
    a.download = `stix2.1_${listing.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0c0c0c] border border-zinc-800 rounded-lg w-full max-w-3xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-[#0c0c0c]">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold text-zinc-200 tracking-wider">
              OASIS STIX 2.1 Threat Intel Bundle: <span className="font-mono text-amber-400">{listing.id}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono border border-zinc-800 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono border border-zinc-800 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export File</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto bg-black font-mono text-xs text-zinc-300">
          <pre className="whitespace-pre leading-relaxed">{stixJsonString}</pre>
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-zinc-800 bg-[#0c0c0c] flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>OASIS STIX 2.1 Interoperability Standard</span>
          <span>Target Bundle ID: {listing.stixBundleId}</span>
        </div>
      </div>
    </div>
  );
};
