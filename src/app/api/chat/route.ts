import Anthropic from '@anthropic-ai/sdk';
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';
import { NextRequest } from 'next/server';
import { ChatSettings } from '@/types/chat';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, settings } = body as {
      messages: MessageParam[];
      settings?: ChatSettings;
    };

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Extract settings or use defaults
    const model = settings?.model || 'claude-sonnet-4-5-20250929';
    const temperature = settings?.temperature ?? 1;
    const maxTokens = settings?.maxTokens || 4096;
    const systemPrompt = settings?.systemPrompt?.trim();

    // Create a streaming response using the MessageStream helper
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const messageStream = anthropic.messages.stream({
            model,
            max_tokens: maxTokens,
            temperature,
            messages: messages,
            ...(systemPrompt && { system: systemPrompt }),
          });

          // Use the 'text' event handler from MessageStream
          messageStream.on('text', (text) => {
            controller.enqueue(new TextEncoder().encode(text));
          });

          messageStream.on('error', (error) => {
            console.error('Stream error:', error);
            controller.enqueue(
              new TextEncoder().encode(
                JSON.stringify({ error: error.message })
              )
            );
            controller.close();
          });

          // Wait for the stream to complete
          await messageStream.done();
          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          controller.enqueue(
            new TextEncoder().encode(
              JSON.stringify({ error: errorMessage })
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
