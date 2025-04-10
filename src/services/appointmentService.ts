
import { supabase } from '@/integrations/supabase/client';

export interface Appointment {
  id: string;
  user_id: string;
  doctor_name: string;
  doctor_specialty: string | null;
  hospital_name: string | null;
  datetime: string;
  notes: string | null;
  status: string;
  created_at: string;
}

export const fetchAppointments = async (userId: string) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('datetime', { ascending: true });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const createAppointment = async (userId: string, appointment: Partial<Appointment>) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: userId,
        doctor_name: appointment.doctor_name,
        doctor_specialty: appointment.doctor_specialty,
        hospital_name: appointment.hospital_name,
        datetime: appointment.datetime,
        notes: appointment.notes,
        status: appointment.status || 'scheduled'
      })
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const updateAppointment = async (id: string, appointment: Partial<Appointment>) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointment)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

export const deleteAppointment = async (id: string) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};
