-- Supabase Admin Setup
-- 
-- IMPORTANT: Admin authentication uses API keys, not user accounts
--
-- To set up admin access:
-- 1. Go to Supabase Dashboard -> Settings -> API
-- 2. Copy the "Service Role Key" (или "Anon Key" ако предпочиташ)
-- 3. Add it to your .env.local file as ADMIN_API_KEY
-- 4. Use this API key to log in at /admin/login
--
-- This approach is simpler for MVP - no need to create user accounts

-- Optional: Create a custom admins table if you want to track admin-specific data
-- This is NOT required for basic authentication
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Create a function to automatically add users to admins table
-- when they sign up (if you want to use this approach)
CREATE OR REPLACE FUNCTION public.handle_new_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admins (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create trigger (only if you want automatic admin creation)
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin();

-- Enable Row Level Security (RLS) on admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read admin table
CREATE POLICY "Admins can read admins table"
  ON admins FOR SELECT
  USING (auth.uid() = id);

-- Note: For the MVP, you can simply use Supabase Auth without the admins table
-- Any authenticated user will be able to access /admin
-- You can later add role-based access control if needed
