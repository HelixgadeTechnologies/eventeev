# Profile Creation Fix Guide

## Problem

User profiles were not being created in the `profiles` table when new accounts were registered.

## Root Cause

1. **Missing Database Trigger**: There was no automatic trigger to create profiles when users sign up
2. **Manual Creation Issues**: The manual profile creation in `AuthContext` had timing issues with email confirmation

## Solution Applied

### 1. Database Changes

Added an automatic trigger that creates a profile entry whenever a new user signs up in Supabase Auth.

**Files Modified:**

- `supabase/schema.sql` - Added `handle_new_user()` function and trigger
- `supabase/migrations/add_profile_trigger.sql` - Migration file for the trigger

### 2. Code Changes

Simplified the `AuthContext.tsx` to remove manual profile creation and rely on the database trigger.

**Files Modified:**

- `context/AuthContext.tsx` - Removed `createUserProfile()` function

## How to Apply the Fix

### Step 1: Run the Migration in Supabase

You need to execute the migration SQL in your Supabase database:

1. **Go to Supabase Dashboard**

   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**

   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Copy the contents of `supabase/migrations/add_profile_trigger.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute

### Step 2: Verify the Trigger

After running the migration, verify it was created:

```sql
-- Check if the function exists
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';

-- Check if the trigger exists
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Step 3: Test with a New Account

1. **Clear your browser cache** (or use incognito mode)
2. **Create a new test account** through the signup page
3. **Check the profiles table** in Supabase:
   ```sql
   SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 5;
   ```

### Step 4: Fix Existing Users (Optional)

If you have existing users without profiles, run this to create them:

```sql
INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', ''),
  created_at,
  updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
```

## What the Trigger Does

The `handle_new_user()` trigger function:

1. **Automatically runs** when a new user is inserted into `auth.users`
2. **Extracts metadata** from the user's signup data (full_name, etc.)
3. **Creates a profile** in the `public.profiles` table
4. **Uses SECURITY DEFINER** to bypass RLS policies during creation

## Benefits

✅ **Automatic**: No manual code needed to create profiles  
✅ **Reliable**: Works even if email confirmation is required  
✅ **Consistent**: Every user will have a profile  
✅ **Secure**: Uses database-level security

## Testing Checklist

- [ ] Migration executed successfully in Supabase
- [ ] Trigger function exists in database
- [ ] Trigger is attached to auth.users table
- [ ] New signup creates profile automatically
- [ ] Profile contains correct email and full_name
- [ ] Existing users have profiles (if migration run)

## Troubleshooting

### Profile still not created?

1. **Check Supabase logs**: Dashboard → Logs → check for errors
2. **Verify trigger exists**: Run the verification SQL above
3. **Check RLS policies**: Ensure the trigger has SECURITY DEFINER
4. **Test in SQL Editor**: Try creating a test user directly

### Error: "duplicate key value violates unique constraint"?

This means a profile already exists. Check:

```sql
SELECT * FROM public.profiles WHERE email = 'your-test-email@example.com';
```

## Next Steps

After applying this fix:

1. Test the signup flow thoroughly
2. Monitor Supabase logs for any errors
3. Consider adding more profile fields as needed
4. Update the organization registration flow if needed
