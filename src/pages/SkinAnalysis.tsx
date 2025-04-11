
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImagePlus, Camera, Upload, History, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchSkinAnalyses, createSkinAnalysis, SkinAnalysis } from '@/services/skinAnalysisService';
import { format, parseISO } from 'date-fns';

const SkinAnalysisPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analyses, setAnalyses] = useState<SkinAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SkinAnalysis | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const loadAnalyses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await fetchSkinAnalyses(user.id);
      if (data) {
        setAnalyses(data as SkinAnalysis[]);
        if (data.length > 0 && !selectedAnalysis) {
          setSelectedAnalysis(data[0] as SkinAnalysis);
        }
      }
    } catch (error) {
      console.error('Error loading skin analyses:', error);
      toast({
        title: "Error",
        description: "Failed to load skin analysis history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyses();
  }, [user]);

  const handleCapture = () => {
    setIsCapturing(true);
    // In a real implementation, this would access the camera and capture an image
    setTimeout(() => {
      setIsCapturing(false);
      toast({
        title: "Image Captured",
        description: "Your skin image has been captured and is being analyzed",
      });
      
      // Mock analysis result
      const mockAnalysis = {
        skin_type: "Combination",
        concerns: ["Fine lines", "Uneven texture"],
        hydration_level: "Moderate",
        oil_level: "High in T-zone",
        sensitivity: "Low",
        recommendations: [
          "Use a gentle cleanser",
          "Apply hydrating serum",
          "Use sunscreen daily",
          "Consider retinol for fine lines"
        ]
      };
      
      // Create a new skin analysis record
      if (user) {
        createSkinAnalysis(user.id, {
          image_url: null, // In a real app, this would be the URL to the uploaded image
          analysis_result: mockAnalysis,
          recommendations: "Based on the analysis, we recommend a hydrating skincare routine with gentle cleansers and daily sunscreen."
        }).then(newAnalysis => {
          if (newAnalysis) {
            setAnalyses([newAnalysis as SkinAnalysis, ...analyses]);
            setSelectedAnalysis(newAnalysis as SkinAnalysis);
            toast({
              title: "Analysis Complete",
              description: "Your skin has been analyzed successfully",
            });
          }
        }).catch(error => {
          console.error('Error creating skin analysis:', error);
          toast({
            title: "Error",
            description: "Failed to save analysis results",
            variant: "destructive",
          });
        });
      }
    }, 2000);
  };

  const handleUpload = () => {
    // In a real implementation, this would open a file picker
    toast({
      title: "Upload Feature",
      description: "The upload feature would be implemented in a production app",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skin Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Analyze your skin and get personalized skincare recommendations
          </p>
        </div>
        
        <Tabs defaultValue="analyze">
          <TabsList>
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analyze" className="space-y-6 pt-4">
            <Card className="glass-morphism overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video relative bg-black/50">
                  {isCapturing ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 border-4 border-health-blue rounded-full border-t-transparent animate-spin mb-4"></div>
                        <p className="text-white">Capturing image...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-16 w-16 mx-auto text-white/50 mb-4" />
                        <p className="text-white">Ready to capture or upload an image</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={handleCapture} 
                      disabled={isCapturing}
                      className="flex-1"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Image
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleUpload}
                      disabled={isCapturing}
                      className="flex-1"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-morphism md:col-span-2">
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Info className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Clean Your Face</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Remove makeup and cleanse your face thoroughly before taking a photo.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Info className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Good Lighting</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Find a well-lit area with natural light for the most accurate results.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Info className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Position Your Face</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Position your face in the center of the frame, keeping a neutral expression.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Important Note</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          This analysis is not a medical diagnosis. Consult a dermatologist for serious skin concerns.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Skin Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">Normal</h3>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">Dry</h3>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">Oily</h3>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">Combination</h3>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm">Sensitive</h3>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle>Analysis History</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 max-h-[400px] overflow-y-auto">
                    {loading ? (
                      <div className="flex items-center justify-center h-48">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    ) : analyses.length === 0 ? (
                      <div className="text-center py-12 px-6">
                        <History className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-medium">No analysis history</h3>
                        <p className="text-muted-foreground mt-2 mb-4">
                          You haven't performed any skin analysis yet
                        </p>
                        <Button onClick={() => document.querySelector('[value="analyze"]')?.dispatchEvent(new Event('click'))}>
                          Start Your First Analysis
                        </Button>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/10">
                        {analyses.map(analysis => (
                          <button
                            key={analysis.id}
                            className={`w-full text-left p-4 hover:bg-white/5 transition-colors ${
                              selectedAnalysis?.id === analysis.id ? 'bg-white/5' : ''
                            }`}
                            onClick={() => setSelectedAnalysis(analysis)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">
                                  Skin Analysis {format(parseISO(analysis.created_at), 'MMM d')}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {format(parseISO(analysis.created_at), 'MMMM d, yyyy • h:mm a')}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                {selectedAnalysis ? (
                  <Card className="glass-morphism">
                    <CardHeader>
                      <CardTitle>Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {selectedAnalysis.image_url ? (
                          <div className="aspect-video rounded-md overflow-hidden border border-white/10">
                            <img
                              src={selectedAnalysis.image_url}
                              alt="Skin Analysis"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video rounded-md border border-white/10 flex items-center justify-center bg-white/5">
                            <div className="text-center">
                              <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                              <p className="text-muted-foreground">No image available</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-medium mb-3">Skin Assessment</h3>
                            {selectedAnalysis.analysis_result ? (
                              <div className="space-y-4">
                                <div className="bg-white/5 p-4 rounded-md">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Skin Type</p>
                                      <p className="font-medium">{selectedAnalysis.analysis_result.skin_type}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Hydration</p>
                                      <p className="font-medium">{selectedAnalysis.analysis_result.hydration_level}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Oil Level</p>
                                      <p className="font-medium">{selectedAnalysis.analysis_result.oil_level}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Sensitivity</p>
                                      <p className="font-medium">{selectedAnalysis.analysis_result.sensitivity}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">Identified Concerns</p>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedAnalysis.analysis_result.concerns.map((concern, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-white/10"
                                      >
                                        {concern}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-muted-foreground">No detailed assessment available</p>
                            )}
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-3">Recommendations</h3>
                            {selectedAnalysis.analysis_result?.recommendations ? (
                              <ul className="space-y-2">
                                {selectedAnalysis.analysis_result.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <div className="h-5 w-5 rounded-full bg-health-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-xs text-health-blue">{index + 1}</span>
                                    </div>
                                    <span className="text-sm">{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted-foreground">
                                {selectedAnalysis.recommendations || "No recommendations available"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="glass-morphism h-full">
                    <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <ImagePlus className="h-16 w-16 text-muted-foreground/50 mb-4" />
                      <h3 className="text-xl font-medium">No analysis selected</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        Select an analysis from the history to view detailed results
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SkinAnalysisPage;
