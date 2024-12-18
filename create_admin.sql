-- First, get the user ID and email
WITH user_info AS (
  SELECT id, email 
  FROM auth.users 
  WHERE email = 'team@lammys.au'
)
-- Then, insert or update the profile with all required fields
INSERT INTO public.profiles (
  id,
  email,
  role,
  created_at,
  last_login_at,
  is_admin
)
SELECT 
  id,
  email,
  'admin',
  NOW(),
  NOW(),
  true
FROM user_info
ON CONFLICT (id) 
DO UPDATE SET 
  email = EXCLUDED.email,
  role = 'admin',
  last_login_at = NOW(),
  is_admin = true
RETURNING *;
