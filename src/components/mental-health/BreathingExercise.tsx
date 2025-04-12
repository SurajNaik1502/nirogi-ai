
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Play, Pause, RefreshCw, AlarmClock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { startBreathingSession, getBreathingSessions, BreathingSession } from '@/services/breathingService';

enum BreathingState {
  IDLE = 'idle',
  INHALE = 'inhale',
  HOLD = 'hold',
  EXHALE = 'exhale',
}

const INHALE_TIME = 4; // seconds
const HOLD_TIME = 2; // seconds
const EXHALE_TIME = 6; // seconds
const BREATHING_CYCLE = INHALE_TIME + HOLD_TIME + EXHALE_TIME; // 12 seconds
const SESSION_TIME = 5 * 60; // 5 minutes in seconds

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [breathingState, setBreathingState] = useState<BreathingState>(BreathingState.IDLE);
  const [secondsLeft, setSecondsLeft] = useState(SESSION_TIME);
  const [progress, setProgress] = useState(0);
  const [cycleProgress, setCycleProgress] = useState(0);
  const [breathingSessions, setBreathingSessions] = useState<BreathingSession[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadBreathingSessions();
    }
  }, [user]);

  const loadBreathingSessions = async () => {
    if (!user) return;
    const sessions = await getBreathingSessions(user.id);
    setBreathingSessions(sessions);
  };

  const startBreathing = () => {
    setIsActive(true);
    setBreathingState(BreathingState.INHALE);
    
    let timeElapsed = 0;
    let cycleTime = 0;

    intervalRef.current = setInterval(() => {
      cycleTime++;
      timeElapsed++;
      
      // Update overall session progress
      setSecondsLeft(SESSION_TIME - timeElapsed);
      setProgress((timeElapsed / SESSION_TIME) * 100);
      
      // Determine current phase in breathing cycle
      const cyclePosition = cycleTime % BREATHING_CYCLE;
      
      if (cyclePosition < INHALE_TIME) {
        setBreathingState(BreathingState.INHALE);
        setCycleProgress((cyclePosition / INHALE_TIME) * 100);
      } else if (cyclePosition < INHALE_TIME + HOLD_TIME) {
        setBreathingState(BreathingState.HOLD);
        setCycleProgress(((cyclePosition - INHALE_TIME) / HOLD_TIME) * 100);
      } else {
        setBreathingState(BreathingState.EXHALE);
        setCycleProgress(((cyclePosition - INHALE_TIME - HOLD_TIME) / EXHALE_TIME) * 100);
      }
      
      // Complete session after 5 minutes
      if (timeElapsed >= SESSION_TIME) {
        completeSession(timeElapsed);
      }
    }, 1000);
  };

  const completeSession = async (duration: number) => {
    pauseBreathing();
    
    if (!user) return;
    
    try {
      await startBreathingSession(user.id, duration);
      toast({ 
        title: "Breathing exercise completed!", 
        description: `You've completed a ${formatTime(duration)} breathing session.`
      });
      loadBreathingSessions();
    } catch (error) {
      console.error("Error saving breathing session:", error);
      toast({ 
        title: "Error saving session", 
        description: "There was a problem saving your breathing session.",
        variant: "destructive"
      });
    }
    
    resetBreathing();
  };

  const pauseBreathing = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
  };

  const resetBreathing = () => {
    pauseBreathing();
    setBreathingState(BreathingState.IDLE);
    setSecondsLeft(SESSION_TIME);
    setProgress(0);
    setCycleProgress(0);
  };

  const toggleBreathing = () => {
    if (isActive) {
      pauseBreathing();
    } else {
      startBreathing();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getInstructionText = () => {
    switch (breathingState) {
      case BreathingState.INHALE:
        return "Breathe In";
      case BreathingState.HOLD:
        return "Hold";
      case BreathingState.EXHALE:
        return "Breathe Out";
      default:
        return "Press Start";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlarmClock className="h-5 w-5 text-health-blue" />
            Breathing Exercise
          </CardTitle>
          <CardDescription>Follow the animation to practice deep breathing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-4 space-y-6">
            <div className="relative w-40 h-40 mb-4">
              <div className="absolute inset-0 bg-health-purple/20 rounded-full"></div>
              <div 
                className={`absolute inset-0 border-2 border-health-purple rounded-full transition-all duration-300 ${isActive ? 'animate-breathe' : ''}`}
                style={{
                  transform: breathingState === BreathingState.INHALE 
                    ? `scale(${1 + (cycleProgress / 200)})` 
                    : breathingState === BreathingState.EXHALE 
                      ? `scale(${1.5 - (cycleProgress / 200)})` 
                      : 'scale(1.5)'
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-lg font-medium">{getInstructionText()}</p>
              </div>
            </div>
            
            {isActive && (
              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Time Remaining</span>
                  <span>{formatTime(secondsLeft)}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            <div className="flex gap-3">
              <Button 
                onClick={toggleBreathing}
                variant="default"
                className="px-6"
              >
                {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isActive ? "Pause" : "Start"}
              </Button>
              
              <Button 
                onClick={resetBreathing}
                variant="outline"
                disabled={!isActive && secondsLeft === SESSION_TIME}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
            
            <p className="text-center text-sm max-w-md text-muted-foreground">
              Breathe in for 4 seconds, hold for 2 seconds, and exhale for 6 seconds. 
              Complete the 5-minute session to track your progress.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {breathingSessions.length > 0 && (
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="text-base">Recent Breathing Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
              {breathingSessions.map(session => (
                <div key={session.id} className="flex justify-between items-center p-2 rounded-md bg-white/5">
                  <span className="text-sm">
                    {format(new Date(session.created_at), 'MMM d, yyyy')} • {format(new Date(session.created_at), 'h:mm a')}
                  </span>
                  <span className="text-sm font-medium">{formatTime(session.duration_seconds)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BreathingExercise;
