import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, ChevronDown, ChevronUp } from 'lucide-react';

export type Theme = 'light-teal' | 'mulberry' | 'soft-peach' | 'purple-cyan';

// Theme configurations with complete color palettes
const themeConfigs = {
  'light-teal': {
    '--background': 'hsl(180, 70%, 98%)',
    '--foreground': 'hsl(180, 18%, 20%)',
    '--primary': 'hsl(180, 75%, 55%)',
    '--primary-foreground': 'hsl(0, 0%, 100%)',
    '--secondary': 'hsl(180, 45%, 92%)',
    '--secondary-foreground': 'hsl(180, 18%, 20%)',
    '--muted': 'hsl(180, 35%, 94%)',
    '--muted-foreground': 'hsl(180, 12%, 55%)',
    '--accent': 'hsl(180, 55%, 90%)',
    '--accent-foreground': 'hsl(180, 18%, 20%)',
    '--border': 'hsl(180, 35%, 80%)',
    '--ring': 'hsl(180, 75%, 55%)',
    '--card': 'hsl(0, 0%, 100%)',
    '--card-foreground': 'hsl(180, 18%, 20%)',
  },
  'mulberry': {
    '--background': 'hsl(340, 95%, 96%)',
    '--foreground': 'hsl(340, 30%, 15%)',
    '--primary': 'hsl(340, 95%, 15%)',
    '--primary-foreground': 'hsl(0, 0%, 100%)',
    '--secondary': 'hsl(340, 50%, 88%)',
    '--secondary-foreground': 'hsl(340, 30%, 15%)',
    '--muted': 'hsl(340, 40%, 90%)',
    '--muted-foreground': 'hsl(340, 25%, 50%)',
    '--accent': 'hsl(340, 60%, 85%)',
    '--accent-foreground': 'hsl(340, 30%, 15%)',
    '--border': 'hsl(340, 40%, 75%)',
    '--ring': 'hsl(340, 95%, 15%)',
    '--card': 'hsl(0, 0%, 100%)',
    '--card-foreground': 'hsl(340, 30%, 15%)',
  },
  'soft-peach': {
    '--background': 'hsl(15, 80%, 96%)',
    '--foreground': 'hsl(15, 30%, 15%)',
    '--primary': 'hsl(15, 85%, 60%)',
    '--primary-foreground': 'hsl(0, 0%, 100%)',
    '--secondary': 'hsl(15, 50%, 88%)',
    '--secondary-foreground': 'hsl(15, 30%, 15%)',
    '--muted': 'hsl(15, 40%, 90%)',
    '--muted-foreground': 'hsl(15, 25%, 50%)',
    '--accent': 'hsl(15, 60%, 85%)',
    '--accent-foreground': 'hsl(15, 30%, 15%)',
    '--border': 'hsl(15, 40%, 75%)',
    '--ring': 'hsl(15, 85%, 60%)',
    '--card': 'hsl(0, 0%, 100%)',
    '--card-foreground': 'hsl(15, 30%, 15%)',
  },
  'purple-cyan': {
    '--background': '#672676', // Exact start color #672676
    '--foreground': 'hsl(0, 0%, 100%)', // White text for dark background
    '--primary': '#672676', // Exact main purple #672676
    '--primary-foreground': 'hsl(0, 0%, 100%)',
    '--secondary': '#672676', // Use main purple for secondary
    '--secondary-foreground': 'hsl(0, 0%, 100%)',
    '--muted': 'rgba(103, 38, 118, 0.7)', // Muted version of main purple
    '--muted-foreground': 'hsl(0, 0%, 80%)',
    '--accent': 'hsl(188, 100%, 50%)', // Bright cyan for accents
    '--accent-foreground': '#020104',
    '--border': 'rgba(103, 38, 118, 0.3)', // Transparent purple border
    '--ring': 'hsl(188, 100%, 50%)', // Cyan ring
    '--card': 'hsl(0, 0%, 100%)', // White cards for contrast
    '--card-foreground': '#020104', // Dark end color for card text
  },
} as const;

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

// Function to apply theme colors to CSS custom properties
const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  const config = themeConfigs[theme];
  
  Object.entries(config).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

const themes = [
  { id: 'light-teal', name: 'Light Teal', color: 'bg-teal-400' },
  { id: 'mulberry', name: 'Mulberry', color: 'bg-rose-900' },
  { id: 'soft-peach', name: 'Soft Peach', color: 'bg-orange-300' },
  { id: 'purple-cyan', name: 'Purple & Cyan', color: 'bg-gradient-to-r from-purple-600 to-cyan-400' },
] as const;

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (theme: Theme) => {
    onThemeChange(theme);
    applyTheme(theme);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Theme</span>
            <div className={`w-3 h-3 rounded-full ${currentThemeData.color}`} />
          </div>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {/* Theme Options */}
        {isExpanded && (
          <div className="border-t border-gray-200 max-h-64 overflow-y-auto">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id as Theme)}
                className={`flex items-center gap-3 w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                  currentTheme === theme.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${theme.color} shadow-sm`} />
                <span className="text-sm text-gray-900">{theme.name}</span>
                {currentTheme === theme.id && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}