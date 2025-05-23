
import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";

const LatestNews = () => {
  const newsItems = [
    {
      id: "4",
      title: "সংসদে নতুন শিক্ষা বিল পাস",
      excerpt: "সংসদে নতুন শিক্ষা বিল পাস হয়েছে। এতে শিক্ষাব্যবস্থায় আমূল পরিবর্তন আনা হবে।",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=300&h=200&fit=crop",
      category: "রাজনীতি",
      date: "২৩ মে, ২০২৪",
      readTime: "৩ মিনিট"
    },
    {
      id: "5",
      title: "নতুন প্রযুক্তি কেন্দ্র উদ্বোধন",
      excerpt: "চট্টগ্রামে নতুন প্রযুক্তি কেন্দ্র উদ্বোধন করা হয়েছে। এতে হাজারো তরুণের কর্মসংস্থান হবে।",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop",
      category: "প্রযুক্তি",
      date: "২২ মে, ২০২৪",
      readTime: "৪ মিনিট"
    },
    {
      id: "6",
      title: "অর্থনৈতিক প্রবৃদ্ধিতে নতুন রেকর্ড",
      excerpt: "চলতি অর্থবছরে দেশের অর্থনৈতিক প্রবৃদ্ধি ৮.৫% এ পৌঁছেছে।",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop",
      category: "অর্থনীতি",
      date: "২১ মে, ২০২৪",
      readTime: "৫ মিনিট"
    },
    {
      id: "7",
      title: "ক্রিকেট বিশ্বকাপে বাংলাদেশের সাফল্য",
      excerpt: "ক্রিকেট বিশ্বকাপে বাংলাদেশ দল চমৎকার পারফরম্যান্স দেখিয়েছে।",
      image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=300&h=200&fit=crop",
      category: "খেলা",
      date: "২০ মে, ২০২৪",
      readTime: "৩ মিনিট"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">সর্বশেষ সংবাদ</h2>
        <Link to="/news" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
          সব দেখুন
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {newsItems.map((item) => (
          <Link key={item.id} to={`/post/${item.id}`} className="group">
            <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded">
                  {item.category}
                </span>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LatestNews;
