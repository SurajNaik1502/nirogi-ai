
import { supabase } from '@/integrations/supabase/client';

export interface MedicalReport {
  id: string;
  user_id: string;
  report_type: string;
  report_date: string;
  file_url: string | null;
  analysis_result: any;
  notes: string | null;
  created_at: string;
}

export const fetchMedicalReports = async (userId: string) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('medical_reports')
      .select('*')
      .eq('user_id', userId)
      .order('report_date', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching medical reports:', error);
    throw error;
  }
};

export const fetchMedicalReport = async (reportId: string) => {
  try {
    const { data, error } = await supabase
      .from('medical_reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching medical report:', error);
    throw error;
  }
};

export const createMedicalReport = async (userId: string, report: Partial<MedicalReport>) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('medical_reports')
      .insert({
        user_id: userId,
        report_type: report.report_type,
        report_date: report.report_date,
        file_url: report.file_url,
        analysis_result: report.analysis_result,
        notes: report.notes
      })
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error creating medical report:', error);
    throw error;
  }
};

export const updateMedicalReport = async (reportId: string, updates: Partial<MedicalReport>) => {
  try {
    const { data, error } = await supabase
      .from('medical_reports')
      .update(updates)
      .eq('id', reportId)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error updating medical report:', error);
    throw error;
  }
};

export const deleteMedicalReport = async (reportId: string) => {
  try {
    const { error } = await supabase
      .from('medical_reports')
      .delete()
      .eq('id', reportId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting medical report:', error);
    throw error;
  }
};
