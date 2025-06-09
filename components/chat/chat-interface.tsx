'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { useChat } from '@/hooks/use-chat';
import { useAppStore } from '@/lib/store/app-store';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Message } from '@/lib/supabase/types';

export function ChatInterface() {
  const { currentProject } = useAppStore();
  const { messages, isGenerating, sendMessage } = useChat(currentProject?.id || null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (currentProject) {
      setIsLoading(true);
      // Simulate loading time for better UX
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentProject]);

  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Project Selected</h3>
          <p className="text-sm">Select a project from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
          <p className="text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Start Your Animation Journey</h3>
              <p className="text-sm mb-4">
                Describe what you want to animate using natural language
              </p>
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-left max-w-md mx-auto">
                <p className="font-medium mb-2">Try something like:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• "Create a bouncing ball animation"</li>
                  <li>• "Show a sine wave transforming into a cosine wave"</li>
                  <li>• "Animate the Pythagorean theorem"</li>
                  <li>• "Create a visualization of sorting algorithms"</li>
                </ul>
              </div>
            </div>
          ) : (
            messages.map((message: Message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}

          {isGenerating && (
            <ChatMessage
              message={{
                id: 'generating',
                project_id: currentProject.id,
                content: '',
                role: 'assistant',
                created_at: new Date().toISOString(),
              }}
              isGenerating={true}
            />
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={sendMessage} disabled={isGenerating} />
        </div>
      </div>
    </div>
  );
}