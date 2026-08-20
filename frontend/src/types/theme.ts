export type ThemeMode = 'linear' | 'vercel' | 'tactical' | 'cobalt';

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  subtitle: string;
  swatches: string[]; // [primary, background, border]
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'linear',
    name: 'Linear Graphite',
    subtitle: 'Deep graphite with electric cyan accents',
    swatches: ['#06b6d4', '#08090a', '#202227'],
  },
  {
    id: 'vercel',
    name: 'Vercel Obsidian',
    subtitle: 'Pitch black & razor monochromatic',
    swatches: ['#ffffff', '#000000', '#222222'],
  },
  {
    id: 'tactical',
    name: 'Tactical SOC',
    subtitle: 'Stealth military dark with radar emerald',
    swatches: ['#10b981', '#05070a', '#172335'],
  },
  {
    id: 'cobalt',
    name: 'Cyber Cobalt',
    subtitle: 'Deep carbon with electric blue accents',
    swatches: ['#3b82f6', '#070a10', '#1d2a42'],
  },
];
