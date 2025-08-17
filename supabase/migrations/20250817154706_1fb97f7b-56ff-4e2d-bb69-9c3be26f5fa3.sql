-- Create a view for public hospital information that excludes sensitive contact details (phone, email)
-- Based on the actual hospital table structure
CREATE OR REPLACE VIEW public.hospitals_public AS
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

-- Enable RLS on the view
ALTER VIEW public.hospitals_public SET (security_barrier = true);

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Everyone can view hospital data" ON public.hospitals;

-- Create a new policy that restricts access to the full hospitals table to authenticated users only
CREATE POLICY "Authenticated users can view hospital data" 
ON public.hospitals 
FOR SELECT 
TO authenticated
USING (true);

-- Grant public access to the public view (this will show hospital info without sensitive contact details)
GRANT SELECT ON public.hospitals_public TO anon;
GRANT SELECT ON public.hospitals_public TO authenticated;