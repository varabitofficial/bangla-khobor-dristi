
import { AdminLayout } from '@/components/admin/AdminLayout';
import VideosManagement from '@/components/admin/VideosManagement';

const AdminVideos = () => {
  return (
    <AdminLayout title="ভিডিও ম্যানেজমেন্ট" breadcrumbItems={[{ label: "ভিডিও" }]}>
      <VideosManagement />
    </AdminLayout>
  );
};

export default AdminVideos;
