
import React from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Brain, 
  HeartPulse, 
  PieChart, 
  MessageCircle, 
  Pill, 
  Calendar, 
  ArrowRight 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const healthScore = 82;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const firstName = user?.user_metadata?.first_name || user?.user_metadata?.firstName || 'User';

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your health status.</p>
        </div>
        
        {/* Health Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-morphism col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-health-pink" />
                Health Score
              </CardTitle>
              <CardDescription>Your overall wellness rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-secondary stroke-current"
                      stroke-width="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    />
                    <circle
                      className="text-health-purple stroke-current animate-pulse-glow"
                      stroke-width="10"
                      stroke-linecap="round"
                      stroke-dasharray={`${healthScore * 2.51}, 251`}
                      stroke-dashoffset="0"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold health-gradient">{healthScore}</span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Great job! You're in good health.</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="glass-morphism col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-health-blue" />
                Quick Actions
              </CardTitle>
              <CardDescription>Access key features</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button 
                variant="secondary" 
                className="flex flex-col h-auto py-4 gap-y-1 items-center justify-center"
                onClick={() => navigate('/consultant')}
              >
                <MessageCircle className="h-5 w-5 mb-1" />
                <span className="text-xs">Consult AI</span>
              </Button>
              <Button 
                variant="secondary" 
                className="flex flex-col h-auto py-4 gap-y-1 items-center justify-center"
                onClick={() => navigate('/mental-health')}
              >
                <Brain className="h-5 w-5 mb-1" />
                <span className="text-xs">Mental Check</span>
              </Button>
              <Button 
                variant="secondary" 
                className="flex flex-col h-auto py-4 gap-y-1 items-center justify-center"
                onClick={() => navigate('/diet')}
              >
                <PieChart className="h-5 w-5 mb-1" />
                <span className="text-xs">Diet Plan</span>
              </Button>
              <Button 
                variant="secondary" 
                className="flex flex-col h-auto py-4 gap-y-1 items-center justify-center"
                onClick={() => navigate('/appointments')}
              >
                <Calendar className="h-5 w-5 mb-1" />
                <span className="text-xs">Appointments</span>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Reminders */}
          <Card className="glass-morphism col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-health-orange" />
                Medication Reminders
              </CardTitle>
              <CardDescription>Today's schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Vitamin D</p>
                    <p className="text-sm text-muted-foreground">1 tablet - After breakfast</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Take
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Omega-3</p>
                    <p className="text-sm text-muted-foreground">1 capsule - After lunch</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Take
                  </Button>
                </div>
              </div>
              <Button variant="link" className="flex items-center justify-end w-full p-0 h-auto">
                <span className="text-sm">View all medications</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-health-blue" />
              Weekly Health Trends
            </CardTitle>
            <CardDescription>Your progress this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Steps Goal (10,000)</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Water Intake (2L)</span>
                <span className="text-sm font-medium">65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Sleep Quality</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Meditation Sessions</span>
                <span className="text-sm font-medium">50%</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Featured Health Tips */}
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>Health Tips</CardTitle>
            <CardDescription>Personalized for you</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="neo-blur">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Boost Your Immune System</h3>
                <p className="text-sm text-muted-foreground">Try adding more citrus fruits to your diet for a natural vitamin C boost.</p>
              </CardContent>
            </Card>
            <Card className="neo-blur">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Improve Your Sleep</h3>
                <p className="text-sm text-muted-foreground">Establish a regular sleep schedule and avoid screens 1 hour before bed.</p>
              </CardContent>
            </Card>
            <Card className="neo-blur">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Mental Wellness Tip</h3>
                <p className="text-sm text-muted-foreground">Try 5 minutes of mindful breathing each morning to reduce stress.</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
