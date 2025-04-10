
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, MapPin, Phone, Mail, Globe, Star, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchHospitals, fetchHospitalsByCity, Hospital } from '@/services/hospitalService';

const HospitalTracker = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const { toast } = useToast();

  const loadHospitals = async () => {
    try {
      setLoading(true);
      const data = await fetchHospitals();
      if (data) {
        setHospitals(data);
        setFilteredHospitals(data);
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
    if (!searchQuery.trim()) {
      setFilteredHospitals(hospitals);
      return;
    }

    try {
      setLoading(true);
      const data = await fetchHospitalsByCity(searchQuery);
      setFilteredHospitals(data || []);
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

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospital Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Find hospitals and healthcare facilities near you
          </p>
        </div>

        <Card className="glass-morphism">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by city, name, or specialty"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} className="md:w-auto">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Nearby Hospitals</CardTitle>
              </CardHeader>
              <CardContent className="p-0 max-h-[500px] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                ) : filteredHospitals.length === 0 ? (
                  <div className="text-center py-12 px-6">
                    <MapPin className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-medium">No hospitals found</h3>
                    <p className="text-muted-foreground mt-2">
                      {searchQuery ? `No hospitals found matching "${searchQuery}"` : "Try searching for hospitals by city or name"}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {filteredHospitals.map(hospital => (
                      <div 
                        key={hospital.id}
                        className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${
                          selectedHospital?.id === hospital.id ? 'bg-white/5' : ''
                        }`}
                        onClick={() => setSelectedHospital(hospital)}
                      >
                        <h4 className="font-medium">{hospital.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {hospital.city}, {hospital.state || ''}
                          </span>
                        </div>
                        {hospital.specialties && hospital.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {hospital.specialties.slice(0, 3).map((specialty, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white/10"
                              >
                                {specialty}
                              </span>
                            ))}
                            {hospital.specialties.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white/10">
                                +{hospital.specialties.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            {selectedHospital ? (
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>{selectedHospital.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="aspect-video relative overflow-hidden rounded-md border border-white/10">
                      {/* Placeholder for map, would use a mapping service in a real implementation */}
                      <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="h-12 w-12 mx-auto text-health-blue mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Map view would be displayed here
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Contact Information</h3>
                          <div className="space-y-2 mt-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {selectedHospital.address}, {selectedHospital.city}, {selectedHospital.state} {selectedHospital.postal_code}
                              </span>
                            </div>
                            
                            {selectedHospital.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{selectedHospital.phone}</span>
                              </div>
                            )}
                            
                            {selectedHospital.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{selectedHospital.email}</span>
                              </div>
                            )}
                            
                            {selectedHospital.website && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <a href={selectedHospital.website} target="_blank" rel="noopener noreferrer" className="text-sm text-health-blue hover:underline">
                                  Visit Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          Get Directions
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Specialties</h3>
                          {selectedHospital.specialties && selectedHospital.specialties.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {selectedHospital.specialties.map((specialty, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white/10"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-2">
                              No specialties listed
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium">Ratings & Reviews</h3>
                          <div className="flex items-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                              />
                            ))}
                            <span className="text-sm ml-2">4.0 (254 reviews)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button className="w-full">
                        Schedule Appointment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-morphism h-full">
                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <MapPin className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-medium">No hospital selected</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Select a hospital from the list to view detailed information
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HospitalTracker;
