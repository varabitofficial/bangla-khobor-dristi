
import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const FeaturedVideos = () => {
  const { data: videos, isLoading } = useQuery({
    queryKey: ['featured-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const getYoutubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoId ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg` : null;
  };

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">বিশেষ ভিডিও</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200">
              <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">বিশেষ ভিডিও</h2>
          <Link to="/videos" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
            সব দেখুন
            <span>→</span>
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">কোন ভিডিও পাওয়া যায়নি।</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">বিশেষ ভিডিও</h2>
        <Link to="/videos" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
          সব দেখুন
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => {
          const thumbnailUrl = video.thumbnail || getYoutubeThumbnail(video.video_url) || "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=240&fit=crop";
          
          return (
            <Link key={video.id} to={`/video/${video.id}`} className="group block">
              <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src={thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-60 p-4 rounded-full">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(video.created_at).toLocaleDateString('bn-BD')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{video.view_count || 0} দেখা হয়েছে</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedVideos;
