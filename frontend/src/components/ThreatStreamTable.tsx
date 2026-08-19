import React, { useMemo } from 'react';
import { 
  Eye, 
  Zap, 
  Check, 
  Network, 
  Fingerprint, 
  Coins, 
  Sparkles
} from 'lucide-react';
import type { CTIListing, ClassificationType } from '../types/cti';

interface ThreatStreamTableProps {
  listings: CTIListing[];
  onViewDossier: (listing: CTIListing) => void;
  onQuickEnrich: (listing: CTIListing) => void;
  searchTerm: string;
  selectedFilter: 'ALL' | 'REBRANDS' | 'ILLICIT' | 'SCAMS' | 'PGP';
  onSelectFilter: (filter: 'ALL' | 'REBRANDS' | 'ILLICIT' | 'SCAMS' | 'PGP') => void;
}

export const ThreatStreamTable: React.FC<ThreatStreamTableProps> = ({
  listings,
  onViewDossier,
  onQuickEnrich,
  searchTerm,
  selectedFilter,
  onSelectFilter,
}) => {
  const [enrichedId, setEnrichedId] = React.useState<string | null>(null);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Search term matching
      const matchesSearch =
        searchTerm.trim() === '' ||
        item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.extracted.wallets.some((w) => w.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.extracted.pgpKey && item.extracted.pgpKey.fingerprint.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.linkedAliases && item.linkedAliases.some((a) => a.alias.toLowerCase().includes(searchTerm.toLowerCase())));

      // Filter chips matching
      let matchesFilter = true;
      if (selectedFilter === 'REBRANDS') matchesFilter = !!item.rebrandDetected;
      if (selectedFilter === 'ILLICIT') matchesFilter = item.classification === 'ILLICIT';
      if (selectedFilter === 'SCAMS') matchesFilter = item.classification === 'SCAM';
      if (selectedFilter === 'PGP') matchesFilter = !!item.extracted.pgpKey;

      return matchesSearch && matchesFilter;
    });
  }, [listings, searchTerm, selectedFilter]);

  const getClassificationBadge = (classification: ClassificationType) => {
    switch (classification) {
      case 'ILLICIT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold font-mono tracking-wide bg-rose-500/10 text-rose-400 border border-rose-500/20">
            ILLICIT
          </span>
        );
      case 'SCAM':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold font-mono tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
            SCAM
          </span>
        );
      case 'LEGIT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold font-mono tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            LEGIT
          </span>
        );
    }
  };

  const handleEnrichClick = (e: React.MouseEvent, listing: CTIListing) => {
    e.stopPropagation();
    setEnrichedId(listing.id);
    onQuickEnrich(listing);
    setTimeout(() => setEnrichedId(null), 1800);
  };

  return (
    <div className="bg-[#0e121a] border border-[#1c2333] rounded-2xl overflow-hidden shadow-xs flex flex-col">
      
      {/* Table Header & Filter Tabs */}
      <div className="p-4 border-b border-[#1c2333] bg-[#0e121a] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
            Active Targets
          </span>
          <span className="text-xs font-mono text-slate-400 bg-[#141924] px-2 py-0.5 rounded-md border border-[#20283d]">
            {filteredListings.length} matching leads
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onSelectFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                : 'bg-[#141924] text-slate-300 hover:text-white border border-[#20283d]'
            }`}
          >
            All Targets
          </button>

          <button
            onClick={() => onSelectFilter('REBRANDS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              selectedFilter === 'REBRANDS'
                ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                : 'bg-[#141924] text-indigo-300 hover:text-white border border-indigo-500/30'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Rebrands Linked</span>
          </button>

          <button
            onClick={() => onSelectFilter('ILLICIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedFilter === 'ILLICIT'
                ? 'bg-rose-600 text-white shadow-xs font-semibold'
                : 'bg-[#141924] text-slate-300 hover:text-rose-300 border border-[#20283d]'
            }`}
          >
            Illicit Contraband
          </button>

          <button
            onClick={() => onSelectFilter('SCAMS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedFilter === 'SCAMS'
                ? 'bg-amber-600 text-white shadow-xs font-semibold'
                : 'bg-[#141924] text-slate-300 hover:text-amber-300 border border-[#20283d]'
            }`}
          >
            Scams Only
          </button>

          <button
            onClick={() => onSelectFilter('PGP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedFilter === 'PGP'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'bg-[#141924] text-slate-300 hover:text-emerald-300 border border-[#20283d]'
            }`}
          >
            PGP Verified
          </button>
        </div>
      </div>

      {/* High-Signal Stream Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#1c2333] bg-[#090b10]/80 text-[11px] uppercase font-bold text-slate-400 font-mono tracking-wider">
              <th className="py-3.5 px-5">Vendor & Platform</th>
              <th className="py-3.5 px-4">Entity Resolution</th>
              <th className="py-3.5 px-4">Contraband Summary</th>
              <th className="py-3.5 px-4">Extracted Assets</th>
              <th className="py-3.5 px-4">Threat Rating</th>
              <th className="py-3.5 px-5 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c2333]/70">
            {filteredListings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 font-mono text-sm">
                  No threat items match the current search or filter criteria.
                </td>
              </tr>
            ) : (
              filteredListings.map((listing) => (
                <tr
                  key={listing.id}
                  onClick={() => onViewDossier(listing)}
                  className="cursor-pointer transition-colors duration-150 hover:bg-[#141924] group"
                >
                  {/* 1. Vendor Alias & Discovered Source */}
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-slate-100 font-mono text-sm group-hover:text-indigo-300 transition-colors">
                      {listing.vendor}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                      <span>{listing.source}</span>
                      <span>•</span>
                      <span>{listing.discoveredAt}</span>
                    </div>
                  </td>

                  {/* 2. Entity Resolution & Cross-Platform Rebrand Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {listing.rebrandDetected ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        <Network className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Linked ({listing.linkedAliases?.length || 2} Personas)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono text-slate-400 bg-[#121622] border border-[#1c2333]">
                        Standalone
                      </span>
                    )}
                  </td>

                  {/* 3. Item Title & Category */}
                  <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                    <div className="text-slate-200 text-sm truncate font-sans" title={listing.itemTitle}>
                      {listing.itemTitle}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Category: <span className="text-slate-300">{listing.category}</span>
                    </div>
                  </td>

                  {/* 4. Extracted Assets (Wallets & PGP) */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs">
                    <div className="flex items-center gap-2.5 text-slate-300">
                      {listing.extracted.wallets.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium">
                          <Coins className="h-3.5 w-3.5" />
                          <span>{listing.extracted.wallets.length} Wallet</span>
                        </span>
                      )}
                      {listing.extracted.pgpKey && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                          <Fingerprint className="h-3.5 w-3.5" />
                          <span>PGP</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 5. Classification & Confidence Bar */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getClassificationBadge(listing.classification)}
                      <div className="text-xs font-mono text-slate-400">
                        {(listing.confidence * 100).toFixed(0)}% Conf
                      </div>
                    </div>
                  </td>

                  {/* 6. Quick Action Button */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDossier(listing);
                        }}
                        className="p-2 rounded-lg bg-[#141924] hover:bg-indigo-600 text-slate-300 hover:text-white border border-[#20283d] transition-all"
                        title="Open Investigation Drawer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        onClick={(e) => handleEnrichClick(e, listing)}
                        className="p-2 rounded-lg bg-[#141924] hover:bg-[#1e2535] text-slate-400 hover:text-amber-400 border border-[#20283d] transition-all"
                        title="Trigger Instant On-Chain Forensic Lookup"
                      >
                        {enrichedId === listing.id ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Zap className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
