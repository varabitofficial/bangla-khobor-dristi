
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PostsManagement from '@/components/admin/PostsManagement';
import CategoriesManagement from '@/components/admin/CategoriesManagement';
import CommentsManagement from '@/components/admin/CommentsManagement';
import VideosManagement from '@/components/admin/VideosManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import NewsletterManagement from '@/components/admin/NewsletterManagement';
import AdsManagement from '@/components/admin/AdsManagement';
import DashboardStats from '@/components/admin/DashboardStats';

const AdminDashboard = () => {
  return (
    <AdminLayout title="ড্যাশবোর্ড" breadcrumbItems={[{ label: "ড্যাশবোর্ড" }]}>
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
    </AdminLayout>
  );
};

export default AdminDashboard;
