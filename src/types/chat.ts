import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: MessageParam[];
}

export interface ChatResponse {
  message: string;
  error?: string;
}
