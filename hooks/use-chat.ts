'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store/app-store';
import { supabase } from '@/lib/supabase/client';
import { Message } from '@/lib/supabase/types';

export function useChat(projectId: string | null) {
  const { 
    messages, 
    setMessages, 
    addMessage, 
    isGenerating, 
    setIsGenerating 
  } = useAppStore();

  useEffect(() => {
    if (projectId) {
      fetchMessages(projectId);
    } else {
      setMessages([]);
    }
  }, [projectId, setMessages]);

  const fetchMessages = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      // Ensure messages are sorted by created_at timestamp
      const sortedMessages = data?.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ) || [];

      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!projectId || isGenerating) return;

    setIsGenerating(true);

    try {
      // Add user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        project_id: projectId,
        content,
        role: 'user',
        created_at: new Date().toISOString(),
      };

      // Save user message to database
      const { error: userError } = await supabase
        .from('messages')
        .insert(userMessage);

      if (userError) {
        console.error('Error saving user message:', userError);
        return;
      }

      addMessage(userMessage);

      // Send to LLM API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      // Add AI response
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        project_id: projectId,
        content: data.content,
        role: 'assistant',
        created_at: new Date().toISOString(),
      };

      // Save AI message to database
      const { error: aiError } = await supabase
        .from('messages')
        .insert(aiMessage);

      if (aiError) {
        console.error('Error saving AI message:', aiError);
      }

      addMessage(aiMessage);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        project_id: projectId,
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        role: 'assistant',
        created_at: new Date().toISOString(),
      };

      addMessage(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    messages,
    isGenerating,
    sendMessage,
  };
}