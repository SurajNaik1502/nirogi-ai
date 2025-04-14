
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MoodTracker from '@/components/mental-health/MoodTracker';
import JournalTab from '@/components/mental-health/JournalTab';
import BreathingExercise from '@/components/mental-health/BreathingExercise';
import RelaxationMusic from '@/components/mental-health/RelaxationMusic';

const MentalHealth: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mental Health</h1>
          <p className="text-muted-foreground mt-1">Track your mood, journal your thoughts, and practice mindfulness</p>
        </div>

        {/* Daily Mood Tracker */}
        <MoodTracker />

        <Tabs defaultValue="journal">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="breathing">Breathing</TabsTrigger>
            <TabsTrigger value="relaxation">Relaxation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="journal" className="pt-4">
            <JournalTab />
          </TabsContent>
          
          <TabsContent value="breathing" className="pt-4">
            <BreathingExercise />
          </TabsContent>
          
          <TabsContent value="relaxation" className="pt-4">
            <RelaxationMusic />
          </TabsContent>
        </Tabs>

        {/* Quick SOS Button */}
        <div className="fixed bottom-6 right-6">
          <Button 
            variant="destructive" 
            size="lg" 
            className="rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            SOS Emergency
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default MentalHealth;
