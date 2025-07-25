import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  Video,
  Image,
  MessageSquare,
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

  const { data: complaints = [] } = useQuery({
    queryKey: ["/api/admin/complaints"],
    enabled: isAuthenticated,
  });

  const { data: news = [] } = useQuery({
    queryKey: ["/api/news"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
      title: "Complaints",
      value: complaints.length,
      icon: MessageSquare,
      color: "red",
      pending: complaints.filter((c: any) => c.status === 'pending').length,
    },
    {
      title: "News Articles",
      value: news.length,
      icon: TrendingUp,
      color: "yellow",
      published: news.filter((n: any) => n.isPublished).length,
    },
  ];

  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 lg:ml-64">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
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

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Complaints */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Recent Complaints</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentComplaints.length > 0 ? (
                    <div className="space-y-4">
                      {recentComplaints.map((complaint: any) => (
                        <div key={complaint.id} className="border-l-2 border-blue-200 pl-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{complaint.subject}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {complaint.complainantName} • {complaint.complaintNumber}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant={
                                  complaint.status === 'resolved' ? 'default' :
                                  complaint.status === 'under_investigation' ? 'secondary' :
                                  'destructive'
                                }>
                                  {complaint.status.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline">{complaint.type}</Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(complaint.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No complaints available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* System Status */}
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
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium">Pending Reviews</span>
                      </div>
                      <Badge variant="secondary">
                        {complaints.filter((c: any) => c.status === 'pending').length}
                      </Badge>
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
