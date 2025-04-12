
import React from 'react';
import { Hospital } from '@/services/hospitalService';
import { Building2 } from 'lucide-react';

interface HospitalMapProps {
  hospital: Hospital;
}

const HospitalMap = ({ hospital }: HospitalMapProps) => {
  if (!hospital.latitude || !hospital.longitude) {
    return (
      <div className="rounded-md overflow-hidden bg-black/20 flex items-center justify-center h-48">
        <p>No location data available for this hospital</p>
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden aspect-video bg-black/20 w-full flex items-center justify-center">
      <div className="text-center">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Map view temporarily disabled</p>
        <p className="text-xs text-muted-foreground">Location: {hospital.latitude.toFixed(4)}, {hospital.longitude.toFixed(4)}</p>
      </div>
    </div>
  );
};

export default HospitalMap;
