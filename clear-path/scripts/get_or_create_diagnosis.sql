CREATE OR REPLACE FUNCTION get_or_create_diagnosis(p_name TEXT)
RETURNS UUID AS $$
DECLARE
    v_diag_id UUID;
BEGIN
    -- Try to find the diagnosis
    SELECT diagnosis_id INTO v_diag_id FROM diagnoses WHERE name = p_name;

    -- If not found, create it
    IF v_diag_id IS NULL THEN
        INSERT INTO diagnoses (name) VALUES (p_name) RETURNING diagnosis_id INTO v_diag_id;
    END IF;

    RETURN v_diag_id;
END;
$$ LANGUAGE plpgsql;
