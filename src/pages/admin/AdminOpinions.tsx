
import { AdminLayout } from '@/components/admin/AdminLayout';
import OpinionsManagement from '@/components/admin/OpinionsManagement';

const AdminOpinions = () => {
  return (
    <AdminLayout 
      title="মতামত ও বিশ্লেষণ" 
      breadcrumbItems={[
        { label: "ড্যাশবোর্ড", href: "/admin" },
        { label: "মতামত ও বিশ্লেষণ" }
      ]}
    >
      <OpinionsManagement />
    </AdminLayout>
  );
};

export default AdminOpinions;
