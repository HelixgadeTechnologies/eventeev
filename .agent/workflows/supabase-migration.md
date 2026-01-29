---
description: Migrate to Supabase for hosting and authentication
---

# Supabase Migration Plan

This workflow guides you through migrating your Eventeev Next.js application to use Supabase for both hosting and authentication.

## Phase 1: Supabase Setup

### Step 1: Install Supabase Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr @supabase/auth-helpers-nextjs
```

### Step 2: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key from Project Settings > API

### Step 3: Configure Environment Variables

Create `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Phase 2: Supabase Client Setup

### Step 4: Create Supabase Client Utilities

- Create `lib/supabase/client.ts` for client-side operations
- Create `lib/supabase/server.ts` for server-side operations
- Create `lib/supabase/middleware.ts` for auth middleware

## Phase 3: Authentication Implementation

### Step 5: Set Up Auth Context

- Create `context/AuthContext.tsx` for managing auth state
- Implement user session management
- Handle auth state changes

### Step 6: Create Auth Components

- Update sign-in page to use Supabase Auth
- Update sign-up page to use Supabase Auth
- Implement password reset functionality
- Add email verification flow

### Step 7: Implement Protected Routes

- Create middleware for route protection
- Add auth checks to protected pages
- Implement redirect logic for unauthenticated users

## Phase 4: Database Schema Setup

### Step 8: Design Database Schema

- Create `users` table (extends Supabase auth.users)
- Create `events` table
- Create `tickets` table
- Create `profiles` table for user metadata
- Set up Row Level Security (RLS) policies

### Step 9: Create Database Migrations

- Write SQL migrations for all tables
- Set up foreign key relationships
- Configure RLS policies for security

## Phase 5: Data Layer Integration

### Step 10: Create API Services

- Create `lib/services/auth.service.ts`
- Create `lib/services/events.service.ts`
- Create `lib/services/users.service.ts`
- Create `lib/services/tickets.service.ts`

### Step 11: Update Redux Store (if needed)

- Integrate Supabase data with Redux
- Update existing slices to work with Supabase
- Implement real-time subscriptions

## Phase 6: Deployment to Supabase

### Step 12: Configure Next.js for Deployment

- Update `next.config.ts` for production
- Set up environment variables in Supabase dashboard
- Configure CORS and security headers

### Step 13: Deploy to Vercel/Netlify with Supabase

- Connect your Git repository
- Configure build settings
- Set environment variables
- Deploy the application

## Phase 7: Testing & Verification

### Step 14: Test Authentication Flow

- Test sign up with email verification
- Test sign in/sign out
- Test password reset
- Test protected routes

### Step 15: Test Database Operations

- Test CRUD operations for events
- Test ticket purchases
- Test user profile updates
- Verify RLS policies work correctly

## Phase 8: Migration Cleanup

### Step 16: Remove Old Auth Logic

- Remove any previous auth implementation
- Clean up unused dependencies
- Update documentation

### Step 17: Performance Optimization

- Implement caching strategies
- Optimize database queries
- Set up connection pooling
- Configure CDN for static assets

## Notes

- Supabase provides 500MB database, 1GB file storage, and 2GB bandwidth on free tier
- Authentication includes email/password, magic links, OAuth providers
- Real-time subscriptions are built-in
- Row Level Security ensures data protection at database level
