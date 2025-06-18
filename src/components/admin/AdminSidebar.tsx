
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Users,
  FileText,
  MessageSquare,
  Video,
  Edit,
  Tags,
  Mail,
  BarChart3,
  Shield,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

// Menu items.
const items = [
  {
    title: "ড্যাশবোর্ড",
    url: "/admin",
    icon: Home,
  },
  {
    title: "পোস্টস",
    url: "/admin/posts",
    icon: FileText,
  },
  {
    title: "ক্যাটেগরি",
    url: "/admin/categories",
    icon: Tags,
  },
  {
    title: "সাবক্যাটেগরি",
    url: "/admin/subcategories",
    icon: Tags,
  },
  {
    title: "ট্যাগস",
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
    title: "মতামত",
    url: "/admin/opinions",
    icon: Edit,
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
    icon: BarChart3,
  },
  /*{
    title: "সেটিংস",
    url: "/admin/settings",
    icon: Settings,
  },*/
]

export function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar className="font-bangla">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-4 py-2">
          <img src="/logo.svg" alt="NewsViewBD" className="h-8" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>অ্যাডমিন প্যানেল</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut />
              <span>লগআউট</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
