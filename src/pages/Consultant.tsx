import React from 'react';
import Layout from '@/components/layout/Layout';
import ChatInterface from '@/components/consultant/ChatInterface';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
              <CardContent className="pt-6 flex flex-col items-center justify-center p-8">
                <Clock className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-medium text-center">View Your Chat History</h3>
                <p className="text-muted-foreground text-center mt-2 mb-4">
                  Access all your saved consultations in one place
                </p>
                <Button asChild>
                  <Link to="/chat-history">Go to Chat History</Link>
                </Button>
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
