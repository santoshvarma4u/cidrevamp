import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/ui/loading-spinner";
import {
  Users,
  FileText,
  Video,
  Image,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
} from "lucide-react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: pages = [] } = useQuery({
    queryKey: ["/api/pages"],
    enabled: isAuthenticated,
  });

  const { data: videos = [] } = useQuery({
    queryKey: ["/api/videos"],
    enabled: isAuthenticated,
  });

  const { data: photos = [] } = useQuery({
    queryKey: ["/api/photos"],
    enabled: isAuthenticated,
  });



  const { data: news = [] } = useQuery({
    queryKey: ["/api/news"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const stats = [
    {
      title: "Total Pages",
      value: pages.length,
      icon: FileText,
      color: "blue",
      published: pages.filter((p: any) => p.isPublished).length,
    },
    {
      title: "Videos",
      value: videos.length,
      icon: Video,
      color: "purple",
      published: videos.filter((v: any) => v.isPublished).length,
    },
    {
      title: "Photos",
      value: photos.length,
      icon: Image,
      color: "green",
      published: photos.filter((p: any) => p.isPublished).length,
    },

    {
      title: "News Articles",
      value: news.length,
      icon: TrendingUp,
      color: "yellow",
      published: news.filter((n: any) => n.isPublished).length,
    },
  ];



  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 lg:ml-64">
          <div className="p-8">
            <div className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6">
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-purple-100 mt-2">
                Welcome back, {user.firstName || user.email}. Here's what's happening with your CID website.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        {stat.published !== undefined && (
                          <p className="text-xs text-green-600">{stat.published} published</p>
                        )}
                        {stat.pending !== undefined && (
                          <p className="text-xs text-red-600">{stat.pending} pending</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Status */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>System Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Website Status</span>
                      </div>
                      <Badge variant="default" className="bg-green-600">Online</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Database</span>
                      </div>
                      <Badge variant="default" className="bg-green-600">Connected</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">File Uploads</span>
                      </div>
                      <Badge variant="default" className="bg-green-600">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Content Management</span>
                      </div>
                      <Badge variant="default" className="bg-green-600">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Content Items</span>
                      <Badge variant="outline">{pages.length + videos.length + photos.length + news.length}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Published Pages</span>
                      <Badge variant="outline">{pages.filter((p: any) => p.isPublished).length}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Active Videos</span>
                      <Badge variant="outline">{videos.filter((v: any) => v.isPublished).length}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium">Photo Gallery Items</span>
                      <Badge variant="outline">{photos.filter((p: any) => p.isPublished).length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
