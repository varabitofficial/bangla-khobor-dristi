
import Header from "@/components/Header";
import BreakingNews from "@/components/BreakingNews";
import HeroSection from "@/components/HeroSection";
import LatestNews from "@/components/LatestNews";
import AdBanner from "@/components/AdBanner";
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
      <main>
        <HeroSection />
        <LatestNews />
        <AdBanner />
        <CategoryTabs />
        <FeaturedVideos />
        <OpinionSection />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
