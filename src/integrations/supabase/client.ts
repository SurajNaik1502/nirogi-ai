
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qclwtisbmuwdneaitjow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjbHd0aXNibXV3ZG5lYWl0am93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjgzODcsImV4cCI6MjA1OTg0NDM4N30.kbJ9UnojX7jKd5J-EPSkwn6l1te4Lkj0kIcMPARH8qw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
  }
});
