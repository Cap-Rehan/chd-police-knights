import React, { useState, useEffect } from 'react';
import { type ThemeMode, THEME_OPTIONS } from '../types/theme';
import { ThemeContext } from './ThemeContext';

const STORAGE_KEY = 'darkscope-color-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved && ['linear', 'vercel', 'tactical', 'cobalt'].includes(saved)) {
        return saved;
      }
    } catch {
      // Ignore localStorage errors
    }
    return 'linear';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Ignore localStorage errors
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const currentThemeOption =
    THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentThemeOption }}>
      {children}
    </ThemeContext.Provider>
  );
};
