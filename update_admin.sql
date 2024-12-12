-- Update the profile for team@lammys.au to be an admin
UPDATE profiles
SET is_admin = true
WHERE id IN (
  SELECT id 
  FROM auth.users 
  WHERE email = 'team@lammys.au'
);
