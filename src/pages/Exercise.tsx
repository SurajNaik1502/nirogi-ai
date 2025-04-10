
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  ArrowRight, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Dumbbell, 
  Heart, 
  HeartPulse, 
  Play,
  TrendingUp
} from 'lucide-react';

const Exercise = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exercise & Fitness</h1>
          <p className="text-muted-foreground mt-1">
            Track your workouts, set fitness goals, and get personalized exercise plans
          </p>
        </div>
        
        <Tabs defaultValue="workouts">
          <TabsList>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="plans">Fitness Plans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workouts" className="space-y-6 pt-4">
            <Card className="glass-morphism overflow-hidden">
              <div className="aspect-video relative">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b" 
                  alt="Person doing workout" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 text-white/80 mb-2">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span>Daily Recommendation</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-white">30-Minute Low Impact Cardio</h2>
                  <p className="text-white/80 mt-2">Perfect for your heart health goals</p>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">30 mins</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Intensity</p>
                      <p className="font-medium">Moderate</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <HeartPulse className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Calorie Burn</p>
                      <p className="font-medium">~250 cal</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  Start Workout
                  <Play className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <h3 className="text-xl font-semibold mt-6 mb-4">Recommended For You</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-morphism hover:bg-white/5 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Dumbbell className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Strength Training</h4>
                      <p className="text-sm text-muted-foreground">20 min • Beginner</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-morphism hover:bg-white/5 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Morning Yoga</h4>
                      <p className="text-sm text-muted-foreground">15 min • All levels</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-morphism hover:bg-white/5 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <HeartPulse className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">HIIT Workout</h4>
                      <p className="text-sm text-muted-foreground">25 min • Intermediate</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Browse All Workouts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </TabsContent>
          
          <TabsContent value="progress" className="pt-4">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div key={i} className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">{day}</div>
                      <div className={`h-16 rounded-md flex items-center justify-center ${
                        i < 4 ? 'bg-health-blue/30' : 'bg-white/10'
                      }`}>
                        {i < 4 && <TrendingUp className="h-6 w-6 text-health-blue" />}
                      </div>
                      {i < 4 && <div className="text-xs mt-1">30 min</div>}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Weekly Goal: 4/7 days</span>
                      <span className="text-sm text-health-blue">57%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-health-blue rounded-full" style={{ width: '57%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Minutes: 120/210</span>
                      <span className="text-sm text-amber-500">57%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '57%' }}></div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-6">
                  View Detailed Progress
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="plans" className="pt-4">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Personalized Fitness Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white/5 p-5 rounded-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Heart className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Heart Health Program</h3>
                        <p className="text-sm text-muted-foreground">4-week program</p>
                      </div>
                    </div>
                    <p className="text-sm mb-4">
                      A tailored program focused on improving your cardiovascular health with a mix of cardio,
                      strength training, and flexibility exercises.
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">3-4 workouts per week • 20-30 min each</span>
                    </div>
                    <Button className="w-full">
                      Start This Plan
                    </Button>
                  </div>
                  
                  <div className="bg-white/5 p-5 rounded-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Dumbbell className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Strength & Toning</h3>
                        <p className="text-sm text-muted-foreground">6-week program</p>
                      </div>
                    </div>
                    <p className="text-sm mb-4">
                      Build strength and muscle tone with this progressive program that includes resistance training
                      and bodyweight exercises suitable for all fitness levels.
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">4-5 workouts per week • 30-45 min each</span>
                    </div>
                    <Button className="w-full">
                      Start This Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Exercise;
