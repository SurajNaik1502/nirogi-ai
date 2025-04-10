
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, Plus, Send } from 'lucide-react';

interface ChatInputAreaProps {
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({ isLoading, onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() === '' || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-white/10">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="rounded-full">
          <Plus className="h-4 w-4" />
        </Button>
        
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your symptoms or health question..."
          className="flex-1 bg-background/50"
          disabled={isLoading}
        />
        
        <Button variant="outline" size="icon" className="rounded-full">
          <Mic className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={handleSendMessage}
          size="icon"
          disabled={input.trim() === '' || isLoading}
          className={`rounded-full ${input.trim() === '' || isLoading ? 'bg-primary/50' : 'bg-health-blue hover:bg-health-blue/80'}`}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        This is not a substitute for professional medical advice, diagnosis, or treatment.
      </p>
    </div>
  );
};

export default ChatInputArea;
