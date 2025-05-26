
const BreakingNews = () => {
  const breakingNews = [
    "সরকারি নতুন নীতি ঘোষণা: শিক্ষাক্ষেত্রে বড় পরিবর্তন আসছে",
    "জলবায়ু পরিবর্তন: বাংলাদেশে নতুন প্রভাব দেখা দিচ্ছে",
    "অর্থনৈতিক প্রবৃদ্ধি: চলতি বছরে ৮% লক্ষ্যমাত্রা অর্জনের সম্ভাবনা",
    "প্রযুক্তি খাতে নতুন বিনিয়োগ: স্টার্টআপদের জন্য সুযোগ সৃষ্টি"
  ];

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <span className="bg-white text-red-600 px-3 py-1 text-sm font-bold mr-4 whitespace-nowrap flex-shrink-0 z-10">
            ব্রেকিং নিউজ
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-slide-left whitespace-nowrap pl-4">
              {breakingNews.map((news, index) => (
                <span key={index} className="mx-8 cursor-pointer hover:underline">
                  {news}
                </span>
              ))}
              {/* Duplicate for seamless loop */}
              {breakingNews.map((news, index) => (
                <span key={`duplicate-${index}`} className="mx-8 cursor-pointer hover:underline">
                  {news}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
