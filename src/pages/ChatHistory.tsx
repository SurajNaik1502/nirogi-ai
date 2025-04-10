
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import ChatHistoryDetail from '@/components/consultant/ChatHistoryDetail';

interface ChatMessage {
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface SavedChat {
  id: string;
  title: string;
  chat_date: string;
  user_id: string;
  messages: ChatMessage[];
}

const ChatHistory = () => {
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState<SavedChat | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSavedChats();
    }
  }, [user]);

  const fetchSavedChats = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('saved_chats')
        .select('*')
        .eq('user_id', user.id)
        .order('chat_date', { ascending: false });

      if (error) throw error;
      setSavedChats(data || []);
    } catch (error: any) {
      console.error('Error fetching saved chats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load saved consultations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_chats')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedChats(savedChats.filter(chat => chat.id !== id));
      if (selectedChat?.id === id) {
        setSelectedChat(null);
      }

      toast({
        title: 'Chat Deleted',
        description: 'The consultation has been deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete consultation',
        variant: 'destructive',
      });
    }
  };

  const filteredChats = savedChats.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultation History</h1>
          <p className="text-muted-foreground mt-1">
            Review your past health consultations
          </p>
        </div>

        {selectedChat ? (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={() => setSelectedChat(null)}
              className="mb-4"
            >
              Back to All Consultations
            </Button>
            <ChatHistoryDetail chat={selectedChat} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search consultations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoading ? (
              <div className="h-60 flex items-center justify-center">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            ) : filteredChats.length === 0 ? (
              <Card className="glass-morphism">
                <CardContent className="flex flex-col items-center justify-center h-60 p-6">
                  <Calendar className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-medium text-center">No saved consultations</h3>
                  <p className="text-muted-foreground text-center mt-2">
                    {searchTerm ? 'No consultations match your search' : 'Your saved consultations will appear here'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredChats.map(chat => (
                  <Card key={chat.id} className="glass-morphism overflow-hidden hover:bg-white/5 transition-colors">
                    <CardContent className="p-0">
                      <button
                        onClick={() => setSelectedChat(chat)}
                        className="w-full text-left p-4 cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-medium text-lg line-clamp-1">{chat.title}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{format(new Date(chat.chat_date), 'MMMM d, yyyy')}</span>
                              <Clock className="h-3.5 w-3.5 ml-2" />
                              <span>{format(new Date(chat.chat_date), 'h:mm a')}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(chat.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChatHistory;
