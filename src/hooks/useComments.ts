
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Comment = Tables<'comments'> & {
  profiles: Tables<'profiles'>;
  replies?: Comment[];
};

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('comments')
        .select(`
          *,
          profiles (full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      // If user is logged in, show approved comments + their own pending comments
      if (user) {
        query = query.or(`is_approved.eq.true,and(user_id.eq.${user.id},is_approved.eq.false)`);
      } else {
        // If not logged in, only show approved comments
        query = query.eq('is_approved', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Organize comments into nested structure
      const commentsMap = new Map();
      const rootComments: Comment[] = [];

      data.forEach((comment) => {
        commentsMap.set(comment.id, { ...comment, replies: [] });
      });

      data.forEach((comment) => {
        if (comment.parent_id) {
          const parent = commentsMap.get(comment.parent_id);
          if (parent) {
            parent.replies.push(commentsMap.get(comment.id));
          }
        } else {
          rootComments.push(commentsMap.get(comment.id));
        }
      });

      return rootComments;
    },
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, postId, parentId }: { content: string; postId: string; parentId?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          post_id: postId,
          user_id: user.id,
          parent_id: parentId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments', data.post_id] });
    },
  });
};
