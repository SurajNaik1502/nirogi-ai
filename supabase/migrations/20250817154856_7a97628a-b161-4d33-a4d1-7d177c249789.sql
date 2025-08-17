-- Drop the problematic view completely and use a different approach
DROP VIEW IF EXISTS public.hospitals_public;

-- Since we have both anonymous and authenticated access policies on hospitals table now,
-- we can modify the application logic to handle the restriction at the application level
-- The database will allow both anonymous and authenticated users to access hospitals table
-- but sensitive fields (phone, email) should be filtered out in the application for anonymous users

-- Make sure we have proper RLS policies for hospitals table
-- Keep the existing policies as they are now (anonymous users can view basic data, authenticated users can view all data)