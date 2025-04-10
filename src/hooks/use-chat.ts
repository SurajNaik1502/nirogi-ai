
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Message, fetchChatHistory, saveMessageToDatabase, getAIResponse } from '@/services/chatService';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadChatHistory();
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

  const loadChatHistory = async () => {
    if (!user) return;
    
    try {
      const data = await fetchChatHistory(user.id);
      
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
        await saveMessageToDatabase(user.id, welcomeMessage.content, welcomeMessage.sender);
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
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat history',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    if (user) {
      await saveMessageToDatabase(user.id, userMessage.content, userMessage.sender);
    }
    
    setIsLoading(true);
    
    try {
      // Get response from AI
      const botResponse = await getAIResponse(messageContent);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      if (user) {
        await saveMessageToDatabase(user.id, botMessage.content, botMessage.sender);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to get health advice. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
};
