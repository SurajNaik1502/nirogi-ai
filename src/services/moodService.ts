
import { supabase } from '@/integrations/supabase/client';

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: string;
  created_at: string;
}

export interface MoodEntryInput {
  user_id: string;
  mood: string;
}

// Fetch user's mood entries with optional limit
export const fetchMoodEntries = async (userId: string, limit?: number) => {
  try {
    let query = supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as unknown as MoodEntry[];
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    throw error;
  }
};

// Create a new mood entry
export const createMoodEntry = async (entry: MoodEntryInput) => {
  try {
    // Check if user has already created a mood entry in the last hour
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const { data: recentEntries, error: checkError } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', entry.user_id)
      .gte('created_at', oneHourAgo.toISOString())
      .order('created_at', { ascending: false });
    
    if (checkError) throw checkError;
    
    // If there's a recent entry, return null to indicate user can't add another yet
    if (recentEntries && recentEntries.length > 0) {
      return { data: null, error: "You can only add one mood entry per hour" };
    }
    
    // If no recent entry, add the new one
    const { data, error } = await supabase
      .from('mood_entries')
      .insert(entry)
      .select();
    
    if (error) throw error;
    
    return { data: data[0] as unknown as MoodEntry, error: null };
  } catch (error) {
    console.error('Error creating mood entry:', error);
    throw error;
  }
};

// Get the latest mood entry
export const getLatestMoodEntry = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    return data.length > 0 ? (data[0] as unknown as MoodEntry) : null;
  } catch (error) {
    console.error('Error fetching latest mood entry:', error);
    throw error;
  }
};

// Check if user can add a new mood entry (hasn't added one in the last hour)
export const canAddMoodEntry = async (userId: string) => {
  try {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', oneHourAgo.toISOString())
      .limit(1);
    
    if (error) throw error;
    
    return data.length === 0;
  } catch (error) {
    console.error('Error checking if user can add mood entry:', error);
    throw error;
  }
};
