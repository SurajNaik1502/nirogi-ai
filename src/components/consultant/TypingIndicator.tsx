
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 justify-start">
      <Avatar className="h-8 w-8 bg-health-purple flex items-center justify-center">
        <Bot className="h-4 w-4" />
      </Avatar>
      <div className="glass-morphism max-w-[80%] rounded-lg p-3">
        <div className="flex space-x-2">
          <div className="h-2 w-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
