
import { AdminLayout } from '@/components/admin/AdminLayout';
import TagsManagement from '@/components/admin/TagsManagement';

const AdminTags = () => {
  return (
    <AdminLayout title="ট্যাগ ম্যানেজমেন্ট" breadcrumbItems={[{ label: "ট্যাগ" }]}>
      <TagsManagement />
    </AdminLayout>
  );
};

export default AdminTags;
