import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/useTheme';
import { THEME_OPTIONS, type ThemeMode } from '../types/theme';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, currentThemeOption } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer shadow-xs"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: isOpen ? 'var(--border-accent)' : 'var(--border-subtle)',
          color: 'var(--text-primary)',
        }}
        title="Change Dark Theme Palette"
        aria-label="Theme Selector"
      >
        <Palette className="h-3.5 w-3.5" style={{ color: 'var(--accent-primary)' }} />
        
        {/* Color Swatch Dot */}
        <span
          className="w-2.5 h-2.5 rounded-full ring-1 ring-white/20 inline-block shrink-0"
          style={{ backgroundColor: currentThemeOption.swatches[0] }}
        />
        
        <span className="hidden sm:inline font-sans text-xs font-semibold">
          {currentThemeOption.name}
        </span>
        
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-2xl border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
          style={{
            backgroundColor: 'var(--bg-sidebar)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="px-3 py-2 border-b mb-1.5" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">
              Dark Theme Palette
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Select your preferred visual style
            </div>
          </div>

          <div className="space-y-1">
            {THEME_OPTIONS.map((opt) => {
              const isSelected = opt.id === theme;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectTheme(opt.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all group cursor-pointer"
                  style={{
                    backgroundColor: isSelected ? 'var(--bg-accent-subtle)' : 'transparent',
                    border: isSelected ? '1px solid var(--border-accent)' : '1px solid transparent',
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Visual Swatch Preview Badge */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center p-1 shrink-0 border"
                      style={{
                        backgroundColor: opt.swatches[1],
                        borderColor: opt.swatches[2],
                      }}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-xs"
                        style={{ backgroundColor: opt.swatches[0] }}
                      />
                    </div>

                    <div className="min-w-0 truncate">
                      <div
                        className="text-xs font-bold font-sans flex items-center gap-1.5"
                        style={{
                          color: isSelected ? 'var(--accent-primary-text)' : 'var(--text-primary)',
                        }}
                      >
                        <span>{opt.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {opt.subtitle}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check
                      className="h-4 w-4 shrink-0"
                      style={{ color: 'var(--accent-primary)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
