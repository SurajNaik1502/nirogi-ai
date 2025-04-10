
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, sender, timestamp }) => {
  return (
    <div
      className={`flex gap-3 ${
        sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {sender === 'bot' && (
        <Avatar className="h-8 w-8 bg-health-purple flex items-center justify-center">
          <Bot className="h-4 w-4" />
        </Avatar>
      )}
      
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          sender === 'user'
            ? 'bg-health-purple/30 text-white'
            : 'glass-morphism'
        }`}
      >
        <p className="text-sm">{content}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      {sender === 'user' && (
        <Avatar className="h-8 w-8 bg-health-blue flex items-center justify-center">
          <User className="h-4 w-4" />
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
