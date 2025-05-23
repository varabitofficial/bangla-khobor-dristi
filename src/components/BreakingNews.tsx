
const BreakingNews = () => {
  const breakingNews = [
    "সরকারি নতুন নীতি ঘোষণা: শিক্ষাক্ষেত্রে বড় পরিবর্তন আসছে",
    "সংসদে নতুন শিক্ষা বিল পাস",
    "ক্রিকেট বিশ্বকাপে বাংলাদেশের সাফল্য"
  ];

  return (
    <div className="bg-black text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <span className="font-bold mr-4 whitespace-nowrap">
          ব্রেকিং নিউজ:
          </span>
          <div className="relative overflow-hidden" style={{ width: 'calc(100% - 100px)' }}>
            <div className="flex whitespace-nowrap animate-slide-left">
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
