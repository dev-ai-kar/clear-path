-- Clear existing data
TRUNCATE TABLE
  public.patients,
  public.sites,
  public.visits,
  public.screenings,
  public.ailments,
  public.patient_ailments,
  public.diagnoses,
  public.visit_diagnoses,
  public.attachments
RESTART IDENTITY;

-- Insert default lookup data
INSERT INTO ailments (name) VALUES ('Diabetes'), ('HIV'), ('Hypertension'), ('TB') ON CONFLICT (name) DO NOTHING;
INSERT INTO diagnoses (name) VALUES ('Cataract'), ('Glaucoma'), ('Conjunctivitis'), ('Diabetic retinopathy'), ('Refractive error'), ('Dry eye'), ('Trachoma'), ('Age-related macular degeneration') ON CONFLICT (name) DO NOTHING;
INSERT INTO sites (name, city) VALUES ('Eye Camp - Nairobi', 'Nairobi'), ('Community Clinic - Mombasa', 'Mombasa'), ('Rural Outreach - Kisumu', 'Kisumu'), ('Eldoret Vision Center', 'Eldoret'), ('Nakuru Eye Care', 'Nakuru') ON CONFLICT (name) DO NOTHING;

-- Insert patients
INSERT INTO patients (first_name, last_name, phone, age, gender) VALUES
('Amina', 'Odhiambo', '0700-111-111', 61, 'female'),
('Kiptoo', 'Mutai', '0700-111-222', 47, 'male'),
('Wanjiru', 'Njeri', '0700-111-333', 55, 'female'),
('Otieno', 'Ouko', '0700-111-444', 63, 'male'),
('Zahra', 'Hassan', '0700-111-555', 39, 'female'),
('Ibrahim', 'Mohamed', '0700-222-111', 58, 'male'),
('Fatuma', 'Ali', '0700-222-222', 52, 'female'),
('John', 'Kamau', '0700-222-333', 45, 'male'),
('Mary', 'Wangari', '0700-222-444', 68, 'female'),
('Hassan', 'Abdi', '0700-222-555', 41, 'male'),
('Grace', 'Akinyi', '0700-333-111', 34, 'female'),
('David', 'Kipchoge', '0700-333-222', 71, 'male'),
('Halima', 'Omar', '0700-333-333', 49, 'female'),
('Peter', 'Mwangi', '0700-333-444', 56, 'male'),
('Aisha', 'Juma', '0700-333-555', 38, 'female'),
('Joseph', 'Ochieng', '0700-444-111', 64, 'male'),
('Naima', 'Farah', '0700-444-222', 44, 'female'),
('Samuel', 'Korir', '0700-444-333', 59, 'male'),
('Rahma', 'Salim', '0700-444-444', 67, 'female'),
('Daniel', 'Onyango', '0700-444-555', 42, 'male'),
('Zeinab', 'Ahmed', '0700-555-111', 53, 'female'),
('Patrick', 'Wekesa', '0700-555-222', 48, 'male'),
('Safia', 'Adan', '0700-555-333', 62, 'female'),
('Michael', 'Kemboi', '0700-555-444', 36, 'male'),
('Maryam', 'Hussein', '0700-555-555', 70, 'female');

-- Insert patient ailments
INSERT INTO patient_ailments (patient_id, ailment_id)
SELECT p.patient_id, a.ailment_id
FROM patients p, ailments a
WHERE (p.first_name = 'Amina' AND a.name = 'Diabetes')
   OR (p.first_name = 'Kiptoo' AND a.name = 'HIV')
   OR (p.first_name = 'Wanjiru' AND a.name = 'Hypertension')
   OR (p.first_name = 'Otieno' AND a.name IN ('Diabetes', 'Hypertension'))
   OR (p.first_name = 'Ibrahim' AND a.name = 'Diabetes')
   OR (p.first_name = 'Fatuma' AND a.name = 'Hypertension')
   OR (p.first_name = 'Mary' AND a.name = 'Diabetes')
   OR (p.first_name = 'Hassan' AND a.name = 'TB')
   OR (p.first_name = 'David' AND a.name IN ('Diabetes', 'Hypertension'))
   OR (p.first_name = 'Halima' AND a.name = 'HIV')
   OR (p.first_name = 'Peter' AND a.name = 'Hypertension')
   OR (p.first_name = 'Joseph' AND a.name = 'Diabetes')
   OR (p.first_name = 'Samuel' AND a.name = 'Hypertension')
   OR (p.first_name = 'Rahma' AND a.name = 'Diabetes')
   OR (p.first_name = 'Zeinab' AND a.name = 'HIV')
   OR (p.first_name = 'Safia' AND a.name IN ('Diabetes', 'Hypertension'))
   OR (p.first_name = 'Maryam' AND a.name = 'Hypertension');

-- Insert visits and visit diagnoses
DO $$
DECLARE
    v_visit_id UUID;
    v_patient_id UUID;
BEGIN
    -- Amina Odhiambo
    SELECT patient_id INTO v_patient_id FROM patients WHERE first_name = 'Amina';
    INSERT INTO visits (patient_id, site_id) VALUES (v_patient_id, (SELECT site_id FROM sites WHERE name = 'Eye Camp - Nairobi')) RETURNING visit_id INTO v_visit_id;
    INSERT INTO visit_diagnoses (visit_id, diagnosis_id) SELECT v_visit_id, diagnosis_id FROM diagnoses WHERE name IN ('Diabetic retinopathy', 'Cataract');

    -- Kiptoo Mutai
    SELECT patient_id INTO v_patient_id FROM patients WHERE first_name = 'Kiptoo';
    INSERT INTO visits (patient_id, site_id) VALUES (v_patient_id, (SELECT site_id FROM sites WHERE name = 'Community Clinic - Mombasa')) RETURNING visit_id INTO v_visit_id;
    INSERT INTO visit_diagnoses (visit_id, diagnosis_id) SELECT v_visit_id, diagnosis_id FROM diagnoses WHERE name = 'Glaucoma';
END $$;
