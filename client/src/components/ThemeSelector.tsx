import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

export type Theme = 'original' | 'teal' | 'navy';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="h-4 w-4" />
        <span className="text-sm font-medium">Theme</span>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={currentTheme === 'original' ? 'default' : 'outline'}
          onClick={() => onThemeChange('original')}
          className="px-3 py-1 text-xs"
        >
          Original
        </Button>
        <Button
          size="sm"
          variant={currentTheme === 'teal' ? 'default' : 'outline'}
          onClick={() => onThemeChange('teal')}
          className="px-3 py-1 text-xs"
        >
          Teal & Cream
        </Button>
        <Button
          size="sm"
          variant={currentTheme === 'navy' ? 'default' : 'outline'}
          onClick={() => onThemeChange('navy')}
          className="px-3 py-1 text-xs"
        >
          Navy Blue
        </Button>
      </div>
    </div>
  );
}