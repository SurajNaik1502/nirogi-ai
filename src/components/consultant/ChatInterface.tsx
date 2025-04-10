
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot, Mic, Plus, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateHealthAdvice } from '@/services/geminiService';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      fetchChatHistory();
    } else {
      // Set default welcome message for not logged in users
      setMessages([
        {
          id: '1',
          content: "Hello! I'm your virtual health consultant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date(),
        }
      ]);
    }
  }, [user]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChatHistory = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('health_chats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length === 0) {
        // Add welcome message if no chat history
        const welcomeMessage = {
          id: '1',
          content: "Hello! I'm your virtual health consultant. How can I help you today?",
          sender: 'bot' as const,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        
        // Save welcome message to database
        await supabase.from('health_chats').insert({
          user_id: user.id,
          message: welcomeMessage.content,
          sender: welcomeMessage.sender
        });
      } else if (data) {
        // Format the retrieved messages
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          content: msg.message,
          sender: msg.sender as 'user' | 'bot',
          timestamp: new Date(msg.created_at)
        }));
        
        setMessages(formattedMessages);
      }
    } catch (error: any) {
      console.error('Error fetching chat history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat history',
        variant: 'destructive',
      });
    }
  };
  
  const saveMessageToDatabase = async (message: string, sender: 'user' | 'bot') => {
    if (!user) return;
    
    try {
      const { error } = await supabase.from('health_chats').insert({
        user_id: user.id,
        message,
        sender
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error saving message:', error);
      toast({
        title: 'Error',
        description: 'Failed to save message',
        variant: 'destructive',
      });
    }
  };

  const saveCurrentChat = async () => {
    if (!user || messages.length === 0) return;
    
    setIsSaving(true);
    try {
      // Create a title from the first user message or a default title
      const firstUserMessage = messages.find(msg => msg.sender === 'user');
      const chatTitle = firstUserMessage 
        ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
        : 'Health Consultation';
      
      // Format messages for saving to saved_chats table
      const formattedMessages = messages.map(msg => ({
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.timestamp.toISOString()
      }));
      
      const { error } = await supabase.from('saved_chats').insert({
        user_id: user.id,
        title: chatTitle,
        chat_date: new Date().toISOString(),
        messages: formattedMessages
      });
      
      if (error) throw error;
      
      toast({
        title: 'Chat Saved',
        description: 'Your consultation has been saved successfully',
      });
      
      // Navigate to chat history
      navigate('/chat-history');
    } catch (error: any) {
      console.error('Error saving chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to save consultation: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    saveMessageToDatabase(userMessage.content, 'user');
    setInput('');
    setIsLoading(true);
    
    try {
      // Get response from Gemini API
      const botResponse = await generateHealthAdvice(input);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      saveMessageToDatabase(botMessage.content, 'bot');
    } catch (error) {
      console.error('Error getting health advice:', error);
      toast({
        title: 'Error',
        description: 'Failed to get health advice. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] glass-morphism rounded-lg">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Health Consultant</h2>
          <p className="text-sm text-muted-foreground">Discuss your symptoms and get AI-powered health advice</p>
        </div>
        {user && messages.length > 0 && (
          <Button
            onClick={saveCurrentChat}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Chat'}
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
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
          
          {isLoading && (
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
          )}
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
    </div>
  );
};

export default ChatInterface;
