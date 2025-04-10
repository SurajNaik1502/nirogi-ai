
import { supabase } from '@/integrations/supabase/client';

export interface SkinAnalysis {
  id: string;
  user_id: string;
  image_url: string | null;
  analysis_result: any;
  recommendations: string | null;
  created_at: string;
}

export const fetchSkinAnalyses = async (userId: string) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('skin_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching skin analyses:', error);
    throw error;
  }
};

export const fetchSkinAnalysis = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('skin_analyses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching skin analysis:', error);
    throw error;
  }
};

export const createSkinAnalysis = async (userId: string, analysis: Partial<SkinAnalysis>) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('skin_analyses')
      .insert({
        user_id: userId,
        image_url: analysis.image_url,
        analysis_result: analysis.analysis_result,
        recommendations: analysis.recommendations
      })
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error creating skin analysis:', error);
    throw error;
  }
};

export const deleteSkinAnalysis = async (id: string) => {
  try {
    const { error } = await supabase
      .from('skin_analyses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting skin analysis:', error);
    throw error;
  }
};
