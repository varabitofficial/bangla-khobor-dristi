
import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const LatestNews = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['latest-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (name),
          profiles (full_name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">সর্বশেষ সংবাদ</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200">
              <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">কোন পোস্ট পাওয়া যায়নি</h2>
          <p className="text-gray-600">অনুগ্রহ করে অ্যাডমিন প্যানেল থেকে পোস্ট তৈরি করুন।</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">সর্বশেষ সংবাদ</h2>
        <Link to="/posts" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
          সব দেখুন
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((item) => (
          <Link key={item.id} to={`/post/${item.id}`} className="group">
            <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="relative overflow-hidden">
                <img 
                  src={item.featured_image || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&h=200&fit=crop"} 
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded">
                  {item.categories?.name}
                </span>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.created_at).toLocaleDateString('bn-BD')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.read_time} মিনিট</span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LatestNews;
