-- Enable RLS on the screenings table if not already enabled
ALTER TABLE public.screenings ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow read access to all users
CREATE POLICY "Enable read access for all users"
ON public.screenings
FOR SELECT
USING (true);
