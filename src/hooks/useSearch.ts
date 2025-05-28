
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];

      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          excerpt,
          featured_image,
          published_at,
          categories (name, slug)
        `)
        .eq('status', 'published')
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: searchQuery.trim().length > 0,
  });

  const performSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  return {
    searchQuery,
    searchResults: searchResults || [],
    isLoading,
    isSearching,
    performSearch,
    clearSearch,
  };
};
