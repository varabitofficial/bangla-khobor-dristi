
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

const RelatedNews = ({ category, currentPostId }: { category: string; currentPostId: string }) => {
  // Mock data - would come from Supabase later
  const relatedNews = [
    {
      id: "rel1",
      title: "সরকারি স্কুলের শিক্ষকদের জন্য নতুন প্রশিক্ষণ প্রকল্প ঘোষণা",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=120&h=80&fit=crop",
      date: "২২ মে, ২০২৪",
      readTime: "৪ মিনিট"
    },
    {
      id: "rel2",
      title: "প্রাথমিক শিক্ষায় নতুন পাঠ্যক্রম চালু হবে আগামী শিক্ষাবর্ষ থেকে",
      image: "https://images.unsplash.com/photo-1605810231580-bcac31801077?w=120&h=80&fit=crop",
      date: "২১ মে, ২০২৪",
      readTime: "৩ মিনিট"
    },
    {
      id: "rel3",
      title: "উচ্চশিক্ষায় ভর্তি পরীক্ষার নতুন নিয়মাবলী প্রকাশ",
      image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=120&h=80&fit=crop",
      date: "২০ মে, ২০২৪",
      readTime: "৫ মিনিট"
    }
  ];

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">সম্পর্কিত সংবাদ</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedNews.map((news) => (
          <Link key={news.id} to={`/post/${news.id}`} className="group">
            <article className="flex flex-col">
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {news.title}
              </h3>
              
              <div className="mt-auto flex items-center gap-4 text-xs text-gray-500">
                <span>{news.date}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{news.readTime}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedNews;
