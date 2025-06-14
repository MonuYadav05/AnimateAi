'use client';

import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun, Play, RotateCcw, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store/app-store';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { currentProject, currentAnimation } = useAppStore();

  return (
    <div className="h-16 glass-effect border-b border-white/10 shadow-glow">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          {currentProject && (
            <div className="animate-fade-in">
              <h2 className="font-montserrat font-semibold text-lg text-white">{currentProject.name}</h2>
              <p className="text-sm text-slate-400">
                {currentProject.description || 'No description'}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentAnimation && (
            <div className="flex items-center gap-2 mr-4 animate-fade-in">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
              >
                <Play className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Re-render
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </div>
  );
}