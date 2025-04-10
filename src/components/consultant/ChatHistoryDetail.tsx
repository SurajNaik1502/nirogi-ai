
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessage {
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface SavedChat {
  id: string;
  title: string;
  chat_date: string;
  user_id?: string;
  messages: ChatMessage[];
}

interface ChatHistoryDetailProps {
  chat: SavedChat;
}

const ChatHistoryDetail: React.FC<ChatHistoryDetailProps> = ({ chat }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">{chat.title}</h2>
          <p className="text-sm text-muted-foreground">
            {format(new Date(chat.chat_date), 'MMMM d, yyyy • h:mm a')}
          </p>
        </div>
      </div>

      <Card className="glass-morphism">
        <CardContent className="p-6 space-y-4">
          {chat.messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <Avatar className="h-8 w-8 bg-health-purple flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-health-purple/30 text-white'
                    : 'glass-morphism'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(message.timestamp), 'h:mm a')}
                </p>
              </div>
              
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8 bg-health-blue flex items-center justify-center">
                  <User className="h-4 w-4" />
                </Avatar>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatHistoryDetail;
