import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface ChatRequest {
  messages: MessageParam[];
  settings?: ChatSettings;
}

export interface ChatResponse {
  message: string;
  error?: string;
}

export const CLAUDE_MODELS = [
  { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5', description: 'Latest & most capable' },
  { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', description: 'Fast and balanced' },
  { id: 'claude-opus-4-20250514', name: 'Claude Opus 4', description: 'Most intelligent' },
  { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', description: 'Previous generation' },
] as const;
