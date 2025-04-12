
import { useState, useEffect } from 'react';
import { 
  fetchHospitals,
  fetchHospitalsByCity,
  fetchHospitalsBySpecialty,
  Hospital
} from '@/services/hospitalService';
import { useToast } from '@/hooks/use-toast';

export const useHospitalSearch = () => {
  const { toast } = useToast();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'city' | 'specialty'>('name');

  const loadHospitals = async () => {
    try {
      setLoading(true);
      const data = await fetchHospitals();
      if (data) {
        setHospitals(data as Hospital[]);
        setFilteredHospitals(data as Hospital[]);
      }
    } catch (error) {
      console.error('Error loading hospitals:', error);
      toast({
        title: "Error",
        description: "Failed to load hospital data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredHospitals(hospitals);
      return;
    }
    
    setLoading(true);
    try {
      let results;
      if (searchType === 'city') {
        results = await fetchHospitalsByCity(searchTerm);
      } else if (searchType === 'specialty') {
        results = await fetchHospitalsBySpecialty(searchTerm);
      } else {
        // Search by name (client-side filtering)
        results = hospitals.filter(hospital => 
          hospital.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (results) {
        setFilteredHospitals(results as Hospital[]);
      }
    } catch (error) {
      console.error('Error searching hospitals:', error);
      toast({
        title: "Error",
        description: "Failed to search hospitals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset search results
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredHospitals(hospitals);
  };

  return {
    hospitals,
    filteredHospitals,
    loading,
    selectedHospital,
    searchTerm,
    searchType,
    setSelectedHospital,
    setSearchTerm,
    setSearchType,
    handleSearch,
    clearSearch
  };
};
