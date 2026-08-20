import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { ThreatStreamTable } from './components/ThreatStreamTable';
import { NetworkGraphView } from './components/NetworkGraphView';
import { ThreatIntelligencePanels } from './components/ThreatIntelligencePanels';
import { STIXHubView } from './components/STIXHubView';
import { AgentSimulatorView } from './components/AgentSimulatorView';
import { InvestigationDrawer } from './components/InvestigationDrawer';
import { ThemeProvider } from './context';
import { mockListings, mockKPIMetrics } from './data/mockData';
import type { CTIListing } from './types/cti';

export function AppContent() {
  const [currentView, setCurrentView] = useState<'stream' | 'graph' | 'analytics' | 'simulator' | 'stix'>('stream');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'REBRANDS' | 'ILLICIT' | 'SCAMS' | 'PGP'>('ALL');
  const [listings, setListings] = useState<CTIListing[]>(mockListings);
  const [selectedListing, setSelectedListing] = useState<CTIListing | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');

      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      } else if (e.key === '[' && !isInput) {
        setIsSidebarCollapsed(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenDossier = (listing: CTIListing) => {
    setSelectedListing(listing);
    setIsDrawerOpen(true);
  };

  const handleSelectFromGraph = (vendorName: string) => {
    const found = listings.find((l) => l.vendor.toLowerCase() === vendorName.toLowerCase() || l.id.toLowerCase() === vendorName.toLowerCase());
    if (found) {
      handleOpenDossier(found);
    } else {
      setSearchTerm(vendorName);
      setCurrentView('stream');
    }
  };

  const handleQuickEnrich = (listing: CTIListing) => {
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

  const handleOpenStixFromDrawer = (listing: CTIListing) => {
    setSelectedListing(listing);
    setIsDrawerOpen(false);
    setCurrentView('stix');
  };

  return (
    <div
      className="min-h-screen flex font-sans transition-colors duration-200"
      style={{
        backgroundColor: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Left Application Collapsible Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        selectedFilter={selectedFilter}
        onSelectFilter={(f) => setSelectedFilter(f)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* Main Right Content Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Lightweight Utility Header */}
        <Header
          currentView={currentView}
          searchTerm={searchTerm}
          onSearchChange={(val) => setSearchTerm(val)}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 max-w-[1560px] w-full mx-auto">
          {/* View 1: High-Signal Threat Stream Table */}
          {currentView === 'stream' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <KPICards metrics={mockKPIMetrics} />
              <ThreatStreamTable
                listings={listings}
                onViewDossier={handleOpenDossier}
                onQuickEnrich={handleQuickEnrich}
                searchTerm={searchTerm}
                selectedFilter={selectedFilter}
                onSelectFilter={(f) => setSelectedFilter(f)}
              />
            </div>
          )}

          {/* View 2: Interactive Criminal Network Graph */}
          {currentView === 'graph' && (
            <NetworkGraphView
              onSelectListingByVendor={handleSelectFromGraph}
            />
          )}

          {/* View 3: Analytics & Intelligence Trends */}
          {currentView === 'analytics' && (
            <ThreatIntelligencePanels metrics={mockKPIMetrics} />
          )}

          {/* View 4: Full-Page Autonomous Agent Simulator */}
          {currentView === 'simulator' && (
            <AgentSimulatorView
              listings={listings}
            />
          )}

          {/* View 5: Full-Page OASIS STIX 2.1 Hub */}
          {currentView === 'stix' && (
            <STIXHubView
              listings={listings}
              selectedListing={selectedListing}
              onSelectListing={(l) => setSelectedListing(l)}
            />
          )}
        </main>
      </div>

      {/* Slide-over Investigation Drawer */}
      <InvestigationDrawer
        listing={selectedListing}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenStix={handleOpenStixFromDrawer}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
