
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

  console.log('CategoryArchive - slug:', slug, 'subcategorySlug:', subcategorySlug);

  // Fetch category data
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      console.log('Fetching category with slug:', slug);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching category:', error);
        throw error;
      }
      console.log('Category data:', data);
      return data;
    },
    enabled: !!slug,
  });

  // Fetch subcategory data if we're viewing a subcategory
  const { data: subcategory } = useQuery({
    queryKey: ['subcategory', subcategorySlug, category?.id],
    queryFn: async () => {
      if (!subcategorySlug || !category?.id) return null;
      
      console.log('Fetching subcategory with slug:', subcategorySlug, 'parent_category_id:', category.id);
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('slug', subcategorySlug)
        .eq('parent_category_id', category.id)
        .single();

      if (error) {
        console.error('Error fetching subcategory:', error);
        throw error;
      }
      console.log('Subcategory data:', data);
      return data;
    },
    enabled: !!subcategorySlug && !!category?.id,
  });

  // Fetch posts based on whether we're viewing category or subcategory
  const { data: posts, isLoading } = useQuery({
    queryKey: ['category-posts', category?.id, subcategory?.id, isSubcategory],
    queryFn: async () => {
      if (!category?.id) {
        console.log('No category ID available');
        return [];
      }

      console.log('Fetching posts for category:', category.id, 'subcategory:', subcategory?.id, 'isSubcategory:', isSubcategory);

      if (isSubcategory && subcategory?.id) {
        // Fetch posts that belong to this subcategory
        console.log('Fetching posts for subcategory:', subcategory.id);
        const { data: postSubcategories, error } = await supabase
          .from('post_subcategories')
          .select(`
            posts (
              id,
              title,
              excerpt,
              featured_image,
              published_at,
              created_at,
              read_time,
              view_count,
              profiles (full_name)
            )
          `)
          .eq('subcategory_id', subcategory.id);

        if (error) {
          console.error('Error fetching subcategory posts:', error);
          throw error;
        }

        // Extract posts from the junction table results and filter out published posts
        const subcategoryPosts = postSubcategories
          ?.map(ps => ps.posts)
          .filter(post => post !== null)
          .filter((post: any) => post.status === 'published' || !post.status) // Include posts without status for backward compatibility
          .sort((a: any, b: any) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime()) || [];

        console.log('Subcategory posts:', subcategoryPosts);
        return subcategoryPosts;
      } else {
        // Fetch posts that belong to this category (main category view)
        console.log('Fetching posts for main category:', category.id);
        const { data: postCategories, error } = await supabase
          .from('post_categories')
          .select(`
            posts (
              id,
              title,
              excerpt,
              featured_image,
              published_at,
              created_at,
              read_time,
              view_count,
              status,
              profiles (full_name)
            )
          `)
          .eq('category_id', category.id);

        if (error) {
          console.error('Error fetching category posts:', error);
          throw error;
        }

        // Extract posts from the junction table results and filter published posts
        const categoryPosts = postCategories
          ?.map(pc => pc.posts)
          .filter(post => post !== null)
          .filter((post: any) => post.status === 'published' || !post.status) // Include posts without status for backward compatibility
          .sort((a: any, b: any) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime()) || [];

        console.log('Category posts:', categoryPosts);
        return categoryPosts;
      }
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

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-white font-bangla">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">লোড হচ্ছে...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white font-bangla">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">ক্যাটেগরি পাওয়া যায়নি।</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
          <div className="mt-2 text-sm text-gray-500">
            মোট পোস্ট: {posts?.length || 0}
          </div>
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
            {posts.map((post: any) => (
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
                          <span>{post.read_time || 5} মিনিট</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.view_count || 0}</span>
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
            <div className="mt-4 text-sm text-gray-500">
              <p>ক্যাটেগরি: {category?.name} (ID: {category?.id})</p>
              {isSubcategory && subcategory && (
                <p>সাবক্যাটেগরি: {subcategory.name} (ID: {subcategory.id})</p>
              )}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryArchive;
