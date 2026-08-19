import { useState } from 'react';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { ThreatStreamTable } from './components/ThreatStreamTable';
import { ThreatIntelligencePanels } from './components/ThreatIntelligencePanels';
import { CaseDossierView } from './components/CaseDossierView';
import { STIXModal } from './components/STIXModal';
import { AgentControllerModal } from './components/AgentControllerModal';
import { mockListings, mockKPIMetrics } from './data/mockData';
import type { CTIListing } from './types/cti';

export function App() {
  const [currentView, setCurrentView] = useState<'stream' | 'dossier'>('stream');
  const [listings, setListings] = useState<CTIListing[]>(mockListings);
  const [selectedListing, setSelectedListing] = useState<CTIListing>(mockListings[0]);
  const [recentlyViewed, setRecentlyViewed] = useState<CTIListing[]>([mockListings[0]]);
  const [isStixModalOpen, setIsStixModalOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);

  const handleOpenDossier = (listing: CTIListing) => {
    setSelectedListing(listing);
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== listing.id);
      return [listing, ...filtered].slice(0, 5);
    });
    setCurrentView('dossier');
  };

  const handleQuickEnrich = (listing: CTIListing) => {
    // Instant enrichment demonstration
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === listing.id && !item.enrichment) {
          return {
            ...item,
            enrichment: {
              threatScore: 88,
              onChainVolumeUsd: 420000,
              txCount: 310,
              isTainted: true,
              taintScore: 85,
              riskFlags: ['UNHOSTED_WALLET_INTERACTION', 'THREAT_FEED_MATCH'],
              threatIntelMatches: ['Darknet_Telemetry_DB'],
              mixerHopsDetected: 1,
              sanctionProximityScore: 65,
            },
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 flex flex-col font-sans selection:bg-zinc-800 selection:text-zinc-100">
      {/* Top Application Header */}
      <Header
        currentView={currentView}
        onNavigateStream={() => setCurrentView('stream')}
        onOpenStix={() => setIsStixModalOpen(true)}
        onOpenPipelineModal={() => setIsPipelineModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-5 max-w-7xl w-full mx-auto">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-5">
          <div className="flex items-center gap-1.5 bg-[#0c0c0c] p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setCurrentView('stream')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                currentView === 'stream'
                  ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Threat Stream View
            </button>
            <button
              onClick={() => setCurrentView('dossier')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                currentView === 'dossier'
                  ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Case Dossier View</span>
              <span className="font-mono text-[10px] text-zinc-500">({selectedListing.id})</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-zinc-500">
            <span>Continuous SOC Ingestion Stream</span>
            <span>•</span>
            <span className="text-emerald-400">ONLINE</span>
          </div>
        </div>

        {/* View Switcher: Full-width contextual views */}
        {currentView === 'stream' ? (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Compact KPI Row */}
            <KPICards metrics={mockKPIMetrics} />

            {/* Simplified Threat Stream Table */}
            <ThreatStreamTable
              listings={listings}
              onViewDossier={handleOpenDossier}
              onQuickEnrich={handleQuickEnrich}
            />

            {/* 3-Column Intelligence Panels (Trends, Case Wall Preview, Alerts Dispatched) */}
            <ThreatIntelligencePanels
              onOpenCaseWall={() => handleOpenDossier(mockListings[0])}
            />
          </div>
        ) : (
          <CaseDossierView
            listing={selectedListing}
            onBack={() => setCurrentView('stream')}
            onOpenStix={() => setIsStixModalOpen(true)}
            recentlyViewed={recentlyViewed}
            onSelectRecent={(item) => setSelectedListing(item)}
          />
        )}
      </main>

      {/* STIX 2.1 JSON Inspection Modal */}
      <STIXModal
        isOpen={isStixModalOpen}
        onClose={() => setIsStixModalOpen(false)}
        listing={selectedListing}
      />

      {/* Autonomous Agent Pipeline & Report Simulator Modal */}
      <AgentControllerModal
        isOpen={isPipelineModalOpen}
        onClose={() => setIsPipelineModalOpen(false)}
        listings={listings}
      />
    </div>
  );
}

export default App;
