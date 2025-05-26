
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  MessageSquare, 
  Video, 
  Users, 
  Mail, 
  Megaphone,
  Settings,
  LogOut,
  Tags,
  Folder
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: "ড্যাশবোর্ড",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "পোস্ট",
    url: "/admin/posts",
    icon: FileText,
  },
  {
    title: "ক্যাটেগরি",
    url: "/admin/categories", 
    icon: FolderTree,
  },
  {
    title: "সাবক্যাটেগরি",
    url: "/admin/subcategories",
    icon: Folder,
  },
  {
    title: "ট্যাগ",
    url: "/admin/tags",
    icon: Tags,
  },
  {
    title: "মন্তব্য",
    url: "/admin/comments",
    icon: MessageSquare,
  },
  {
    title: "ভিডিও",
    url: "/admin/videos",
    icon: Video,
  },
  {
    title: "ইউজার",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "নিউজলেটার",
    url: "/admin/newsletter",
    icon: Mail,
  },
  {
    title: "বিজ্ঞাপন",
    url: "/admin/ads",
    icon: Megaphone,
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">NewsViewBD</h2>
            <p className="text-xs text-muted-foreground">অ্যাডমিন প্যানেল</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>নেভিগেশন</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/admin/settings">
                <Settings className="w-4 h-4" />
                <span>সেটিংস</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut}>
              <LogOut className="w-4 h-4" />
              <span>লগআউট</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
