
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Post = Tables<'posts'> & {
  categories: Tables<'categories'>;
  profiles: Tables<'profiles'>;
};

export const usePosts = (limit?: number, featured?: boolean) => {
  return useQuery({
    queryKey: ['posts', limit, featured],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          categories (name, slug),
          profiles (full_name)
        `)
        .order('created_at', { ascending: false });

      if (featured) {
        query = query.eq('is_featured', true);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Post[];
    },
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (name, slug),
          profiles (full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Increment view count
      await supabase.rpc('increment_post_view_count', { post_id: id });

      return data as Post;
    },
  });
};

export const usePostsByCategory = (categorySlug: string, limit?: number) => {
  return useQuery({
    queryKey: ['posts', 'category', categorySlug, limit],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          categories!inner (name, slug),
          profiles (full_name)
        `)
        .eq('categories.slug', categorySlug)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Post[];
    },
  });
};
