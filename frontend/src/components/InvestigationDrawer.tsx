import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  Fingerprint, 
  Coins, 
  ShieldAlert, 
  Network, 
  MapPin, 
  Terminal, 
  ArrowRight
} from 'lucide-react';
import type { CTIListing } from '../types/cti';

interface InvestigationDrawerProps {
  listing: CTIListing | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenStix: (listing: CTIListing) => void;
}

export const InvestigationDrawer: React.FC<InvestigationDrawerProps> = ({
  listing,
  isOpen,
  onClose,
  onOpenStix,
}) => {
  const [activeTab, setActiveTab] = useState<'identity' | 'copilot' | 'forensics' | 'pipeline'>('identity');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !listing) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const threatScore = listing.enrichment?.threatScore ?? 0;
  const threatScoreColor =
    threatScore >= 85 ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' :
    threatScore >= 60 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
    'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-over Container */}
      <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-[#0b0e14] border-l border-[#1c2333] shadow-2xl flex flex-col animate-slide-in-right z-50">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#1c2333] bg-[#0e121a] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <Network className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-slate-400">{listing.id}</span>
                <span className="text-slate-600">•</span>
                <span className="font-bold text-base text-slate-100 truncate font-sans">
                  {listing.vendor}
                </span>
                {listing.rebrandDetected && (
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                    REBRAND MATCHED
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span>Discovered via {listing.source}</span>
                <span>•</span>
                <span>{listing.discoveredAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopy(JSON.stringify(listing, null, 2), 'drawer_json')}
              className="p-2 rounded-lg bg-[#141924] hover:bg-[#1b2230] text-slate-300 hover:text-white border border-[#20293d] transition-colors"
              title="Copy Raw Investigation JSON"
            >
              {copiedKey === 'drawer_json' ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={() => onOpenStix(listing)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-mono transition-colors font-semibold"
              title="Inspect STIX 2.1 Bundle"
            >
              <Share2 className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">STIX 2.1</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#141924] hover:bg-[#20283d] text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-[#1c2333] bg-[#0e121a]/60 flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('identity')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'identity'
                ? 'border-indigo-500 text-indigo-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fingerprint className="h-4 w-4" />
            <span>Entity Resolution</span>
            {listing.linkedAliases && listing.linkedAliases.length > 0 && (
              <span className="px-2 py-0.2 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 font-bold">
                {listing.linkedAliases.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'copilot'
                ? 'border-indigo-500 text-indigo-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>AI Copilot Brief</span>
          </button>

          <button
            onClick={() => setActiveTab('forensics')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'forensics'
                ? 'border-indigo-500 text-indigo-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="h-4 w-4 text-amber-400" />
            <span>On-Chain Forensics</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`py-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'pipeline'
                ? 'border-indigo-500 text-indigo-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-4 w-4 text-cyan-400" />
            <span>Pipeline Audit</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#080a0f]">
          
          {/* TAB 1: ENTITY RESOLUTION & REBRAND MATRIX */}
          {activeTab === 'identity' && (
            <div className="space-y-5">
              
              {/* Evidence Snippet */}
              <div className="p-4 rounded-2xl bg-[#0e121a] border border-[#1c2333]">
                <div className="text-xs font-mono uppercase text-slate-500 font-bold mb-1.5">
                  Raw Intercepted Listing Evidence
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-sans italic">
                  "{listing.rawText}"
                </p>
                {listing.extracted.deliveryLocation && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-300">
                    <MapPin className="h-4 w-4 text-rose-400 shrink-0" />
                    <span>Target Drop Zone: <strong className="text-rose-200 font-semibold">{listing.extracted.deliveryLocation}</strong></span>
                  </div>
                )}
              </div>

              {/* Cross-Platform Rebrand Resolution Section */}
              <div className="p-4 rounded-2xl bg-[#0e121a] border border-[#1c2333] space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#1c2333] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                      Cross-Platform Linked Personas & Migration History
                    </span>
                  </div>
                  {listing.resolvedIdentityCluster && (
                    <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-2.5 py-0.5 rounded-md border border-indigo-500/30">
                      {listing.resolvedIdentityCluster}
                    </span>
                  )}
                </div>

                {listing.linkedAliases && listing.linkedAliases.length > 0 ? (
                  <div className="space-y-2.5">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      DarkScope detected shared cryptographic keys and wallet overlap connecting this darknet listing across the following platforms:
                    </p>
                    <div className="space-y-2.5">
                      {listing.linkedAliases.map((linked, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#121622] border border-[#20283d] flex items-center justify-between gap-3 text-sm"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-100 font-mono text-sm">
                                {linked.alias}
                              </span>
                              <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-[#1a2130] text-slate-300 border border-[#2d3852]">
                                {linked.platform}
                              </span>
                              <span className="text-xs font-mono text-emerald-400 font-semibold">
                                ({(linked.confidence * 100).toFixed(0)}% Match)
                              </span>
                            </div>
                            <div className="text-xs font-mono text-indigo-300 flex items-center gap-1.5 truncate">
                              <span>Matched via:</span>
                              <strong className="text-indigo-200">{linked.matchedIndicator}</strong>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              linked.activeStatus === 'ACTIVE'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : linked.activeStatus === 'MIGRATED'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {linked.activeStatus}
                            </span>
                            <div className="text-xs text-slate-500 font-mono mt-1">
                              Seen: {linked.discoveredDate}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 font-mono py-4 text-center">
                    No secondary alias rebrands currently linked to this isolated profile.
                  </div>
                )}
              </div>

              {/* Cryptographic Fingerprint Card */}
              {listing.extracted.pgpKey && (
                <div className="p-4 rounded-2xl bg-[#0e121a] border border-[#1c2333] space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400 font-bold">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="h-4 w-4 text-emerald-400" />
                      <span>Extracted PGP 4096-bit Public Key</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {listing.extracted.pgpKey.status}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/60 border border-[#1c2333] font-mono text-xs text-slate-200 flex items-center justify-between gap-2">
                    <span className="truncate">{listing.extracted.pgpKey.fingerprint}</span>
                    <button
                      onClick={() => handleCopy(listing.extracted.pgpKey!.fingerprint, 'pgp_fp')}
                      className="p-1.5 rounded-lg hover:bg-[#1a2130] text-slate-400 hover:text-white transition-colors"
                      title="Copy PGP Fingerprint"
                    >
                      {copiedKey === 'pgp_fp' ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Direct Communication Handles */}
              {listing.extracted.commsHandles.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#0e121a] border border-[#1c2333] space-y-2.5">
                  <div className="text-xs font-mono uppercase text-slate-400 font-bold">
                    Intercepted Contact Handles & Channels ({listing.extracted.commsHandles.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {listing.extracted.commsHandles.map((handle, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCopy(handle, `handle_${idx}`)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121622] hover:bg-[#1a2130] border border-[#20283d] text-slate-200 font-mono text-xs transition-colors"
                      >
                        <span>{handle}</span>
                        {copiedKey === `handle_${idx}` ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400 ml-1" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-slate-500 ml-1 opacity-70" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: AI COPILOT BRIEF & LAW ENFORCEMENT ACTIONS */}
          {activeTab === 'copilot' && (
            <div className="space-y-5">
              {listing.copilot ? (
                <>
                  {/* Plain English Summary */}
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-[#101420] to-[#0e121a] border border-indigo-500/30 space-y-2.5">
                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider font-mono">
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                      <span>AI Intelligence Executive Summary</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-sans">
                      {listing.copilot.plainEnglishSummary}
                    </p>
                    <div className="pt-2.5 border-t border-[#1c2333] text-xs font-mono text-amber-400">
                      <strong>Threat Level:</strong> {listing.copilot.threatAssessment}
                    </div>
                  </div>

                  {/* Recommended Law Enforcement Actions */}
                  <div className="p-4 rounded-2xl bg-[#0e121a] border border-[#1c2333] space-y-3.5">
                    <div className="flex items-center gap-2 text-slate-200 font-bold text-xs uppercase tracking-wider font-mono border-b border-[#1c2333] pb-2.5">
                      <ShieldAlert className="h-4 w-4 text-rose-400" />
                      <span>Recommended Law Enforcement Actions</span>
                    </div>

                    <div className="space-y-3">
                      {listing.copilot.recommendedActions.map((rec, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#121622] border border-[#20283d] space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-bold text-sm text-slate-100">
                              <ArrowRight className="h-4 w-4 text-indigo-400 shrink-0" />
                              <span>{rec.action}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              rec.priority === 'URGENT'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}>
                              {rec.priority}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-indigo-300 pl-6">
                            Target: <strong className="text-slate-200">{rec.target}</strong>
                          </div>
                          <div className="text-sm text-slate-300 pl-6 font-sans leading-relaxed">
                            {rec.justification}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chain of Custody & Hash */}
                  <div className="p-3.5 rounded-2xl bg-[#0e121a] border border-[#1c2333] flex items-center justify-between text-xs font-mono text-slate-400">
                    <div className="truncate mr-2">
                      <span>Evidence Custody Hash: </span>
                      <span className="text-slate-200 font-bold">{listing.copilot.chainOfCustodyHash}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(listing.copilot!.chainOfCustodyHash, 'custody_hash')}
                      className="p-1.5 rounded-lg hover:bg-[#1a2130] text-slate-400 hover:text-white shrink-0"
                    >
                      {copiedKey === 'custody_hash' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-sm font-mono text-slate-500 text-center py-8">
                  AI Copilot summary pending pipeline generation.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ON-CHAIN FORENSICS & WALLETS */}
          {activeTab === 'forensics' && (
            <div className="space-y-5">
              {/* Risk Meter & Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center ${threatScoreColor}`}>
                  <div className="text-3xl font-extrabold font-mono">{threatScore}/100</div>
                  <div className="text-xs uppercase font-mono tracking-wider mt-1 font-semibold">Threat Score</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e121a] border border-[#1c2333] flex flex-col items-center justify-center text-center">
                  <div className="text-xl font-bold font-mono text-slate-100">
                    {listing.enrichment ? `$${(listing.enrichment.onChainVolumeUsd / 1000).toFixed(0)}k USD` : 'N/A'}
                  </div>
                  <div className="text-xs uppercase font-mono text-slate-400 tracking-wider mt-1 font-semibold">On-Chain Volume</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e121a] border border-[#1c2333] flex flex-col items-center justify-center text-center">
                  <div className="text-xl font-bold font-mono text-amber-300">
                    {listing.enrichment?.mixerHopsDetected ?? 0} Mixer Hops
                  </div>
                  <div className="text-xs uppercase font-mono text-slate-400 tracking-wider mt-1 font-semibold">Privacy Depth</div>
                </div>
              </div>

              {/* Cryptocurrency Wallets */}
              <div className="p-4 rounded-2xl bg-[#0e121a] border border-[#1c2333] space-y-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono border-b border-[#1c2333] pb-2.5">
                  Identified Cryptocurrency Wallets ({listing.extracted.wallets.length})
                </div>

                <div className="space-y-2.5">
                  {listing.extracted.wallets.map((wallet, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#121622] border border-[#20283d] flex items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-400 text-sm">{wallet.currency}:</span>
                          <span className="text-slate-100 truncate text-xs font-semibold">{wallet.address}</span>
                          {wallet.isTainted && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                              TAINTED
                            </span>
                          )}
                        </div>
                        {wallet.balanceUsd !== undefined && (
                          <div className="text-xs text-slate-400">
                            Balance: {wallet.balanceBtc} {wallet.currency} (${wallet.balanceUsd.toLocaleString()} USD) • {wallet.txCount} transactions
                          </div>
                        )}
                        {wallet.clusterTag && (
                          <div className="text-xs text-indigo-300 font-medium">
                            Cluster: {wallet.clusterTag}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleCopy(wallet.address, `w_addr_${idx}`)}
                        className="p-2 rounded-lg bg-[#1a2130] hover:bg-[#232c40] text-slate-300 hover:text-white transition-colors shrink-0"
                        title="Copy Wallet Hash"
                      >
                        {copiedKey === `w_addr_${idx}` ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Flags & Threat Intel Matches */}
              {listing.enrichment && (
                <div className="p-4 rounded-2xl bg-[#0e121a] border border-[#1c2333] space-y-3.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono border-b border-[#1c2333] pb-2.5">
                    Active Forensic Risk Flags ({listing.enrichment.riskFlags.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {listing.enrichment.riskFlags.map((flag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>

                  {listing.enrichment.threatIntelMatches.length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs font-mono uppercase text-slate-400 font-bold mb-1.5">
                        Threat Feed Correlations
                      </div>
                      <div className="space-y-1.5">
                        {listing.enrichment.threatIntelMatches.map((m, idx) => (
                          <div key={idx} className="text-xs font-mono text-slate-300 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0"></span>
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PIPELINE TRACE & AUDIT */}
          {activeTab === 'pipeline' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#0e121a] border border-[#1c2333] space-y-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono border-b border-[#1c2333] pb-2.5 flex items-center justify-between">
                  <span>LangGraph Autonomous Execution Trace</span>
                  <span className="text-xs text-slate-400 font-mono">v2.1 State Flow</span>
                </div>

                <div className="relative pl-5 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1c2333]">
                  {listing.pipelineTrace.map((step, idx) => {
                    const isDone = step.status === 'DONE' || step.status === 'ENRICHED';
                    const isBypassed = step.status === 'BYPASSED';

                    return (
                      <div key={idx} className="relative text-xs">
                        <div
                          className={`absolute -left-5 top-0.5 h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                            isDone
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                              : isBypassed
                              ? 'bg-[#1c2333] border-[#2a354d] text-slate-500'
                              : 'bg-amber-500/20 border-amber-500 text-amber-400'
                          }`}
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-current" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono text-slate-200 text-xs">{step.name}</span>
                            <span className="text-xs text-slate-400 font-mono">({step.subtext})</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isDone
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isBypassed
                              ? 'bg-[#141924] text-slate-500 border border-[#20283d]'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            [{step.status}]
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mt-1 font-mono leading-relaxed">
                          {step.details}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#1c2333] bg-[#0e121a] flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Target Cluster: <strong className="text-slate-200">{listing.resolvedIdentityCluster ?? 'STANDALONE'}</strong></span>
          <button
            onClick={() => onOpenStix(listing)}
            className="text-indigo-400 hover:text-indigo-300 underline font-semibold"
          >
            Export OASIS STIX 2.1 Bundle &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};
