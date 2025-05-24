
import { AdminLayout } from '@/components/admin/AdminLayout';
import UsersManagement from '@/components/admin/UsersManagement';
import { CreateUserForm } from '@/components/admin/CreateUserForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminUsers = () => {
  return (
    <AdminLayout title="ইউজার ম্যানেজমেন্ট" breadcrumbItems={[{ label: "ইউজার" }]}>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">ইউজার তালিকা</TabsTrigger>
          <TabsTrigger value="create">নতুন ইউজার</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UsersManagement />
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>নতুন ইউজার তৈরি</CardTitle>
              <CardDescription>নতুন ইউজার অ্যাকাউন্ট তৈরি করুন</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateUserForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminUsers;
