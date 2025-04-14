
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Brain,
  SmilePlus,
  Smile,
  Meh,
  Frown,
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
import { formatDistanceToNow } from 'date-fns';

const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [canSelectMood, setCanSelectMood] = useState(true);
  const [moodTimeRemaining, setMoodTimeRemaining] = useState<string | null>(null);
  const [lastEntry, setLastEntry] = useState<MoodEntry | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkMoodStatus();
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

  return (
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
  );
};

export default MoodTracker;
