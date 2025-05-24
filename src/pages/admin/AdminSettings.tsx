
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminSettings = () => {
  return (
    <AdminLayout title="সেটিংস" breadcrumbItems={[{ label: "সেটিংস" }]}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>সাইট সেটিংস</CardTitle>
            <CardDescription>সাইটের মূল সেটিংস পরিবর্তন করুন</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">সেটিংস পেজ শীঘ্রই আসছে...</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
