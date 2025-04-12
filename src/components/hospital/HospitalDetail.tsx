
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Globe, Clock, Hospital as HospitalIcon, Bed, Building2, Star, PhoneCall } from 'lucide-react';
import { Hospital } from '@/services/hospitalService';
import HospitalMap from './HospitalMap';
import { toast } from 'sonner';

interface HospitalDetailProps {
  hospital: Hospital | null;
  parseSpecialities: (specialityString: string | null) => string[];
}

const HospitalDetail = ({ hospital, parseSpecialities }: HospitalDetailProps) => {
  const handleCallNow = () => {
    if (hospital?.phone) {
      window.location.href = `tel:${hospital.phone}`;
      toast.success('Calling hospital...');
    } else {
      toast.error('No phone number available for this hospital');
    }
  };

  if (!hospital) {
    return (
      <Card className="glass-morphism h-full">
        <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
          <Building2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-medium">No hospital selected</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            Select a hospital from the list to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle>{hospital.hospital_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-muted-foreground">Address</h3>
                <p className="font-medium">
                  {hospital.address}<br />
                  {hospital.city}{hospital.state ? `, ${hospital.state}` : ''} {hospital.postal_code || ''}
                </p>
              </div>
              
              <div className="space-y-2">
                {hospital.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${hospital.phone}`} className="hover:underline">
                      {hospital.phone}
                    </a>
                  </div>
                )}
                
                {hospital.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${hospital.email}`} className="hover:underline">
                      {hospital.email}
                    </a>
                  </div>
                )}
                
                {hospital.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
                
                {(hospital.opening_time || hospital.closing_time) && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {hospital.opening_time && hospital.closing_time
                        ? `${hospital.opening_time} - ${hospital.closing_time}`
                        : hospital.opening_time
                        ? `Opens at ${hospital.opening_time}`
                        : `Closes at ${hospital.closing_time}`}
                    </span>
                  </div>
                )}
                
                {hospital.beds_available && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span>Beds available: {hospital.beds_available}</span>
                  </div>
                )}

                <Button 
                  onClick={handleCallNow} 
                  className="w-full mt-4" 
                  disabled={!hospital.phone}
                  variant="default"
                >
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
              </div>
            </div>
            
            <div className="rounded-md overflow-hidden">
              {hospital.latitude && hospital.longitude ? (
                <HospitalMap hospital={hospital} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 aspect-video">
                  <div className="text-center">
                    <HospitalIcon className="h-12 w-12 mx-auto text-health-blue opacity-70 mb-2" />
                    <p className="text-sm">No location data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {hospital.speciality && parseSpecialities(hospital.speciality).length > 0 && (
            <div>
              <h3 className="text-sm text-muted-foreground mb-2">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {parseSpecialities(hospital.speciality).map((specialty, index) => (
                  <Badge key={index} className="bg-white/10 hover:bg-white/20 text-foreground">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="border-t border-white/10 pt-4">
            <h3 className="font-medium mb-2">Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="default">
                <Star className="mr-2 h-4 w-4" />
                Save to Favorites
              </Button>
              
              <Button variant="outline">
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalDetail;
