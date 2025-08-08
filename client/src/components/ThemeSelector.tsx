import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, ChevronDown, ChevronUp } from 'lucide-react';

export type Theme = 'original' | 'teal' | 'navy' | 'dark' | 'purple' | 'green' | 'orange' | 'red';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

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
                onClick={() => {
                  onThemeChange(theme.id as Theme);
                  setIsExpanded(false);
                }}
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