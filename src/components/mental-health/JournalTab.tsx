
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  createJournalEntry,
  JournalEntry,
  fetchJournalEntries
} from '@/services/journalService';
import { format } from 'date-fns';

const JournalTab: React.FC = () => {
  const [journalEntry, setJournalEntry] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadJournalEntries();
    }
  }, [user]);

  const loadJournalEntries = async () => {
    if (!user) return;
    
    try {
      const entries = await fetchJournalEntries(user.id, 10);
      setJournalEntries(entries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const handleJournalSubmit = async () => {
    if (!user || journalEntry.trim() === '') return;
    
    try {
      await createJournalEntry({
        user_id: user.id,
        content: journalEntry
      });
      
      toast({
        title: "Journal Entry Saved",
        description: "Your thoughts have been recorded successfully.",
      });
      
      setJournalEntry('');
      loadJournalEntries();
    } catch (error: any) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to save your journal entry. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookText className="h-5 w-5 text-health-purple" />
            Journal Entry
          </CardTitle>
          <CardDescription>Write down your thoughts and feelings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            value={journalEntry} 
            onChange={(e) => setJournalEntry(e.target.value)} 
            placeholder="How are you feeling today? What's on your mind?"
            className="min-h-[200px] bg-background/50"
          />
          <div className="flex justify-end">
            <Button onClick={handleJournalSubmit} disabled={journalEntry.trim() === ''}>
              Save Entry
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookText className="h-5 w-5 text-health-blue" />
            Recent Journal Entries
          </CardTitle>
          <CardDescription>Your previous thoughts and reflections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {journalEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No journal entries yet. Start writing your thoughts.</p>
            ) : (
              journalEntries.map(entry => (
                <div key={entry.id} className="p-3 border border-white/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    {format(new Date(entry.created_at), 'MMMM d, yyyy • h:mm a')}
                  </p>
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalTab;
