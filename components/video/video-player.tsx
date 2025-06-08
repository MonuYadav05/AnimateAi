'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store/app-store';
import { supabase } from '@/lib/supabase/client';
import { Animation } from '@/lib/supabase/types';
import { Play, RotateCcw, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

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
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'rendering':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (!currentProject) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a project to view animations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Animation Preview</CardTitle>
            <CardDescription>
              {currentAnimation ? 'Latest generated animation' : 'No animations yet'}
            </CardDescription>
          </div>
          
          {currentAnimation && (
            <div className="flex items-center gap-2">
              <Badge className={getStatusIcon(currentAnimation.status) ? getStatusColor(currentAnimation.status) : ''}>
                {getStatusIcon(currentAnimation.status)}
                <span className="ml-2 capitalize">{currentAnimation.status}</span>
              </Badge>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRerender}
                disabled={isLoading}
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
      
      <CardContent className="flex-1">
        {currentAnimation ? (
          <div className="space-y-4">
            {currentAnimation.video_url ? (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  src={currentAnimation.video_url}
                  controls
                  className="w-full h-full"
                  poster="/api/placeholder/800/450"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  {currentAnimation.status === 'pending' && (
                    <>
                      <Clock className="h-8 w-8 mx-auto mb-2" />
                      <p>Animation queued for rendering</p>
                    </>
                  )}
                  {currentAnimation.status === 'rendering' && (
                    <>
                      <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                      <p>Animation is being rendered...</p>
                    </>
                  )}
                  {currentAnimation.status === 'error' && (
                    <>
                      <XCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                      <p>Error rendering animation</p>
                      {currentAnimation.error_message && (
                        <p className="text-sm mt-1">{currentAnimation.error_message}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            
            {currentAnimation.manim_code && (
              <div className="space-y-2">
                <h4 className="font-medium">Generated Manim Code:</h4>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{currentAnimation.manim_code}</code>
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No animations created yet</p>
              <p className="text-sm">Start chatting to generate your first animation</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}