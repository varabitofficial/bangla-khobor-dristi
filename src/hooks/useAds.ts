
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAds = (location?: string) => {
  return useQuery({
    queryKey: ['ads', location],
    queryFn: async () => {
      let query = supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true);

      if (location) {
        query = query.eq('location', location);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
