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
      className={`bg-[#0a0d14] border-r border-[#1c2333] flex flex-col justify-between h-screen sticky top-0 shrink-0 z-30 select-none transition-all duration-200 ease-in-out ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      
      {/* Top Brand Header & Toggle */}
      <div>
        <div className="p-3.5 border-b border-[#1c2333] flex items-center justify-center min-h-[64px]">
          {isCollapsed ? (
            /* Collapsed Single Centered Toggle Button */
            <button
              onClick={onToggleCollapse}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/30 text-indigo-400 hover:text-white hover:border-indigo-400 hover:scale-105 transition-all shadow-xs"
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
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/30 text-indigo-400 shadow-xs shrink-0">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="truncate">
                  <span className="font-extrabold text-base tracking-wider text-slate-100 uppercase font-sans">
                    DARKSCOPE
                  </span>
                  <div className="text-xs text-slate-400 font-mono">
                    Threat Intel & SOC
                  </div>
                </div>
              </div>

              <button
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg hover:bg-[#141924] text-slate-400 hover:text-white transition-colors shrink-0"
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
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-sm font-medium transition-all ${
                currentView === 'stream'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-[#141924]'
              }`}
              title="Threat Stream"
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`h-4 w-4 ${currentView === 'stream' ? 'text-white' : 'text-indigo-400'}`} />
                {!isCollapsed && <span>Threat Stream</span>}
              </div>
              {!isCollapsed && (
                <span className={`text-xs font-mono px-1.5 py-0.2 rounded-md ${
                  currentView === 'stream' ? 'bg-indigo-800 text-indigo-200' : 'bg-[#141924] text-slate-400'
                }`}>
                  Live
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('graph')}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-sm font-medium transition-all ${
                currentView === 'graph'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-[#141924]'
              }`}
              title="Network Graph"
            >
              <div className="flex items-center gap-2.5">
                <GitFork className={`h-4 w-4 ${currentView === 'graph' ? 'text-white' : 'text-cyan-400'}`} />
                {!isCollapsed && <span>Network Graph</span>}
              </div>
              {!isCollapsed && (
                <span className={`text-xs font-mono px-1.5 py-0.2 rounded-md ${
                  currentView === 'graph' ? 'bg-indigo-800 text-indigo-200' : 'bg-[#141924] text-slate-400'
                }`}>
                  Nodes
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('analytics')}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-sm font-medium transition-all ${
                currentView === 'analytics'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-[#141924]'
              }`}
              title="Analytics & Trends"
            >
              <div className="flex items-center gap-2.5">
                <BarChart2 className={`h-4 w-4 ${currentView === 'analytics' ? 'text-white' : 'text-amber-400'}`} />
                {!isCollapsed && <span>Analytics & Trends</span>}
              </div>
              {!isCollapsed && (
                <span className={`text-xs font-mono px-1.5 py-0.2 rounded-md ${
                  currentView === 'analytics' ? 'bg-indigo-800 text-indigo-200' : 'bg-[#141924] text-slate-400'
                }`}>
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
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-sm font-medium transition-all ${
                currentView === 'simulator'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-[#141924]'
              }`}
              title="Agent Simulator (LangGraph)"
            >
              <div className="flex items-center gap-2.5">
                <Terminal className={`h-4 w-4 ${currentView === 'simulator' ? 'text-white' : 'text-cyan-400'}`} />
                {!isCollapsed && <span>Agent Simulator</span>}
              </div>
              {!isCollapsed && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  currentView === 'simulator' ? 'bg-indigo-800 text-indigo-200' : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                }`}>
                  LangGraph
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('stix')}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2.5'} rounded-xl text-sm font-medium transition-all ${
                currentView === 'stix'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-[#141924]'
              }`}
              title="STIX 2.1 Hub (OASIS)"
            >
              <div className="flex items-center gap-2.5">
                <FileCode className={`h-4 w-4 ${currentView === 'stix' ? 'text-white' : 'text-amber-400'}`} />
                {!isCollapsed && <span>STIX 2.1 Hub</span>}
              </div>
              {!isCollapsed && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  currentView === 'stix' ? 'bg-indigo-800 text-indigo-200' : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                }`}>
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
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    selectedFilter === 'ALL' && currentView === 'stream'
                      ? 'bg-[#161c28] text-indigo-300 font-bold border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#121622]'
                  }`}
                >
                  &bull; All Targets (5)
                </button>

                <button
                  onClick={() => {
                    onViewChange('stream');
                    onSelectFilter('REBRANDS');
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    selectedFilter === 'REBRANDS' && currentView === 'stream'
                      ? 'bg-[#161c28] text-indigo-300 font-bold border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#121622]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-indigo-400" />
                    <span>Rebrand Matches</span>
                  </div>
                  <span className="text-[10px] px-1 rounded bg-indigo-500/20 text-indigo-300">3</span>
                </button>

                <button
                  onClick={() => {
                    onViewChange('stream');
                    onSelectFilter('ILLICIT');
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    selectedFilter === 'ILLICIT' && currentView === 'stream'
                      ? 'bg-[#161c28] text-rose-300 font-bold border border-rose-500/30'
                      : 'text-slate-400 hover:text-rose-300 hover:bg-[#121622]'
                  }`}
                >
                  <span>&bull; Illicit Contraband</span>
                  <span className="text-[10px] px-1 rounded bg-rose-500/20 text-rose-400">3</span>
                </button>

                <button
                  onClick={() => {
                    onViewChange('stream');
                    onSelectFilter('PGP');
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    selectedFilter === 'PGP' && currentView === 'stream'
                      ? 'bg-[#161c28] text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-slate-400 hover:text-emerald-300 hover:bg-[#121622]'
                  }`}
                >
                  <span>&bull; PGP Verified</span>
                  <span className="text-[10px] px-1 rounded bg-emerald-500/20 text-emerald-400">4</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Status & Analyst Info */}
      <div className={`p-3 border-t border-[#1c2333] space-y-3 bg-[#0a0d14] ${isCollapsed ? 'px-2' : ''}`}>
        
        {/* Stream Live Indicator */}
        {!isCollapsed ? (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#0e121a] border border-[#1c2333] text-xs font-mono">
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
            className="h-8 w-8 rounded-full bg-[#141924] border border-[#1c2333] flex items-center justify-center text-slate-300 shrink-0"
            title="Cyber SOC Analyst (ID CC-CHD #419)"
          >
            <UserCheck className="h-4 w-4 text-indigo-400" />
          </div>
          {!isCollapsed && (
            <div className="text-left min-w-0 truncate">
              <div className="text-xs font-bold text-slate-200 truncate">Cyber SOC Analyst</div>
              <div className="text-[10px] text-slate-500 font-mono">ID CC-CHD #419</div>
            </div>
          )}
        </div>

      </div>

    </aside>
  );
};
