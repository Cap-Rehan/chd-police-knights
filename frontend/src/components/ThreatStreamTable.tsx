import React, { useState, useMemo } from 'react';
import { Search, Filter, Eye, Zap, ChevronDown, ChevronUp, Check } from 'lucide-react';
import type { CTIListing, ClassificationType } from '../types/cti';

interface ThreatStreamTableProps {
  listings: CTIListing[];
  onViewDossier: (listing: CTIListing) => void;
  onQuickEnrich: (listing: CTIListing) => void;
}

export const ThreatStreamTable: React.FC<ThreatStreamTableProps> = ({
  listings,
  onViewDossier,
  onQuickEnrich,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [enrichedId, setEnrichedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(listings.map((l) => l.category));
    return ['ALL', ...Array.from(set)];
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClassification =
        selectedClassification === 'ALL' || item.classification === selectedClassification;

      const matchesCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      return matchesSearch && matchesClassification && matchesCategory;
    });
  }, [listings, searchTerm, selectedClassification, selectedCategory]);

  const getClassificationBadge = (classification: ClassificationType) => {
    switch (classification) {
      case 'ILLICIT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold font-mono tracking-wide bg-rose-500/10 text-rose-400 border border-rose-500/20">
            ILLICIT
          </span>
        );
      case 'SCAM':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold font-mono tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
            SCAM
          </span>
        );
      case 'LEGIT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold font-mono tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            LEGIT
          </span>
        );
    }
  };

  const getConfidenceBar = (confidence: number, classification: ClassificationType) => {
    const color =
      classification === 'ILLICIT'
        ? 'bg-rose-500'
        : classification === 'SCAM'
        ? 'bg-amber-500'
        : 'bg-emerald-500';

    return (
      <div 
        className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden relative cursor-help group"
        title={`Confidence: ${confidence.toFixed(2)} (${(confidence * 100).toFixed(0)}%)`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${Math.round(confidence * 100)}%` }}
        />
      </div>
    );
  };

  const handleEnrichClick = (e: React.MouseEvent, listing: CTIListing) => {
    e.stopPropagation();
    setEnrichedId(listing.id);
    onQuickEnrich(listing);
    setTimeout(() => setEnrichedId(null), 1800);
  };

  return (
    <div className="bg-[#0c0c0c] border border-zinc-800 rounded-lg overflow-hidden shadow-xs flex flex-col">
      {/* Top Action & Filter Toolbar */}
      <div className="p-3 border-b border-zinc-800 bg-[#0c0c0c] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Intelligence Stream
          </span>
          <span className="text-xs font-mono text-zinc-500">
            ({filteredListings.length} items)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Bar Toggle Button */}
          <button
            onClick={() => setIsFilterBarOpen(!isFilterBarOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              isFilterBarOpen || searchTerm || selectedClassification !== 'ALL' || selectedCategory !== 'ALL'
                ? 'bg-zinc-800 text-zinc-200 border-zinc-700'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <Filter className="h-3 w-3" />
            <span>Filters</span>
            {isFilterBarOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Collapsible Filter Toolbar */}
      {isFilterBarOpen && (
        <div className="p-3 bg-zinc-950/90 border-b border-zinc-800 flex flex-wrap items-center gap-3 animate-in fade-in duration-150">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search vendor alias, title, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-7 w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded pl-8 pr-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500">Classification:</span>
            <select
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
              className="h-7 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded px-2 text-xs font-mono focus:outline-none focus:border-zinc-700"
            >
              <option value="ALL">All Threat Levels</option>
              <option value="ILLICIT">Illicit Only</option>
              <option value="SCAM">Scams Only</option>
              <option value="LEGIT">Legit Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-7 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded px-2 text-xs font-mono focus:outline-none focus:border-zinc-700"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedClassification !== 'ALL' || selectedCategory !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedClassification('ALL');
                setSelectedCategory('ALL');
              }}
              className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 underline"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Simplified Essential Table with subtle zebra striping */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-800/80 bg-zinc-950/60 text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
              <th className="py-2.5 px-4">Vendor Alias</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Item Title</th>
              <th className="py-2.5 px-3">Classification</th>
              <th className="py-2.5 px-3">Confidence</th>
              <th className="py-2.5 px-4 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {filteredListings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-500 font-mono text-xs">
                  No threat items match the current query criteria.
                </td>
              </tr>
            ) : (
              filteredListings.map((listing) => (
                <tr
                  key={listing.id}
                  onClick={() => onViewDossier(listing)}
                  className="cursor-pointer transition-colors duration-100 odd:bg-zinc-900/30 even:bg-transparent hover:bg-zinc-850/50 group"
                >
                  {/* 1. Vendor Alias (with small timestamp below) */}
                  <td className="py-2.5 px-4">
                    <div className="font-semibold text-zinc-200 group-hover:text-white transition-colors">
                      {listing.vendor}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">
                      {listing.discoveredAt}
                    </div>
                  </td>

                  {/* 2. Category (small badge) */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[11px]">
                      {listing.category}
                    </span>
                  </td>

                  {/* 3. Item Title (truncated to ~60 chars) */}
                  <td className="py-2.5 px-3 max-w-xs md:max-w-md">
                    <div className="text-zinc-300 text-xs truncate" title={listing.itemTitle}>
                      {listing.itemTitle.length > 60
                        ? `${listing.itemTitle.substring(0, 60)}...`
                        : listing.itemTitle}
                    </div>
                  </td>

                  {/* 4. Classification Badge */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {getClassificationBadge(listing.classification)}
                  </td>

                  {/* 5. Confidence (simple progress bar with tooltip on hover) */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {getConfidenceBar(listing.confidence, listing.classification)}
                  </td>

                  {/* 6. Quick Actions (Eye: View Dossier, Zap: Quick Enrich) */}
                  <td className="py-2.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDossier(listing);
                        }}
                        className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                        title="View Full Case Dossier"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleEnrichClick(e, listing)}
                        className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 border border-zinc-800 transition-colors"
                        title="Trigger Instant On-Chain Enrichment"
                      >
                        {enrichedId === listing.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Zap className="h-3.5 w-3.5 text-amber-400" />
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
