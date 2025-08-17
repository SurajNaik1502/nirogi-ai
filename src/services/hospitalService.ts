
import { supabase } from '@/integrations/supabase/client';

export interface Hospital {
  id: string;
  hospital_name: string;
  address: string;
  city: string;
  state: string | null;
  phone: string | null;
  email: string | null;
  speciality: string | null;
  created_at: string;
  opening_time: string | null;
  closing_time: string | null;
  beds_available: string | null;
}

// Filter sensitive information for anonymous users
const filterSensitiveData = (hospitals: Hospital[], isAuthenticated: boolean): Hospital[] => {
  if (isAuthenticated) {
    return hospitals;
  }
  
  // Remove sensitive contact information for anonymous users
  return hospitals.map(hospital => ({
    ...hospital,
    phone: null,
    email: null,
  }));
};

export const fetchHospitals = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const isAuthenticated = !!user;
    
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .order('hospital_name');
    
    if (error) throw error;
    
    return data ? filterSensitiveData(data as Hospital[], isAuthenticated) : data;
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    throw error;
  }
};

export const fetchHospitalsByCity = async (city: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const isAuthenticated = !!user;
    
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .ilike('city', `%${city}%`)
      .order('hospital_name');
    
    if (error) throw error;
    
    return data ? filterSensitiveData(data as Hospital[], isAuthenticated) : data;
  } catch (error) {
    console.error('Error fetching hospitals by city:', error);
    throw error;
  }
};

export const fetchHospitalsBySpecialty = async (specialty: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const isAuthenticated = !!user;
    
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .contains('speciality', [specialty])
      .order('hospital_name');
    
    if (error) throw error;
    
    return data ? filterSensitiveData(data as Hospital[], isAuthenticated) : data;
  } catch (error) {
    console.error('Error fetching hospitals by specialty:', error);
    throw error;
  }
};

export const fetchHospitalById = async (id: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const isAuthenticated = !!user;
    
    const { data, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    
    return data ? filterSensitiveData([data as Hospital], isAuthenticated)[0] : data;
  } catch (error) {
    console.error('Error fetching hospital by id:', error);
    throw error;
  }
};
