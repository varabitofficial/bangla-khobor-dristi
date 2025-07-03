
-- =====================================================
-- NewsViewBD Database Schema Migration Script
-- Version: 1.0
-- Created: 2025
-- Description: Complete database schema for NewsViewBD news platform
-- =====================================================
-- 
-- IMPORTANT: Run this script on a FRESH Supabase instance only!
-- This script will create all necessary tables, functions, policies, and storage buckets.
-- 
-- Usage:
-- 1. Create a new Supabase project
-- 2. Open SQL Editor in Supabase dashboard
-- 3. Copy and paste this entire script
-- 4. Click "Run" to execute
-- 
-- =====================================================

-- Create custom types/enums first
CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'reader');

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'reader',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- Categories table
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- Subcategories table
CREATE TABLE public.subcategories (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    parent_category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- Tags table
CREATE TABLE public.tags (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- Posts table
CREATE TABLE public.posts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    read_time INTEGER DEFAULT 5,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- Post tags junction table
CREATE TABLE public.post_tags (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    UNIQUE(post_id, tag_id)
);

-- Videos table
CREATE TABLE public.videos (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail TEXT,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- Opinions table
CREATE TABLE public.opinions (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_role TEXT,
    author_image TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- Comments table
CREATE TABLE public.comments (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- Newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- Advertisements table
CREATE TABLE public.advertisements (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT NOT NULL,
    location TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Performance indexes
CREATE INDEX idx_posts_category_id ON public.posts(category_id);
CREATE INDEX idx_posts_author_id ON public.posts(author_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX idx_posts_is_featured ON public.posts(is_featured);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_is_approved ON public.comments(is_approved);
CREATE INDEX idx_videos_author_id ON public.videos(author_id);
CREATE INDEX idx_subcategories_parent_category_id ON public.subcategories(parent_category_id);

-- =====================================================
-- SECURITY FUNCTIONS
-- =====================================================

-- Function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = auth.uid();
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    'reader'
  );
  RETURN NEW;
END;
$$;

-- Function to increment post view count
CREATE OR REPLACE FUNCTION public.increment_post_view_count(post_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$;

-- Function to increment video view count
CREATE OR REPLACE FUNCTION public.increment_video_view_count(video_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.videos
  SET view_count = view_count + 1
  WHERE id = video_id;
END;
$$;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opinions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (get_current_user_role() = 'admin');

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins and editors can create categories" ON public.categories
  FOR INSERT WITH CHECK (get_current_user_role() = ANY (ARRAY['admin', 'editor']));

CREATE POLICY "Only admins and editors can update categories" ON public.categories
  FOR UPDATE USING (get_current_user_role() = ANY (ARRAY['admin', 'editor']));

CREATE POLICY "Only admins and editors can delete categories" ON public.categories
  FOR DELETE USING (get_current_user_role() = ANY (ARRAY['admin', 'editor']));

-- Subcategories policies
CREATE POLICY "Anyone can view subcategories" ON public.subcategories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage subcategories" ON public.subcategories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = ANY (ARRAY['admin'::user_role, 'editor'::user_role])
    )
  );

-- Tags policies
CREATE POLICY "Anyone can view tags" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage tags" ON public.tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = ANY (ARRAY['admin'::user_role, 'editor'::user_role])
    )
  );

-- Posts policies
CREATE POLICY "Posts are viewable by everyone" ON public.posts
  FOR SELECT USING (true);

CREATE POLICY "Only admins and editors can create posts" ON public.posts
  FOR INSERT WITH CHECK (get_current_user_role() = ANY (ARRAY['admin', 'editor']));

CREATE POLICY "Admins can update any post" ON public.posts
  FOR UPDATE USING (get_current_user_role() = 'admin');

CREATE POLICY "Authors can update their own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Admins can delete any post" ON public.posts
  FOR DELETE USING (get_current_user_role() = 'admin');

CREATE POLICY "Authors can delete their own posts" ON public.posts
  FOR DELETE USING (auth.uid() = author_id);

-- Post tags policies
CREATE POLICY "Anyone can view post tags" ON public.post_tags
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage post tags" ON public.post_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = ANY (ARRAY['admin'::user_role, 'editor'::user_role])
    )
  );

-- Videos policies
CREATE POLICY "Videos are viewable by everyone" ON public.videos
  FOR SELECT USING (true);

CREATE POLICY "Only admins and editors can create videos" ON public.videos
  FOR INSERT WITH CHECK (get_current_user_role() = ANY (ARRAY['admin', 'editor']));

CREATE POLICY "Admins can update any video" ON public.videos
  FOR UPDATE USING (get_current_user_role() = 'admin');

CREATE POLICY "Authors can update their own videos" ON public.videos
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Admins can delete any video" ON public.videos
  FOR DELETE USING (get_current_user_role() = 'admin');

CREATE POLICY "Authors can delete their own videos" ON public.videos
  FOR DELETE USING (auth.uid() = author_id);

-- Opinions policies
CREATE POLICY "Anyone can view opinions" ON public.opinions
  FOR SELECT USING (true);

CREATE POLICY "Admins and editors can manage opinions" ON public.opinions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = ANY (ARRAY['admin'::user_role, 'editor'::user_role])
    )
  );

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (is_approved OR (auth.uid() = user_id) OR (get_current_user_role() = ANY (ARRAY['admin', 'editor'])));

CREATE POLICY "Logged-in users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins and editors can update any comment" ON public.comments
  FOR UPDATE USING (get_current_user_role() = ANY (ARRAY['admin', 'editor']));

CREATE POLICY "Admins and editors can delete any comment" ON public.comments
  FOR DELETE USING (get_current_user_role() = ANY (ARRAY['admin', 'editor']));

-- Newsletter policies
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (get_current_user_role() = 'admin');

CREATE POLICY "Only admins can delete subscribers" ON public.newsletter_subscribers
  FOR DELETE USING (get_current_user_role() = 'admin');

-- Advertisements policies
CREATE POLICY "Active ads are viewable by everyone" ON public.advertisements
  FOR SELECT USING (is_active OR (get_current_user_role() = ANY (ARRAY['admin', 'editor'])));

CREATE POLICY "Only admins can create ads" ON public.advertisements
  FOR INSERT WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Only admins can update ads" ON public.advertisements
  FOR UPDATE USING (get_current_user_role() = 'admin');

CREATE POLICY "Only admins can delete ads" ON public.advertisements
  FOR DELETE USING (get_current_user_role() = 'admin');

-- =====================================================
-- STORAGE BUCKETS AND POLICIES
-- =====================================================

-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true);

-- Storage policies for post-images bucket
CREATE POLICY "Anyone can view post images" ON storage.objects
  FOR SELECT USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'post-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own post images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own post images" ON storage.objects
  FOR DELETE USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- SAMPLE DATA (BOOTSTRAP YOUR APPLICATION)
-- =====================================================

-- Insert sample categories (matching your application)
INSERT INTO public.categories (name, slug) VALUES
('রাজনীতি', 'politics'),
('অর্থনীতি', 'economy'),
('ব্যবসা', 'business'),
('বাংলাদেশ', 'bangladesh'),
('বিশ্ব', 'world'),
('স্বাস্থ্য', 'health'),
('প্রযুক্তি', 'technology'),
('সংস্কৃতি', 'culture'),
('বিনোদন', 'entertainment'),
('খেলা', 'sports');

-- Insert sample tags
INSERT INTO public.tags (name, slug) VALUES
('সংবাদ', 'news'),
('আপডেট', 'update'),
('বিশেষ', 'special'),
('জরুরি', 'urgent'),
('ট্রেন্ডিং', 'trending'),
('ব্রেকিং', 'breaking'),
('এক্সক্লুসিভ', 'exclusive'),
('লাইভ', 'live'),
('রিপোর্ট', 'report'),
('বিশ্লেষণ', 'analysis');

-- =====================================================
-- COMPLETION
-- =====================================================

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'NewsViewBD Schema Migration Completed!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables created: 11';
  RAISE NOTICE 'Functions created: 4';
  RAISE NOTICE 'Policies created: 30+';
  RAISE NOTICE 'Storage buckets created: 1';
  RAISE NOTICE 'Sample data inserted: Categories & Tags';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Update your application configuration';
  RAISE NOTICE '2. Create your first admin user';
  RAISE NOTICE '3. Test the application';
  RAISE NOTICE '========================================';
END $$;
