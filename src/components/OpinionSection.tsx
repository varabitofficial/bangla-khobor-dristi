
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const OpinionSection = () => {
  const articles = [
    {
      id: "op1",
      title: "দক্ষিণ এশিয়ায় গণতান্ত্রিক প্রতিষ্ঠানের ভবিষ্যৎ",
      excerpt: "দক্ষিণ এশিয়ার গণতান্ত্রিক প্রতিষ্ঠানগুলি বর্তমানে যে সমস্যা ও সম্ভাবনা নিয়ে এগিয়ে চলেছে তার একটি বিশ্লেষণ।",
      date: "২২ মে, ২০২৪",
      author: {
        name: "ড. আনোয়ার রহমান",
        role: "অর্থনীতিবিদ",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
      },
      comments: 14
    },
    {
      id: "op2",
      title: "দক্ষিণ এশিয়ায় গণতান্ত্রিক প্রতিষ্ঠানের উত্থান পতন",
      excerpt: "দক্ষিণ এশিয়ার গণতান্ত্রিক প্রতিষ্ঠানগুলি বর্তমানে যে সমস্যা ও সম্ভাবনা নিয়ে এগিয়ে চলেছে তার একটি বিশ্লেষণ।",
      date: "২১ মে, ২০২৪",
      author: {
        name: "ড. আনোয়ার রহমান",
        role: "অর্থনীতিবিদ",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
      },
      comments: 8
    },
    {
      id: "op3",
      title: "দক্ষিণ এশিয়ায় গণতান্ত্রিক প্রতিষ্ঠানের চ্যালেঞ্জ",
      excerpt: "দক্ষিণ এশিয়ার গণতান্ত্রিক প্রতিষ্ঠানগুলি বর্তমানে যে সমস্যা ও সম্ভাবনা নিয়ে এগিয়ে চলেছে তার একটি বিশ্লেষণ।",
      date: "২০ মে, ২০২৪",
      author: {
        name: "ড. আনোয়ার রহমান",
        role: "অর্থনীতিবিদ",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
      },
      comments: 6
    }
  ];

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
        {articles.map((article) => (
          <Link key={article.id} to={`/opinion/${article.id}`} className="group">
            <article className="bg-white border-t-4 border-gray-800 p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={article.author.image} 
                    alt={article.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{article.author.name}</h3>
                  <p className="text-sm text-gray-600">{article.author.role}</p>
                </div>
              </div>
              
              <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                {article.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {article.excerpt}
              </p>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>{article.date}</span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {article.comments} মন্তব্য
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default OpinionSection;
