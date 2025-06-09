'use client';

import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun, Play, Square, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/lib/store/app-store';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { currentProject, currentAnimation } = useAppStore();

  return (
    <div className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          {currentProject && (
            <div>
              <h2 className="font-semibold">{currentProject.name}</h2>
              <p className="text-sm text-muted-foreground">
                {currentProject.description || 'No description'}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentAnimation && (
            <div className="flex items-center gap-2 mr-4">
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Re-render
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
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