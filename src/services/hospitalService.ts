
import { supabase } from '@/integrations/supabase/client';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string | null;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  specialties: string[] | null;
  created_at: string;
}

export const fetchHospitals = async () => {
  try {
    // Using a type assertion to handle the custom table
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .order('name') as any;
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    throw error;
  }
};

export const fetchHospitalsByCity = async (city: string) => {
  try {
    // Using a type assertion to handle the custom table
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .ilike('city', `%${city}%`)
      .order('name') as any;
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching hospitals by city:', error);
    throw error;
  }
};

export const fetchHospitalsBySpecialty = async (specialty: string) => {
  try {
    // Using a type assertion to handle the custom table
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .contains('specialties', [specialty])
      .order('name') as any;
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching hospitals by specialty:', error);
    throw error;
  }
};

export const fetchHospitalById = async (id: string) => {
  try {
    // Using a type assertion to handle the custom table
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('id', id)
      .single() as any;
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching hospital by id:', error);
    throw error;
  }
};
