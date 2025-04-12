
import { supabase } from '@/integrations/supabase/client';

export interface Hospital {
  id: string;
  hospital_name: string;
  address: string;
  city: string;
  state: string | null;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  speciality: string | null;
  created_at: string;
  opening_time: string | null;
  closing_time: string | null;
  beds_available: string | null;
}

export const fetchHospitals = async () => {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .order('hospital_name');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    throw error;
  }
};

export const fetchHospitalsByCity = async (city: string) => {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .ilike('city', `%${city}%`)
      .order('hospital_name');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching hospitals by city:', error);
    throw error;
  }
};

export const fetchHospitalsBySpecialty = async (specialty: string) => {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .contains('speciality', [specialty])
      .order('hospital_name');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching hospitals by specialty:', error);
    throw error;
  }
};

export const fetchHospitalById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching hospital by id:', error);
    throw error;
  }
};
