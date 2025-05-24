
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import PostsManagement from '@/components/admin/PostsManagement';
import CategoriesManagement from '@/components/admin/CategoriesManagement';
import CommentsManagement from '@/components/admin/CommentsManagement';
import VideosManagement from '@/components/admin/VideosManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import NewsletterManagement from '@/components/admin/NewsletterManagement';
import AdsManagement from '@/components/admin/AdsManagement';
import DashboardStats from '@/components/admin/DashboardStats';
import { useToast } from '@/hooks/use-toast';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!loading && user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setUserRole(profile?.role || null);
        setRoleLoading(false);

        if (!profile || !['admin', 'editor'].includes(profile.role)) {
          toast({
            title: "অ্যাক্সেস নিষিদ্ধ",
            description: "আপনার এই পেজে অ্যাক্সেস নেই।",
            variant: "destructive",
          });
          navigate('/');
        }
      } else if (!loading && !user) {
        toast({
          title: "অ্যাক্সেস নিষিদ্ধ",
          description: "আপনাকে প্রথমে লগইন করতে হবে।",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    checkUserRole();
  }, [user, loading, navigate, toast]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bangla">
        <div className="text-lg">লোড হচ্ছে...</div>
      </div>
    );
  }

  if (!user || !userRole || !['admin', 'editor'].includes(userRole)) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 font-bangla">
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-white">
            <SidebarTrigger className="-ml-1" />
            <div className="mx-2 h-4 w-px bg-gray-300" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin">
                    অ্যাডমিন ড্যাশবোর্ড
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>ড্যাশবোর্ড</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="flex-1 space-y-4 p-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">ড্যাশবোর্ড</h2>
            </div>

            <DashboardStats />

            <Card>
              <CardHeader>
                <CardTitle>কন্টেন্ট ম্যানেজমেন্ট</CardTitle>
                <CardDescription>সাইটের সকল কন্টেন্ট পরিচালনা করুন</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="posts" className="w-full">
                  <TabsList className="grid w-full grid-cols-7">
                    <TabsTrigger value="posts">পোস্ট</TabsTrigger>
                    <TabsTrigger value="categories">ক্যাটেগরি</TabsTrigger>
                    <TabsTrigger value="comments">মন্তব্য</TabsTrigger>
                    <TabsTrigger value="videos">ভিডিও</TabsTrigger>
                    <TabsTrigger value="users">ইউজার</TabsTrigger>
                    <TabsTrigger value="newsletter">নিউজলেটার</TabsTrigger>
                    <TabsTrigger value="ads">বিজ্ঞাপন</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="posts">
                    <PostsManagement />
                  </TabsContent>
                  
                  <TabsContent value="categories">
                    <CategoriesManagement />
                  </TabsContent>
                  
                  <TabsContent value="comments">
                    <CommentsManagement />
                  </TabsContent>
                  
                  <TabsContent value="videos">
                    <VideosManagement />
                  </TabsContent>
                  
                  <TabsContent value="users">
                    <UsersManagement />
                  </TabsContent>
                  
                  <TabsContent value="newsletter">
                    <NewsletterManagement />
                  </TabsContent>
                  
                  <TabsContent value="ads">
                    <AdsManagement />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
