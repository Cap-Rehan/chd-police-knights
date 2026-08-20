import React from 'react';
import { Network, AlertOctagon, Coins, ShieldCheck } from 'lucide-react';
import type { KPIMetrics } from '../types/cti';

interface KPICardsProps {
  metrics: KPIMetrics;
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* 1. Entities Resolved (Dynamic Primary Accent) */}
      <div
        className="rounded-2xl p-4 flex items-center justify-between transition-all group shadow-xs border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Entities Resolved
          </div>
          <div
            className="text-2xl font-extrabold font-mono mt-1"
            style={{ color: 'var(--accent-primary-text)' }}
          >
            {metrics.entitiesResolved.toLocaleString()}
          </div>
          <div
            className="text-xs font-mono mt-0.5"
            style={{ color: 'var(--accent-primary-text)', opacity: 0.85 }}
          >
            +18 cross-platform links
          </div>
        </div>
        <div
          className="h-10 w-10 rounded-xl border flex items-center justify-center group-hover:scale-105 transition-transform shrink-0"
          style={{
            backgroundColor: 'var(--bg-accent-subtle)',
            borderColor: 'var(--border-accent)',
            color: 'var(--accent-primary)',
          }}
        >
          <Network className="h-5 w-5" />
        </div>
      </div>

      {/* 2. Illicit Targets */}
      <div
        className="rounded-2xl p-4 flex items-center justify-between transition-all group shadow-xs border hover:border-rose-500/40"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
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
        <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform shrink-0">
          <AlertOctagon className="h-5 w-5" />
        </div>
      </div>

      {/* 3. Tracked Wallets */}
      <div
        className="rounded-2xl p-4 flex items-center justify-between transition-all group shadow-xs border hover:border-amber-500/40"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
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
        <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
          <Coins className="h-5 w-5" />
        </div>
      </div>

      {/* 4. STIX 2.1 Intel Bundles */}
      <div
        className="rounded-2xl p-4 flex items-center justify-between transition-all group shadow-xs border hover:border-emerald-500/40"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
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
        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
