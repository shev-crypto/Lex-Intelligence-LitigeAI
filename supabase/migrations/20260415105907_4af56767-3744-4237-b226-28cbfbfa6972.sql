-- Drop the trigger first (it's on auth.users, created by a previous migration)
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS public.auto_assign_admin();
