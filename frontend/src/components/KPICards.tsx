import React from 'react';
import { Database, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { KPIMetrics } from '../types/cti';

interface KPICardsProps {
  metrics: KPIMetrics;
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      {/* 1. Total Ingested */}
      <div className="bg-[#0c0c0c] border border-zinc-850 rounded-lg p-3.5 flex items-center justify-between shadow-xs">
        <div>
          <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Total Ingested
          </div>
          <div className="text-lg font-semibold font-mono text-zinc-100 mt-0.5">
            {metrics.totalIngested.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
            +1,420 today
          </div>
        </div>
        <div className="h-7 w-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
          <Database className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* 2. Illicit Drug Listings */}
      <div className="bg-[#0c0c0c] border border-zinc-850 rounded-lg p-3.5 flex items-center justify-between shadow-xs">
        <div>
          <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Illicit Contraband
          </div>
          <div className="text-lg font-semibold font-mono text-rose-400 mt-0.5">
            {metrics.illicitListings.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-rose-400/90 mt-0.5">
            +38 high-priority leads
          </div>
        </div>
        <div className="h-7 w-7 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertTriangle className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* 3. Exit Scams */}
      <div className="bg-[#0c0c0c] border border-zinc-850 rounded-lg p-3.5 flex items-center justify-between shadow-xs">
        <div>
          <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Exit Scams / Fraud
          </div>
          <div className="text-lg font-semibold font-mono text-amber-400 mt-0.5">
            {metrics.scamListings.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-amber-400/90 mt-0.5">
            +14 flagged lures
          </div>
        </div>
        <div className="h-7 w-7 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <ShieldAlert className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* 4. Benign Traffic */}
      <div className="bg-[#0c0c0c] border border-zinc-850 rounded-lg p-3.5 flex items-center justify-between shadow-xs">
        <div>
          <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Benign Infrastructure
          </div>
          <div className="text-lg font-semibold font-mono text-emerald-400 mt-0.5">
            {metrics.benignTraffic.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-emerald-400/90 mt-0.5">
            +1,368 unflagged
          </div>
        </div>
        <div className="h-7 w-7 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};
