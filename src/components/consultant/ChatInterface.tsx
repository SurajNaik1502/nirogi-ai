
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/hooks/use-chat';
import { saveChatToHistory } from '@/services/chatService';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ChatInputArea from './ChatInputArea';

const ChatInterface: React.FC = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSaveChat = async () => {
    if (!user || messages.length === 0) return;
    
    setIsSaving(true);
    try {
      await saveChatToHistory(user.id, messages);
      
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
  
  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] glass-morphism rounded-lg">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Health Consultant</h2>
          <p className="text-sm text-muted-foreground">Discuss your symptoms and get AI-powered health advice</p>
        </div>
        {user && messages.length > 0 && (
          <Button
            onClick={handleSaveChat}
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
            <ChatMessage
              key={message.id}
              id={message.id}
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
            />
          ))}
          
          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>
      
      <ChatInputArea 
        isLoading={isLoading}
        onSendMessage={sendMessage}
      />
    </div>
  );
};

export default ChatInterface;
