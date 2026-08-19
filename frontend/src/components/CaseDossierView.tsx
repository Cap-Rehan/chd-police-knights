import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Coins, 
  Fingerprint, 
  MessageSquare, 
  MapPin, 
  Terminal
} from 'lucide-react';
import type { CTIListing } from '../types/cti';

interface CaseDossierViewProps {
  listing: CTIListing;
  onBack: () => void;
  onOpenStix: () => void;
  recentlyViewed: CTIListing[];
  onSelectRecent: (listing: CTIListing) => void;
}

export const CaseDossierView: React.FC<CaseDossierViewProps> = ({
  listing,
  onBack,
  onOpenStix,
  recentlyViewed,
  onSelectRecent,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Accordion toggle states
  const [isEntitiesOpen, setIsEntitiesOpen] = useState(true);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(true);
  const [isPipelineOpen, setIsPipelineOpen] = useState(false); // collapsed by default
  const [showFullLogs, setShowFullLogs] = useState(false);
  const [showAllFlags, setShowAllFlags] = useState(false);
  const [showAllFeeds, setShowAllFeeds] = useState(false);

  // Keyboard shortcut: ESC to return to stream
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const threatScore = listing.enrichment?.threatScore ?? 0;
  const threatScoreColor =
    threatScore >= 80 ? '#f43f5e' : threatScore >= 50 ? '#f59e0b' : '#10b981';

  // Circular progress math (80px diameter, r=30, circumference=188.49)
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (threatScore / 100) * circumference;

  const totalEntitiesCount =
    listing.extracted.wallets.length +
    listing.extracted.commsHandles.length +
    (listing.extracted.pgpKey ? 1 : 0);

  const visibleRiskFlags = listing.enrichment
    ? showAllAllFlags(listing.enrichment.riskFlags, showAllFlags)
    : [];

  const visibleFeedMatches = listing.enrichment
    ? showAllAllFeeds(listing.enrichment.threatIntelMatches, showAllFeeds)
    : [];

  function showAllAllFlags(flags: string[], all: boolean) {
    if (all) return flags;
    return flags.slice(0, 4);
  }

  function showAllAllFeeds(feeds: string[], all: boolean) {
    if (all) return feeds;
    return feeds.slice(0, 3);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-150">
      {/* 1. TOP NAVIGATION HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Stream</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-200">
              Dossier: <span className="font-mono text-zinc-100">{listing.id}</span>
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono tracking-wide ${
                listing.classification === 'ILLICIT'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : listing.classification === 'SCAM'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {listing.classification}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-500 mr-1">
            Press ESC to return
          </span>

          <button
            onClick={() => handleCopy(JSON.stringify(listing, null, 2), 'dossier_json')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono border border-zinc-800 transition-colors"
          >
            {copiedKey === 'dossier_json' ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-zinc-400" />
            )}
            <span>{copiedKey === 'dossier_json' ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={onOpenStix}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono border border-zinc-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-amber-400" />
            <span>Export STIX 2.1</span>
          </button>
        </div>
      </div>

      {/* 2. SECTION 1: THREAT SUMMARY (Full width 2-column card) */}
      <div className="bg-[#0c0c0c] border border-zinc-800 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {/* Left Column: Vendor, Source & Description (2 cols on desktop) */}
          <div className="md:col-span-2 space-y-2">
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">Target Vendor Alias</div>
              <div className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                <span>{listing.vendor}</span>
                <span className="text-xs font-mono text-zinc-400 font-normal">({listing.category})</span>
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-0.5">
                Discovered via {listing.source} • {listing.discoveredAt}
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans line-clamp-3">
              "{listing.rawText}"
            </p>

            {listing.extracted.deliveryLocation && (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black border border-zinc-800 text-xs font-mono text-zinc-300">
                <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                <span>Target Drop Area: <strong className="text-zinc-100 font-medium">{listing.extracted.deliveryLocation}</strong></span>
              </div>
            )}
          </div>

          {/* Right Column: Key Metric Tiles */}
          <div className="grid grid-cols-3 md:grid-cols-1 gap-2 pt-2 md:pt-0 md:border-l md:border-zinc-800/80 md:pl-4">
            <div className="bg-black border border-zinc-800 rounded p-2 text-center md:text-left">
              <div className="text-[10px] font-mono uppercase text-zinc-500">Threat Score</div>
              <div className="text-base font-bold font-mono mt-0.5" style={{ color: threatScoreColor }}>
                {listing.enrichment?.threatScore ?? 'N/A'}{listing.enrichment ? '/100' : ''}
              </div>
            </div>

            <div className="bg-black border border-zinc-800 rounded p-2 text-center md:text-left">
              <div className="text-[10px] font-mono uppercase text-zinc-500">On-Chain Vol</div>
              <div className="text-sm font-semibold font-mono text-zinc-200 mt-0.5">
                {listing.enrichment ? `$${(listing.enrichment.onChainVolumeUsd / 1000).toFixed(1)}k` : 'N/A'}
              </div>
            </div>

            <div className="bg-black border border-zinc-800 rounded p-2 text-center md:text-left">
              <div className="text-[10px] font-mono uppercase text-zinc-500">Mixer Hops</div>
              <div className="text-sm font-semibold font-mono text-zinc-200 mt-0.5">
                {listing.enrichment?.mixerHopsDetected ?? '0'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECTION 2: EXTRACTED ENTITIES (Accordion) */}
      <div className="bg-[#0c0c0c] border border-zinc-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsEntitiesOpen(!isEntitiesOpen)}
          className="w-full p-3.5 bg-[#0c0c0c] hover:bg-zinc-900 flex items-center justify-between text-left transition-colors border-b border-zinc-800/80"
        >
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-zinc-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Extracted Entities ({totalEntitiesCount})
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isEntitiesOpen && (
              <span className="text-xs font-mono text-zinc-500">
                {listing.extracted.wallets.length} Wallets • {listing.extracted.commsHandles.length} Handles • {listing.extracted.pgpKey ? '1 PGP Key' : '0 PGP'}
              </span>
            )}
            {isEntitiesOpen ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
          </div>
        </button>

        {isEntitiesOpen && (
          <div className="p-4 space-y-4 bg-black/40">
            {/* Cryptocurrency Wallets */}
            <div>
              <div className="text-[11px] font-mono uppercase text-zinc-500 mb-2">
                Cryptocurrency Wallets ({listing.extracted.wallets.length})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {listing.extracted.wallets.map((wallet, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-black border border-zinc-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="space-y-0.5 truncate max-w-[85%]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-amber-400">{wallet.currency}:</span>
                        <span className="text-zinc-300 truncate" title={wallet.address}>
                          {wallet.address.length > 24
                            ? `${wallet.address.substring(0, 10)}...${wallet.address.substring(wallet.address.length - 8)}`
                            : wallet.address}
                        </span>
                        {wallet.isTainted && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            TAINTED
                          </span>
                        )}
                      </div>
                      {wallet.balanceBtc !== undefined && (
                        <div className="text-[11px] text-zinc-500">
                          Balance: {wallet.balanceBtc} {wallet.currency} (${wallet.balanceUsd?.toLocaleString()})
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleCopy(wallet.address, `w_${idx}`)}
                      className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title="Copy Address"
                    >
                      {copiedKey === `w_${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Handles */}
            {listing.extracted.commsHandles.length > 0 && (
              <div>
                <div className="text-[11px] font-mono uppercase text-zinc-500 mb-2">
                  Contact Handles & Channels ({listing.extracted.commsHandles.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {listing.extracted.commsHandles.map((handle, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCopy(handle, `handle_${idx}`)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black hover:bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs transition-colors"
                    >
                      <MessageSquare className="h-3 w-3 text-zinc-400" />
                      <span>{handle}</span>
                      {copiedKey === `handle_${idx}` ? (
                        <Check className="h-3 w-3 text-emerald-400 ml-1" />
                      ) : (
                        <Copy className="h-3 w-3 text-zinc-500 ml-1 opacity-60" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PGP Signature */}
            {listing.extracted.pgpKey && (
              <div>
                <div className="text-[11px] font-mono uppercase text-zinc-500 mb-1.5">
                  PGP Key Fingerprint
                </div>
                <div className="p-2.5 rounded bg-black border border-zinc-800 font-mono text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-zinc-300 font-mono text-xs">{listing.extracted.pgpKey.fingerprint}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {listing.extracted.pgpKey.status}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. SECTION 3: THREAT SCORING & RISK FLAGS (Accordion) */}
      <div className="bg-[#0c0c0c] border border-zinc-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsAnalysisOpen(!isAnalysisOpen)}
          className="w-full p-3.5 bg-[#0c0c0c] hover:bg-zinc-900 flex items-center justify-between text-left transition-colors border-b border-zinc-800/80"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Threat Analysis
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isAnalysisOpen && (
              <span className="text-xs font-mono text-zinc-500">
                Score: {threatScore}/100 • {listing.enrichment?.riskFlags.length ?? 0} Risk Flags
              </span>
            )}
            {isAnalysisOpen ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
          </div>
        </button>

        {isAnalysisOpen && (
          <div className="p-4 space-y-4 bg-black/40">
            {listing.enrichment ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* 80px Circular Threat Score Meter */}
                <div className="flex flex-col items-center justify-center p-3 bg-black border border-zinc-800 rounded-md">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="#27272a"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke={threatScoreColor}
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                      <span className="text-lg font-bold text-zinc-100">{threatScore}</span>
                      <span className="text-[9px] text-zinc-500 -mt-1">/ 100</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 mt-2">On-Chain Risk Index</span>
                </div>

                {/* Risk Flags (Max 4 visible + expandable) & Threat Feed Matches */}
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <div className="text-[11px] font-mono uppercase text-zinc-500 mb-1.5">
                      Identified Risk Flags ({listing.enrichment.riskFlags.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {visibleRiskFlags.map((flag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        >
                          {flag}
                        </span>
                      ))}

                      {listing.enrichment.riskFlags.length > 4 && !showAllFlags && (
                        <button
                          onClick={() => setShowAllFlags(true)}
                          className="px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-colors"
                        >
                          +{listing.enrichment.riskFlags.length - 4} more
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Threat Feed Matches (Max 3 visible + expandable) */}
                  {listing.enrichment.threatIntelMatches.length > 0 && (
                    <div>
                      <div className="text-[11px] font-mono uppercase text-zinc-500 mb-1">
                        Threat Feed Correlations ({listing.enrichment.threatIntelMatches.length})
                      </div>
                      <ul className="space-y-1 text-xs font-mono text-zinc-300">
                        {visibleFeedMatches.map((match, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span>{match}</span>
                          </li>
                        ))}
                      </ul>

                      {listing.enrichment.threatIntelMatches.length > 3 && !showAllFeeds && (
                        <button
                          onClick={() => setShowAllFeeds(true)}
                          className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 underline mt-1"
                        >
                          Show all {listing.enrichment.threatIntelMatches.length} correlations
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs font-mono text-zinc-500">
                No active threat flags. Threat level assessed as benign/scam by initial filter.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. SECTION 4: AGENTIC PIPELINE TRACE (Accordion, collapsed by default) */}
      <div className="bg-[#0c0c0c] border border-zinc-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsPipelineOpen(!isPipelineOpen)}
          className="w-full p-3.5 bg-[#0c0c0c] hover:bg-zinc-900 flex items-center justify-between text-left transition-colors border-b border-zinc-800/80"
        >
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-zinc-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Pipeline Execution Log
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isPipelineOpen && (
              <span className="text-xs font-mono text-zinc-500">
                4 Stages Executed • STIX 2.1 Bundled
              </span>
            )}
            {isPipelineOpen ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
          </div>
        </button>

        {isPipelineOpen && (
          <div className="p-4 bg-black/40 space-y-4">
            {/* Clean Vertical Timeline */}
            <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
              {listing.pipelineTrace.map((step, idx) => {
                const isDone = step.status === 'DONE' || step.status === 'ENRICHED';
                const isBypassed = step.status === 'BYPASSED';

                return (
                  <div key={idx} className="relative text-xs">
                    {/* Stepper Dot */}
                    <div
                      className={`absolute -left-4 top-0.5 h-3 w-3 rounded-full border flex items-center justify-center ${
                        isDone
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : isBypassed
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-500'
                          : 'bg-amber-500/20 border-amber-500 text-amber-400'
                      }`}
                    >
                      <div className="h-1 w-1 rounded-full bg-current" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold font-mono text-zinc-200 uppercase">{step.name}</span>
                        <span className="text-[11px] text-zinc-500 font-mono">({step.subtext})</span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                        <span>{step.timestamp}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            isDone
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isBypassed
                              ? 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          [{step.status}]
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 mt-1 font-mono leading-relaxed">
                      {step.details}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Technical Log Toggle */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
              <button
                onClick={() => setShowFullLogs(!showFullLogs)}
                className="text-xs font-mono text-zinc-400 hover:text-white underline"
              >
                {showFullLogs ? 'Hide Detailed Payload' : 'Show Full Technical Logs'}
              </button>
              <span className="text-[11px] font-mono text-zinc-500">
                LangGraph State v2.1
              </span>
            </div>

            {showFullLogs && (
              <div className="p-3 bg-black border border-zinc-800 rounded font-mono text-xs text-zinc-300 overflow-x-auto max-h-48">
                <pre className="whitespace-pre">{JSON.stringify(listing.pipelineTrace, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 6. RECENTLY VIEWED BAR (Bottom) */}
      {recentlyViewed.length > 1 && (
        <div className="p-3 bg-[#0c0c0c] border border-zinc-800 rounded-lg flex items-center justify-between text-xs">
          <span className="font-mono text-zinc-500 uppercase text-[11px]">
            Recently Viewed Targets:
          </span>
          <div className="flex items-center gap-2">
            {recentlyViewed
              .filter((r) => r.id !== listing.id)
              .slice(0, 3)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectRecent(item)}
                  className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs border border-zinc-800 transition-colors"
                >
                  {item.vendor} ({item.id})
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
