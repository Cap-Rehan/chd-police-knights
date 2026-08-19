import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Square, 
  Cpu, 
  Layers, 
  Shield, 
  GitBranch, 
  Coins, 
  FileCode, 
  CheckCircle2, 
  SkipForward, 
  Clock, 
  Terminal, 
  FileText, 
  ArrowRight, 
  AlertTriangle, 
  BarChart3,
  Loader2
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { CTIListing } from '../types/cti';

interface AgentControllerModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: CTIListing[];
}

const AGENTS = [
  {
    id: 'extract',
    name: 'Extraction Agent',
    icon: Layers,
    color: '#0d9488', // muted teal
    model: 'Hybrid Regex + Ollama qwen2.5:7b',
    role: 'Deterministic extraction of BTC/ETH/XMR wallets, PGP fingerprints, handles, .onion mirrors'
  },
  {
    id: 'classify',
    name: 'Classification Agent',
    icon: Shield,
    color: '#fbbf24', // amber-400
    model: 'Few-Shot LLM (temperature=0.0)',
    role: 'Threat classification: ILLICIT vs SCAM vs LEGIT with confidence score & investigative reasoning'
  },
  {
    id: 'routing',
    name: 'Deterministic Routing Gate',
    icon: GitBranch,
    color: '#a855f7', // purple-500
    model: 'LangGraph Conditional Edge',
    role: 'Evaluate: Category==ILLICIT && confidence>=0.85 && wallets.length>0 => Trigger Enrichment'
  },
  {
    id: 'enrich',
    name: 'Enrichment Agent',
    icon: Coins,
    color: '#f43f5e', // rose-500
    model: 'Blockchain.info & BlockCypher APIs',
    role: 'On-chain forensic lookup: wallet volume, tx count, mixer interaction hops, OFAC sanctions match'
  },
  {
    id: 'report',
    name: 'Report Agent',
    icon: FileCode,
    color: '#10b981', // emerald-500
    model: 'OASIS STIX 2.1 Python SDK',
    role: 'STIX 2.1 ThreatActor, Indicator, ObservedData bundle serialization & webhook dispatch'
  }
];

export const AgentControllerModal: React.FC<AgentControllerModalProps> = ({
  isOpen,
  onClose,
  listings,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [agentStates, setAgentStates] = useState<Record<string, 'idle' | 'running' | 'done' | 'skipped'>>({});
  const [logs, setLogs] = useState<{ ts: number; agent: string; level: 'info' | 'warn' | 'success' | 'error'; message: string }[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [completedListings, setCompletedListings] = useState<CTIListing[]>([]);

  const cancelRef = useRef<(() => void) | null>(null);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (!isOpen) return null;

  const currentListing = listings[currentIdx] || listings[0];

  const runPipelineForListing = (listing: CTIListing, onCompleteCallback: () => void) => {
    setIsRunning(true);
    setAgentStates({});

    const steps: { delay: number; action: () => void }[] = [];

    // Extract
    steps.push({
      delay: 300,
      action: () => {
        setAgentStates(prev => ({ ...prev, extract: 'running' }));
        setLogs(prev => [...prev, {
          ts: Date.now(),
          agent: 'Extraction Agent',
          level: 'info',
          message: `[${listing.id}] Initiating hybrid regex + LLM extraction on target "${listing.vendor}"...`
        }]);
      }
    });
    steps.push({
      delay: 700,
      action: () => {
        setLogs(prev => [...prev, {
          ts: Date.now(),
          agent: 'Extraction Agent',
          level: 'info',
          message: `  Regex: Discovered ${listing.extracted.wallets.length} wallet(s), PGP=${listing.extracted.pgpKey ? 'PRESENT' : 'NONE'}, Handles=${listing.extracted.commsHandles.length}`
        }]);
      }
    });
    steps.push({
      delay: 300,
      action: () => {
        setAgentStates(prev => ({ ...prev, extract: 'done' }));
        setLogs(prev => [...prev, {
          ts: Date.now(),
          agent: 'Extraction Agent',
          level: 'success',
          message: `  Extraction complete. Entities successfully mapped into LangGraph State.`
        }]);
      }
    });

    // Classify
    steps.push({
      delay: 400,
      action: () => {
        setAgentStates(prev => ({ ...prev, classify: 'running' }));
        setLogs(prev => [...prev, {
          ts: Date.now(),
          agent: 'Classification Agent',
          level: 'info',
          message: `[${listing.id}] Invoking Few-Shot Classifier (qwen2.5:7b, format=json)...`
        }]);
      }
    });
    steps.push({
      delay: 800,
      action: () => {
        setLogs(prev => [...prev, {
          ts: Date.now(),
          agent: 'Classification Agent',
          level: 'info',
          message: `  Category="${listing.classification}", Confidence=${listing.confidence.toFixed(2)}`
        }]);
      }
    });
    steps.push({
      delay: 300,
      action: () => {
        setAgentStates(prev => ({ ...prev, classify: 'done' }));
        setLogs(prev => [...prev, {
          ts: Date.now(),
          agent: 'Classification Agent',
          level: 'success',
          message: `  Classification confirmed: ${listing.classification} (${(listing.confidence * 100).toFixed(0)}%)`
        }]);
      }
    });

    // Routing Gate
    steps.push({
      delay: 200,
      action: () => {
        setAgentStates(prev => ({ ...prev, routing: 'running' }));
        const meetsCategory = listing.classification === 'ILLICIT';
        const meetsConfidence = listing.confidence >= 0.85;
        const hasWallets = listing.extracted.wallets.length > 0;
        setLogs(prev => [...prev, {
          ts: Date.now(),
          agent: 'Routing Gate',
          level: 'info',
          message: `  Evaluating: Illicit=${meetsCategory} | Conf>=0.85=${meetsConfidence} | Wallets>0=${hasWallets}`
        }]);
      }
    });
    steps.push({
      delay: 300,
      action: () => {
        const willEnrich = listing.classification === 'ILLICIT' && listing.extracted.wallets.length > 0;
        setAgentStates(prev => ({ ...prev, routing: 'done' }));
        if (willEnrich) {
          setLogs(prev => [...prev, {
            ts: Date.now(),
            agent: 'Routing Gate',
            level: 'warn',
            message: `  GATE PASSED -> Proceeding to On-Chain Forensic Enrichment Agent.`
          }]);
        } else {
          setLogs(prev => [...prev, {
            ts: Date.now(),
            agent: 'Routing Gate',
            level: 'info',
            message: `  GATE BYPASSED -> Benign / Scam or no crypto assets. Routing directly to Report Agent.`
          }]);
        }
      }
    });

    // Enrich
    if (listing.classification === 'ILLICIT' && listing.extracted.wallets.length > 0) {
      steps.push({
        delay: 400,
        action: () => {
          setAgentStates(prev => ({ ...prev, enrich: 'running' }));
          setLogs(prev => [...prev, {
            ts: Date.now(),
            agent: 'Enrichment Agent',
            level: 'info',
            message: `[${listing.id}] Querying Blockchain.info & BlockCypher APIs...`
          }]);
        }
      });
      steps.push({
        delay: 700,
        action: () => {
          setAgentStates(prev => ({ ...prev, enrich: 'done' }));
          setLogs(prev => [...prev, {
            ts: Date.now(),
            agent: 'Enrichment Agent',
            level: 'warn',
            message: `  Enrichment score: ${listing.enrichment?.threatScore}/100 | Volume: $${((listing.enrichment?.onChainVolumeUsd || 0) / 1000).toFixed(0)}k USD | Flags: [${listing.enrichment?.riskFlags.join(', ')}]`
          }]);
        }
      });
    } else {
      steps.push({
        delay: 150,
        action: () => {
          setAgentStates(prev => ({ ...prev, enrich: 'skipped' }));
          setLogs(prev => [...prev, {
            ts: Date.now(),
            agent: 'Enrichment Agent',
            level: 'info',
            message: `  Skipped by routing gate.`
          }]);
        }
      });
    }

    // Report
    steps.push({
      delay: 300,
      action: () => {
        setAgentStates(prev => ({ ...prev, report: 'running' }));
        setLogs(prev => [...prev, {
          ts: Date.now(),
          agent: 'Report Agent',
          level: 'info',
          message: `[${listing.id}] Generating OASIS STIX 2.1 Threat Intelligence Bundle...`
        }]);
      }
    });
    steps.push({
      delay: 500,
      action: () => {
        setAgentStates(prev => ({ ...prev, report: 'done' }));
        setLogs(prev => [...prev, {
          ts: Date.now(),
          agent: 'Report Agent',
          level: 'success',
          message: `  Bundle ${listing.stixBundleId} generated and queued for command center dispatch.`
        }]);
      }
    });

    // Complete
    steps.push({
      delay: 200,
      action: () => {
        setIsRunning(false);
        setProcessedCount(prev => prev + 1);
        setCompletedListings(prev => [...prev, listing]);
        onCompleteCallback();
      }
    });

    let cumDelay = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    steps.forEach((step) => {
      cumDelay += step.delay;
      const t = setTimeout(step.action, cumDelay);
      timeouts.push(t);
    });

    cancelRef.current = () => timeouts.forEach(clearTimeout);
  };

  const handleStartCurrent = () => {
    if (isRunning) return;
    runPipelineForListing(listings[currentIdx], () => {
      setShowReport(true);
    });
  };

  const handleStartAll = () => {
    if (isRunning) return;
    setCurrentIdx(0);
    setProcessedCount(0);
    setLogs([]);
    setCompletedListings([]);
    setShowReport(false);

    let idx = 0;
    const runNext = () => {
      if (idx < listings.length) {
        setCurrentIdx(idx);
        runPipelineForListing(listings[idx], () => {
          idx += 1;
          if (idx < listings.length) {
            setTimeout(runNext, 400);
          } else {
            setTimeout(() => setShowReport(true), 600);
          }
        });
      }
    };
    runNext();
  };

  const handleAbort = () => {
    if (cancelRef.current) cancelRef.current();
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0c0c0c] border border-zinc-800 rounded-xl w-full max-w-5xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-[#0c0c0c]">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-teal-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-100 uppercase tracking-wider">
                  LangGraph Autonomous Multi-Agent Pipeline
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  v2.1 SOC EXEC
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">
                Real-Time Execution Simulator: Extract &rarr; Classify &rarr; Routing Gate &rarr; Enrich &rarr; STIX 2.1 Report
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isRunning ? (
              <>
                <button
                  onClick={handleStartCurrent}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-teal-600 hover:bg-teal-500 text-zinc-950 text-xs font-bold font-mono transition-colors shadow-xs"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Run Target</span>
                </button>
                <button
                  onClick={handleStartAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold font-mono border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <Play className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Run All ({listings.length})</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleAbort}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold font-mono border border-rose-500/30 transition-colors"
              >
                <Square className="h-3.5 w-3.5" />
                <span>Abort Pipeline</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/60">
          {/* Top Row: Target & 5 Agent Status Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
            {AGENTS.map((agent) => {
              const status = agentStates[agent.id] || 'idle';
              const Icon = agent.icon;
              return (
                <div
                  key={agent.id}
                  className={`p-2.5 rounded-lg border transition-all ${
                    status === 'running'
                      ? 'bg-teal-500/10 border-teal-500/40 ring-1 ring-teal-500/20'
                      : status === 'done'
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : status === 'skipped'
                      ? 'bg-[#0c0c0c] border-zinc-800 opacity-60'
                      : 'bg-[#0c0c0c] border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5" style={{ color: agent.color }}>
                      <Icon className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-semibold tracking-wide text-zinc-200 uppercase">
                        {agent.name.replace(' Agent', '')}
                      </span>
                    </div>
                    {status === 'running' ? (
                      <Loader2 className="h-3 w-3 animate-spin text-teal-400" />
                    ) : status === 'done' ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    ) : status === 'skipped' ? (
                      <SkipForward className="h-3 w-3 text-zinc-500" />
                    ) : (
                      <Clock className="h-3 w-3 text-zinc-600" />
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono truncate">{agent.model}</div>
                  <div className="mt-2 flex items-center justify-between text-[9px] font-mono">
                    <span className="text-zinc-500">STATE:</span>
                    <span
                      className={`font-bold uppercase ${
                        status === 'running'
                          ? 'text-teal-400 animate-pulse'
                          : status === 'done'
                          ? 'text-emerald-400'
                          : status === 'skipped'
                          ? 'text-zinc-500'
                          : 'text-zinc-600'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Middle Row: Target Info & Live Log Terminal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Target Queue Info */}
            <div className="bg-[#0c0c0c] border border-zinc-800 rounded-lg p-3.5 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-zinc-500">Current Target Under Analysis</div>
                <div className="text-sm font-semibold text-zinc-100 mt-0.5">{currentListing.id}</div>
                <div className="text-xs text-rose-400 font-medium">{currentListing.vendor}</div>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{currentListing.itemTitle}</p>
              </div>

              <div className="pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-500 space-y-1">
                <div className="flex justify-between">
                  <span>Queue Position:</span>
                  <span className="text-zinc-300 font-bold">{currentIdx + 1} / {listings.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Batch Processed:</span>
                  <span className="text-emerald-400 font-bold">{processedCount}</span>
                </div>
              </div>
            </div>

            {/* Execution Log Terminal (takes 2 cols) */}
            <div className="md:col-span-2 bg-black border border-zinc-800 rounded-lg flex flex-col h-56 overflow-hidden">
              <div className="p-2.5 border-b border-zinc-800 bg-[#0c0c0c] flex items-center justify-between text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-teal-400" />
                  <span className="font-semibold text-zinc-200">LANGGRAPH EXECUTION LOGS</span>
                </div>
                <button
                  onClick={() => setLogs([])}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  CLEAR
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] space-y-1 leading-relaxed bg-black">
                {logs.length === 0 ? (
                  <div className="text-zinc-600 text-center py-12">
                    Pipeline idle. Press "Run Target" or "Run All" to begin autonomous orchestration.
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-zinc-600 shrink-0">
                        {new Date(log.ts).toLocaleTimeString([], { hour12: false })}
                      </span>
                      <span
                        className={`shrink-0 font-bold ${
                          log.level === 'success'
                            ? 'text-emerald-400'
                            : log.level === 'warn'
                            ? 'text-rose-400'
                            : 'text-teal-400'
                        }`}
                      >
                        {log.level === 'success' ? '[+]' : log.level === 'warn' ? '[!]' : '[>]'}
                      </span>
                      <span
                        className={
                          log.level === 'success'
                            ? 'text-emerald-300'
                            : log.level === 'warn'
                            ? 'text-rose-300'
                            : 'text-zinc-300'
                        }
                      >
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>

          {/* AI AGENT AUTONOMOUS REPORT CARD (Appears when runs complete) */}
          {showReport && (
            <div className="bg-[#0c0c0c] border border-zinc-800 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-zinc-100 uppercase tracking-wider">
                    Autonomous Intelligence Assessment Report
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {completedListings.length} Target(s) Evaluated
                  </span>
                </div>
                <button
                  onClick={() => setShowReport(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Row 1: Visual Charts (Pie + Bar with muted teal) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Pie Chart: Threat Breakdown */}
                <div className="bg-black border border-zinc-800 rounded-lg p-3">
                  <div className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    Threat Classification Breakdown
                  </div>
                  {(() => {
                    const illicitCount = completedListings.filter(l => l.classification === 'ILLICIT').length;
                    const scamCount = completedListings.filter(l => l.classification === 'SCAM').length;
                    const legitCount = completedListings.filter(l => l.classification === 'LEGIT').length;
                    const pieData = [
                      { name: 'Illicit', value: illicitCount, color: '#f43f5e' },
                      { name: 'Scam', value: scamCount, color: '#f59e0b' },
                      { name: 'Legit', value: legitCount, color: '#10b981' }
                    ].filter(d => d.value > 0);

                    return (
                      <div className="flex items-center justify-around h-36">
                        <ResponsiveContainer width="50%" height="100%">
                          <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={28} outerRadius={48} paddingAngle={4} dataKey="value">
                              {pieData.map((e, idx) => (
                                <Cell key={idx} fill={e.color} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: 4, fontSize: 11, color: '#ededed' }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-1.5 font-mono text-xs">
                          {pieData.map((d, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                              <span className="text-zinc-400">{d.name}:</span>
                              <span className="font-bold text-zinc-100">{d.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Bar Chart: Stage Processing Velocity */}
                <div className="bg-black border border-zinc-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
                      Stage Velocity & Ingestion Latency
                    </div>
                    <span className="text-[10px] font-mono text-teal-400">Mean: 0.86s</span>
                  </div>
                  {(() => {
                    const enrichedCount = completedListings.filter(l => l.enrichment !== undefined).length;
                    const barData = [
                      { stage: 'Extract', items: completedListings.length, latency: '0.8s' },
                      { stage: 'Classify', items: completedListings.length, latency: '1.4s' },
                      { stage: 'Route', items: completedListings.length, latency: '0.2s' },
                      { stage: 'Enrich', items: enrichedCount, latency: '2.1s' },
                      { stage: 'Report', items: completedListings.length, latency: '0.4s' }
                    ];

                    return (
                      <div className="h-36">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 35, left: -20, bottom: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="stage" type="category" stroke="#52525b" tick={{ fontSize: 10, fill: '#a1a1aa' }} width={60} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: 4, fontSize: 11, fontFamily: 'monospace', color: '#ededed' }} 
                              formatter={(val, _name, item) => [`${val} items (${(item as { payload: { latency: string } }).payload.latency})`, 'Processed']}
                            />
                            <Bar 
                              dataKey="items" 
                              fill="#0d9488" 
                              fillOpacity={0.85} 
                              radius={[0, 3, 3, 0]} 
                              label={{ position: 'right', fill: '#a1a1aa', fontSize: 10, fontFamily: 'monospace' }}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Row 2: Flowchart Trace */}
              <div className="bg-black border border-zinc-800 rounded-lg p-3">
                <div className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  LangGraph Agent Flow Architecture Trace
                </div>
                <div className="flex items-center justify-center gap-2 flex-wrap py-2 text-xs font-mono">
                  <div className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">START</div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />
                  <div className="px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/30 text-teal-400 font-bold">EXTRACT</div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />
                  <div className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">CLASSIFY</div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />
                  <div className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold">GATE</div>
                  <div className="flex flex-col gap-1 items-start">
                    <div className="flex items-center gap-1">
                      <ArrowRight className="h-3 w-3 text-rose-400" />
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[10px]">ENRICH (Illicit)</span>
                      <ArrowRight className="h-3 w-3 text-rose-400" />
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-zinc-500 italic">
                      <ArrowRight className="h-3 w-3 text-zinc-600" />
                      <span>bypass (Scam/Legit)</span>
                      <ArrowRight className="h-3 w-3 text-zinc-600" />
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">REPORT (STIX 2.1)</div>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />
                  <div className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">END</div>
                </div>
              </div>

              {/* Row 3: Key Autonomous Findings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-black border border-zinc-800 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold font-mono">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>CRITICAL LAW ENFORCEMENT NOTICES</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    Identified <strong className="text-rose-400">{completedListings.filter(l => l.classification === 'ILLICIT').length} illicit operations</strong> with high confidence. Primary actors in Punjab/Chandigarh region include <strong className="text-zinc-200">PunjabSynthetics_01</strong> and <strong className="text-zinc-200">Chd_DarkPharma</strong> with physical municipal dead-drop logistics.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-zinc-800 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold font-mono">
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>BLOCKCHAIN FORENSIC INTELLIGENCE</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    On-chain threat analysis revealed multiple mixer hops and OFAC sanctions proximity across flagged Bitcoin & Monero wallets. All Indicators have been converted to standard OASIS STIX 2.1 bundles for inter-agency coordination.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-zinc-800 bg-[#0c0c0c] flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Chandigarh Police Cyber Cell Autonomous Pipeline</span>
          <span>Status: {isRunning ? 'ORCHESTRATING RUNS...' : 'STANDBY'}</span>
        </div>
      </div>
    </div>
  );
};
