import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, ChevronDown, ChevronUp } from 'lucide-react';

export type Theme = 'teal' | 'ocean-blue';

// Theme configurations with complete color palettes
const themeConfigs = {
  'teal': {
    '--background': 'hsl(180, 95%, 98%)',
    '--foreground': 'hsl(180, 60%, 15%)',
    '--primary': 'hsl(180, 75%, 55%)',
    '--primary-foreground': 'hsl(180, 60%, 15%)',
    '--secondary': 'hsl(180, 65%, 85%)',
    '--secondary-foreground': 'hsl(180, 60%, 15%)',
    '--muted': 'hsl(180, 55%, 90%)',
    '--muted-foreground': 'hsl(180, 40%, 40%)',
    '--accent': 'hsl(180, 85%, 75%)',
    '--accent-foreground': 'hsl(180, 60%, 15%)',
    '--border': 'hsl(180, 45%, 70%)',
    '--ring': 'hsl(180, 75%, 55%)',
    '--card': 'hsl(0, 0%, 100%)',
    '--card-foreground': 'hsl(180, 60%, 15%)',
  },
  'ocean-blue': {
    '--background': 'hsl(172, 100%, 97%)', // #EFFFFD - Very light ocean
    '--foreground': 'hsl(232, 63%, 26%)', // #161D6F - Dark navy text
    '--primary': 'hsl(187, 100%, 76%)', // #85F4FF - Bright ocean blue
    '--primary-foreground': 'hsl(232, 63%, 26%)', // Dark navy on bright blue
    '--secondary': 'hsl(172, 100%, 86%)', // #B8FFF9 - Light ocean
    '--secondary-foreground': 'hsl(232, 63%, 26%)', // Dark navy
    '--muted': 'hsl(172, 100%, 90%)', // Lighter version of #B8FFF9
    '--muted-foreground': 'hsl(232, 40%, 50%)', // Medium navy
    '--accent': 'hsl(172, 100%, 86%)', // #B8FFF9 - Light ocean
    '--accent-foreground': 'hsl(232, 63%, 26%)', // Dark navy
    '--border': 'hsl(187, 100%, 76%)', // #85F4FF - Bright ocean blue
    '--ring': 'hsl(187, 100%, 76%)', // #85F4FF - Bright ocean blue
    '--card': 'hsl(0, 0%, 100%)', // White cards for contrast
    '--card-foreground': 'hsl(232, 63%, 26%)', // Dark navy text on cards
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

  // Set data-theme attribute for CSS selectors
  root.setAttribute('data-theme', theme);

  // Apply CSS custom properties
  Object.entries(config || {}).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

const themes = [
  { id: 'teal', name: 'Teal', color: 'bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-200' },
  { id: 'ocean-blue', name: 'Ocean Blue', color: 'bg-gradient-to-r from-blue-900 via-cyan-400 to-blue-200' },
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
