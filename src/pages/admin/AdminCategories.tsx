
import { AdminLayout } from '@/components/admin/AdminLayout';
import CategoriesManagement from '@/components/admin/CategoriesManagement';

const AdminCategories = () => {
  return (
    <AdminLayout title="ক্যাটেগরি ম্যানেজমেন্ট" breadcrumbItems={[{ label: "ক্যাটেগরি" }]}>
      <CategoriesManagement />
    </AdminLayout>
  );
};

export default AdminCategories;
