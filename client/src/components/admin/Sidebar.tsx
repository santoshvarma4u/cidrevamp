import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  LayoutDashboard,
  FileText,
  Video,
  Image,
  MessageSquare,
  Newspaper,
  Users,
  Settings,
  LogOut,
  Menu,
  FolderOpen,
} from "lucide-react";

export default function AdminSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Content Management",
      icon: FolderOpen,
      items: [
        { title: "Pages", href: "/admin/content/pages", icon: FileText },
        { title: "Videos", href: "/admin/content/videos", icon: Video },
        { title: "Photos", href: "/admin/content/photos", icon: Image },
        { title: "News", href: "/admin/content/news", icon: Newspaper },
      ],
    },
    {
      title: "Complaints",
      href: "/admin/complaints",
      icon: MessageSquare,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      adminOnly: true,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location === "/admin";
    }
    return location.startsWith(href);
  };

  const canAccess = (item: any) => {
    if (item.adminOnly && user?.role !== 'super_admin') {
      return false;
    }
    return true;
  };

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 text-white shadow-lg">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-gray-700">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">CID Admin</h2>
            <p className="text-sm text-gray-400">Management Panel</p>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.firstName || user.email}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={user.role === 'super_admin' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {user.role?.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              if (!canAccess(item)) return null;

              if (item.items) {
                return (
                  <div key={item.title} className="space-y-1">
                    <div className="flex items-center space-x-3 px-3 py-2 text-gray-400">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    <div className="ml-4 space-y-1">
                      {item.items.map((subItem) => (
                        <Link key={subItem.href} href={subItem.href}>
                          <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                            isActive(subItem.href)
                              ? "bg-blue-600 text-white"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          }`}>
                            <subItem.icon className="h-4 w-4" />
                            <span>{subItem.title}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    isActive(item.href)
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="space-y-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
                <Menu className="mr-2 h-4 w-4" />
                View Site
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:text-white"
              onClick={() => window.location.href = '/api/logout'}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
