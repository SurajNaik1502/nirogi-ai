
import { supabase } from '@/integrations/supabase/client';

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  taken_at: string;
  created_at: string;
}

export const fetchMedications = async (userId: string) => {
  if (!userId) return null;
  
  try {
    // Using a type assertion to handle the custom table
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }) as any;
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching medications:', error);
    throw error;
  }
};

export const fetchMedicationLogs = async (medicationId: string) => {
  try {
    // Using a type assertion to handle the custom table
    const { data, error } = await supabase
      .from('medication_logs')
      .select('*')
      .eq('medication_id', medicationId)
      .order('taken_at', { ascending: false }) as any;
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching medication logs:', error);
    throw error;
  }
};

export const createMedication = async (userId: string, medication: Partial<Medication>) => {
  if (!userId) return null;
  
  try {
    // Using a type assertion to handle the custom table
    const { data, error } = await supabase
      .from('medications')
      .insert({
        user_id: userId,
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        start_date: medication.start_date,
        end_date: medication.end_date,
        notes: medication.notes
      })
      .select() as any;
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error creating medication:', error);
    throw error;
  }
};

export const logMedicationTaken = async (medicationId: string, takenAt: string) => {
  try {
    // Using a type assertion to handle the custom table
    const { data, error } = await supabase
      .from('medication_logs')
      .insert({
        medication_id: medicationId,
        taken_at: takenAt
      })
      .select() as any;
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error logging medication:', error);
    throw error;
  }
};

export const deleteMedication = async (id: string) => {
  try {
    // Using a type assertion to handle the custom table
    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', id) as any;
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw error;
  }
};
