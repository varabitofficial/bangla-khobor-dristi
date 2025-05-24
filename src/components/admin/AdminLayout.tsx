
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useToast } from '@/hooks/use-toast';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbItems?: Array<{ label: string; href?: string }>;
}

export const AdminLayout = ({ children, title, breadcrumbItems = [] }: AdminLayoutProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!loading && user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setUserRole(profile?.role || null);
        setRoleLoading(false);

        if (!profile || !['admin', 'editor'].includes(profile.role)) {
          toast({
            title: "অ্যাক্সেস নিষিদ্ধ",
            description: "আপনার এই পেজে অ্যাক্সেস নেই।",
            variant: "destructive",
          });
          navigate('/');
        }
      } else if (!loading && !user) {
        toast({
          title: "অ্যাক্সেস নিষিদ্ধ",
          description: "আপনাকে প্রথমে লগইন করতে হবে।",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    checkUserRole();
  }, [user, loading, navigate, toast]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bangla">
        <div className="text-lg">লোড হচ্ছে...</div>
      </div>
    );
  }

  if (!user || !userRole || !['admin', 'editor'].includes(userRole)) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 font-bangla">
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-white">
            <SidebarTrigger className="-ml-1" />
            <div className="mx-2 h-4 w-px bg-gray-300" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin">
                    অ্যাডমিন ড্যাশবোর্ড
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbItems.map((item, index) => (
                  <div key={index}>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <div className="flex-1 space-y-4 p-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            </div>
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
