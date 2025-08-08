import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, ChevronDown, ChevronUp } from 'lucide-react';

export type Theme = 'original' | 'teal' | 'navy' | 'dark' | 'purple' | 'green' | 'orange' | 'red';

// Theme configurations with complete color palettes
const themeConfigs = {
  original: {
    '--background': 'hsl(212, 50%, 95%)',
    '--foreground': 'hsl(213, 15%, 25%)',
    '--primary': 'hsl(213, 94%, 68%)',
    '--primary-foreground': 'hsl(0, 0%, 100%)',
    '--secondary': 'hsl(213, 20%, 90%)',
    '--secondary-foreground': 'hsl(213, 15%, 25%)',
    '--muted': 'hsl(213, 15%, 95%)',
    '--muted-foreground': 'hsl(213, 10%, 60%)',
    '--accent': 'hsl(213, 50%, 95%)',
    '--accent-foreground': 'hsl(213, 15%, 25%)',
    '--border': 'hsl(213, 20%, 85%)',
    '--ring': 'hsl(213, 94%, 68%)',
  },
  teal: {
    '--background': 'hsl(178, 50%, 95%)',
    '--foreground': 'hsl(178, 15%, 25%)',
    '--primary': 'hsl(178, 78%, 35%)',
    '--primary-foreground': 'hsl(0, 0%, 100%)',
    '--secondary': 'hsl(178, 25%, 92%)',
    '--secondary-foreground': 'hsl(178, 15%, 25%)',
    '--muted': 'hsl(178, 20%, 95%)',
    '--muted-foreground': 'hsl(178, 10%, 60%)',
    '--accent': 'hsl(178, 50%, 95%)',
    '--accent-foreground': 'hsl(178, 15%, 25%)',
    '--border': 'hsl(178, 20%, 85%)',
    '--ring': 'hsl(178, 78%, 35%)',
  },
  navy: {
    '--background': 'hsl(213, 50%, 95%)',
    '--foreground': 'hsl(213, 15%, 25%)',
    '--primary': 'hsl(213, 100%, 20%)',
    '--primary-foreground': 'hsl(0, 0%, 100%)',
    '--secondary': 'hsl(213, 20%, 90%)',
    '--secondary-foreground': 'hsl(213, 15%, 25%)',
    '--muted': 'hsl(213, 15%, 95%)',
    '--muted-foreground': 'hsl(213, 10%, 60%)',
    '--accent': 'hsl(213, 50%, 95%)',
    '--accent-foreground': 'hsl(213, 15%, 25%)',
    '--border': 'hsl(213, 20%, 85%)',
    '--ring': 'hsl(213, 100%, 20%)',
  },
  dark: {
    '--background': 'hsl(0, 0%, 9%)',
    '--foreground': 'hsl(0, 0%, 95%)',
    '--primary': 'hsl(0, 0%, 20%)',
    '--primary-foreground': 'hsl(0, 0%, 95%)',
    '--secondary': 'hsl(0, 0%, 14%)',
    '--secondary-foreground': 'hsl(0, 0%, 95%)',
    '--muted': 'hsl(0, 0%, 14%)',
    '--muted-foreground': 'hsl(0, 0%, 65%)',
    '--accent': 'hsl(0, 0%, 20%)',
    '--accent-foreground': 'hsl(0, 0%, 95%)',
    '--border': 'hsl(0, 0%, 20%)',
    '--ring': 'hsl(0, 0%, 20%)',
  },
  purple: {
    '--background': 'hsl(262, 50%, 95%)',
    '--foreground': 'hsl(262, 15%, 25%)',
    '--primary': 'hsl(262, 83%, 58%)',
    '--primary-foreground': 'hsl(0, 0%, 100%)',
    '--secondary': 'hsl(262, 20%, 90%)',
    '--secondary-foreground': 'hsl(262, 15%, 25%)',
    '--muted': 'hsl(262, 15%, 95%)',
    '--muted-foreground': 'hsl(262, 10%, 60%)',
    '--accent': 'hsl(262, 50%, 95%)',
    '--accent-foreground': 'hsl(262, 15%, 25%)',
    '--border': 'hsl(262, 20%, 85%)',
    '--ring': 'hsl(262, 83%, 58%)',
  },
  green: {
    '--background': 'hsl(142, 50%, 95%)',
    '--foreground': 'hsl(142, 15%, 25%)',
    '--primary': 'hsl(142, 76%, 36%)',
    '--primary-foreground': 'hsl(0, 0%, 100%)',
    '--secondary': 'hsl(142, 20%, 90%)',
    '--secondary-foreground': 'hsl(142, 15%, 25%)',
    '--muted': 'hsl(142, 15%, 95%)',
    '--muted-foreground': 'hsl(142, 10%, 60%)',
    '--accent': 'hsl(142, 50%, 95%)',
    '--accent-foreground': 'hsl(142, 15%, 25%)',
    '--border': 'hsl(142, 20%, 85%)',
    '--ring': 'hsl(142, 76%, 36%)',
  },
  orange: {
    '--background': 'hsl(24, 50%, 95%)',
    '--foreground': 'hsl(24, 15%, 25%)',
    '--primary': 'hsl(24, 95%, 53%)',
    '--primary-foreground': 'hsl(0, 0%, 100%)',
    '--secondary': 'hsl(24, 20%, 90%)',
    '--secondary-foreground': 'hsl(24, 15%, 25%)',
    '--muted': 'hsl(24, 15%, 95%)',
    '--muted-foreground': 'hsl(24, 10%, 60%)',
    '--accent': 'hsl(24, 50%, 95%)',
    '--accent-foreground': 'hsl(24, 15%, 25%)',
    '--border': 'hsl(24, 20%, 85%)',
    '--ring': 'hsl(24, 95%, 53%)',
  },
  red: {
    '--background': 'hsl(348, 50%, 95%)',
    '--foreground': 'hsl(348, 15%, 25%)',
    '--primary': 'hsl(348, 83%, 47%)',
    '--primary-foreground': 'hsl(0, 0%, 100%)',
    '--secondary': 'hsl(348, 20%, 90%)',
    '--secondary-foreground': 'hsl(348, 15%, 25%)',
    '--muted': 'hsl(348, 15%, 95%)',
    '--muted-foreground': 'hsl(348, 10%, 60%)',
    '--accent': 'hsl(348, 50%, 95%)',
    '--accent-foreground': 'hsl(348, 15%, 25%)',
    '--border': 'hsl(348, 20%, 85%)',
    '--ring': 'hsl(348, 83%, 47%)',
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
  { id: 'original', name: 'Original', color: 'bg-blue-600' },
  { id: 'teal', name: 'Teal & Cream', color: 'bg-teal-600' },
  { id: 'navy', name: 'Navy Blue', color: 'bg-blue-900' },
  { id: 'dark', name: 'Dark Mode', color: 'bg-gray-900' },
  { id: 'purple', name: 'Royal Purple', color: 'bg-purple-600' },
  { id: 'green', name: 'Forest Green', color: 'bg-green-600' },
  { id: 'orange', name: 'Sunset Orange', color: 'bg-orange-600' },
  { id: 'red', name: 'Crimson Red', color: 'bg-red-600' },
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