-- Create the Sites table
CREATE TABLE Sites (
    site_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    city TEXT
);

-- Create the Patients table
CREATE TABLE Patients (
    patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    age INT,
    gender TEXT,
    national_id TEXT,
    patient_code TEXT UNIQUE,
    portrait_url TEXT,
    other_ailments TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create the Visits table
CREATE TABLE Visits (
    visit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES Patients(patient_id) ON DELETE CASCADE,
    site_id UUID REFERENCES Sites(site_id) ON DELETE SET NULL,
    visit_date TIMESTAMPTZ DEFAULT now() NOT NULL,
    notes TEXT,
    other_diagnoses TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create the Screenings table
CREATE TABLE Screenings (
    screening_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID UNIQUE REFERENCES Visits(visit_id) ON DELETE CASCADE,
    va_left_distance_sc TEXT,
    va_right_distance_sc TEXT,
    va_left_distance_cc TEXT,
    va_right_distance_cc TEXT,
    iop_left INT,
    iop_right INT,
    cdr_left DECIMAL(3, 2),
    cdr_right DECIMAL(3, 2),
    lens_left TEXT,
    lens_right TEXT,
    cornea_left TEXT,
    cornea_right TEXT,
    retina_left TEXT,
    retina_right TEXT
);

-- Create the Ailments table (lookup)
CREATE TABLE Ailments (
    ailment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

-- Create the Patient_Ailments join table
CREATE TABLE Patient_Ailments (
    patient_id UUID REFERENCES Patients(patient_id) ON DELETE CASCADE,
    ailment_id UUID REFERENCES Ailments(ailment_id) ON DELETE CASCADE,
    PRIMARY KEY (patient_id, ailment_id)
);

-- Create the Diagnoses table (lookup)
CREATE TABLE Diagnoses (
    diagnosis_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

-- Create the Visit_Diagnoses join table
CREATE TABLE Visit_Diagnoses (
    visit_id UUID REFERENCES Visits(visit_id) ON DELETE CASCADE,
    diagnosis_id UUID REFERENCES Diagnoses(diagnosis_id) ON DELETE CASCADE,
    PRIMARY KEY (visit_id, diagnosis_id)
);

-- Insert default lookup data
INSERT INTO Ailments (name) VALUES ('Diabetes'), ('HIV'), ('Hypertension'), ('TB');
INSERT INTO Diagnoses (name) VALUES ('Cataract'), ('Glaucoma'), ('Conjunctivitis');

-- Add Row Level Security and Policies for all tables
ALTER TABLE Sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view sites" ON Sites FOR SELECT USING (true);

ALTER TABLE Patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can manage patients" ON Patients FOR ALL USING (true);

ALTER TABLE Visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can manage visits" ON Visits FOR ALL USING (true);

ALTER TABLE Screenings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can manage screenings" ON Screenings FOR ALL USING (true);

ALTER TABLE Ailments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view ailments" ON Ailments FOR SELECT USING (true);

ALTER TABLE Patient_Ailments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can manage patient ailments" ON Patient_Ailments FOR ALL USING (true);

ALTER TABLE Diagnoses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view diagnoses" ON Diagnoses FOR SELECT USING (true);

ALTER TABLE Visit_Diagnoses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can manage visit diagnoses" ON Visit_Diagnoses FOR ALL USING (true);

-- Create a bucket for patient assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient_assets', 'patient_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for the patient_assets bucket
CREATE POLICY "Anyone can upload an asset" ON storage.objects FOR INSERT TO authenticated, anon WITH CHECK ( bucket_id = 'patient_assets' );
CREATE POLICY "Anyone can update an asset" ON storage.objects FOR UPDATE TO authenticated, anon USING ( bucket_id = 'patient_assets' );
CREATE POLICY "Anyone can read an asset" ON storage.objects FOR SELECT TO authenticated, anon USING ( bucket_id = 'patient_assets' );
