
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState<string>("");

  // Fetch categories from database
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Fetch posts for the active category
  const { data: categoryPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['category-posts', activeTab],
    queryFn: async () => {
      if (!activeTab) return null;
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (name, slug),
          profiles (full_name)
        `)
        .eq('status', 'published')
        .eq('categories.slug', activeTab)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!activeTab,
  });

  // Set default active tab when categories load
  React.useEffect(() => {
    if (categories && categories.length > 0 && !activeTab) {
      setActiveTab(categories[0].slug);
    }
  }, [categories, activeTab]);

  // Fetch popular posts for sidebar
  const { data: popularPosts } = useQuery({
    queryKey: ['popular-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories (name)
        `)
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (categoriesLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">কোন ক্যাটেগরি পাওয়া যায়নি</h2>
          <p className="text-gray-600">অনুগ্রহ করে অ্যাডমিন প্যানেল থেকে ক্যাটেগরি তৈরি করুন।</p>
        </div>
      </section>
    );
  }

  const mainPost = categoryPosts?.[0];
  const relatedPosts = categoryPosts?.slice(1) || [];

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.slug)}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                    activeTab === category.slug
                      ? "border-red-600 text-red-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          {postsLoading ? (
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : mainPost ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Featured Article */}
              <div className="md:col-span-2">
                <Link to={`/post/${mainPost.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src={mainPost.featured_image || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop"} 
                      alt={mainPost.title}
                      className="w-full h-64 md:h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-gray-200 transition-colors">
                        {mainPost.title}
                      </h3>
                      <p className="text-sm text-gray-200 line-clamp-2">
                        {mainPost.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Related Articles */}
              <div className="space-y-4">
                {relatedPosts.map((article) => (
                  <Link key={article.id} to={`/post/${article.id}`} className="group block">
                    <article className="border-b border-gray-200 pb-4">
                      <h3 className="text-gray-900 font-medium mb-1 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {new Date(article.created_at).toLocaleDateString('bn-BD')}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-bold text-gray-900 mb-4">এই ক্যাটেগরিতে কোন পোস্ট নেই</h3>
              <p className="text-gray-600">শীঘ্রই নতুন পোস্ট যোগ করা হবে।</p>
            </div>
          )}

          {/* View All Link */}
          {mainPost && (
            <div className="mt-8 text-center">
              <Link
                to={`/category/${activeTab}`}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                আরো দেখুন
                <span className="ml-2">→</span>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">জনপ্রিয় সংবাদ</h3>
            <div className="space-y-4">
              {popularPosts?.map((post, index) => (
                <Link key={post.id} to={`/post/${post.id}`} className="group block">
                  <article className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h4>
                  </article>
                </Link>
              )) || [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="h-4 bg-gray-200 animate-pulse rounded flex-1"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Ad banner in sidebar */}
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="text-gray-500">
              <div className="text-base font-medium mb-2">বিজ্ঞাপন</div>
              <div className="text-xs">Ad Space Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryTabs;
