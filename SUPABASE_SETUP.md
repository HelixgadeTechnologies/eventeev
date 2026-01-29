# Supabase Setup Guide for Eventeev

This guide will walk you through setting up Supabase for your Eventeev application.

## Prerequisites

- A Supabase account (sign up at [https://supabase.com](https://supabase.com))
- Your Eventeev application running locally

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: Eventeev (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Start with the Free tier
4. Click "Create new project"
5. Wait for the project to be provisioned (usually takes 1-2 minutes)

## Step 2: Get Your API Credentials

1. Once your project is ready, go to **Project Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. You'll see two important values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (a long JWT token)
4. Copy these values - you'll need them next

## Step 3: Configure Environment Variables

1. In your Eventeev project root, create a `.env.local` file:

   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Save the file

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open the file `supabase/schema.sql` in your project
4. Copy the entire contents of the file
5. Paste it into the SQL Editor in Supabase
6. Click **Run** to execute the schema

This will create all the necessary tables:

- `profiles` - User profile information
- `events` - Event details
- `tickets` - Ticket types for events
- `orders` - Ticket purchase orders
- `order_items` - Individual items in orders
- `attendees` - Individual attendee records

## Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. **Email** provider is enabled by default
3. Configure email templates (optional):
   - Go to **Authentication** > **Email Templates**
   - Customize the confirmation, password reset, and magic link emails

### Optional: Enable OAuth Providers

To enable social login (Google, GitHub, etc.):

1. Go to **Authentication** > **Providers**
2. Enable the providers you want (e.g., Google, GitHub)
3. For each provider, you'll need to:
   - Create an OAuth app in the provider's developer console
   - Add the callback URL from Supabase
   - Copy the Client ID and Client Secret to Supabase

## Step 6: Configure Email Settings (Production)

For production, you should configure a custom SMTP server:

1. Go to **Project Settings** > **Auth**
2. Scroll to **SMTP Settings**
3. Enable custom SMTP
4. Add your SMTP credentials (e.g., SendGrid, AWS SES, Mailgun)

## Step 7: Test the Setup

1. Restart your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/sign-up`
3. Try creating a new account
4. Check your email for the confirmation link
5. Verify you can sign in

## Step 8: Verify Database Tables

1. In Supabase dashboard, go to **Table Editor**
2. You should see all the tables created:
   - profiles
   - events
   - tickets
   - orders
   - order_items
   - attendees
3. Click on each table to verify the structure

## Step 9: Test Row Level Security

The schema includes Row Level Security (RLS) policies to protect your data:

- Users can only view and edit their own profiles
- Users can only view published events (or their own unpublished events)
- Users can only view their own orders
- Event organizers can manage their own events and view attendees

To test RLS:

1. Create a test user
2. Try to access data in the Table Editor
3. You should only see data the user has permission to access

## Step 10: Set Up Real-time Subscriptions (Optional)

Supabase supports real-time updates. To enable:

1. Go to **Database** > **Replication**
2. Enable replication for tables you want to subscribe to
3. In your code, you can now use:
   ```typescript
   supabase
     .from("events")
     .on("INSERT", (payload) => {
       console.log("New event created!", payload);
     })
     .subscribe();
   ```

## Troubleshooting

### "Invalid API key" error

- Double-check your `.env.local` file
- Make sure you're using the **anon public** key, not the service role key
- Restart your development server after changing environment variables

### Email confirmation not working

- Check your spam folder
- In development, you can disable email confirmation:
  - Go to **Authentication** > **Settings**
  - Disable "Enable email confirmations"

### Database connection errors

- Verify your project is fully provisioned
- Check the Supabase status page: [https://status.supabase.com](https://status.supabase.com)

### RLS policy errors

- Make sure you're authenticated when accessing protected data
- Check the policies in the SQL Editor
- Use the Supabase logs to debug policy issues

## Next Steps

Now that Supabase is set up, you can:

1. **Create events**: Use the events service to create and manage events
2. **Implement payments**: Integrate Stripe or another payment provider
3. **Add file uploads**: Use Supabase Storage for event images
4. **Deploy to production**: Deploy your app to Vercel or Netlify

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## Support

If you encounter any issues:

- Check the [Supabase Discord](https://discord.supabase.com)
- Visit the [Supabase GitHub Discussions](https://github.com/supabase/supabase/discussions)
- Review the [Supabase Examples](https://github.com/supabase/supabase/tree/master/examples)
