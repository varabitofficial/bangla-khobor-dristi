
import { AdminLayout } from '@/components/admin/AdminLayout';
import NewsletterManagement from '@/components/admin/NewsletterManagement';

const AdminNewsletter = () => {
  return (
    <AdminLayout title="নিউজলেটার ম্যানেজমেন্ট" breadcrumbItems={[{ label: "নিউজলেটার" }]}>
      <NewsletterManagement />
    </AdminLayout>
  );
};

export default AdminNewsletter;
