
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Clock, Eye } from "lucide-react";

const CategoryArchive = () => {
  const { slug, subcategorySlug } = useParams();

  // If we have a subcategorySlug, we're viewing a subcategory
  const isSubcategory = !!subcategorySlug;

  // Fetch category data
  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Fetch subcategory data if we're viewing a subcategory
  const { data: subcategory } = useQuery({
    queryKey: ['subcategory', subcategorySlug],
    queryFn: async () => {
      if (!subcategorySlug || !category?.id) return null;
      
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('slug', subcategorySlug)
        .eq('parent_category_id', category.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!subcategorySlug && !!category?.id,
  });

  // Fetch posts based on whether we're viewing category or subcategory
  const { data: posts, isLoading } = useQuery({
    queryKey: ['category-posts', category?.id, subcategory?.id],
    queryFn: async () => {
      if (!category?.id) return [];

      let query = supabase
        .from('posts')
        .select(`
          id,
          title,
          excerpt,
          featured_image,
          published_at,
          created_at,
          read_time,
          view_count,
          profiles (full_name)
        `)
        .eq('category_id', category.id)
        .eq('status', 'published');

      // If we're viewing a subcategory, filter by subcategory_id
      if (isSubcategory && subcategory?.id) {
        query = query.eq('subcategory_id', subcategory.id);
      }

      query = query.order('published_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!category?.id,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get display name and description
  const displayName = isSubcategory ? subcategory?.name : category?.name;
  const displayDescription = isSubcategory 
    ? `${category?.name} > ${subcategory?.name} বিভাগের সকল সংবাদ`
    : `${category?.name} বিভাগের সকল সংবাদ`;

  return (
    <div className="min-h-screen bg-white font-bangla">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {displayName || 'ক্যাটেগরি'}
          </h1>
          <p className="text-gray-600">
            {displayDescription}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} to={`/post/${post.id}`} className="group">
                <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.featured_image || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=240&fit=crop"} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h2 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span>{post.profiles?.full_name}</span>
                        <span>•</span>
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.read_time} মিনিট</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.view_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">এই ক্যাটেগরিতে কোনো সংবাদ পাওয়া যায়নি।</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryArchive;
