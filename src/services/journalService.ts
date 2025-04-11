
import { supabase } from '@/integrations/supabase/client';

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface JournalEntryInput {
  user_id: string;
  content: string;
}

// Fetch user's journal entries with optional limit
export const fetchJournalEntries = async (userId: string, limit?: number) => {
  try {
    let query = supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as unknown as JournalEntry[];
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }
};

// Create a new journal entry
export const createJournalEntry = async (entry: JournalEntryInput) => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert(entry)
      .select();
    
    if (error) throw error;
    
    return data[0] as unknown as JournalEntry;
  } catch (error) {
    console.error('Error creating journal entry:', error);
    throw error;
  }
};

// Delete a journal entry
export const deleteJournalEntry = async (id: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .match({ id, user_id: userId });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    throw error;
  }
};

// Get a specific journal entry
export const getJournalEntry = async (id: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .match({ id, user_id: userId })
      .single();
    
    if (error) throw error;
    
    return data as unknown as JournalEntry;
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    throw error;
  }
};
