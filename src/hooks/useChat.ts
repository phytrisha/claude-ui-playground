import { useState, useCallback } from 'react';
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';
import { Message, ChatSettings } from '@/types/chat';
import { streamChat } from '@/lib/api/chat';

export interface UseChatReturn {
  messages: Message[];
  input: string;
  isLoading: boolean;
  settings: ChatSettings;
  setInput: (input: string) => void;
  setSettings: (settings: ChatSettings) => void;
  sendMessage: (e?: React.FormEvent) => Promise<void>;
  clearMessages: () => void;
}

const DEFAULT_SETTINGS: ChatSettings = {
  model: 'claude-sonnet-4-5-20250929',
  temperature: 1,
  maxTokens: 4096,
  systemPrompt: '',
};

/**
 * Custom hook for managing chat state and interactions
 * @returns Chat state and control functions
 */
export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);

  const sendMessage = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!input.trim() || isLoading) return;

      const userMessage: Message = {
        role: 'user',
        content: input.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      // Convert messages to MessageParam format for API
      const apiMessages: MessageParam[] = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      let assistantMessage = '';

      try {
        // Add empty assistant message that we'll update
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

        await streamChat({
          messages: apiMessages,
          settings,
          onChunk: (chunk) => {
            assistantMessage += chunk;

            // Update the last message (assistant's message) with accumulated content
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: 'assistant',
                content: assistantMessage,
              };
              return newMessages;
            });
          },
          onError: (error) => {
            console.error('Stream error:', error);
            setMessages((prev) => [
              ...prev.slice(0, -1), // Remove the empty assistant message
              {
                role: 'assistant',
                content: `Error: ${error.message}`,
              },
            ]);
          },
        });
      } catch (error) {
        console.error('Error:', error);
        // Error is already handled in onError callback
        // Only handle if the error wasn't caught there
        if (!assistantMessage) {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'assistant' && lastMessage.content === '') {
              return [
                ...prev.slice(0, -1),
                {
                  role: 'assistant',
                  content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
                },
              ];
            }
            return prev;
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, settings]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setInput('');
  }, []);

  return {
    messages,
    input,
    isLoading,
    settings,
    setInput,
    setSettings,
    sendMessage,
    clearMessages,
  };
}
