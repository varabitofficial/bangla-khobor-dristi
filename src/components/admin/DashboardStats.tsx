
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, MessageSquare, Video } from 'lucide-react';

const DashboardStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [postsResult, usersResult, commentsResult, videosResult] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('comments').select('id', { count: 'exact', head: true }),
        supabase.from('videos').select('id', { count: 'exact', head: true })
      ]);

      return {
        posts: postsResult.count || 0,
        users: usersResult.count || 0,
        comments: commentsResult.count || 0,
        videos: videosResult.count || 0
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'মোট পোস্ট',
      value: stats?.posts || 0,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'মোট ইউজার',
      value: stats?.users || 0,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'মোট মন্তব্য',
      value: stats?.comments || 0,
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      title: 'মোট ভিডিও',
      value: stats?.videos || 0,
      icon: Video,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
