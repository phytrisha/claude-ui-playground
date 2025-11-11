'use client';

import { Card } from '@/components/ui/card';
import { ChatHeader, ChatInput, ChatMessages } from '@/components/chat';
import { useChat } from '@/hooks/useChat';

export default function Home() {
  const { messages, input, isLoading, settings, setInput, setSettings, sendMessage } = useChat();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col gap-0 py-0">
        <ChatHeader settings={settings} onSettingsChange={setSettings} />
        <ChatMessages messages={messages} isLoading={isLoading} />
        <div className="p-8 border-t">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={sendMessage}
            disabled={isLoading}
          />
        </div>
      </Card>
    </div>
  );
}
