
import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const HeroSection = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['featured-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (name),
          profiles (full_name)
        `)
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-red-100">

          {/* First Column – 50% width (col-span-2) */}
          <div className="col-span-1 lg:col-span-2">
            <div className="w-full h-80 lg:h-96 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>

          {/* Second Column – 25% width (col-span-1) */}
          <div className="col-span-1">
            <div className="space-y-6">
              <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          </div>

          {/* Third Column – 25% width (col-span-1) */}
          <div className="col-span-1">
            <div className="space-y-6">
              <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          </div>

        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">কোন ফিচারড পোস্ট পাওয়া যায়নি</h2>
          <p className="text-gray-600">অনুগ্রহ করে অ্যাডমিন প্যানেল থেকে পোস্ট তৈরি করুন।</p>
        </div>
      </section>
    );
  }

  const [featuredStory, ...supportingStories] = posts;
  const firstColumnStories = supportingStories.slice(0, 2);
  const secondColumnStories = supportingStories.slice(2, 4);

  return (
    <section className="w-full px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">

        {/* Main Featured Story - First Column */}
        <div className="col-span-1 lg:col-span-2">
          <Link to={`/post/${featuredStory.id}`} className="group block h-full">
            <div className="relative overflow-hidden rounded-lg h-full">
              <img
                src={
                  featuredStory.featured_image ||
                  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop"
                }
                alt={featuredStory.title}
                className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="bg-red-600 text-white px-3 py-1 text-sm font-medium rounded mb-3 inline-block">
                  {featuredStory.categories?.name}
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight group-hover:text-gray-200 transition-colors">
                  {featuredStory.title}
                </h2>
                <p className="text-gray-200 mb-4 line-clamp-2">{featuredStory.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(featuredStory.created_at).toLocaleDateString('bn-BD')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{featuredStory.read_time} মিনিট</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Supporting Stories - Second Column */}
        <div className="col-span-1 h-full flex flex-col justify-between gap-4">
          {firstColumnStories.map((story) => (
            <Link key={story.id} to={`/post/${story.id}`} className="group block flex-1">
              <div className="relative overflow-hidden rounded-lg h-full">
                <img
                  src={
                    story.featured_image ||
                    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop"
                  }
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <span className="bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded mb-2 inline-block">
                    {story.categories?.name}
                  </span>
                  <h3 className="text-sm font-semibold leading-tight group-hover:text-gray-200 transition-colors">
                    {story.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Supporting Stories - Third Column */}
        <div className="col-span-1 h-full flex flex-col justify-between gap-4">
          {secondColumnStories.map((story) => (
            <Link key={story.id} to={`/post/${story.id}`} className="group block flex-1">
              <div className="relative overflow-hidden rounded-lg h-full">
                <img
                  src={
                    story.featured_image ||
                    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop"
                  }
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <span className="bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded mb-2 inline-block">
                    {story.categories?.name}
                  </span>
                  <h3 className="text-sm font-semibold leading-tight group-hover:text-gray-200 transition-colors">
                    {story.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
