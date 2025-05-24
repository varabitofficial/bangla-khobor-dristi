
import { AdminLayout } from '@/components/admin/AdminLayout';
import AdsManagement from '@/components/admin/AdsManagement';

const AdminAds = () => {
  return (
    <AdminLayout title="বিজ্ঞাপন ম্যানেজমেন্ট" breadcrumbItems={[{ label: "বিজ্ঞাপন" }]}>
      <AdsManagement />
    </AdminLayout>
  );
};

export default AdminAds;
