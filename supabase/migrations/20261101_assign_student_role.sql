CREATE OR REPLACE FUNCTION public.initialize_student_account()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'mahasiswa')
    ON CONFLICT (user_id) DO NOTHING;
    INSERT INTO public.profiles (user_id, name)
    VALUES (NEW.id, COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''), NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''), SPLIT_PART(NEW.email, '@', 1), 'Mahasiswa'))
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS initialize_student_account_on_signup ON auth.users;
CREATE TRIGGER initialize_student_account_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.initialize_student_account();

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'mahasiswa' FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.profiles (user_id, name)
SELECT id, COALESCE(NULLIF(TRIM(raw_user_meta_data->>'name'), ''), NULLIF(TRIM(raw_user_meta_data->>'full_name'), ''), SPLIT_PART(email, '@', 1), 'Mahasiswa')
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
