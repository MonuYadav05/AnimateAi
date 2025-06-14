'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-center w-full">
      <div className="flex-1 relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe your animation idea..."
          className="w-full h-[60px] text-2xl bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 pr-12"
          disabled={disabled}
        />
        {message.trim() && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
          </div>
        )}
      </div>
      <Button
        type="submit"
        size="icon"
        className="h-[60px] w-[60px] shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-200 transform hover:scale-105 shadow-glow"
        disabled={disabled || !message.trim()}
      >
        {disabled ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
}