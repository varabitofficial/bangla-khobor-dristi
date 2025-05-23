
import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";

const FeaturedVideos = () => {
  const videos = [
    {
      id: "v1",
      title: "সাক্ষাৎকার: আগামী বছরের অর্থনৈতিক সম্ভাবনা",
      thumbnail: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=240&fit=crop",
      duration: "12:34",
      date: "২২ মে, ২০২৪",
      views: "৩.২ হাজার"
    },
    {
      id: "v2",
      title: "সাক্ষাৎকার: আগামী বছরের অর্থনৈতিক পরিস্থিতি",
      thumbnail: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=240&fit=crop",
      duration: "08:45",
      date: "২১ মে, ২০২৪",
      views: "২.৫ হাজার"
    },
    {
      id: "v3",
      title: "সাক্ষাৎকার: আগামী বছরের অর্থনৈতিক চ্যালেঞ্জ",
      thumbnail: "https://images.unsplash.com/photo-1423784346385-c1d4dac9893a?w=400&h=240&fit=crop",
      duration: "15:20",
      date: "২০ মে, ২০২৪",
      views: "১.৮ হাজার"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-12 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">বিশেষ ভিডিও</h2>
        <Link to="/videos" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
          সব দেখুন
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link key={video.id} to={`/video/${video.id}`} className="group block">
            <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="relative overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-60 p-4 rounded-full">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"></path>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{video.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{video.views} দেখা হয়েছে</span>
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

export default FeaturedVideos;
