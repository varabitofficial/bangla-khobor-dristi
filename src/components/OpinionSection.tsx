
import { Link } from "react-router-dom";
import { User, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const OpinionSection = () => {
  const { data: opinions, isLoading } = useQuery({
    queryKey: ['featured-opinions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opinions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">মতামত এবং বিশ্লেষণ</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border-t-4 border-gray-800 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!opinions || opinions.length === 0) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">মতামত এবং বিশ্লেষণ</h2>
          <Link to="/opinions" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
            আরো মতামত
            <span>→</span>
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">কোন মতামত পাওয়া যায়নি।</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">মতামত এবং বিশ্লেষণ</h2>
        <Link to="/opinions" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
          আরো মতামত
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {opinions.map((opinion) => (
          <Link key={opinion.id} to={`/opinion/${opinion.id}`} className="group">
            <article className="bg-white border-t-4 border-gray-800 p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={opinion.author_image || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"} 
                    alt={opinion.author_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{opinion.author_name}</h3>
                  <p className="text-sm text-gray-600">{opinion.author_role}</p>
                </div>
              </div>
              
              <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                {opinion.title}
              </h2>
              {opinion.excerpt && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {opinion.excerpt}
                </p>
              )}
              
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(opinion.created_at).toLocaleDateString('bn-BD')}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default OpinionSection;
