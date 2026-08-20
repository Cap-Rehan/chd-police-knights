import { createContext } from 'react';
import type { ThemeMode, ThemeOption } from '../types/theme';

export interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  currentThemeOption: ThemeOption;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
