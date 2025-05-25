
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

const RelatedNews = ({ category, currentPostId }: { category: string; currentPostId: string }) => {
  const { data: relatedNews, isLoading } = useQuery({
    queryKey: ['related-news', category, currentPostId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          featured_image,
          published_at,
          created_at,
          read_time,
          categories (name)
        `)
        .eq('status', 'published')
        .eq('categories.name', category)
        .neq('id', currentPostId)
        .limit(3)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!category && !!currentPostId,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">সম্পর্কিত সংবাদ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!relatedNews || relatedNews.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">সম্পর্কিত সংবাদ</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedNews.map((news) => (
          <Link key={news.id} to={`/post/${news.id}`} className="group">
            <article className="flex flex-col">
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img 
                  src={news.featured_image || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=120&h=80&fit=crop"} 
                  alt={news.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {news.title}
              </h3>
              
              <div className="mt-auto flex items-center gap-4 text-xs text-gray-500">
                <span>{formatDate(news.published_at || news.created_at)}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{news.read_time} মিনিট</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedNews;
