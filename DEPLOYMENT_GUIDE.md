
# NewsViewBD Database Schema Deployment Guide

This guide will help you deploy the NewsViewBD application to a new company using a fresh Supabase instance.

## 📋 Prerequisites

- A new Supabase account/project
- Access to the Supabase dashboard
- The NewsViewBD database schema migration script
- Node.js and npm/yarn installed locally

## 🚀 Step-by-Step Deployment Process

### Step 1: Create New Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: Your new company's project name
   - **Database Password**: Create a strong password (save it securely)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project initialization (2-3 minutes)

### Step 2: Get Your New Project Credentials

1. In your new project dashboard, go to **Settings** → **API**
2. Copy and save these values:
   - **Project URL**: `https://[project-ref].supabase.co`
   - **Project Reference ID**: `[project-ref]` 
   - **API Keys**:
     - `anon` key (public key)
     - `service_role` key (secret key - keep secure)

### Step 3: Run the Database Schema Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `database_schema_migration.sql` 
4. Paste it into the SQL editor
5. Click "Run" to execute the migration
6. You should see "Success. No rows returned" - this is normal and expected

### Step 4: Verify Schema Creation

1. Go to **Database** → **Tables** in your Supabase dashboard
2. Verify these tables were created:
   - `profiles`
   - `categories` 
   - `subcategories`
   - `tags`
   - `posts`
   - `post_tags`
   - `videos`
   - `opinions`
   - `comments`
   - `newsletter_subscribers`
   - `advertisements`

3. Go to **Storage** and verify the `post-images` bucket was created

### Step 5: Update Application Configuration

1. Clone or download the NewsViewBD application code
2. Update the Supabase configuration file:

   **File**: `src/integrations/supabase/client.ts`
   
   Replace the existing values with your new project credentials:
   ```typescript
   const SUPABASE_URL = "https://YOUR_NEW_PROJECT_REF.supabase.co";
   const SUPABASE_PUBLISHABLE_KEY = "YOUR_NEW_ANON_KEY_HERE";
   ```

3. Update the project configuration:

   **File**: `supabase/config.toml`
   
   Replace with your new project ID:
   ```toml
   project_id = "YOUR_NEW_PROJECT_REF"
   ```

### Step 6: Configure Authentication (Optional)

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure your preferred authentication providers:
   - **Email**: Enable email/password authentication
   - **Social providers**: Configure Google, GitHub, etc. if needed
3. Set up email templates and SMTP settings if using email auth

### Step 7: Set Up Storage Policies (Already Done)

The migration script already created the necessary storage bucket and policies, but verify:

1. Go to **Storage** → **Policies**
2. Verify policies exist for the `post-images` bucket:
   - Anyone can view post images
   - Authenticated users can upload
   - Users can manage their own uploads

### Step 8: Create Your First Admin User

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Enter admin details:
   - **Email**: Your admin email
   - **Password**: Strong password
   - **Email Confirm**: Check this box
4. After creating, go to **SQL Editor** and run:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE id = 'USER_ID_FROM_AUTH_USERS';
   ```

### Step 9: Test the Application

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Test key functionality:
   - User registration/login
   - Admin panel access
   - Creating posts, categories
   - File upload functionality
   - Comments system

## 🔧 Configuration Files to Update

### Required Updates

| File | What to Update | Example |
|------|---------------|---------|
| `src/integrations/supabase/client.ts` | SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY | See Step 5 |
| `supabase/config.toml` | project_id | See Step 5 |

### Optional Updates

| File/Setting | Purpose | Notes |
|-------------|---------|-------|
| Authentication providers | Social login setup | Configure in Supabase dashboard |
| SMTP settings | Email functionality | For password reset, notifications |
| Storage settings | File upload limits | Configure bucket size limits |
| Custom domain | Brand consistency | Requires paid Supabase plan |

## 📊 Database Schema Overview

### Core Tables

- **profiles**: User information and roles
- **categories**: News categories (রাজনীতি, অর্থনীতি, etc.)
- **posts**: News articles and content
- **comments**: User comments on posts
- **videos**: Video content management
- **opinions**: Opinion pieces and editorials

### Security Features

- **Row Level Security (RLS)**: All tables protected
- **Role-based access**: Admin, Editor, Reader roles
- **Secure functions**: Database functions with proper security
- **Authentication**: Integration with Supabase Auth

## 🛡️ Security Considerations

1. **API Keys**: Keep service_role key secure, never expose in frontend
2. **RLS Policies**: Review and test all security policies
3. **Admin Access**: Limit admin role assignments
4. **File Uploads**: Monitor storage usage and implement size limits
5. **Rate Limiting**: Consider implementing rate limits for API calls

## 🚨 Troubleshooting

### Common Issues

1. **Migration Fails**: 
   - Ensure you're using a fresh, empty database
   - Check for any existing schema conflicts

2. **Connection Issues**:
   - Verify URL and API keys are correct
   - Check network/firewall settings

3. **Authentication Problems**:
   - Confirm email settings in Supabase
   - Verify RLS policies are working

4. **File Upload Issues**:
   - Check storage bucket policies
   - Verify bucket is public if needed

### Getting Help

- Check Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
- Review application logs in browser developer tools
- Check Supabase dashboard logs and metrics

## 📈 Post-Deployment Steps

1. **Backup Strategy**: Set up regular database backups
2. **Monitoring**: Monitor usage and performance
3. **Updates**: Keep dependencies updated
4. **Content**: Import or create initial content
5. **SEO**: Configure meta tags and sitemap
6. **Analytics**: Set up usage tracking if needed

## ✅ Deployment Checklist

- [ ] New Supabase project created
- [ ] Database schema migrated successfully
- [ ] Application configuration updated
- [ ] Authentication configured
- [ ] Storage bucket verified
- [ ] Admin user created
- [ ] Application tested locally
- [ ] Production deployment (if ready)
- [ ] Backup strategy implemented
- [ ] Monitoring set up

---

**Success!** Your NewsViewBD application is now ready to use with your new Supabase instance. The database schema has been replicated exactly, maintaining all functionality while being completely independent of the original database.
