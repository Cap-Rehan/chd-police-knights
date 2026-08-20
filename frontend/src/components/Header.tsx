import React from 'react';
import { 
  Search, 
  Layers, 
  GitFork, 
  BarChart2, 
  ChevronRight, 
  Shield, 
  Terminal, 
  FileCode
} from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

interface HeaderProps {
  currentView: 'stream' | 'graph' | 'analytics' | 'simulator' | 'stix';
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  searchTerm,
  onSearchChange,
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
    <header
      className="border-b px-6 py-3.5 sticky top-0 z-20 backdrop-blur-md transition-colors"
      style={{
        backgroundColor: 'rgba(var(--bg-header), 0.95)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 max-w-[1560px] mx-auto w-full">
        
        {/* Left: Breadcrumbs & Current View Title */}
        <div className="flex items-center gap-3 text-sm font-sans min-w-0">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs hidden sm:flex">
            <Shield className="h-4 w-4" style={{ color: 'var(--accent-primary)' }} />
            <span>DarkScope</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          </div>

          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0" style={{ color: 'var(--accent-primary)' }} />
            <h1 className="font-bold text-sm tracking-wide truncate" style={{ color: 'var(--text-primary)' }}>
              {current.name}
            </h1>
          </div>
        </div>

        {/* Center: Global Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search vendor alias, PGP 0xB8C2..., wallet bc1q..., or Telegram @..."
            className="w-full h-9 pl-10 pr-12 rounded-xl text-xs font-mono placeholder:text-slate-500 focus:outline-none transition-all shadow-inner border"
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <kbd
              className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 rounded border"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              /
            </kbd>
          </div>
        </div>

        {/* Right: Theme Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
        </div>

      </div>
    </header>
  );
};
