import { Message } from '@/types/chat';
import { MessageContent } from './MessageContent';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          message.role === 'user'
            ? 'bg-zinc-900 text-white'
            : 'bg-zinc-100 text-zinc-900'
        }`}
      >
        <MessageContent content={message.content} role={message.role} />
      </div>
    </div>
  );
}
