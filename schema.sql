-- Create the patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT,
  symbol_name TEXT,
  symbol_color TEXT,
  photo_url TEXT,
  voice_clip_url TEXT,
  status TEXT DEFAULT 'prescreened' NOT NULL
);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Public can create patients" ON patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view all patients" ON patients FOR SELECT USING (true);
CREATE POLICY "Public can update patients" ON patients FOR UPDATE USING (true);

-- Create a bucket for patient assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient_assets', 'patient_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for the patient_assets bucket
CREATE POLICY "Anyone can upload an asset" ON storage.objects FOR INSERT TO authenticated, anon WITH CHECK ( bucket_id = 'patient_assets' );
CREATE POLICY "Anyone can update an asset" ON storage.objects FOR UPDATE TO authenticated, anon USING ( bucket_id = 'patient_assets' );
CREATE POLICY "Anyone can read an asset" ON storage.objects FOR SELECT TO authenticated, anon USING ( bucket_id = 'patient_assets' );
