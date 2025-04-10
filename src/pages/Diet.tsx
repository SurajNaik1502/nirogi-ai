
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Apple, ArrowRight, Utensils, Salad, ChevronRight } from 'lucide-react';

const Diet = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Diet & Nutrition</h1>
          <p className="text-muted-foreground mt-1">
            Get personalized diet recommendations and track your nutrition
          </p>
        </div>
        
        <Tabs defaultValue="recommendations">
          <TabsList>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="meal-planner">Meal Planner</TabsTrigger>
            <TabsTrigger value="nutrition-tracker">Nutrition Tracker</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations" className="space-y-6 pt-4">
            <Card className="glass-morphism overflow-hidden">
              <div className="aspect-video relative">
                <img 
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061" 
                  alt="Healthy meal" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <h2 className="text-2xl font-semibold text-white">Your Personalized Diet Plan</h2>
                  <p className="text-white/80 mt-2">Based on your health profile and goals</p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-lg transition-colors">
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Apple className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Mediterranean Diet</h3>
                      <p className="text-sm text-muted-foreground">Recommended for your heart health</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-lg transition-colors">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Utensils className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Low Carb Options</h3>
                      <p className="text-sm text-muted-foreground">Alternatives for your current meals</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-lg transition-colors">
                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Salad className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Protein-Rich Meals</h3>
                      <p className="text-sm text-muted-foreground">Support your fitness activities</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <Button className="w-full mt-6" variant="default">
                  Get Complete Diet Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Nutritional Deficiencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Vitamin D</span>
                      <span className="text-amber-500">Low</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Iron</span>
                      <span className="text-green-500">Good</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Calcium</span>
                      <span className="text-red-500">Very Low</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-6">
                    View All Nutrients
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Food Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Fatty fish (salmon, mackerel)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Leafy greens (spinach, kale)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Nuts and seeds</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Berries (blueberries, strawberries)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Greek yogurt</span>
                    </li>
                  </ul>
                  
                  <Button variant="outline" className="w-full mt-6">
                    Get Shopping List
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="meal-planner" className="pt-4">
            <Card className="glass-morphism">
              <CardContent className="p-6 text-center">
                <div className="py-12">
                  <Utensils className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-medium">Meal Planner Coming Soon</h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    We're working on an interactive meal planner that will help you create balanced, 
                    healthy meals based on your dietary preferences and health goals.
                  </p>
                  <Button className="mt-6">Get Notified When Available</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nutrition-tracker" className="pt-4">
            <Card className="glass-morphism">
              <CardContent className="p-6 text-center">
                <div className="py-12">
                  <Salad className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-medium">Nutrition Tracker Coming Soon</h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    Track your daily nutrition intake, monitor calories, macronutrients, and
                    get insights about your eating habits. Coming in the next update!
                  </p>
                  <Button className="mt-6">Get Notified When Available</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Diet;
