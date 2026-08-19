import React from 'react';
import { 
  Search, 
  Layers, 
  GitFork, 
  BarChart2, 
  ChevronRight, 
  Shield, 
  Terminal, 
  FileCode,
  PanelLeft
} from 'lucide-react';

interface HeaderProps {
  currentView: 'stream' | 'graph' | 'analytics' | 'simulator' | 'stix';
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  searchTerm,
  onSearchChange,
  isSidebarCollapsed,
  onToggleSidebar,
}) => {
  const getViewTitle = () => {
    switch (currentView) {
      case 'stream':
        return { name: 'Threat Stream & Triage', icon: Layers };
      case 'graph':
        return { name: 'Criminal Network Graph Explorer', icon: GitFork };
      case 'analytics':
        return { name: 'Trafficking Trends & Intelligence Analytics', icon: BarChart2 };
      case 'simulator':
        return { name: 'LangGraph Autonomous Multi-Agent Pipeline', icon: Terminal };
      case 'stix':
        return { name: 'OASIS STIX 2.1 Threat Intelligence Hub', icon: FileCode };
    }
  };

  const current = getViewTitle();
  const Icon = current.icon;

  return (
    <header className="border-b border-[#1c2333] bg-[#090b10]/95 backdrop-blur-md px-6 py-3.5 sticky top-0 z-20">
      <div className="flex flex-wrap items-center justify-between gap-4 max-w-[1560px] mx-auto w-full">
        
        {/* Left: Sidebar Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3 text-sm font-sans min-w-0">
          <button
            onClick={onToggleSidebar}
            className={`p-1.5 rounded-lg border transition-all ${
              isSidebarCollapsed
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-[#0e121a] border-[#1c2333] text-slate-400 hover:text-white hover:bg-[#141924]'
            }`}
            title="Toggle sidebar ([)"
          >
            <PanelLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-xs hidden sm:flex">
            <Shield className="h-4 w-4 text-indigo-400" />
            <span>DarkScope</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          </div>

          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-indigo-400" />
            <h1 className="font-bold text-slate-100 text-sm tracking-wide truncate">
              {current.name}
            </h1>
          </div>
        </div>

        {/* Center / Right: Global Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search vendor alias, PGP 0xB8C2..., wallet bc1q..., or Telegram @..."
            className="w-full h-9 pl-10 pr-12 rounded-xl bg-[#0e121a] border border-[#1c2333] focus:border-indigo-500/60 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-[#161b26] border border-[#232b3e] rounded">
              /
            </kbd>
          </div>
        </div>

      </div>
    </header>
  );
};
