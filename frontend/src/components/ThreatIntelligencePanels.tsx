import React from 'react';
import { TrendingUp, PieChart as PieIcon, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip } from 'recharts';

interface ThreatIntelligencePanelsProps {
  onOpenCaseWall?: () => void;
}

const trendData = [
  { day: '13 Aug', fentanyl: 18, mdma: 34, cannabinoids: 12 },
  { day: '14 Aug', fentanyl: 24, mdma: 38, cannabinoids: 15 },
  { day: '15 Aug', fentanyl: 32, mdma: 42, cannabinoids: 19 },
  { day: '16 Aug', fentanyl: 48, mdma: 40, cannabinoids: 22 },
  { day: '17 Aug', fentanyl: 65, mdma: 45, cannabinoids: 28 },
  { day: '18 Aug', fentanyl: 92, mdma: 49, cannabinoids: 31 },
  { day: '19 Aug', fentanyl: 142, mdma: 56, cannabinoids: 35 },
];

const classificationData = [
  { name: 'Illicit Contraband', value: 9430, percentage: '8.6%', color: '#f43f5e' },
  { name: 'Exit Scams / Fraud', value: 5390, percentage: '4.9%', color: '#f59e0b' },
  { name: 'Benign Traffic', value: 94873, percentage: '86.5%', color: '#10b981' },
];

export const ThreatIntelligencePanels: React.FC<ThreatIntelligencePanelsProps> = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5 items-stretch">
      {/* PANEL A: EMERGING TRAFFICKING TRENDS */}
      <div className="bg-[#0c0c0c] border border-zinc-800 rounded-lg p-4 flex flex-col justify-between h-[255px] shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Emerging Trafficking Trends
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">7-Day NLP Feed</span>
        </div>

        {/* Center Body: 7-Day AreaChart */}
        <div className="h-36 w-full flex items-center justify-center pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="fentanylGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="mdmaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cannabinoidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#3f3f46" tick={{ fontSize: 9, fill: '#71717a' }} />
              <YAxis stroke="#3f3f46" tick={{ fontSize: 9, fill: '#71717a' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  borderColor: '#27272a',
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: 'monospace',
                  color: '#ededed'
                }}
              />
              <Area type="monotone" dataKey="fentanyl" stroke="#f43f5e" strokeWidth={1.5} fillOpacity={1} fill="url(#fentanylGrad)" name="Fentanyl" />
              <Area type="monotone" dataKey="mdma" stroke="#f59e0b" strokeWidth={1.5} fillOpacity={1} fill="url(#mdmaGrad)" name="MDMA" />
              <Area type="monotone" dataKey="cannabinoids" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#cannabinoidGrad)" name="Cannabinoids" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-zinc-800 text-xs font-mono text-zinc-500">
          NLP keyword clustering over Telegram + Agora stream
        </div>
      </div>

      {/* PANEL B: THREAT CLASSIFICATION RATIO */}
      <div className="bg-[#0c0c0c] border border-zinc-800 rounded-lg p-4 flex flex-col justify-between h-[255px] shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-rose-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Threat Classification Ratio
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">109,693 Items</span>
        </div>

        {/* Center Body: Pie Chart & Metrics Legend */}
        <div className="flex items-center justify-between h-36">
          <div className="w-[45%] h-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classificationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="#0c0c0c"
                  strokeWidth={2}
                >
                  {classificationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a',
                    borderColor: '#27272a',
                    borderRadius: 4,
                    fontSize: 11,
                    fontFamily: 'monospace',
                    color: '#ededed',
                  }}
                  formatter={(val) => [Number(val).toLocaleString(), 'Volume']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-mono">
              <span className="text-[11px] font-bold text-zinc-100">109.7k</span>
              <span className="text-[8px] text-zinc-500 uppercase">Total</span>
            </div>
          </div>

          {/* Legend Breakdown */}
          <div className="w-[55%] space-y-2 pl-2 font-mono text-xs">
            {classificationData.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-300 text-[11px] truncate">{item.name}</span>
                  </div>
                  <span className="font-semibold text-zinc-100 text-[11px] ml-1">{item.percentage}</span>
                </div>
                <div className="text-[9px] text-zinc-500 pl-3.5">
                  {item.value.toLocaleString()} listings
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-zinc-800 text-xs font-mono text-zinc-500 flex items-center justify-between">
          <span>Continuous Ingestion Feed</span>
          <span className="text-emerald-400">94.2% Mean Conf</span>
        </div>
      </div>

      {/* PANEL C: ALERTS DISPATCHED */}
      <div className="bg-[#0c0c0c] border border-zinc-800 rounded-lg p-4 flex flex-col justify-between h-[255px] shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Alerts Dispatched
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">3 Sent • 1 Queued</span>
        </div>

        {/* Center Body: 3 Balanced Alert Feeds */}
        <div className="h-36 flex flex-col justify-between py-0.5 space-y-1.5">
          {/* Alert 1 */}
          <div className="p-2 rounded bg-black border border-zinc-800 text-xs font-mono flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 truncate">
              <div className="text-zinc-200 truncate">STIX bundle--9e4c8f… dispatched to LEA command center</div>
              <div className="text-[10px] text-zinc-500 truncate">10:55:20 UTC • High Priority (PunjabSynthetics_01)</div>
            </div>
          </div>

          {/* Alert 2 */}
          <div className="p-2 rounded bg-black border border-zinc-800 text-xs font-mono flex items-start gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 truncate">
              <div className="text-zinc-200 truncate">STIX bundle--3a11b8… dispatched to Narcotics Control</div>
              <div className="text-[10px] text-zinc-500 truncate">10:48:38 UTC • Sector 17 Dead Drop Match</div>
            </div>
          </div>

          {/* Alert 3 - Pending */}
          <div className="p-2 rounded bg-amber-500/5 border border-amber-500/20 text-xs font-mono flex items-start gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 truncate">
              <div className="text-amber-400 truncate">PENDING REVIEW — confidence below 0.85 gate</div>
              <div className="text-[10px] text-zinc-500 truncate">CryptoElonBot (Giveaway Lure) • Queued for Analyst</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-zinc-800 text-xs font-mono text-zinc-500 flex items-center justify-between">
          <span>OASIS STIX 2.1 Webhook</span>
          <span className="text-zinc-400">Channel #le-alerts-live</span>
        </div>
      </div>
    </div>
  );
};
