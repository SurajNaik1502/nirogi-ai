
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getAIResponse, saveMessageToDatabase } from '@/services/chatService';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/services/chatService';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message to state
    setMessages((prev) => [...prev, userMessage]);

    // Save user message to database if user is authenticated
    if (user) {
      try {
        await saveMessageToDatabase(user.id, content, 'user');
      } catch (error) {
        console.error('Error saving user message:', error);
      }
    }

    // Set loading state for bot response
    setIsLoading(true);

    try {
      // Get AI response
      const botResponse = await getAIResponse(content);

      // Create bot message
      const botMessage: Message = {
        id: uuidv4(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      // Add bot message to state
      setMessages((prev) => [...prev, botMessage]);

      // Save bot message to database if user is authenticated
      if (user) {
        try {
          await saveMessageToDatabase(user.id, botResponse, 'bot');
        } catch (error) {
          console.error('Error saving bot message:', error);
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
};
