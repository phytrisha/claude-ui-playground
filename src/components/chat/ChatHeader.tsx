import { ChatSettings } from '@/types/chat';
import { ChatSettingsDialog } from './ChatSettingsDialog';

interface ChatHeaderProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
}

export function ChatHeader({ settings, onSettingsChange }: ChatHeaderProps) {
  return (
    <div className="p-8 border-b flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Chat with Claude</h1>
        <p className="text-sm text-zinc-600 mt-1">Powered by Claude Sonnet 4.5</p>
      </div>
      <ChatSettingsDialog settings={settings} onSettingsChange={onSettingsChange} />
    </div>
  );
}
