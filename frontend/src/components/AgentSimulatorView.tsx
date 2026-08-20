import React, { useState, useRef, useEffect } from 'react';
import { 
  Cpu, 
  Play, 
  Square, 
  Terminal, 
  Sparkles, 
  ShieldAlert, 
  Network, 
  Coins, 
  ChevronDown,
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import type { CTIListing } from '../types/cti';

interface AgentSimulatorViewProps {
  listings: CTIListing[];
  onCompleteListing?: (listing: CTIListing) => void;
}

interface LogEntry {
  timestamp: string;
  stage: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
  message: string;
}

const PIPELINE_STAGES = [
  { id: 'extract', name: 'Regex Extraction', subtext: 'Wallets, PGP, Handles', icon: Network },
  { id: 'classify', name: 'Few-Shot LLM', subtext: 'Threat Categorization', icon: Sparkles },
  { id: 'rebrand', name: 'Rebrand Gate', subtext: 'Graph Entity Resolution', icon: ShieldAlert },
  { id: 'forensics', name: 'On-Chain Forensics', subtext: 'Mixer Hops & Taint', icon: Coins },
  { id: 'stix', name: 'STIX 2.1 Bundle', subtext: 'OASIS JSON Export', icon: Cpu },
];

export const AgentSimulatorView: React.FC<AgentSimulatorViewProps> = ({
  listings,
}) => {
  const [selectedListingId, setSelectedListingId] = useState<string>(listings[0]?.id || '');
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(-1);
  const [stageStatus, setStageStatus] = useState<('IDLE' | 'RUNNING' | 'DONE')[]>([
    'IDLE', 'IDLE', 'IDLE', 'IDLE', 'IDLE'
  ]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copiedLogs, setCopiedLogs] = useState<boolean>(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  const activeListing = listings.find(l => l.id === selectedListingId) || listings[0];

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (stage: string, level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR', message: string) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 12);
    setLogs(prev => [...prev, { timestamp, stage, level, message }]);
  };

  const runPipeline = (listing: CTIListing) => {
    setIsRunning(true);
    setCurrentStageIdx(0);
    setStageStatus(['RUNNING', 'IDLE', 'IDLE', 'IDLE', 'IDLE']);
    setLogs([]);

    addLog('INIT', 'INFO', `Initializing LangGraph state machine for Target: [${listing.vendor}] (${listing.id})`);
    addLog('INIT', 'INFO', `Raw Source: ${listing.source} | Discovered: ${listing.discoveredAt}`);

    let isCancelled = false;
    cancelRef.current = () => { isCancelled = true; };

    // Stage 1: Extraction
    setTimeout(() => {
      if (isCancelled) return;
      setCurrentStageIdx(0);
      setStageStatus(['DONE', 'RUNNING', 'IDLE', 'IDLE', 'IDLE']);
      addLog('EXTRACT', 'INFO', `Executing deterministic regex patterns for wallets, PGP fingerprints, and communication handles.`);
      
      listing.extracted.wallets.forEach(w => {
        addLog('EXTRACT', 'SUCCESS', `Extracted ${w.currency} Address: ${w.address}`);
      });
      if (listing.extracted.pgpKey) {
        addLog('EXTRACT', 'SUCCESS', `Extracted PGP Fingerprint: ${listing.extracted.pgpKey.fingerprint}`);
      }
      listing.extracted.commsHandles.forEach(h => {
        addLog('EXTRACT', 'SUCCESS', `Extracted Contact Handle: ${h}`);
      });

      // Stage 2: Classification
      setTimeout(() => {
        if (isCancelled) return;
        setCurrentStageIdx(1);
        setStageStatus(['DONE', 'DONE', 'RUNNING', 'IDLE', 'IDLE']);
        addLog('CLASSIFY', 'INFO', `Invoking Few-Shot Prompting Agent for contraband classification.`);
        addLog('CLASSIFY', 'SUCCESS', `Target Classified: [${listing.classification}] (Confidence: ${(listing.confidence * 100).toFixed(0)}%)`);
        addLog('CLASSIFY', 'INFO', `Extracted Item Category: ${listing.category}`);

        // Stage 3: Rebrand Gate
        setTimeout(() => {
          if (isCancelled) return;
          setCurrentStageIdx(2);
          setStageStatus(['DONE', 'DONE', 'DONE', 'RUNNING', 'IDLE']);
          addLog('REBRAND', 'INFO', `Searching cross-platform identity cluster knowledge graph...`);

          if (listing.rebrandDetected) {
            addLog('REBRAND', 'WARN', `CRITICAL MATCH: Shared PGP Key & Wallet linked to ${listing.linkedAliases?.length || 2} personas across Agora & Telegram!`);
            listing.linkedAliases?.forEach(a => {
              addLog('REBRAND', 'SUCCESS', `Linked Persona: [${a.alias}] on ${a.platform} via ${a.matchedIndicator}`);
            });
          } else {
            addLog('REBRAND', 'INFO', `No secondary rebrand matches detected. Entity isolated.`);
          }

          // Stage 4: On-Chain Forensics
          setTimeout(() => {
            if (isCancelled) return;
            setCurrentStageIdx(3);
            setStageStatus(['DONE', 'DONE', 'DONE', 'DONE', 'RUNNING']);
            addLog('FORENSICS', 'INFO', `Querying blockchain telemetry for tainted funds & mixer hops...`);
            
            if (listing.enrichment) {
              addLog('FORENSICS', 'WARN', `Threat Score: ${listing.enrichment.threatScore}/100 | Tainted Balance: $${listing.enrichment.onChainVolumeUsd.toLocaleString()}`);
              addLog('FORENSICS', 'WARN', `Mixer Hops: ${listing.enrichment.mixerHopsDetected} | Sanction Proximity: ${listing.enrichment.sanctionProximityScore}%`);
            }

            // Stage 5: STIX 2.1 Export
            setTimeout(() => {
              if (isCancelled) return;
              setCurrentStageIdx(4);
              setStageStatus(['DONE', 'DONE', 'DONE', 'DONE', 'DONE']);
              addLog('STIX_EXPORT', 'SUCCESS', `OASIS STIX 2.1 Bundle generated successfully: [${listing.stixBundleId}]`);
              addLog('STIX_EXPORT', 'SUCCESS', `Inter-agency court-admissible evidence packaged.`);
              addLog('COMPLETE', 'SUCCESS', `LangGraph execution completed in 2.41s.`);
              setIsRunning(false);
            }, 500);

          }, 500);

        }, 500);

      }, 500);

    }, 400);
  };

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.stage}] [${l.level}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLogs(true);
    setTimeout(() => setCopiedLogs(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Pipeline Controller */}
      <div
        className="rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        
        {/* Left Info */}
        <div className="flex items-center gap-4">
          <div
            className="h-12 w-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs"
            style={{
              backgroundColor: 'var(--bg-accent-subtle)',
              borderColor: 'var(--border-accent)',
              color: 'var(--accent-primary)',
            }}
          >
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2
                className="text-lg font-bold font-sans tracking-wide"
                style={{ color: 'var(--text-primary)' }}
              >
                DarkScope Autonomous Multi-Agent Pipeline Simulator
              </h2>
              <span
                className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border"
                style={{
                  backgroundColor: 'var(--bg-accent-badge)',
                  borderColor: 'var(--border-accent)',
                  color: 'var(--accent-primary-text)',
                }}
              >
                LangGraph v2.1
              </span>
            </div>
            <p className="text-sm text-slate-400 font-sans mt-0.5">
              Live deterministic orchestration: Regex Ingestion &rarr; Few-Shot LLM &rarr; Rebrand Graph Gate &rarr; On-Chain Forensics &rarr; STIX 2.1 Bundler.
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Target Selector */}
          <div className="relative">
            <select
              value={selectedListingId}
              onChange={(e) => setSelectedListingId(e.target.value)}
              disabled={isRunning}
              aria-label="Select Target Investigation Case for Simulation"
              className="appearance-none text-sm font-mono pl-3.5 pr-9 py-2.5 rounded-xl border focus:outline-none cursor-pointer font-medium disabled:opacity-50"
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

          {!isRunning ? (
            <button
              onClick={() => runPipeline(activeListing)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-mono font-bold transition-all shadow-xs cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-accent)',
                color: 'var(--accent-primary-content)',
                boxShadow: 'var(--accent-glow)',
              }}
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Execute Pipeline</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (cancelRef.current) cancelRef.current();
                setIsRunning(false);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-mono font-bold transition-all shadow-xs cursor-pointer"
            >
              <Square className="h-4 w-4 fill-current" />
              <span>Abort Pipeline</span>
            </button>
          )}
        </div>

      </div>

      {/* 5-Stage Interactive LangGraph Pipeline Strip */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {PIPELINE_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const status = stageStatus[idx];
          const isCurrent = currentStageIdx === idx && isRunning;

          return (
            <div
              key={stage.id}
              className="p-4 rounded-2xl border transition-all"
              style={
                status === 'DONE'
                  ? {
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'rgba(16, 185, 129, 0.4)',
                      color: 'var(--text-primary)',
                    }
                  : isCurrent
                  ? {
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-accent)',
                      color: 'var(--text-primary)',
                      boxShadow: 'var(--accent-glow)',
                    }
                  : {
                      backgroundColor: 'var(--bg-card)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      opacity: 0.8,
                    }
              }
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="h-8 w-8 rounded-xl flex items-center justify-center"
                  style={
                    status === 'DONE'
                      ? { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }
                      : isCurrent
                      ? { backgroundColor: 'var(--bg-accent-subtle)', color: 'var(--accent-primary-text)' }
                      : { backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }
                  }
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                  style={
                    status === 'DONE'
                      ? { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }
                      : isCurrent
                      ? { backgroundColor: 'var(--bg-accent-badge)', color: 'var(--accent-primary-text)', borderColor: 'var(--border-accent)' }
                      : { backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', borderColor: 'var(--border-subtle)' }
                  }
                >
                  {status}
                </span>
              </div>

              <div
                className="font-bold text-sm font-sans"
                style={{ color: 'var(--text-primary)' }}
              >
                {idx + 1}. {stage.name}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {stage.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Workbench: Split State View & Live Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 cols): Structured Entity State Snapshot */}
        <div
          className="lg:col-span-5 rounded-2xl p-6 shadow-xs space-y-4 border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div
            className="flex items-center justify-between pb-3 border-b"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <h3
              className="text-sm font-bold font-mono uppercase tracking-wider"
              style={{ color: 'var(--text-primary)' }}
            >
              Live State Machine Snapshot
            </h3>
            <span className="text-xs font-mono text-slate-400">
              State: <strong style={{ color: 'var(--accent-primary-text)' }}>{activeListing.id}</strong>
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Raw Target */}
            <div
              className="p-3.5 rounded-xl border space-y-1"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <span className="text-[10px] text-slate-500 uppercase font-bold">Target Identity & Vendor</span>
              <div
                className="text-sm font-bold font-sans"
                style={{ color: 'var(--text-primary)' }}
              >
                {activeListing.vendor}
              </div>
              <div className="text-slate-400 text-xs">{activeListing.itemTitle}</div>
            </div>

            {/* Entity Fingerprints */}
            <div
              className="p-3.5 rounded-xl border space-y-2"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <span className="text-[10px] text-slate-500 uppercase font-bold">Extracted Identity Fingerprints</span>
              {activeListing.extracted.pgpKey && (
                <div className="text-emerald-400 truncate">
                  PGP: {activeListing.extracted.pgpKey.fingerprint}
                </div>
              )}
              {activeListing.extracted.wallets.map((w, idx) => (
                <div key={idx} className="text-amber-300 truncate">
                  {w.currency}: {w.address}
                </div>
              ))}
            </div>

            {/* Resolved Rebrand Cluster */}
            <div
              className="p-3.5 rounded-xl border space-y-2"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <span className="text-[10px] text-slate-500 uppercase font-bold">Cross-Platform Resolution</span>
              {activeListing.linkedAliases && activeListing.linkedAliases.length > 0 ? (
                <div className="space-y-1">
                  {activeListing.linkedAliases.map((a, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                      style={{ color: 'var(--accent-primary-text)' }}
                    >
                      <span>{a.alias} ({a.platform})</span>
                      <span className="text-emerald-400 font-bold">{(a.confidence * 100).toFixed(0)}% MATCH</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500">No linked aliases. Standalone target.</div>
              )}
            </div>

            {/* STIX 2.1 State */}
            <div
              className="p-3.5 rounded-xl border space-y-1"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <span className="text-[10px] text-slate-500 uppercase font-bold">STIX 2.1 State Reference</span>
              <div className="text-slate-300 truncate">{activeListing.stixBundleId}</div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Terminal Stream Workbench */}
        <div
          className="lg:col-span-7 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[560px] border"
          style={{
            backgroundColor: 'var(--bg-canvas)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          {/* Terminal Header */}
          <div
            className="p-4 border-b flex items-center justify-between"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-2.5 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-amber-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <span className="ml-2 text-slate-400 font-semibold">darkscope-agent-terminal: ~ langgraph.log</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLogs}
                disabled={logs.length === 0}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-slate-300 text-xs font-mono border transition-colors disabled:opacity-40 cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                {copiedLogs ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedLogs ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => setLogs([])}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Clear Terminal"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Terminal Logs Content */}
          <div
            className="flex-1 p-5 overflow-y-auto font-mono text-xs space-y-2 leading-relaxed"
            style={{ backgroundColor: 'var(--bg-canvas)' }}
          >
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
                <Terminal className="h-8 w-8 text-slate-700" />
                <span>Agent pipeline is standby. Click "Execute Pipeline" to start.</span>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
                  <span className="text-slate-400 font-bold shrink-0">[{log.stage}]</span>
                  <span className={`break-all ${
                    log.level === 'SUCCESS' ? 'text-emerald-400 font-medium' :
                    log.level === 'WARN' ? 'text-amber-400 font-semibold' :
                    log.level === 'ERROR' ? 'text-rose-400 font-bold' :
                    'text-slate-300'
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>

          {/* Terminal Footer */}
          <div
            className="p-3 border-t flex items-center justify-between text-[11px] font-mono text-slate-500"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <span>LangGraph Agent Stream: {isRunning ? 'ORCHESTRATING...' : 'IDLE'}</span>
            <span>Logs: {logs.length} events</span>
          </div>

        </div>

      </div>

    </div>
  );
};
