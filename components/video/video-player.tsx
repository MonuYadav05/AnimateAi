'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store/app-store';
import { supabase } from '@/lib/supabase/client';
import { Animation } from '@/lib/supabase/types';
import { Play, RotateCcw, Clock, CheckCircle, XCircle, Loader2, Code, Film } from 'lucide-react';

export function VideoPlayer() {
  const { currentProject, currentAnimation, setCurrentAnimation, setAnimations } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentProject) {
      fetchLatestAnimation();
    }
  }, [currentProject]);

  const fetchLatestAnimation = async () => {
    if (!currentProject) return;

    const { data, error } = await supabase
      .from('animations')
      .select('*')
      .eq('project_id', currentProject.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching animation:', error);
      return;
    }

    if (data && data.length > 0) {
      setCurrentAnimation(data[0]);
    }
  };

  const handleRerender = async () => {
    if (!currentProject) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/animations/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: currentProject.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to trigger re-render');
      }

      await fetchLatestAnimation();
    } catch (error) {
      console.error('Error triggering re-render:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Animation['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rendering':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Animation['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'rendering':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'error':
        return 'bg-red-500/20 text-red-300 border-red-400/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  if (!currentProject) {
    return (
      <Card className="h-full glass-effect border-white/20 shadow-glow">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-slate-400 animate-fade-in">
            <div className="relative mb-6">
              <Play className="h-16 w-16 mx-auto opacity-30" />
              <div className="absolute inset-0 h-16 w-16 mx-auto animate-ping opacity-10">
                <Play className="h-16 w-16" />
              </div>
            </div>
            <p className="text-lg font-medium">Select a project to view animations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full glass-effect border-white/20 shadow-glow">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-montserrat text-white flex items-center gap-2">
              <Film className="h-5 w-5 text-blue-400" />
              Animation Preview
            </CardTitle>
            <CardDescription className="text-slate-400">
              {currentAnimation ? 'Latest generated animation' : 'No animations yet'}
            </CardDescription>
          </div>

          {currentAnimation && (
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(currentAnimation.status)} border`}>
                {getStatusIcon(currentAnimation.status)}
                <span className="ml-2 capitalize font-medium">{currentAnimation.status}</span>
              </Badge>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRerender}
                disabled={isLoading}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4 mr-2" />
                )}
                Re-render
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-6">
        {currentAnimation ? (
          <div className="space-y-6 animate-fade-in">
            {currentAnimation.video_url ? (
              <div className="aspect-video bg-black/50 rounded-xl overflow-hidden border border-white/10 shadow-glow">
                <video
                  src={`https://vehcctitsmwglccncynx.supabase.co/storage/v1/object/public/videos/${currentAnimation.video_url}`}
                  controls
                  className="w-full h-full"
                  poster="/api/placeholder/800/450"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="aspect-video glass-effect border-white/20 rounded-xl flex items-center justify-center">
                <div className="text-center text-slate-400">
                  {currentAnimation.status === 'pending' && (
                    <div className="animate-fade-in">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-yellow-400 animate-pulse" />
                      <p className="text-lg font-medium text-yellow-300">Animation queued for rendering</p>
                      <p className="text-sm opacity-75 mt-2">Your animation will be ready soon</p>
                    </div>
                  )}
                  {currentAnimation.status === 'rendering' && (
                    <div className="animate-fade-in">
                      <Loader2 className="h-12 w-12 mx-auto mb-4 text-blue-400 animate-spin" />
                      <p className="text-lg font-medium text-blue-300">Animation is being rendered...</p>
                      <p className="text-sm opacity-75 mt-2">This may take a few moments</p>
                    </div>
                  )}
                  {currentAnimation.status === 'error' && (
                    <div className="animate-fade-in">
                      <XCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
                      <p className="text-lg font-medium text-red-300">Error rendering animation</p>
                      {currentAnimation.error_message && (
                        <p className="text-sm mt-2 text-slate-400 max-w-md mx-auto">{currentAnimation.error_message}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentAnimation.manim_code && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-400" />
                  <h4 className="font-semibold text-white">Generated Manim Code</h4>
                </div>
                <div className="glass-effect h-80 border-white/20 rounded-xl p-4 overflow-y-auto">
                  <pre className="text-sm overflow-x-auto scrollbar-thin text-slate-300 leading-relaxed">
                    <code>{currentAnimation.manim_code}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-400 animate-fade-in">
            <div className="text-center">
              <div className="relative mb-6">
                <Play className="h-16 w-16 mx-auto opacity-30" />
                <div className="absolute inset-0 h-16 w-16 mx-auto animate-ping opacity-10">
                  <Play className="h-16 w-16" />
                </div>
              </div>
              <p className="text-lg font-medium mb-2">No animations created yet</p>
              <p className="text-sm opacity-75">Start chatting to generate your first animation</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}