
import { supabase } from '@/integrations/supabase/client';

export interface WorkoutPlan {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  duration_weeks: number | null;
  created_at: string;
  updated_at: string;
}

export interface Workout {
  id: string;
  workout_plan_id: string;
  title: string;
  description: string | null;
  day_of_week: string | null;
  duration_minutes: number | null;
  created_at: string;
}

export interface Exercise {
  id: string;
  workout_id: string;
  name: string;
  sets: number | null;
  reps: number | null;
  weight: string | null;
  notes: string | null;
  created_at: string;
}

export const fetchWorkoutPlans = async (userId: string) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    throw error;
  }
};

export const fetchWorkoutPlan = async (planId: string) => {
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .select(`
        *,
        workouts(*, exercises(*))
      `)
      .eq('id', planId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    throw error;
  }
};

export const createWorkoutPlan = async (userId: string, plan: Partial<WorkoutPlan>) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .insert({
        user_id: userId,
        title: plan.title,
        description: plan.description,
        duration_weeks: plan.duration_weeks
      })
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error creating workout plan:', error);
    throw error;
  }
};

export const addWorkoutToPlan = async (workout: Partial<Workout>) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .insert(workout)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error adding workout to plan:', error);
    throw error;
  }
};

export const addExerciseToWorkout = async (exercise: Partial<Exercise>) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .insert(exercise)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error adding exercise to workout:', error);
    throw error;
  }
};

export const deleteWorkoutPlan = async (planId: string) => {
  try {
    const { error } = await supabase
      .from('workout_plans')
      .delete()
      .eq('id', planId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting workout plan:', error);
    throw error;
  }
};
