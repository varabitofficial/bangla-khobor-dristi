
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar } from 'lucide-react';

type Opinion = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  author_name: string;
  author_role: string | null;
  author_image: string | null;
  created_at: string;
  updated_at: string;
};

const OpinionsArchive = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const { data: opinions, isLoading } = useQuery({
    queryKey: ['opinions-archive', searchTerm, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('opinions')
        .select('*');

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      if (sortBy === 'latest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Opinion[];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">মতামত এবং বিশ্লেষণ</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="মতামত খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="সর্ট করুন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">নতুন আগে</SelectItem>
                <SelectItem value="oldest">পুরাতন আগে</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
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
        ) : opinions && opinions.length > 0 ? (
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
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">কোন মতামত পাওয়া যায়নি</h2>
            <p className="text-gray-600">আপনার অনুসন্ধান পরিবর্তন করে আবার চেষ্টা করুন।</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default OpinionsArchive;
