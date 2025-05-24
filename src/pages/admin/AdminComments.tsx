
import { AdminLayout } from '@/components/admin/AdminLayout';
import CommentsManagement from '@/components/admin/CommentsManagement';

const AdminComments = () => {
  return (
    <AdminLayout title="মন্তব্য ম্যানেজমেন্ট" breadcrumbItems={[{ label: "মন্তব্য" }]}>
      <CommentsManagement />
    </AdminLayout>
  );
};

export default AdminComments;
