# Deploying Eventeev to Vercel with Supabase

This guide will walk you through deploying your Eventeev application to Vercel with Supabase as your backend.

## Prerequisites

- ✅ Supabase project set up and configured
- ✅ Database schema executed in Supabase
- ✅ Application tested locally
- ✅ Git repository with your code
- ✅ Vercel account (free tier is fine)

## Step 1: Prepare Your Application

### 1.1 Verify Environment Variables

Make sure your `.env.local` is working locally:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 1.2 Update .gitignore

Ensure `.env.local` is in your `.gitignore`:

```
.env*
!.env.local.example
```

### 1.3 Commit Your Changes

```bash
git add .
git commit -m "Add Supabase integration"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure your project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

## Step 3: Configure Environment Variables in Vercel

### 3.1 Add Environment Variables

1. In your Vercel project dashboard, go to **Settings** > **Environment Variables**
2. Add the following variables:

| Name                            | Value                     | Environment                      |
| ------------------------------- | ------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key    | Production, Preview, Development |

### 3.2 Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** > **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3.3 Apply Environment Variables

After adding the variables:

1. Click **Save**
2. Redeploy your application for changes to take effect

## Step 4: Configure Supabase for Production

### 4.1 Add Vercel Domain to Supabase

1. In Supabase dashboard, go to **Authentication** > **URL Configuration**
2. Add your Vercel domain to **Site URL**:
   ```
   https://your-app.vercel.app
   ```
3. Add to **Redirect URLs**:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/**
   ```

### 4.2 Configure Email Templates

1. Go to **Authentication** > **Email Templates**
2. Update all email templates to use your production URL:
   - Confirmation email
   - Password reset email
   - Magic link email

Replace `{{ .ConfirmationURL }}` with your domain if needed.

### 4.3 Set Up Custom SMTP (Recommended for Production)

1. Go to **Project Settings** > **Auth**
2. Scroll to **SMTP Settings**
3. Enable custom SMTP
4. Configure with your email provider (SendGrid, AWS SES, Mailgun, etc.)

Example for SendGrid:

```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: YOUR_SENDGRID_API_KEY
Sender email: noreply@yourdomain.com
Sender name: Eventeev
```

## Step 5: Configure Custom Domain (Optional)

### 5.1 Add Custom Domain in Vercel

1. In Vercel dashboard, go to **Settings** > **Domains**
2. Add your custom domain (e.g., `eventeev.com`)
3. Configure DNS records as instructed by Vercel

### 5.2 Update Supabase URLs

Once your custom domain is active:

1. Update **Site URL** in Supabase to your custom domain
2. Update **Redirect URLs** to use your custom domain
3. Update email templates if needed

## Step 6: Test Your Deployment

### 6.1 Test Authentication

1. Visit your deployed site
2. Try signing up with a new account
3. Check email for confirmation
4. Verify you can sign in
5. Test password reset flow

### 6.2 Test Protected Routes

1. Try accessing protected pages without signing in
2. Verify you're redirected to sign-in page
3. Sign in and verify you can access protected content

### 6.3 Test Database Operations

1. Create a test event
2. Verify it appears in Supabase database
3. Test CRUD operations
4. Verify RLS policies are working

## Step 7: Monitor and Optimize

### 7.1 Set Up Monitoring

**Vercel Analytics:**

1. Go to **Analytics** in Vercel dashboard
2. Enable Web Analytics
3. Monitor page views, performance, etc.

**Supabase Monitoring:**

1. Go to **Reports** in Supabase dashboard
2. Monitor database usage
3. Check API requests
4. Review error logs

### 7.2 Enable Caching

In `next.config.ts`, add caching headers:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
        ],
      },
    ];
  },
};
```

### 7.3 Optimize Images

Use Next.js Image component for automatic optimization:

```typescript
import Image from "next/image";

<Image src="/event-banner.jpg" alt="Event" width={800} height={400} priority />;
```

## Step 8: Set Up CI/CD

### 8.1 Automatic Deployments

Vercel automatically deploys:

- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

### 8.2 Configure Branch Deployments

1. Go to **Settings** > **Git**
2. Configure which branches trigger deployments
3. Set up preview deployments for PRs

## Step 9: Security Checklist

- ✅ Environment variables are set correctly
- ✅ `.env.local` is not committed to Git
- ✅ RLS policies are enabled in Supabase
- ✅ HTTPS is enabled (automatic with Vercel)
- ✅ Email confirmation is required
- ✅ Rate limiting is configured (Supabase handles this)
- ✅ CORS is configured correctly
- ✅ Custom SMTP is set up for production emails

## Step 10: Post-Deployment Tasks

### 10.1 Update README

Update your README with:

- Live URL
- Deployment status badge
- Setup instructions for contributors

### 10.2 Set Up Error Tracking (Optional)

Consider integrating error tracking:

- Sentry
- LogRocket
- Bugsnag

### 10.3 Set Up Backups

1. In Supabase, go to **Database** > **Backups**
2. Configure automatic backups
3. Test restore process

## Troubleshooting

### Build Fails

**Error: "Module not found"**

- Run `npm install` locally
- Commit `package-lock.json`
- Redeploy

**Error: "Environment variable not defined"**

- Check environment variables in Vercel
- Ensure they're set for the correct environment
- Redeploy after adding variables

### Authentication Issues

**Error: "Invalid redirect URL"**

- Add your Vercel URL to Supabase redirect URLs
- Include both `https://your-app.vercel.app` and `https://your-app.vercel.app/**`

**Emails not sending**

- Check Supabase email settings
- Set up custom SMTP for production
- Check spam folder

### Database Connection Issues

**Error: "Failed to fetch"**

- Verify Supabase URL and anon key
- Check Supabase project is active
- Review Supabase logs

## Performance Optimization

### Enable Edge Functions

For better performance, consider using Vercel Edge Functions:

```typescript
export const config = {
  runtime: "edge",
};
```

### Use ISR (Incremental Static Regeneration)

For event pages:

```typescript
export const revalidate = 3600; // Revalidate every hour
```

### Optimize Database Queries

- Use indexes for frequently queried fields
- Limit query results
- Use pagination
- Cache results when appropriate

## Scaling Considerations

### Supabase Limits (Free Tier)

- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- 50,000 monthly active users

### Upgrade When Needed

Monitor your usage and upgrade to:

- **Pro Plan** ($25/month): 8 GB database, 100 GB bandwidth
- **Team Plan** ($599/month): Custom limits

### Vercel Limits (Free Tier)

- 100 GB bandwidth
- 6,000 build minutes
- Unlimited deployments

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Vercel + Supabase Integration](https://vercel.com/integrations/supabase)

## Support

- Vercel Support: [https://vercel.com/support](https://vercel.com/support)
- Supabase Support: [https://supabase.com/support](https://supabase.com/support)
- Community Discord: [https://discord.supabase.com](https://discord.supabase.com)

---

🎉 **Congratulations!** Your Eventeev application is now live with Supabase authentication and database!
