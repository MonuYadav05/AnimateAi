'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { useChat } from '@/hooks/use-chat';
import { useAppStore } from '@/lib/store/app-store';
import { MessageSquare, Sparkles, Zap } from 'lucide-react';

export function ChatInterface() {
  const { currentProject } = useAppStore();
  const { messages, isGenerating, sendMessage } = useChat(currentProject?.id || null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-mesh">
        <div className="text-center text-slate-400 animate-fade-in">
          <div className="relative mb-6">
            <MessageSquare className="h-16 w-16 mx-auto opacity-30" />
            <div className="absolute inset-0 h-16 w-16 mx-auto animate-ping opacity-10">
              <MessageSquare className="h-16 w-16" />
            </div>
          </div>
          <h3 className="text-xl font-montserrat font-semibold mb-3 text-slate-300">No Project Selected</h3>
          <p className="text-sm opacity-75">Select a project from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-mesh">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6 scrollbar-thin">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 py-16 animate-fade-in">
              <div className="relative mb-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Sparkles className="h-12 w-12 text-blue-400 animate-float" />
                  <Zap className="h-8 w-8 text-purple-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-montserrat font-bold mb-4 gradient-text">Start Your Animation Journey</h3>
              <p className="text-lg mb-8 text-slate-300">
                Describe what you want to animate using natural language
              </p>
              <div className="glass-effect border-white/20 rounded-2xl p-8 text-left max-w-2xl mx-auto shadow-glow">
                <p className="font-semibold mb-4 text-blue-300 text-lg">Try something like:</p>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>"Create a bouncing ball animation with physics"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>"Show a sine wave transforming into a cosine wave"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>"Animate the Pythagorean theorem with visual proof"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>"Create a visualization of sorting algorithms"</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={message.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ChatMessage message={message} />
              </div>
            ))
          )}

          {isGenerating && (
            <div className="animate-fade-in">
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
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-white/10 p-6 glass-effect">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={sendMessage} disabled={isGenerating} />
        </div>
      </div>
    </div>
  );
}