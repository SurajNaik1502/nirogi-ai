export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string
          datetime: string
          doctor_name: string
          doctor_specialty: string | null
          hospital_name: string | null
          id: string
          notes: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          datetime: string
          doctor_name: string
          doctor_specialty?: string | null
          hospital_name?: string | null
          id?: string
          notes?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          datetime?: string
          doctor_name?: string
          doctor_specialty?: string | null
          hospital_name?: string | null
          id?: string
          notes?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      diet_plan_meals: {
        Row: {
          calories: number | null
          carbs_grams: number | null
          created_at: string
          description: string | null
          diet_plan_id: string
          fat_grams: number | null
          id: string
          meal_name: string
          meal_time: string | null
          protein_grams: number | null
        }
        Insert: {
          calories?: number | null
          carbs_grams?: number | null
          created_at?: string
          description?: string | null
          diet_plan_id: string
          fat_grams?: number | null
          id?: string
          meal_name: string
          meal_time?: string | null
          protein_grams?: number | null
        }
        Update: {
          calories?: number | null
          carbs_grams?: number | null
          created_at?: string
          description?: string | null
          diet_plan_id?: string
          fat_grams?: number | null
          id?: string
          meal_name?: string
          meal_time?: string | null
          protein_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "diet_plan_meals_diet_plan_id_fkey"
            columns: ["diet_plan_id"]
            isOneToOne: false
            referencedRelation: "diet_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_plans: {
        Row: {
          calories_per_day: number | null
          created_at: string
          description: string | null
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          calories_per_day?: number | null
          created_at?: string
          description?: string | null
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          calories_per_day?: number | null
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          reps: number | null
          sets: number | null
          weight: string | null
          workout_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          reps?: number | null
          sets?: number | null
          weight?: string | null
          workout_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          reps?: number | null
          sets?: number | null
          weight?: string | null
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      health_chats: {
        Row: {
          created_at: string
          id: string
          message: string
          sender: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender?: string
          user_id?: string
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          address: string
          beds_available: string | null
          city: string
          closing_time: string | null
          created_at: string
          email: string | null
          hospital_name: string
          id: string
          opening_time: string | null
          phone: string | null
          speciality: string[] | null
          state: string | null
        }
        Insert: {
          address: string
          beds_available?: string | null
          city: string
          closing_time?: string | null
          created_at?: string
          email?: string | null
          hospital_name: string
          id?: string
          opening_time?: string | null
          phone?: string | null
          speciality?: string[] | null
          state?: string | null
        }
        Update: {
          address?: string
          beds_available?: string | null
          city?: string
          closing_time?: string | null
          created_at?: string
          email?: string | null
          hospital_name?: string
          id?: string
          opening_time?: string | null
          phone?: string | null
          speciality?: string[] | null
          state?: string | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      medical_reports: {
        Row: {
          analysis_result: Json | null
          created_at: string
          file_url: string | null
          id: string
          notes: string | null
          report_date: string
          report_type: string
          user_id: string
        }
        Insert: {
          analysis_result?: Json | null
          created_at?: string
          file_url?: string | null
          id?: string
          notes?: string | null
          report_date: string
          report_type: string
          user_id: string
        }
        Update: {
          analysis_result?: Json | null
          created_at?: string
          file_url?: string | null
          id?: string
          notes?: string | null
          report_date?: string
          report_type?: string
          user_id?: string
        }
        Relationships: []
      }
      medication_logs: {
        Row: {
          created_at: string
          id: string
          medication_id: string
          taken_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          medication_id: string
          taken_at: string
        }
        Update: {
          created_at?: string
          id?: string
          medication_id?: string
          taken_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          name: string
          notes: string | null
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          name: string
          notes?: string | null
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          name?: string
          notes?: string | null
          start_date?: string
          user_id?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          created_at: string
          id: string
          mood: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_chats: {
        Row: {
          chat_date: string
          created_at: string
          id: string
          messages: Json
          title: string
          user_id: string
        }
        Insert: {
          chat_date?: string
          created_at?: string
          id?: string
          messages: Json
          title: string
          user_id: string
        }
        Update: {
          chat_date?: string
          created_at?: string
          id?: string
          messages?: Json
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      skin_analyses: {
        Row: {
          analysis_result: Json | null
          created_at: string
          id: string
          image_url: string | null
          recommendations: string | null
          user_id: string
        }
        Insert: {
          analysis_result?: Json | null
          created_at?: string
          id?: string
          image_url?: string | null
          recommendations?: string | null
          user_id: string
        }
        Update: {
          analysis_result?: Json | null
          created_at?: string
          id?: string
          image_url?: string | null
          recommendations?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          created_at: string
          description: string | null
          duration_weeks: number | null
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_weeks?: number | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          created_at: string
          day_of_week: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          title: string
          workout_plan_id: string
        }
        Insert: {
          created_at?: string
          day_of_week?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          title: string
          workout_plan_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          title?: string
          workout_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
