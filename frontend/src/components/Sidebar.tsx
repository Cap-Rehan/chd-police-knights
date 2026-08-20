import React from 'react';
import { 
  ShieldAlert, 
  Layers, 
  GitFork, 
  BarChart2, 
  Terminal, 
  FileCode, 
  Filter, 
  Sparkles, 
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

interface SidebarProps {
  currentView: 'stream' | 'graph' | 'analytics' | 'simulator' | 'stix';
  onViewChange: (view: 'stream' | 'graph' | 'analytics' | 'simulator' | 'stix') => void;
  selectedFilter: string;
  onSelectFilter: (filter: 'ALL' | 'REBRANDS' | 'ILLICIT' | 'SCAMS' | 'PGP') => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  selectedFilter,
  onSelectFilter,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <aside
      className={`border-r flex flex-col justify-between h-screen sticky top-0 shrink-0 z-30 select-none transition-all duration-200 ease-in-out ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
      style={{
        backgroundColor: 'var(--bg-sidebar)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      
      {/* Top Brand Header & Toggle */}
      <div>
        <div
          className="p-3.5 border-b flex items-center justify-center min-h-[64px]"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          {isCollapsed ? (
            /* Collapsed Single Centered Toggle Button */
            <button
              onClick={onToggleCollapse}
              className="flex h-10 w-10 items-center justify-center rounded-xl border hover:scale-105 transition-all shadow-xs cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-accent-subtle)',
                borderColor: 'var(--border-accent)',
                color: 'var(--accent-primary)',
              }}
              title="Expand sidebar ([)"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>
          ) : (
            /* Expanded Full Brand + Collapse Button */
            <div className="flex items-center justify-between w-full">
              <div 
                className="flex items-center gap-3 cursor-pointer overflow-hidden min-w-0" 
                onClick={() => onViewChange('stream')}
                title="DarkScope Home"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl border shadow-xs shrink-0"
                  style={{
                    backgroundColor: 'var(--bg-accent-subtle)',
                    borderColor: 'var(--border-accent)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="truncate">
                  <span
                    className="font-extrabold text-base tracking-wider uppercase font-sans"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    DARKSCOPE
                  </span>
                  <div className="text-xs text-slate-400 font-mono">
                    Threat Intel & SOC
                  </div>
                </div>
              </div>

              <button
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                style={{ backgroundColor: 'transparent' }}
                title="Collapse sidebar ([)"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className={`p-3 space-y-6 ${isCollapsed ? 'px-2' : ''}`}>
          
          {/* Main Navigation Views */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Intelligence Views
              </div>
            )}

            <button
              onClick={() => onViewChange('stream')}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-sm font-medium transition-all cursor-pointer`}
              style={
                currentView === 'stream'
                  ? {
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--accent-primary-content)',
                      fontWeight: 600,
                      boxShadow: 'var(--accent-glow)',
                    }
                  : {
                      color: 'var(--text-secondary)',
                    }
              }
              title="Threat Stream"
            >
              <div className="flex items-center gap-2.5">
                <Layers
                  className="h-4 w-4 shrink-0"
                  style={{
                    color: currentView === 'stream' ? 'var(--accent-primary-content)' : 'var(--accent-primary)',
                  }}
                />
                {!isCollapsed && <span>Threat Stream</span>}
              </div>
              {!isCollapsed && (
                <span
                  className="text-xs font-mono px-1.5 py-0.2 rounded-md"
                  style={{
                    backgroundColor: currentView === 'stream' ? 'rgba(0,0,0,0.25)' : 'var(--bg-subtle)',
                    color: currentView === 'stream' ? 'var(--accent-primary-content)' : 'var(--text-muted)',
                  }}
                >
                  Live
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('graph')}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-sm font-medium transition-all cursor-pointer`}
              style={
                currentView === 'graph'
                  ? {
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--accent-primary-content)',
                      fontWeight: 600,
                      boxShadow: 'var(--accent-glow)',
                    }
                  : {
                      color: 'var(--text-secondary)',
                    }
              }
              title="Network Graph"
            >
              <div className="flex items-center gap-2.5">
                <GitFork
                  className="h-4 w-4 shrink-0"
                  style={{
                    color: currentView === 'graph' ? 'var(--accent-primary-content)' : 'var(--accent-primary)',
                  }}
                />
                {!isCollapsed && <span>Network Graph</span>}
              </div>
              {!isCollapsed && (
                <span
                  className="text-xs font-mono px-1.5 py-0.2 rounded-md"
                  style={{
                    backgroundColor: currentView === 'graph' ? 'rgba(0,0,0,0.25)' : 'var(--bg-subtle)',
                    color: currentView === 'graph' ? 'var(--accent-primary-content)' : 'var(--text-muted)',
                  }}
                >
                  Nodes
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('analytics')}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-sm font-medium transition-all cursor-pointer`}
              style={
                currentView === 'analytics'
                  ? {
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--accent-primary-content)',
                      fontWeight: 600,
                      boxShadow: 'var(--accent-glow)',
                    }
                  : {
                      color: 'var(--text-secondary)',
                    }
              }
              title="Analytics & Trends"
            >
              <div className="flex items-center gap-2.5">
                <BarChart2
                  className="h-4 w-4 shrink-0"
                  style={{
                    color: currentView === 'analytics' ? 'var(--accent-primary-content)' : 'var(--accent-primary)',
                  }}
                />
                {!isCollapsed && <span>Analytics & Trends</span>}
              </div>
              {!isCollapsed && (
                <span
                  className="text-xs font-mono px-1.5 py-0.2 rounded-md"
                  style={{
                    backgroundColor: currentView === 'analytics' ? 'rgba(0,0,0,0.25)' : 'var(--bg-subtle)',
                    color: currentView === 'analytics' ? 'var(--accent-primary-content)' : 'var(--text-muted)',
                  }}
                >
                  7-Day
                </span>
              )}
            </button>
          </div>

          {/* Autonomous Operations Tools */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-2.5 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Autonomous Operations
              </div>
            )}

            <button
              onClick={() => onViewChange('simulator')}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-sm font-medium transition-all cursor-pointer`}
              style={
                currentView === 'simulator'
                  ? {
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--accent-primary-content)',
                      fontWeight: 600,
                      boxShadow: 'var(--accent-glow)',
                    }
                  : {
                      color: 'var(--text-secondary)',
                    }
              }
              title="Agent Simulator (LangGraph)"
            >
              <div className="flex items-center gap-2.5">
                <Terminal
                  className="h-4 w-4 shrink-0"
                  style={{
                    color: currentView === 'simulator' ? 'var(--accent-primary-content)' : 'var(--accent-primary)',
                  }}
                />
                {!isCollapsed && <span>Agent Simulator</span>}
              </div>
              {!isCollapsed && (
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                  style={{
                    backgroundColor: currentView === 'simulator' ? 'rgba(0,0,0,0.25)' : 'var(--bg-accent-subtle)',
                    borderColor: currentView === 'simulator' ? 'transparent' : 'var(--border-accent)',
                    color: currentView === 'simulator' ? 'var(--accent-primary-content)' : 'var(--accent-primary-text)',
                  }}
                >
                  LangGraph
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('stix')}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-sm font-medium transition-all cursor-pointer`}
              style={
                currentView === 'stix'
                  ? {
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--accent-primary-content)',
                      fontWeight: 600,
                      boxShadow: 'var(--accent-glow)',
                    }
                  : {
                      color: 'var(--text-secondary)',
                    }
              }
              title="STIX 2.1 Hub (OASIS)"
            >
              <div className="flex items-center gap-2.5">
                <FileCode
                  className="h-4 w-4 shrink-0"
                  style={{
                    color: currentView === 'stix' ? 'var(--accent-primary-content)' : 'var(--accent-primary)',
                  }}
                />
                {!isCollapsed && <span>STIX 2.1 Hub</span>}
              </div>
              {!isCollapsed && (
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                  style={{
                    backgroundColor: currentView === 'stix' ? 'rgba(0,0,0,0.25)' : 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: currentView === 'stix' ? 'var(--accent-primary-content)' : 'var(--text-secondary)',
                  }}
                >
                  OASIS
                </span>
              )}
            </button>
          </div>

          {/* Quick Triage Filters (Expanded Only) */}
          {!isCollapsed && (
            <div className="space-y-1">
              <div className="px-2.5 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                <Filter className="h-3 w-3" />
                <span>Triage Quick Filters</span>
              </div>

              <div className="grid grid-cols-1 gap-1">
                <button
                  onClick={() => {
                    onViewChange('stream');
                    onSelectFilter('ALL');
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                  style={{
                    backgroundColor: selectedFilter === 'ALL' && currentView === 'stream' ? 'var(--bg-accent-subtle)' : 'transparent',
                    borderColor: selectedFilter === 'ALL' && currentView === 'stream' ? 'var(--border-accent)' : 'transparent',
                    borderWidth: '1px',
                    color: selectedFilter === 'ALL' && currentView === 'stream' ? 'var(--accent-primary-text)' : 'var(--text-secondary)',
                    fontWeight: selectedFilter === 'ALL' && currentView === 'stream' ? 700 : 400,
                  }}
                >
                  &bull; All Targets (5)
                </button>

                <button
                  onClick={() => {
                    onViewChange('stream');
                    onSelectFilter('REBRANDS');
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between cursor-pointer"
                  style={{
                    backgroundColor: selectedFilter === 'REBRANDS' && currentView === 'stream' ? 'var(--bg-accent-subtle)' : 'transparent',
                    borderColor: selectedFilter === 'REBRANDS' && currentView === 'stream' ? 'var(--border-accent)' : 'transparent',
                    borderWidth: '1px',
                    color: selectedFilter === 'REBRANDS' && currentView === 'stream' ? 'var(--accent-primary-text)' : 'var(--text-secondary)',
                    fontWeight: selectedFilter === 'REBRANDS' && currentView === 'stream' ? 700 : 400,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" style={{ color: 'var(--accent-primary)' }} />
                    <span>Rebrand Matches</span>
                  </div>
                  <span
                    className="text-[10px] px-1 rounded border"
                    style={{
                      backgroundColor: 'var(--bg-accent-badge)',
                      borderColor: 'var(--border-accent)',
                      color: 'var(--accent-primary-text)',
                    }}
                  >
                    3
                  </span>
                </button>

                <button
                  onClick={() => {
                    onViewChange('stream');
                    onSelectFilter('ILLICIT');
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between cursor-pointer"
                  style={{
                    backgroundColor: selectedFilter === 'ILLICIT' && currentView === 'stream' ? 'rgba(244, 63, 94, 0.15)' : 'transparent',
                    borderColor: selectedFilter === 'ILLICIT' && currentView === 'stream' ? 'rgba(244, 63, 94, 0.35)' : 'transparent',
                    borderWidth: '1px',
                    color: selectedFilter === 'ILLICIT' && currentView === 'stream' ? '#fda4af' : 'var(--text-secondary)',
                    fontWeight: selectedFilter === 'ILLICIT' && currentView === 'stream' ? 700 : 400,
                  }}
                >
                  <span>&bull; Illicit Contraband</span>
                  <span className="text-[10px] px-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">3</span>
                </button>

                <button
                  onClick={() => {
                    onViewChange('stream');
                    onSelectFilter('PGP');
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between cursor-pointer"
                  style={{
                    backgroundColor: selectedFilter === 'PGP' && currentView === 'stream' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    borderColor: selectedFilter === 'PGP' && currentView === 'stream' ? 'rgba(16, 185, 129, 0.35)' : 'transparent',
                    borderWidth: '1px',
                    color: selectedFilter === 'PGP' && currentView === 'stream' ? '#6ee7b7' : 'var(--text-secondary)',
                    fontWeight: selectedFilter === 'PGP' && currentView === 'stream' ? 700 : 400,
                  }}
                >
                  <span>&bull; PGP Verified</span>
                  <span className="text-[10px] px-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">4</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Status & Analyst Info */}
      <div
        className={`p-3 border-t space-y-3 ${isCollapsed ? 'px-2' : ''}`}
        style={{
          backgroundColor: 'var(--bg-sidebar)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        
        {/* Stream Live Indicator */}
        {!isCollapsed ? (
          <div
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs font-mono"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              <span className="text-slate-300 font-medium">SOC Stream</span>
            </div>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
        ) : (
          <div className="flex justify-center" title="SOC Stream: ONLINE">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          </div>
        )}

        {/* Analyst Profile */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 px-2'}`}>
          <div 
            className="h-8 w-8 rounded-full border flex items-center justify-center shrink-0"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
            }}
            title="Cyber SOC Analyst (ID CC-CHD #419)"
          >
            <UserCheck className="h-4 w-4" style={{ color: 'var(--accent-primary)' }} />
          </div>
          {!isCollapsed && (
            <div className="text-left min-w-0 truncate">
              <div className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                Cyber SOC Analyst
              </div>
              <div className="text-[10px] text-slate-500 font-mono">ID CC-CHD #419</div>
            </div>
          )}
        </div>

      </div>

    </aside>
  );
};
