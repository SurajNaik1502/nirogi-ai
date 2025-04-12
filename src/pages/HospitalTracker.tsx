
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useHospitalSearch } from '@/hooks/useHospitalSearch';
import { parseSpecialities } from '@/utils/specialtyParser';
import SearchBar from '@/components/hospital/SearchBar';
import HospitalList from '@/components/hospital/HospitalList';
import HospitalDetail from '@/components/hospital/HospitalDetail';

const HospitalTracker = () => {
  const {
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
  } = useHospitalSearch();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospital Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Find hospitals and healthcare facilities near you
          </p>
        </div>
        
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchType={searchType}
          setSearchType={setSearchType}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="glass-morphism rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">Hospitals</h3>
              </div>
              <div className="p-0 max-h-[600px] overflow-y-auto">
                <HospitalList
                  hospitals={filteredHospitals}
                  loading={loading}
                  selectedHospitalId={selectedHospital?.id || null}
                  onSelectHospital={setSelectedHospital}
                  parseSpecialities={parseSpecialities}
                />
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <HospitalDetail 
              hospital={selectedHospital}
              parseSpecialities={parseSpecialities}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HospitalTracker;
