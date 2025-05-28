
import Header from "@/components/Header";
import BreakingNews from "@/components/BreakingNews";
import HeroSection from "@/components/HeroSection";
import LatestNews from "@/components/LatestNews";
import AdBanner from "@/components/AdBanner";
import SidebarAdBanner from "@/components/SidebarAdBanner";
import CategoryTabs from "@/components/CategoryTabs";
import FeaturedVideos from "@/components/FeaturedVideos";
import OpinionSection from "@/components/OpinionSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-bangla">
      <Header />
      <BreakingNews />
      <main className="flex max-w-7xl mx-auto px-4 gap-8">
        <div className="flex-1">
          <HeroSection />
          <LatestNews />
          <AdBanner />
          <CategoryTabs />
          <FeaturedVideos />
          <OpinionSection />
          <Newsletter />
        </div>
        <aside className="w-80 hidden lg:block pt-8">
          <div className="sticky top-4 space-y-8">
            <SidebarAdBanner />
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
