
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import { Calendar, Eye, Play } from 'lucide-react';
import { useEffect } from 'react';

type Video = {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail: string | null;
  view_count: number | null;
  created_at: string;
  published_at: string | null;
  profiles: {
    full_name: string;
  };
};

// Function to extract YouTube video ID and get embed URL
const getYouTubeEmbedUrl = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url;
};

const VideoSingle = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: video, isLoading, error } = useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      if (!id) throw new Error('Video ID is required');
      
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles (full_name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Video;
    },
    enabled: !!id,
  });

  // Increment view count
  const incrementViewMutation = useMutation({
    mutationFn: async () => {
      if (!id) return;
      const { error } = await supabase.rpc('increment_video_view_count', {
        video_id: id
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video', id] });
    },
  });

  useEffect(() => {
    if (video) {
      incrementViewMutation.mutate();
    }
  }, [video]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-8 w-1/3"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">ভিডিও পাওয়া যায়নি</h1>
            <p className="text-gray-600">এই ভিডিওটি খুঁজে পাওয়া যায়নি অথবা মুছে ফেলা হয়েছে।</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(video.video_url);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Video Player */}
          <div className="aspect-video mb-6">
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Info */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {video.title}
            </h1>
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(video.created_at).toLocaleDateString('bn-BD')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{video.view_count || 0} বার দেখা হয়েছে</span>
                </div>
              </div>
              <span>প্রকাশক: {video.profiles?.full_name}</span>
            </div>

            {video.description && (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {video.description}
                </p>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <CommentSection postId={video.id} />
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default VideoSingle;
