
import { supabase } from "@/integrations/supabase/client";

export interface BreathingSession {
  id: string;
  user_id: string;
  duration_seconds: number;
  completed: boolean;
  created_at: string;
}

export const startBreathingSession = async (userId: string, durationSeconds: number): Promise<BreathingSession | null> => {
  const { data, error } = await supabase
    .from('breathing_sessions')
    .insert([{ 
      user_id: userId, 
      duration_seconds: durationSeconds,
      completed: true 
    }])
    .select()
    .single();

  if (error) {
    console.error('Error starting breathing session:', error);
    return null;
  }

  return data as BreathingSession;
};

export const getBreathingSessions = async (userId: string, limit = 10): Promise<BreathingSession[]> => {
  const { data, error } = await supabase
    .from('breathing_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching breathing sessions:', error);
    return [];
  }

  return data as BreathingSession[];
};

export const getTotalBreathingTime = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('breathing_sessions')
    .select('duration_seconds')
    .eq('user_id', userId)
    .eq('completed', true);

  if (error) {
    console.error('Error calculating total breathing time:', error);
    return 0;
  }

  return data.reduce((total, session) => total + session.duration_seconds, 0);
};
