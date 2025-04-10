
import { supabase } from '@/integrations/supabase/client';
import { generateHealthAdvice } from './geminiService';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const fetchChatHistory = async (userId: string) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('health_chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

export const saveMessageToDatabase = async (
  userId: string,
  message: string,
  sender: 'user' | 'bot'
) => {
  if (!userId) return null;
  
  try {
    const { error, data } = await supabase.from('health_chats').insert({
      user_id: userId,
      message,
      sender
    }).select();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const saveChatToHistory = async (
  userId: string,
  messages: Message[]
) => {
  if (!userId || messages.length === 0) return null;
  
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
    
    const { error, data } = await supabase.from('saved_chats').insert({
      user_id: userId,
      title: chatTitle,
      chat_date: new Date().toISOString(),
      messages: formattedMessages
    }).select();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error saving chat:', error);
    throw error;
  }
};

export const getAIResponse = async (userMessage: string) => {
  try {
    return await generateHealthAdvice(userMessage);
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error;
  }
};
