
import { supabase } from '@/integrations/supabase/client';

export interface DietPlan {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  calories_per_day: number | null;
  created_at: string;
  updated_at: string;
}

export interface DietPlanMeal {
  id: string;
  diet_plan_id: string;
  meal_name: string;
  description: string | null;
  calories: number | null;
  protein_grams: number | null;
  carbs_grams: number | null;
  fat_grams: number | null;
  meal_time: string | null;
  created_at: string;
}

// Define types specifically for creating entities
export type CreateDietPlanMeal = Omit<DietPlanMeal, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export const fetchDietPlans = async (userId: string) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching diet plans:', error);
    throw error;
  }
};

export const fetchDietPlan = async (planId: string) => {
  try {
    const { data, error } = await supabase
      .from('diet_plans')
      .select(`
        *,
        diet_plan_meals(*)
      `)
      .eq('id', planId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching diet plan:', error);
    throw error;
  }
};

export const createDietPlan = async (userId: string, plan: Partial<DietPlan>) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('diet_plans')
      .insert({
        user_id: userId,
        title: plan.title!,
        description: plan.description,
        calories_per_day: plan.calories_per_day
      })
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error creating diet plan:', error);
    throw error;
  }
};

export const addMealToPlan = async (meal: CreateDietPlanMeal) => {
  // Validate required properties
  if (!meal.diet_plan_id || !meal.meal_name) {
    throw new Error('Missing required properties: diet_plan_id and meal_name are required');
  }

  try {
    const { data, error } = await supabase
      .from('diet_plan_meals')
      .insert(meal)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error adding meal to plan:', error);
    throw error;
  }
};

export const deleteDietPlan = async (planId: string) => {
  try {
    const { error } = await supabase
      .from('diet_plans')
      .delete()
      .eq('id', planId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting diet plan:', error);
    throw error;
  }
};
