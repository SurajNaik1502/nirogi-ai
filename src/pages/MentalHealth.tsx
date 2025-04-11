import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookText, 
  Music, 
  AlarmClock,
  Calendar,
  Brain,
  Smile,
  Meh,
  Frown,
  Play,
  Pause,
  SmilePlus,
  Angry,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  createMoodEntry,
  canAddMoodEntry,
  getLatestMoodEntry,
  MoodEntry
} from '@/services/moodService';
import {
  createJournalEntry,
  JournalEntry,
  fetchJournalEntries
} from '@/services/journalService';
import { format, formatDistanceToNow } from 'date-fns';

const MentalHealth: React.FC = () => {
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canSelectMood, setCanSelectMood] = useState(true);
  const [moodTimeRemaining, setMoodTimeRemaining] = useState<string | null>(null);
  const [lastEntry, setLastEntry] = useState<MoodEntry | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkMoodStatus();
      loadJournalEntries();
    }
  }, [user]);

  const checkMoodStatus = async () => {
    if (!user) return;
    
    try {
      const canAdd = await canAddMoodEntry(user.id);
      setCanSelectMood(canAdd);
      
      const latest = await getLatestMoodEntry(user.id);
      setLastEntry(latest);
      
      if (latest && !canAdd) {
        const entryDate = new Date(latest.created_at);
        const nextAllowedTime = new Date(entryDate);
        nextAllowedTime.setHours(nextAllowedTime.getHours() + 1);
        
        const timeRemaining = formatDistanceToNow(nextAllowedTime, { addSuffix: true });
        setMoodTimeRemaining(`You can select another mood ${timeRemaining}`);
        setSelectedMood(latest.mood);
      }
    } catch (error) {
      console.error('Error checking mood status:', error);
    }
  };

  const loadJournalEntries = async () => {
    if (!user) return;
    
    try {
      const entries = await fetchJournalEntries(user.id, 10);
      setJournalEntries(entries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const handleMoodSelect = async (mood: string) => {
    if (!user || !canSelectMood) return;
    
    try {
      const { data, error } = await createMoodEntry({
        user_id: user.id,
        mood: mood
      });
      
      if (error) {
        toast({
          title: "Cannot Add Mood",
          description: error,
          variant: "destructive"
        });
        return;
      }
      
      if (data) {
        setSelectedMood(mood);
        setCanSelectMood(false);
        await checkMoodStatus();
        
        toast({
          title: "Mood Tracked",
          description: `You're feeling ${mood} today. Noted!`,
        });
      }
    } catch (error: any) {
      console.error('Error saving mood:', error);
      toast({
        title: "Error",
        description: "Failed to save your mood. Please try again.",
        variant: "destructive"
      });
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

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'Very Happy':
        return <SmilePlus className="h-12 w-12 text-green-400 mb-2" />;
      case 'Happy':
        return <Smile className="h-12 w-12 text-green-300 mb-2" />;
      case 'Neutral':
        return <Meh className="h-12 w-12 text-yellow-400 mb-2" />;
      case 'Sad':
        return <Frown className="h-12 w-12 text-red-400 mb-2" />;
      case 'Angry':
        return <Angry className="h-12 w-12 text-red-500 mb-2" />;
      case 'Irritated':
        return <AlertCircle className="h-12 w-12 text-orange-400 mb-2" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mental Health</h1>
          <p className="text-muted-foreground mt-1">Track your mood, journal your thoughts, and practice mindfulness</p>
        </div>

        {/* Daily Mood Tracker */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-health-pink" />
              Daily Mood Check-in
            </CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
            {moodTimeRemaining && !canSelectMood && (
              <p className="text-sm text-muted-foreground">{moodTimeRemaining}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4 py-4">
              <Button 
                variant="outline" 
                className={`flex flex-col items-center p-4 h-auto ${selectedMood === 'Very Happy' ? 'ring-2 ring-health-blue' : ''}`}
                onClick={() => handleMoodSelect('Very Happy')}
                disabled={!canSelectMood}
              >
                <SmilePlus className="h-12 w-12 text-green-400 mb-2" />
                <span>Very Happy</span>
              </Button>
              
              <Button 
                variant="outline" 
                className={`flex flex-col items-center p-4 h-auto ${selectedMood === 'Happy' ? 'ring-2 ring-health-blue' : ''}`}
                onClick={() => handleMoodSelect('Happy')}
                disabled={!canSelectMood}
              >
                <Smile className="h-12 w-12 text-green-300 mb-2" />
                <span>Happy</span>
              </Button>
              
              <Button 
                variant="outline" 
                className={`flex flex-col items-center p-4 h-auto ${selectedMood === 'Neutral' ? 'ring-2 ring-health-blue' : ''}`}
                onClick={() => handleMoodSelect('Neutral')}
                disabled={!canSelectMood}
              >
                <Meh className="h-12 w-12 text-yellow-400 mb-2" />
                <span>Neutral</span>
              </Button>
              
              <Button 
                variant="outline" 
                className={`flex flex-col items-center p-4 h-auto ${selectedMood === 'Sad' ? 'ring-2 ring-health-blue' : ''}`}
                onClick={() => handleMoodSelect('Sad')}
                disabled={!canSelectMood}
              >
                <Frown className="h-12 w-12 text-red-400 mb-2" />
                <span>Sad</span>
              </Button>
              
              <Button 
                variant="outline" 
                className={`flex flex-col items-center p-4 h-auto ${selectedMood === 'Angry' ? 'ring-2 ring-health-blue' : ''}`}
                onClick={() => handleMoodSelect('Angry')}
                disabled={!canSelectMood}
              >
                <Angry className="h-12 w-12 text-red-500 mb-2" />
                <span>Angry</span>
              </Button>
              
              <Button 
                variant="outline" 
                className={`flex flex-col items-center p-4 h-auto ${selectedMood === 'Irritated' ? 'ring-2 ring-health-blue' : ''}`}
                onClick={() => handleMoodSelect('Irritated')}
                disabled={!canSelectMood}
              >
                <AlertCircle className="h-12 w-12 text-orange-400 mb-2" />
                <span>Irritated</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="journal">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="breathing">Breathing</TabsTrigger>
            <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="journal" className="pt-4">
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
                    <Calendar className="h-5 w-5 text-health-blue" />
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
          </TabsContent>
          
          <TabsContent value="breathing" className="pt-4">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlarmClock className="h-5 w-5 text-health-blue" />
                  Breathing Exercise
                </CardTitle>
                <CardDescription>Follow the animation to practice deep breathing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-8">
                  <div className="relative w-40 h-40 mb-8">
                    <div className="absolute inset-0 bg-health-purple/20 rounded-full"></div>
                    <div className="absolute inset-0 border-2 border-health-purple rounded-full animate-breathe"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Breathe in</p>
                        <p className="text-sm text-muted-foreground">Hold</p>
                        <p className="text-sm text-muted-foreground">Breathe out</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm max-w-md text-muted-foreground">
                    Breathe in for 4 seconds, hold for 2 seconds, and exhale for 6 seconds. 
                    Repeat this exercise for 5 minutes to reduce stress and anxiety.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="relaxation" className="pt-4">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-health-orange" />
                  Relaxation Music
                </CardTitle>
                <CardDescription>Listen to calming sounds to reduce stress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="neo-blur">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="bg-gradient-to-r from-health-blue to-health-purple h-16 w-16 rounded-md flex items-center justify-center">
                        {isPlaying ? (
                          <Pause 
                            className="h-8 w-8 text-white" 
                            onClick={togglePlay} 
                          />
                        ) : (
                          <Play 
                            className="h-8 w-8 text-white" 
                            onClick={togglePlay} 
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">Calm Forest Sounds</h3>
                        <p className="text-sm text-muted-foreground">5:32</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="neo-blur">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="bg-gradient-to-r from-health-pink to-health-purple h-16 w-16 rounded-md flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Ocean Waves</h3>
                        <p className="text-sm text-muted-foreground">7:15</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="neo-blur">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="bg-gradient-to-r from-health-orange to-health-pink h-16 w-16 rounded-md flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Meditation Music</h3>
                        <p className="text-sm text-muted-foreground">10:05</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="neo-blur">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="bg-gradient-to-r from-health-blue to-health-orange h-16 w-16 rounded-md flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Rain Sounds</h3>
                        <p className="text-sm text-muted-foreground">8:45</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick SOS Button */}
        <div className="fixed bottom-6 right-6">
          <Button 
            variant="destructive" 
            size="lg" 
            className="rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            SOS Emergency
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default MentalHealth;
