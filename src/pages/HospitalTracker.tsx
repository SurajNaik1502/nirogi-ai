
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchHospitals, fetchHospitalsByCity, fetchHospitalsBySpecialty, Hospital } from '@/services/hospitalService';
import { Search, MapPin, Phone, Mail, Globe, Building2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const HospitalTracker = () => {
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
          hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search hospitals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              <div className="flex gap-2">
                <Tabs 
                  defaultValue="name" 
                  className="w-full md:w-auto"
                  onValueChange={(value) => setSearchType(value as 'name' | 'city' | 'specialty')}
                >
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="name">Name</TabsTrigger>
                    <TabsTrigger value="city">City</TabsTrigger>
                    <TabsTrigger value="specialty">Specialty</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                
                {searchTerm && (
                  <Button variant="ghost" onClick={clearSearch}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Hospitals</CardTitle>
              </CardHeader>
              <CardContent className="p-0 max-h-[600px] overflow-y-auto">
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
                    <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-medium">No hospitals found</h3>
                    <p className="text-muted-foreground mt-2">
                      Try adjusting your search criteria
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {filteredHospitals.map(hospital => (
                      <button
                        key={hospital.id}
                        className={`w-full text-left p-4 hover:bg-white/5 transition-colors ${
                          selectedHospital?.id === hospital.id ? 'bg-white/5' : ''
                        }`}
                        onClick={() => setSelectedHospital(hospital)}
                      >
                        <h3 className="font-medium">{hospital.name}</h3>
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{hospital.city}{hospital.state ? `, ${hospital.state}` : ''}</span>
                        </div>
                        {hospital.specialties && hospital.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {hospital.specialties.slice(0, 2).map((specialty, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {hospital.specialties.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{hospital.specialties.length - 2} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </button>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm text-muted-foreground">Address</h3>
                          <p className="font-medium">
                            {selectedHospital.address}<br />
                            {selectedHospital.city}{selectedHospital.state ? `, ${selectedHospital.state}` : ''} {selectedHospital.postal_code || ''}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          {selectedHospital.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <a href={`tel:${selectedHospital.phone}`} className="hover:underline">
                                {selectedHospital.phone}
                              </a>
                            </div>
                          )}
                          
                          {selectedHospital.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <a href={`mailto:${selectedHospital.email}`} className="hover:underline">
                                {selectedHospital.email}
                              </a>
                            </div>
                          )}
                          
                          {selectedHospital.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <a href={selectedHospital.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                Visit Website
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="rounded-md overflow-hidden aspect-video bg-black/20 flex items-center justify-center">
                        {selectedHospital.latitude && selectedHospital.longitude ? (
                          <div className="w-full h-full">
                            {/* In a production app, this would be a map component */}
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                              <div className="text-center">
                                <MapPin className="h-12 w-12 mx-auto text-health-blue opacity-70 mb-2" />
                                <p className="text-sm">Map location: {selectedHospital.latitude.toFixed(4)}, {selectedHospital.longitude.toFixed(4)}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                            <p className="text-muted-foreground">Map location not available</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedHospital.specialties && selectedHospital.specialties.length > 0 && (
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-2">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedHospital.specialties.map((specialty, index) => (
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
            ) : (
              <Card className="glass-morphism h-full">
                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <Building2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-medium">No hospital selected</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Select a hospital from the list to view details
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
