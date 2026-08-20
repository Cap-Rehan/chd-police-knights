import React from 'react';
import { Network, AlertOctagon, Coins, ShieldCheck } from 'lucide-react';
import type { KPIMetrics } from '../types/cti';

interface KPICardsProps {
  metrics: KPIMetrics;
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* 1. Entities Resolved */}
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

      {/* 2. Illicit Targets */}
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

      {/* 3. Tracked Wallets */}
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

      {/* 4. STIX 2.1 Intel Bundles */}
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
  );
};
