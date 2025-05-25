
import { useParams, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import CommentSection from "@/components/CommentSection";
import RelatedNews from "@/components/RelatedNews";
import { Calendar, Clock, User } from "lucide-react";
import { useEffect } from "react";

const PostSingle = () => {
  const { id } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (name),
          subcategories (name),
          profiles (full_name),
          post_tags (
            tags (name)
          )
        `)
        .eq('id', id)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Increment view count when post loads
  useEffect(() => {
    if (post?.id) {
      supabase.rpc('increment_post_view_count', { post_id: post.id });
    }
  }, [post?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-bangla">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
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

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white font-bangla">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">পোস্ট পাওয়া যায়নি</h1>
            <p className="text-gray-600 mb-8">দুঃখিত, এই পোস্টটি খুঁজে পাওয়া যায়নি।</p>
            <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              হোমে ফিরুন
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const tags = post.post_tags?.map(pt => pt.tags.name) || [];

  return (
    <div className="min-h-screen bg-white font-bangla">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:text-black">হোম</Link>
            <span className="mx-2">/</span>
            <Link to={`/category/${post.categories?.name}`} className="hover:text-black">
              {post.categories?.name}
            </Link>
            {post.subcategories && (
              <>
                <span className="mx-2">/</span>
                <span className="text-black">{post.subcategories.name}</span>
              </>
            )}
          </nav>

          {/* Article Header */}
          <article className="bg-white">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-red-600 text-white px-3 py-1 text-sm font-medium">
                  {post.categories?.name}
                </span>
                {post.subcategories && (
                  <span className="bg-gray-600 text-white px-3 py-1 text-sm font-medium">
                    {post.subcategories.name}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.profiles?.full_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.published_at || post.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.read_time} মিনিট পড়ার সময়</span>
                </div>
                {post.view_count > 0 && (
                  <div className="flex items-center gap-2">
                    <span>{post.view_count} বার পড়া হয়েছে</span>
                  </div>
                )}
              </div>
            </header>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-8">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <div className="mb-6 p-4 bg-gray-50 border-l-4 border-blue-600 italic text-gray-700">
                {post.excerpt}
              </div>
            )}

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Mid-content Ad */}
            <div className="my-12">
              <AdBanner />
            </div>

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600">ট্যাগ:</span>
                  {tags.map((tag) => (
                    <Link 
                      key={tag} 
                      to={`/tag/${tag}`}
                      className="bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded hover:bg-gray-200 cursor-pointer"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </footer>
          </article>

          {/* Comments Section */}
          <CommentSection postId={post.id} />

          {/* Post-comments Ad */}
          <div className="my-12">
            <AdBanner />
          </div>

          {/* Related News */}
          <RelatedNews category={post.categories?.name} currentPostId={post.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostSingle;
