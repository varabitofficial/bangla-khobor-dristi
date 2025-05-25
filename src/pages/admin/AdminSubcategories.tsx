
import { AdminLayout } from '@/components/admin/AdminLayout';
import SubcategoriesManagement from '@/components/admin/SubcategoriesManagement';

const AdminSubcategories = () => {
  return (
    <AdminLayout title="সাবক্যাটেগরি ম্যানেজমেন্ট" breadcrumbItems={[{ label: "সাবক্যাটেগরি" }]}>
      <SubcategoriesManagement />
    </AdminLayout>
  );
};

export default AdminSubcategories;
