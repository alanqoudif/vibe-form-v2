// Form theming types - similar to Google Forms customization

export interface FormTheme {
  // Header/Banner
  headerImage?: string;
  headerColor: string;
  
  // Background
  backgroundColor: string;
  backgroundPattern?: 'none' | 'dots' | 'grid' | 'waves';
  
  // Colors
  primaryColor: string;
  accentColor: string;
  
  // Typography
  fontFamily: FontFamily;
  questionTextColor: string;
  answerTextColor: string;
  
  // Card style
  cardBackground: string;
  cardBorderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  cardShadow: 'none' | 'sm' | 'md' | 'lg';
}

export type FontFamily = 
  | 'Inter'
  | 'Roboto'
  | 'Poppins'
  | 'Outfit'
  | 'Space Grotesk'
  | 'DM Sans'
  | 'Plus Jakarta Sans'
  | 'Nunito'
  | 'Lato'
  | 'Open Sans'
  | 'Cairo' // Arabic support
  | 'IBM Plex Sans Arabic'; // Arabic support

// Predefined theme presets
export const THEME_PRESETS: Record<string, FormTheme> = {
  default: {
    headerColor: '#6366f1',
    backgroundColor: '#0f0f14',
    primaryColor: '#6366f1',
    accentColor: '#8b5cf6',
    fontFamily: 'Inter',
    questionTextColor: '#ffffff',
    answerTextColor: '#9ca3af',
    cardBackground: 'rgba(30, 30, 40, 0.8)',
    cardBorderRadius: 'lg',
    cardShadow: 'md',
  },
  ocean: {
    headerColor: '#0ea5e9',
    backgroundColor: '#0c1929',
    primaryColor: '#0ea5e9',
    accentColor: '#06b6d4',
    fontFamily: 'Poppins',
    questionTextColor: '#ffffff',
    answerTextColor: '#94a3b8',
    cardBackground: 'rgba(15, 35, 55, 0.9)',
    cardBorderRadius: 'xl',
    cardShadow: 'lg',
  },
  sunset: {
    headerColor: '#f97316',
    backgroundColor: '#1a1212',
    primaryColor: '#f97316',
    accentColor: '#fb923c',
    fontFamily: 'Outfit',
    questionTextColor: '#fef3c7',
    answerTextColor: '#d1c4a5',
    cardBackground: 'rgba(45, 30, 25, 0.9)',
    cardBorderRadius: 'lg',
    cardShadow: 'md',
  },
  forest: {
    headerColor: '#22c55e',
    backgroundColor: '#0d1711',
    primaryColor: '#22c55e',
    accentColor: '#4ade80',
    fontFamily: 'DM Sans',
    questionTextColor: '#ecfdf5',
    answerTextColor: '#9ca3af',
    cardBackground: 'rgba(20, 40, 30, 0.9)',
    cardBorderRadius: 'md',
    cardShadow: 'sm',
  },
  lavender: {
    headerColor: '#a855f7',
    backgroundColor: '#15121a',
    primaryColor: '#a855f7',
    accentColor: '#c084fc',
    fontFamily: 'Plus Jakarta Sans',
    questionTextColor: '#faf5ff',
    answerTextColor: '#c4b5fd',
    cardBackground: 'rgba(35, 25, 50, 0.9)',
    cardBorderRadius: 'xl',
    cardShadow: 'lg',
  },
  rose: {
    headerColor: '#ec4899',
    backgroundColor: '#1a1015',
    primaryColor: '#ec4899',
    accentColor: '#f472b6',
    fontFamily: 'Nunito',
    questionTextColor: '#fdf2f8',
    answerTextColor: '#f9a8d4',
    cardBackground: 'rgba(45, 25, 35, 0.9)',
    cardBorderRadius: 'lg',
    cardShadow: 'md',
  },
  midnight: {
    headerColor: '#3b82f6',
    backgroundColor: '#0a0a0f',
    primaryColor: '#3b82f6',
    accentColor: '#60a5fa',
    fontFamily: 'Space Grotesk',
    questionTextColor: '#f8fafc',
    answerTextColor: '#64748b',
    cardBackground: 'rgba(15, 15, 25, 0.95)',
    cardBorderRadius: 'md',
    cardShadow: 'sm',
  },
  lightClean: {
    headerColor: '#6366f1',
    backgroundColor: '#f8fafc',
    primaryColor: '#6366f1',
    accentColor: '#8b5cf6',
    fontFamily: 'Inter',
    questionTextColor: '#1e293b',
    answerTextColor: '#475569',
    cardBackground: '#ffffff',
    cardBorderRadius: 'lg',
    cardShadow: 'md',
  },
  lightOcean: {
    headerColor: '#0ea5e9',
    backgroundColor: '#f0f9ff',
    primaryColor: '#0ea5e9',
    accentColor: '#06b6d4',
    fontFamily: 'Poppins',
    questionTextColor: '#0c4a6e',
    answerTextColor: '#334155',
    cardBackground: '#ffffff',
    cardBorderRadius: 'xl',
    cardShadow: 'lg',
  },
  lightMinimal: {
    headerColor: '#18181b',
    backgroundColor: '#fafafa',
    primaryColor: '#18181b',
    accentColor: '#3f3f46',
    fontFamily: 'DM Sans',
    questionTextColor: '#18181b',
    answerTextColor: '#52525b',
    cardBackground: '#ffffff',
    cardBorderRadius: 'sm',
    cardShadow: 'sm',
  },
};

// Color palette for custom colors
export const COLOR_PALETTE = [
  // Blues
  '#3b82f6', '#2563eb', '#1d4ed8', '#0ea5e9', '#06b6d4',
  // Purples
  '#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#7c3aed',
  // Pinks/Roses
  '#ec4899', '#f472b6', '#db2777', '#f43f5e', '#e11d48',
  // Greens
  '#22c55e', '#4ade80', '#10b981', '#14b8a6', '#059669',
  // Oranges/Yellows
  '#f97316', '#fb923c', '#f59e0b', '#fbbf24', '#eab308',
  // Neutrals
  '#18181b', '#3f3f46', '#52525b', '#71717a', '#94a3b8',
];

export const BACKGROUND_COLORS = [
  // Dark
  '#0f0f14', '#0a0a0f', '#0c1929', '#1a1212', '#0d1711', '#15121a', '#1a1015',
  // Light
  '#f8fafc', '#fafafa', '#f0f9ff', '#fdf4ff', '#fef2f2', '#f0fdf4',
  // White
  '#ffffff',
];

export const DEFAULT_THEME: FormTheme = THEME_PRESETS.default;

export function getThemeCSS(theme: FormTheme): string {
  return `
    --form-header-color: ${theme.headerColor};
    --form-bg: ${theme.backgroundColor};
    --form-primary: ${theme.primaryColor};
    --form-accent: ${theme.accentColor};
    --form-question-text: ${theme.questionTextColor};
    --form-answer-text: ${theme.answerTextColor};
    --form-card-bg: ${theme.cardBackground};
    --form-font: "${theme.fontFamily}", system-ui, sans-serif;
    --form-radius: ${
      theme.cardBorderRadius === 'none' ? '0' :
      theme.cardBorderRadius === 'sm' ? '0.375rem' :
      theme.cardBorderRadius === 'md' ? '0.5rem' :
      theme.cardBorderRadius === 'lg' ? '0.75rem' : '1rem'
    };
    --form-shadow: ${
      theme.cardShadow === 'none' ? 'none' :
      theme.cardShadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.05)' :
      theme.cardShadow === 'md' ? '0 4px 6px -1px rgba(0,0,0,0.1)' :
      '0 10px 15px -3px rgba(0,0,0,0.1)'
    };
  `;
}


