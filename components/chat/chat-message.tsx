'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Message } from '@/lib/supabase/types';
import { Bot, User, Sparkles, Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store/app-store';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
  isGenerating?: boolean;
}

export function ChatMessage({ message, isGenerating = false }: ChatMessageProps) {
  const { setCurrentAnimation } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const isUser = message.role === 'user';

  const handleClick = async () => {
    if (isUser || isGenerating || isLoading) return;

    setIsLoading(true);
    try {
      // Fetch the animation that was generated for this message
      const response = await fetch(`/api/animations/by-message?messageId=${message.id}`);
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 404) {
          // No animation found for this message, try getting the latest animation
          const latestResponse = await fetch(`/api/animations/latest?projectId=${message.project_id}`);
          if (!latestResponse.ok) throw new Error('Failed to fetch latest animation');
          const animation = await latestResponse.json();
          if (animation) {
            setCurrentAnimation(animation);
          }
        } else {
          throw new Error(data.error || 'Failed to fetch animation');
        }
      } else {
        const animation = await response.json();
        if (animation) {
          setCurrentAnimation(animation);
        }
      }
    } catch (error) {
      console.error('Error fetching animation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    // Remove code blocks, headers, and bullet points
    const cleanContent = content
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/^\s*[\*\-]\s*/gm, '') // Remove bullet points
      .replace(/^\s*\d+\.\s*/gm, '') // Remove numbered lists
      .replace(/\*\*.*?\*\*:/g, '') // Remove markdown headers
      .replace(/\*\*/g, '') // Remove remaining bold markers
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
      .trim();

    // Split into paragraphs and remove empty lines
    return cleanContent
      .split('\n')
      .filter(line => line.trim())
      .map((line, index) => (
        <p key={index} className="mb-2 last:mb-0">
          {line}
        </p>
      ));
  };

  return (
    <div className={cn('flex gap-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="h-10 w-10 shrink-0 ring-2 ring-blue-400/30 shadow-glow">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}

      <Card
        className={cn(
          'max-w-[75%] transition-all duration-300 shadow-glow group relative',
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-400/30'
            : 'glass-effect border-white/20 text-white hover:bg-white/10 cursor-pointer'
        )}
        onClick={handleClick}
      >
        <CardContent className="p-4">
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
                <span className="text-sm text-slate-300 font-medium">AI is crafting your animation...</span>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert prose-p:text-inherit prose-headings:text-inherit prose-strong:text-inherit">
              {formatMessage(message.content)}
              {!isUser && !isGenerating && (
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading animation...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Click to play animation</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {isUser && (
        <Avatar className="h-10 w-10 shrink-0 ring-2 ring-green-400/30 shadow-glow">
          <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}