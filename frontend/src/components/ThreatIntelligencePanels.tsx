import React from 'react';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Network, 
  AlertOctagon, 
  Coins, 
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { mockKPIMetrics } from '../data/mockData';
import type { KPIMetrics } from '../types/cti';

interface ThreatIntelligencePanelsProps {
  metrics?: KPIMetrics;
}

const trendData = [
  { day: '13 Aug', precursors: 18, mdma: 34, rceExploits: 12 },
  { day: '14 Aug', precursors: 24, mdma: 38, rceExploits: 15 },
  { day: '15 Aug', precursors: 32, mdma: 42, rceExploits: 19 },
  { day: '16 Aug', precursors: 48, mdma: 40, rceExploits: 22 },
  { day: '17 Aug', precursors: 65, mdma: 45, rceExploits: 28 },
  { day: '18 Aug', precursors: 92, mdma: 49, rceExploits: 31 },
  { day: '19 Aug', precursors: 142, mdma: 56, rceExploits: 35 },
];

const classificationData = [
  { name: 'Illicit Contraband', value: 6180, percentage: '7.3%', color: '#f43f5e' },
  { name: 'Exit Scams / Fraud', value: 4320, percentage: '5.1%', color: '#f59e0b' },
  { name: 'Benign Traffic', value: 73620, percentage: '87.6%', color: '#10b981' },
];

export const ThreatIntelligencePanels: React.FC<ThreatIntelligencePanelsProps> = ({
  metrics = mockKPIMetrics,
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
      
      {/* LEFT COLUMN (Wider ~66% width): 7-Day Trends + Threat Ratio */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* Panel 1: 7-Day Contraband & Exploit Volume Trends (Large & Spacious) */}
        <div className="bg-[#0e121a] border border-[#1c2333] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1c2333] gap-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100 font-sans tracking-wide">
                  7-Day Contraband & Exploit Ingestion Trends
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  NLP keyword clustering across Telegram exports and Agora historical stream
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-500/30">
              Live NLP Stream
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center py-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="precursorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="mdmaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="exploitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#334155" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis stroke="#334155" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e121a',
                    borderColor: '#1c2333',
                    borderRadius: 12,
                    fontSize: 12,
                    fontFamily: 'monospace',
                    color: '#f1f5f9',
                    padding: '8px 12px'
                  }}
                />
                <Area type="monotone" dataKey="precursors" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#precursorGrad)" name="Synthetic Precursors" />
                <Area type="monotone" dataKey="mdma" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#mdmaGrad)" name="MDMA Tablets" />
                <Area type="monotone" dataKey="rceExploits" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#exploitGrad)" name="0-Day RCE Exploits" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-[#1c2333] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Precursors (+44%)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> MDMA (+18%)
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> 0-Day Exploits (+35%)
              </span>
            </div>
            <span className="text-slate-500">Mean Ingestion Latency: 0.86s</span>
          </div>
        </div>

        {/* Panel 2: Threat Classification & Rebrand Ratio (Spacious & Detailed) */}
        <div className="bg-[#0e121a] border border-[#1c2333] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1c2333] gap-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <PieIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100 font-sans tracking-wide">
                  Threat Classification Ratio & Confidence
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Few-shot calibrated LLM triage across 84,120 ingested listings
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-semibold">
              96.4% Calibrated Accuracy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-4">
            
            {/* Donut Chart */}
            <div className="md:col-span-5 h-52 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classificationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="#0e121a"
                    strokeWidth={3}
                  >
                    {classificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0e121a',
                      borderColor: '#1c2333',
                      borderRadius: 12,
                      fontSize: 12,
                      fontFamily: 'monospace',
                      color: '#f1f5f9',
                    }}
                    formatter={(val) => [Number(val).toLocaleString(), 'Volume']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-mono">
                <span className="text-sm font-extrabold text-slate-100">84.1k</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider">Total Listings</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="md:col-span-7 space-y-3 font-mono text-xs">
              {classificationData.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#121622] border border-[#1c2333] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-200 font-semibold text-xs">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-100 text-sm">{item.percentage}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Volume: {item.value.toLocaleString()} items</span>
                    <span className="text-slate-500">Triage: Automated</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="pt-4 border-t border-[#1c2333] text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Continuous Triage Gate: Deterministic Routing Active</span>
            <span className="text-indigo-400">LangGraph v2.1</span>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN (~34% width): 4 KPI Cards in 1 Col, 4 Rows + Intelligence Alerts Feed */}
      <div className="xl:col-span-4 space-y-6">
        
        {/* Section 1: 4 KPI Cards Stacked Vertically */}
        <div className="space-y-3.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono px-1">
            System Key Performance Indicators
          </div>

          {/* Card 1: Entities Resolved */}
          <div className="bg-[#0e121a] border border-[#1c2333] hover:border-indigo-500/40 rounded-2xl p-4 flex items-center justify-between transition-all group shadow-xs">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Entities Resolved
              </div>
              <div className="text-2xl font-extrabold font-mono text-indigo-300 mt-1">
                {metrics.entitiesResolved.toLocaleString()}
              </div>
              <div className="text-xs font-mono text-indigo-400/90 mt-0.5">
                +18 cross-platform links
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <Network className="h-5 w-5" />
            </div>
          </div>

          {/* Card 2: Illicit Targets Flagged */}
          <div className="bg-[#0e121a] border border-[#1c2333] hover:border-rose-500/40 rounded-2xl p-4 flex items-center justify-between transition-all group shadow-xs">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Illicit Targets Flagged
              </div>
              <div className="text-2xl font-extrabold font-mono text-rose-400 mt-1">
                {metrics.illicitListings.toLocaleString()}
              </div>
              <div className="text-xs font-mono text-rose-400/90 mt-0.5">
                High-confidence narcotics/IAB
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <AlertOctagon className="h-5 w-5" />
            </div>
          </div>

          {/* Card 3: Tracked Crypto Wallets */}
          <div className="bg-[#0e121a] border border-[#1c2333] hover:border-amber-500/40 rounded-2xl p-4 flex items-center justify-between transition-all group shadow-xs">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Tracked Crypto Wallets
              </div>
              <div className="text-2xl font-extrabold font-mono text-amber-300 mt-1">
                {metrics.trackedWallets.toLocaleString()}
              </div>
              <div className="text-xs font-mono text-amber-400/90 mt-0.5">
                BTC • XMR • ETH Assets
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Coins className="h-5 w-5" />
            </div>
          </div>

          {/* Card 4: STIX 2.1 Bundles */}
          <div className="bg-[#0e121a] border border-[#1c2333] hover:border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between transition-all group shadow-xs">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                STIX 2.1 Bundles
              </div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
                {metrics.stixBundlesGenerated.toLocaleString()}
              </div>
              <div className="text-xs font-mono text-emerald-400/90 mt-0.5">
                Inter-agency interoperable
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Section 2: Intelligence Alerts Dispatched Feed (Spacious Bottom Right Corner) */}
        <div className="bg-[#0e121a] border border-[#1c2333] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c2333]">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                  Live LE Alerts
                </h3>
                <span className="text-[11px] font-mono text-emerald-400">
                  3 Dispatched • 1 Queued
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
              OASIS STIX
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Alert 1 */}
            <div className="p-3 rounded-xl bg-[#080a0f] border border-[#1c2333] text-xs font-mono flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0">
                <div className="text-slate-200 font-medium truncate">
                  STIX bundle--9e4c8f… dispatched
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  10:55:20 UTC • PunjabSynthetics_01 Rebrand Expose
                </div>
              </div>
            </div>

            {/* Alert 2 */}
            <div className="p-3 rounded-xl bg-[#080a0f] border border-[#1c2333] text-xs font-mono flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0">
                <div className="text-slate-200 font-medium truncate">
                  STIX bundle--3a11b8… dispatched
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  10:48:38 UTC • Sector 17 Dead Drop Match
                </div>
              </div>
            </div>

            {/* Alert 3 - Pending */}
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs font-mono flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0">
                <div className="text-amber-300 font-medium truncate">
                  HOLD REVIEW — Giveaway lure
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  CryptoElonBot • Queued for Analyst Verification
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1c2333] text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>Inter-Agency Channel</span>
            <span className="text-slate-400 font-semibold">#soc-alerts-live</span>
          </div>
        </div>

      </div>

    </div>
  );
};
