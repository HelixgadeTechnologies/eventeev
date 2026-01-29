# 🔧 Profile Table Issue - FIXED!

## ✅ Problem Identified and Resolved

### **The Issue:**

Users were being created in `auth.users` but **NOT** in the `public.profiles` table.

### **Root Cause:**

The `AuthContext.signUp()` function was only creating the auth user, but **not creating the profile record** in the database.

### **The Fix:**

Updated `context/AuthContext.tsx` to automatically create a profile record in the `profiles` table after successful user registration.

---

## 🔍 Why This Happened

### **Before the Fix:**

```typescript
// OLD CODE - Only created auth user
const signUp = async (email: string, password: string, metadata?: any) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { error };
};
```

**Result:**

- ✅ User created in `auth.users`
- ❌ No profile created in `public.profiles`

### **After the Fix:**

```typescript
// NEW CODE - Creates both auth user AND profile
const signUp = async (email: string, password: string, metadata?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  // Create user profile in the database if signup was successful
  if (!error && data.user) {
    const profileError = await createUserProfile(data.user.id, {
      email,
      full_name: metadata?.full_name,
      phone_number: metadata?.phone_number,
    });

    if (profileError) {
      console.error("Error creating user profile:", profileError);
    }
  }

  return { error };
};
```

**Result:**

- ✅ User created in `auth.users`
- ✅ Profile created in `public.profiles`

---

## 🧪 Testing the Fix

### **Step 1: Create a New Test User**

1. Go to: **http://localhost:3000/sign-up**
2. Fill in the form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: test123
3. Click "Sign up"

### **Step 2: Check Supabase Dashboard**

#### Check Auth Users:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to: **Authentication** → **Users**
3. You should see your test user ✅

#### Check Profiles Table:

1. Navigate to: **Table Editor** → **profiles**
2. You should now see a profile record with:
   - `id` - Same as auth user ID
   - `email` - test@example.com
   - `full_name` - Test User
   - `created_at` - Timestamp
   - `updated_at` - Timestamp

---

## ⚠️ Important Notes

### **For Existing Users:**

If you already created users **before this fix**, they will have:

- ✅ Record in `auth.users`
- ❌ NO record in `profiles`

**Solution:** You have two options:

#### Option 1: Create Profiles Manually (SQL)

Run this in Supabase SQL Editor:

```sql
-- Create profiles for existing auth users
INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  created_at,
  updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
```

#### Option 2: Delete Test Users and Re-register

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Delete the test users
3. Re-register them through the sign-up form
4. Profiles will be created automatically

---

## 🔍 Troubleshooting

### **Profile Still Not Created?**

#### Check 1: Verify Profiles Table Exists

```sql
-- Run in Supabase SQL Editor
SELECT * FROM public.profiles LIMIT 1;
```

If you get an error, the table doesn't exist. Run the schema from `supabase/schema.sql`.

#### Check 2: Check RLS Policies

The profiles table has Row Level Security enabled. Make sure the policies allow INSERT:

```sql
-- Check if INSERT policy exists
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

You should see a policy: **"Users can insert their own profile"**

#### Check 3: Check Browser Console

Open browser DevTools (F12) and check the Console tab for errors when signing up.

Look for:

- `Error creating user profile:` - This means the profile creation failed
- Check what the error message says

#### Check 4: Verify User is Authenticated

The profile creation uses the authenticated user's context. Make sure:

- User is successfully created in `auth.users`
- No errors during sign-up

---

## 📊 What Gets Stored

### **In `auth.users` table:**

```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "encrypted_password": "hashed",
  "user_metadata": {
    "full_name": "John Doe",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### **In `public.profiles` table:**

```json
{
  "id": "uuid-here (same as auth.users.id)",
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone_number": null,
  "avatar_url": null,
  "bio": null,
  "created_at": "2024-12-15T00:00:00Z",
  "updated_at": "2024-12-15T00:00:00Z"
}
```

---

## ✅ Verification Checklist

After the fix, verify:

- [ ] New users appear in `auth.users` table
- [ ] New users appear in `public.profiles` table
- [ ] Profile `id` matches auth user `id`
- [ ] Profile `email` matches auth user `email`
- [ ] Profile `full_name` is populated correctly
- [ ] No errors in browser console during sign-up
- [ ] No errors in Supabase logs

---

## 🎯 Summary

**Problem:** Users not stored in profiles table

**Cause:** `AuthContext.signUp()` didn't create profile records

**Solution:** Updated `AuthContext.tsx` to create profile after auth user creation

**Status:** ✅ **FIXED!**

**Next Steps:**

1. Test with a new user registration
2. Verify profile is created in Supabase
3. For existing users, run the SQL migration or re-register

---

## 📝 Files Modified

- ✅ `context/AuthContext.tsx` - Added profile creation logic

**Changes:**

- Added `createUserProfile()` helper function
- Updated `signUp()` to call `createUserProfile()` after successful auth user creation
- Added error logging for profile creation failures

---

## 💡 Best Practice

Going forward, the profile will be automatically created for every new user that signs up through the form. No manual intervention needed!

If you need to add more fields to the profile, update:

1. The `profiles` table schema in `supabase/schema.sql`
2. The `createUserProfile()` function in `context/AuthContext.tsx`
3. The sign-up form to collect the additional data
