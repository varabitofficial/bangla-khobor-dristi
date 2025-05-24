
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import PostSingle from "./pages/PostSingle";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminComments from "./pages/admin/AdminComments";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminAds from "./pages/admin/AdminAds";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/post/:id" element={<PostSingle />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/comments" element={<AdminComments />} />
            <Route path="/admin/videos" element={<AdminVideos />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/newsletter" element={<AdminNewsletter />} />
            <Route path="/admin/ads" element={<AdminAds />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
