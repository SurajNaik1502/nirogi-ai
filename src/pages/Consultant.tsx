
import React from 'react';
import Layout from '@/components/layout/Layout';
import ChatInterface from '@/components/consultant/ChatInterface';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pill, Clock, FileText } from 'lucide-react';

const Consultant: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Virtual Health Consultant</h1>
          <p className="text-muted-foreground mt-1">
            Chat with our AI-powered health assistant for personalized guidance
          </p>
        </div>

        <Tabs defaultValue="chat">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="space-y-4 pt-4">
            <ChatInterface />
          </TabsContent>
          
          <TabsContent value="history" className="pt-4">
            <Card className="glass-morphism">
              <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-health-blue" />
                      <h3 className="font-medium">Yesterday, 15:30</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Discussed: Headache, fatigue, sore throat
                    </p>
                  </div>
                  <button className="text-sm text-health-blue hover:underline">
                    View Chat
                  </button>
                </div>
                
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-health-blue" />
                      <h3 className="font-medium">April 5, 2025, 10:15</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Discussed: Back pain, stretching exercises
                    </p>
                  </div>
                  <button className="text-sm text-health-blue hover:underline">
                    View Chat
                  </button>
                </div>
                
                <div className="flex justify-between items-start pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-health-blue" />
                      <h3 className="font-medium">March 28, 2025, 19:45</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Discussed: Insomnia, sleep hygiene
                    </p>
                  </div>
                  <button className="text-sm text-health-blue hover:underline">
                    View Chat
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resources" className="pt-4">
            <Card className="glass-morphism">
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-4 border-b border-white/10 pb-4">
                  <FileText className="h-12 w-12 text-health-pink p-2 bg-white/5 rounded-lg" />
                  <div>
                    <h3 className="font-medium">Understanding Common Cold vs. Allergies</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Learn how to differentiate between cold symptoms and seasonal allergies.
                    </p>
                    <button className="text-sm text-health-blue hover:underline mt-2">
                      Read Article
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-4 border-b border-white/10 pb-4">
                  <FileText className="h-12 w-12 text-health-blue p-2 bg-white/5 rounded-lg" />
                  <div>
                    <h3 className="font-medium">Stress Management Techniques</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Discover effective ways to manage stress and improve mental wellbeing.
                    </p>
                    <button className="text-sm text-health-blue hover:underline mt-2">
                      Read Article
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <FileText className="h-12 w-12 text-health-purple p-2 bg-white/5 rounded-lg" />
                  <div>
                    <h3 className="font-medium">Healthy Eating Guidelines</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Learn about balanced nutrition and meal planning for optimal health.
                    </p>
                    <button className="text-sm text-health-blue hover:underline mt-2">
                      Read Article
                    </button>
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

export default Consultant;
