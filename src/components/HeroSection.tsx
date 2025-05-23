
import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";

const HeroSection = () => {
  const featuredStory = {
    id: "1",
    title: "সরকারি নতুন নীতি ঘোষণা: শিক্ষাক্ষেত্রে বড় পরিবর্তন আসছে",
    excerpt: "শিক্ষা মন্ত্রণালয় আগামী মাস থেকে নতুন শিক্ষানীতি বাস্তবায়ন শুরু করবে। এতে প্রাথমিক থেকে উচ্চশিক্ষা পর্যন্ত সব স্তরে পরিবর্তন আনা হবে।",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop",
    category: "রাজনীতি",
    date: "২৩ মে, ২০২৪",
    readTime: "৫ মিনিট"
  };

  const supportingStories = [
    {
      id: "2",
      title: "প্রযুক্তি সামিট: উদ্ভাবনী প্রকল্প প্রদর্শনী",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop",
      category: "প্রযুক্তি",
      categoryColor: "bg-blue-600"
    },
    {
      id: "3", 
      title: "জাতীয় ক্রিকেট দল বিজয় অর্জন",
      image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=300&h=200&fit=crop",
      category: "খেলা",
      categoryColor: "bg-green-600"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Story */}
        <div className="lg:col-span-2">
          <Link to={`/post/${featuredStory.id}`} className="group block">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={featuredStory.image} 
                alt={featuredStory.title}
                className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="bg-red-600 text-white px-3 py-1 text-sm font-medium rounded mb-3 inline-block">
                  {featuredStory.category}
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight group-hover:text-gray-200 transition-colors">
                  {featuredStory.title}
                </h2>
                <p className="text-gray-200 mb-4 line-clamp-2">
                  {featuredStory.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredStory.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{featuredStory.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Supporting Stories */}
        <div className="space-y-6">
          {supportingStories.map((story) => (
            <Link key={story.id} to={`/post/${story.id}`} className="group block">
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <span className={`${story.categoryColor} text-white px-2 py-1 text-xs font-medium rounded mb-2 inline-block`}>
                    {story.category}
                  </span>
                  <h3 className="text-lg font-semibold leading-tight group-hover:text-gray-200 transition-colors">
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
