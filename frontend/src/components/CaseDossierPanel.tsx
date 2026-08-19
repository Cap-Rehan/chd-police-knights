import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  ShieldAlert, 
  Coins, 
  Fingerprint, 
  MessageSquare, 
  MapPin,
  Layers,
  Share2
} from 'lucide-react';
import type { CTIListing } from '../types/cti';

interface CaseDossierPanelProps {
  listing: CTIListing;
  onOpenStix: () => void;
}

export const CaseDossierPanel: React.FC<CaseDossierPanelProps> = ({ listing, onOpenStix }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getThreatScoreColor = (score: number) => {
    if (score >= 85) return 'text-rose-500 stroke-rose-500';
    if (score >= 60) return 'text-amber-500 stroke-amber-500';
    return 'text-emerald-500 stroke-emerald-500';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded flex flex-col h-full overflow-hidden shadow-xs">
      {/* Dossier Top Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-200 tracking-wider">
            Dossier: <span className="font-mono text-slate-100">{listing.id}</span>
          </span>
          <span
            className={`inline-flex items-center px-1.5 py-0.2 text-[10px] font-bold font-mono tracking-wider rounded border ${
              listing.classification === 'ILLICIT'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : listing.classification === 'SCAM'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {listing.classification}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleCopy(JSON.stringify(listing, null, 2), 'full_dossier')}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono border border-slate-700 transition-colors"
            title="Copy Raw Dossier JSON"
          >
            {copiedKey === 'full_dossier' ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3 text-slate-400" />
            )}
            <span>Copy</span>
          </button>

          <button
            onClick={onOpenStix}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono border border-slate-700 transition-colors"
            title="Inspect OASIS STIX 2.1 Object"
          >
            <Share2 className="h-3 w-3 text-amber-400" />
            <span>STIX 2.1</span>
          </button>
        </div>
      </div>

      {/* Scrollable Dossier Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {/* Case Overview Strip */}
        <div className="bg-slate-950/80 border border-slate-800 rounded p-2.5 space-y-1.5">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500">Target Vendor</div>
              <div className="text-sm font-bold text-slate-100">{listing.vendor}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono uppercase text-slate-500">Discovered Source</div>
              <div className="text-xs font-mono text-slate-300">{listing.source}</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans pt-1 border-t border-slate-800/80">
            "{listing.rawText}"
          </p>
          {listing.extracted.deliveryLocation && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono pt-1">
              <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
              <span>Target Drop Area: <strong className="text-slate-200">{listing.extracted.deliveryLocation}</strong></span>
            </div>
          )}
        </div>

        {/* SECTION A: Extracted Entities */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
            <Coins className="h-3.5 w-3.5 text-slate-400" />
            <span>Section A: Extracted Entities</span>
          </div>

          {/* Crypto Wallets */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-slate-500">Cryptocurrency Wallets</div>
            {listing.extracted.wallets.map((wallet, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800 text-xs font-mono"
              >
                <div className="space-y-0.5 max-w-[80%] truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-amber-400">{wallet.currency}:</span>
                    <span className="text-slate-300 truncate" title={wallet.address}>
                      {wallet.address}
                    </span>
                    {wallet.isTainted && (
                      <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        TAINTED
                      </span>
                    )}
                  </div>
                  {wallet.txCount !== undefined && (
                    <div className="text-[10px] text-slate-500">
                      Balance: {wallet.balanceBtc} {wallet.currency} (${wallet.balanceUsd?.toLocaleString()} USD) • {wallet.txCount} txs
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleCopy(wallet.address, `wallet_${idx}`)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Copy Wallet Address"
                >
                  {copiedKey === `wallet_${idx}` ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Communication Handles */}
          {listing.extracted.commsHandles.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-500">Contact Handles & Channels</div>
              <div className="flex flex-wrap gap-1.5">
                {listing.extracted.commsHandles.map((handle, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]"
                  >
                    <MessageSquare className="h-3 w-3 text-sky-400" />
                    <span>{handle}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PGP Key */}
          {listing.extracted.pgpKey && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase text-slate-500">PGP Key Signature</div>
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800 font-mono text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                    <Fingerprint className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Fingerprint: {listing.extracted.pgpKey.fingerprint}</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {listing.extracted.pgpKey.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">Key ID: {listing.extracted.pgpKey.keyId}</div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION B: Enrichment & Threat Score */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
            <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
            <span>Section B: Threat Scoring & Risk Flags</span>
          </div>

          {listing.enrichment ? (
            <div className="bg-slate-950/60 border border-slate-800 rounded p-2.5 space-y-2.5">
              {/* Score Metric Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500">
                    On-Chain Threat Score
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-2xl font-bold font-mono ${getThreatScoreColor(listing.enrichment.threatScore)}`}>
                      {listing.enrichment.threatScore}
                    </span>
                    <span className="text-xs font-mono text-slate-500">/ 100</span>
                  </div>
                </div>

                {/* Mini Metric Badges */}
                <div className="text-right space-y-0.5 text-[11px] font-mono text-slate-400">
                  <div>Volume: <strong className="text-slate-200">${(listing.enrichment.onChainVolumeUsd / 1000).toFixed(1)}k USD</strong></div>
                  <div>Mixer Hops: <strong className="text-rose-400">{listing.enrichment.mixerHopsDetected}</strong></div>
                </div>
              </div>

              {/* Risk Flags */}
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                  Active Risk Flags
                </div>
                <div className="flex flex-wrap gap-1">
                  {listing.enrichment.riskFlags.map((flag, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Threat Feed Matches */}
              {listing.enrichment.threatIntelMatches.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                    Threat Feed Matches
                  </div>
                  <div className="space-y-1">
                    {listing.enrichment.threatIntelMatches.map((match, idx) => (
                      <div key={idx} className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                        <span>{match}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded text-center text-xs font-mono text-slate-500">
              No on-chain enrichment required (bypassed by routing gate).
            </div>
          )}
        </div>

        {/* SECTION C: Agentic Pipeline Trace */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
            <Layers className="h-3.5 w-3.5 text-slate-400" />
            <span>Section C: Agentic Pipeline Trace (LangGraph)</span>
          </div>

          <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {listing.pipelineTrace.map((step, idx) => {
              const isDone = step.status === 'DONE' || step.status === 'ENRICHED';
              const isBypassed = step.status === 'BYPASSED';
              return (
                <div key={idx} className="relative text-xs">
                  {/* Step Node Icon */}
                  <div
                    className={`absolute -left-4 top-0.5 h-3 w-3 rounded-full border flex items-center justify-center ${
                      isDone
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : isBypassed
                        ? 'bg-slate-800 border-slate-700 text-slate-500'
                        : 'bg-amber-500/20 border-amber-500 text-amber-400'
                    }`}
                  >
                    <div className="h-1 w-1 rounded-full bg-current" />
                  </div>

                  {/* Step Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold font-mono text-slate-200 uppercase">{step.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({step.subtext})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                      <span>{step.timestamp}</span>
                      <span
                        className={`px-1 py-0.2 rounded font-bold ${
                          isDone
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isBypassed
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        [{step.status}]
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono leading-relaxed">
                    {step.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
