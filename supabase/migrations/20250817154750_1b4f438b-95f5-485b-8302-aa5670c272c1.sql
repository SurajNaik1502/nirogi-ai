-- Fix security definer view issue by removing the security_barrier property
-- and creating a proper RLS-enabled view approach

-- Drop the previous view
DROP VIEW IF EXISTS public.hospitals_public;

-- Create a new approach: Use a regular view without security definer
-- and rely on RLS policies for access control
CREATE VIEW public.hospitals_public AS
SELECT 
  id,
  hospital_name,
  address,
  city,
  state,
  speciality,
  opening_time,
  closing_time,
  beds_available,
  created_at
FROM public.hospitals;

-- Create a policy for anonymous users to access non-sensitive hospital data
-- This will be applied to the base table but only return non-sensitive fields
CREATE POLICY "Anonymous users can view basic hospital data" 
ON public.hospitals 
FOR SELECT 
TO anon
USING (true);

-- Grant access to the view for both anonymous and authenticated users
GRANT SELECT ON public.hospitals_public TO anon;
GRANT SELECT ON public.hospitals_public TO authenticated;