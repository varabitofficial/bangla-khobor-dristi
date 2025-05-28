
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Advertise from "./pages/Advertise";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PostSingle from "./pages/PostSingle";
import PostsArchive from "./pages/PostsArchive";
import CategoryArchive from "./pages/CategoryArchive";
import TagsArchive from "./pages/TagsArchive";
import VideosArchive from "./pages/VideosArchive";
import VideoSingle from "./pages/VideoSingle";
import OpinionsArchive from "./pages/OpinionsArchive";
import OpinionSingle from "./pages/OpinionSingle";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminSubcategories from "./pages/admin/AdminSubcategories";
import AdminTags from "./pages/admin/AdminTags";
import AdminComments from "./pages/admin/AdminComments";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminOpinions from "./pages/admin/AdminOpinions";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminAds from "./pages/admin/AdminAds";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

// Component to handle scroll to top
const ScrollToTopHandler = () => {
  useScrollToTop();
  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTopHandler />
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/advertise" element={<Advertise />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/post/:id" element={<PostSingle />} />
                <Route path="/posts" element={<PostsArchive />} />
                <Route path="/category/:slug" element={<CategoryArchive />} />
                <Route path="/tag/:slug" element={<TagsArchive />} />
                <Route path="/videos" element={<VideosArchive />} />
                <Route path="/video/:id" element={<VideoSingle />} />
                <Route path="/opinions" element={<OpinionsArchive />} />
                <Route path="/opinion/:id" element={<OpinionSingle />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/posts" element={<AdminPosts />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/subcategories" element={<AdminSubcategories />} />
                <Route path="/admin/tags" element={<AdminTags />} />
                <Route path="/admin/comments" element={<AdminComments />} />
                <Route path="/admin/videos" element={<AdminVideos />} />
                <Route path="/admin/opinions" element={<AdminOpinions />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/newsletter" element={<AdminNewsletter />} />
                <Route path="/admin/ads" element={<AdminAds />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
