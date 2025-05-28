
import { useAds } from '@/hooks/useAds';

const SidebarAdBanner = () => {
  const { data: ads, isLoading } = useAds('sidebar');

  if (isLoading) {
    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center animate-pulse">
        <div className="text-gray-400">
          <div className="text-sm font-medium mb-2">লোড হচ্ছে...</div>
        </div>
      </div>
    );
  }

  if (!ads || ads.length === 0) {
    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <div className="text-gray-500">
          <div className="text-sm font-medium mb-2">বিজ্ঞাপনের স্থান</div>
          <div className="text-xs">Ad Space Available</div>
        </div>
      </div>
    );
  }

  // Show random ad from available ads for this location
  const randomAd = ads[Math.floor(Math.random() * ads.length)];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <a 
        href={randomAd.link_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block hover:opacity-90 transition-opacity"
      >
        <img 
          src={randomAd.image_url} 
          alt={randomAd.title}
          className="w-full h-auto object-contain"
        />
      </a>
      <div className="px-2 py-1 text-xs text-gray-500 text-center">
        বিজ্ঞাপন
      </div>
    </div>
  );
};

export default SidebarAdBanner;
