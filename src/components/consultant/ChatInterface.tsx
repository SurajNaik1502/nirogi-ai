
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot, Mic, Plus } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your virtual health consultant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    
    // Simulate bot response (in a real app, this would call your Gemini API)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand you're experiencing these symptoms. Based on the information you've provided, it could be related to seasonal allergies. Would you like me to provide some self-care tips or recommend when you should see a doctor?",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] glass-morphism rounded-lg">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-semibold">Health Consultant</h2>
        <p className="text-sm text-muted-foreground">Discuss your symptoms and get AI-powered health advice</p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
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
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8 bg-health-blue flex items-center justify-center">
                  <User className="h-4 w-4" />
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
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
          />
          
          <Button variant="outline" size="icon" className="rounded-full">
            <Mic className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={handleSendMessage}
            size="icon"
            disabled={input.trim() === ''}
            className={`rounded-full ${input.trim() === '' ? 'bg-primary/50' : 'bg-health-blue hover:bg-health-blue/80'}`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          This is not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
