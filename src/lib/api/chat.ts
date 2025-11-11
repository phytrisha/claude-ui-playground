import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';

export interface StreamChatOptions {
  messages: MessageParam[];
  onChunk: (text: string) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

/**
 * Streams a chat response from the API
 * @param options - Configuration options for the streaming chat
 * @throws {Error} If the API request fails or returns an error
 */
export async function streamChat({
  messages,
  onChunk,
  onError,
  onComplete,
}: StreamChatOptions): Promise<void> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get response');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }

    onComplete?.();
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error occurred');
    onError?.(err);
    throw err;
  }
}

/**
 * Sends a message to the chat API and returns the full response
 * @param messages - Array of messages to send
 * @returns The complete assistant response
 */
export async function sendChatMessage(messages: MessageParam[]): Promise<string> {
  let fullResponse = '';

  await streamChat({
    messages,
    onChunk: (chunk) => {
      fullResponse += chunk;
    },
  });

  return fullResponse;
}
