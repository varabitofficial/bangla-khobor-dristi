
import { AdminLayout } from '@/components/admin/AdminLayout';
import PostsManagement from '@/components/admin/PostsManagement';

const AdminPosts = () => {
  return (
    <AdminLayout title="পোস্ট ম্যানেজমেন্ট" breadcrumbItems={[{ label: "পোস্ট" }]}>
      <PostsManagement />
    </AdminLayout>
  );
};

export default AdminPosts;
