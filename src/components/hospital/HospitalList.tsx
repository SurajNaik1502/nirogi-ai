
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2 } from 'lucide-react';
import { Hospital } from '@/services/hospitalService';

interface HospitalListProps {
  hospitals: Hospital[];
  loading: boolean;
  selectedHospitalId: string | null;
  onSelectHospital: (hospital: Hospital) => void;
  parseSpecialities: (specialityString: string | null) => string[];
}

const HospitalList = ({ 
  hospitals, 
  loading, 
  selectedHospitalId, 
  onSelectHospital,
  parseSpecialities
}: HospitalListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex space-x-2">
          <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <div className="text-center py-12 px-6">
        <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-medium">No hospitals found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/10">
      {hospitals.map(hospital => (
        <button
          key={hospital.id}
          className={`w-full text-left p-4 hover:bg-white/5 transition-colors ${
            selectedHospitalId === hospital.id ? 'bg-white/5' : ''
          }`}
          onClick={() => onSelectHospital(hospital)}
        >
          <h3 className="font-medium">{hospital.hospital_name}</h3>
          <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{hospital.city}{hospital.state ? `, ${hospital.state}` : ''}</span>
          </div>
          {hospital.speciality && (
            <div className="flex flex-wrap gap-1 mt-2">
              {parseSpecialities(hospital.speciality).slice(0, 2).map((specialty, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {parseSpecialities(hospital.speciality).length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{parseSpecialities(hospital.speciality).length - 2} more
                </Badge>
              )}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default HospitalList;
