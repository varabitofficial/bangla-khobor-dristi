
-- Create a junction table for post-category relationships
CREATE TABLE public.post_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(post_id, category_id)
);

-- Create a junction table for post-subcategory relationships  
CREATE TABLE public.post_subcategories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    subcategory_id UUID NOT NULL REFERENCES public.subcategories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(post_id, subcategory_id)
);

-- Add RLS policies for post_categories
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view post categories" ON public.post_categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins and editors can manage post categories" ON public.post_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = ANY (ARRAY['admin'::user_role, 'editor'::user_role])
    )
  );

-- Add RLS policies for post_subcategories
ALTER TABLE public.post_subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view post subcategories" ON public.post_subcategories
  FOR SELECT USING (true);

CREATE POLICY "Only admins and editors can manage post subcategories" ON public.post_subcategories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = ANY (ARRAY['admin'::user_role, 'editor'::user_role])
    )
  );

-- Add indexes for better performance
CREATE INDEX idx_post_categories_post_id ON public.post_categories(post_id);
CREATE INDEX idx_post_categories_category_id ON public.post_categories(category_id);
CREATE INDEX idx_post_subcategories_post_id ON public.post_subcategories(post_id);
CREATE INDEX idx_post_subcategories_subcategory_id ON public.post_subcategories(subcategory_id);

-- Migration script to move existing post category/subcategory data to junction tables
-- Insert existing category relationships
INSERT INTO public.post_categories (post_id, category_id)
SELECT id, category_id 
FROM public.posts 
WHERE category_id IS NOT NULL;

-- Insert existing subcategory relationships
INSERT INTO public.post_subcategories (post_id, subcategory_id)
SELECT id, subcategory_id 
FROM public.posts 
WHERE subcategory_id IS NOT NULL;
