
import { useState } from "react";
import { Link } from "react-router-dom";

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState("বাংলাদেশ");

  const categories = ["বাংলাদেশ", "আন্তর্জাতিক", "ব্যবসা", "প্রযুক্তি"];

  const categoryNews = {
    "বাংলাদেশ": {
      main: {
        id: "8",
        title: "ঢাকায় নতুন উন্নয়ন প্রকল্প চালু",
        excerpt: "ঢ্যাকার নগর উন্নয়নে নতুন প্রকল্প চালু হয়েছে। এতে রাজধানীর যানজট সমস্যা কমবে।",
        image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&h=400&fit=crop"
      },
      related: [
        {
          id: "9",
          title: "মেট্রো রেলের দ্বিতীয় লাইন নির্মাণ শুরু হবে আগামী মাসে",
          date: "২৩ মে, ২০২৪"
        },
        {
          id: "10",
          title: "ফ্লাইওভার প্রকল্প: যানজট কমার প্রত্যাশা",
          date: "২২ মে, ২০২৪"
        },
        {
          id: "11",
          title: "ঢাকা মহানগরীর পানি সমস্যা সমাধানে নতুন প্রকল্প",
          date: "২১ মে, ২০২৪"
        },
        {
          id: "12",
          title: "পরিবেশ সংরক্ষণে ঢাকায় বড় প্রকল্প",
          date: "২০ মে, ২০২৪"
        }
      ]
    },
    "আন্তর্জাতিক": {
      main: {
        id: "13",
        title: "আন্তর্জাতিক সম্মেলনে নতুন চুক্তি স্বাক্ষর",
        excerpt: "আন্তর্জাতিক একটি সম্মেলনে বাংলাদেশ গুরুত্বপূর্ণ চুক্তি স্বাক্ষর করেছে।",
        image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&h=400&fit=crop"
      },
      related: [
        {
          id: "14", 
          title: "আন্তর্জাতিক বাণিজ্যে নতুন চুক্তি",
          date: "২৩ মে, ২০২৪"
        },
        {
          id: "15",
          title: "জাতিসংঘে বাংলাদেশের নতুন প্রতিনিধি নিয়োগ",
          date: "২২ মে, ২০২৪"
        },
        {
          id: "16",
          title: "জলবায়ু পরিবর্তন নিয়ে আন্তর্জাতিক সম্মেলন",
          date: "২১ মে, ২০২৪"
        },
        {
          id: "17",
          title: "প্রবাসী বাংলাদেশিদের অধিকার নিয়ে সম্মেলন",
          date: "২০ মে, ২০২৪"
        }
      ]
    },
    "ব্যবসা": {
      main: {
        id: "18",
        title: "স্টক মার্কেটে নতুন রেকর্ড",
        excerpt: "দেশের স্টক মার্কেট ইতিহাসের সবচেয়ে উঁচু অবস্থানে পৌঁছেছে।",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop"
      },
      related: [
        {
          id: "19",
          title: "নতুন বৈদেশিক বিনিয়োগ: হাজার কোটি টাকা",
          date: "২৩ মে, ২০২৪"
        },
        {
          id: "20",
          title: "রপ্তানি খাতে অভূতপূর্ব সাফল্য",
          date: "২২ মে, ২০২৪"
        },
        {
          id: "21",
          title: "ব্যাংক খাতে নতুন নীতিমালা ঘোষণা",
          date: "২১ মে, ২০২৪"
        },
        {
          id: "22",
          title: "ছোট ব্যবসায় নতুন ঋণ প্রকল্প চালু",
          date: "২০ মে, ২০২৪"
        }
      ]
    },
    "প্রযুক্তি": {
      main: {
        id: "23",
        title: "দেশে তৈরি হচ্ছে পঞ্চম প্রজন্মের মোবাইল নেটওয়ার্ক",
        excerpt: "দেশের নিজস্ব প্রযুক্তিতে তৈরি হচ্ছে ৫জি নেটওয়ার্ক।",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop"
      },
      related: [
        {
          id: "24",
          title: "প্রযুক্তি শিক্ষায় নতুন প্রকল্প",
          date: "২৩ মে, ২০২৪"
        },
        {
          id: "25",
          title: "আর্টিফিশিয়াল ইন্টেলিজেন্স গবেষণা কেন্দ্র স্থাপন",
          date: "২২ মে, ২০২৪"
        },
        {
          id: "26",
          title: "বয়স্কদের জন্য নতুন প্রযুক্তি প্রশিক্ষণ",
          date: "২১ মে, ২০২৪"
        },
        {
          id: "27",
          title: "প্রতিবন্ধী ব্যক্তিদের জন্য বিশেষ প্রযুক্তি উদ্ভাবন",
          date: "২০ মে, ২০২৪"
        }
      ]
    }
  };

  const currentCategoryNews = categoryNews[activeTab as keyof typeof categoryNews];

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                    activeTab === category
                      ? "border-red-600 text-red-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Featured Article */}
            <div className="md:col-span-2">
              <Link to={`/post/${currentCategoryNews.main.id}`} className="group block">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={currentCategoryNews.main.image} 
                    alt={currentCategoryNews.main.title}
                    className="w-full h-64 md:h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-gray-200 transition-colors">
                      {currentCategoryNews.main.title}
                    </h3>
                    <p className="text-sm text-gray-200 line-clamp-2">
                      {currentCategoryNews.main.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Related Articles */}
            <div className="space-y-4">
              {currentCategoryNews.related.map((article) => (
                <Link key={article.id} to={`/post/${article.id}`} className="group block">
                  <article className="border-b border-gray-200 pb-4">
                    <h3 className="text-gray-900 font-medium mb-1 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-xs">{article.date}</p>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* View All Link */}
          <div className="mt-8 text-center">
            <Link
              to={`/category/${activeTab}`}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              আরো দেখুন
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">জনপ্রিয় সংবাদ</h3>
            <div className="space-y-4">
              <Link to="/post/101" className="group block">
                <article className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400">০১</span>
                  <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    চট্টগ্রামে নতুন সাংস্কৃতিক কেন্দ্র উদ্বোধন
                  </h4>
                </article>
              </Link>
              <Link to="/post/102" className="group block">
                <article className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400">০২</span>
                  <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    নতুন শিল্প নীতি ঘোষণা করল সরকার
                  </h4>
                </article>
              </Link>
              <Link to="/post/103" className="group block">
                <article className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400">০৩</span>
                  <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    জাতীয় ক্রীড়া প্রতিযোগিতা শুরু হচ্ছে আগামী সপ্তাহে
                  </h4>
                </article>
              </Link>
              <Link to="/post/104" className="group block">
                <article className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400">০৪</span>
                  <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    প্রাকৃতিক দুর্যোগ মোকাবেলায় নতুন পদক্ষেপ
                  </h4>
                </article>
              </Link>
              <Link to="/post/105" className="group block">
                <article className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400">০৫</span>
                  <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    গ্রামীণ অঞ্চলে শিক্ষার মান উন্নয়নে বিশেষ প্রকল্প
                  </h4>
                </article>
              </Link>
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
