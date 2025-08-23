import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import queryClient from "@/lib/queryClient";
import ContentEditor from "@/components/admin/content-editor";
import { 
  FileText, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Calendar,
  Eye,
  Globe
} from "lucide-react";

export default function ContentManagement() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("news");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [contentType, setContentType] = useState("news");

  const breadcrumbItems = [
    { label: "Admin Dashboard", href: "/admin" },
    { label: "Content Management" }
  ];

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

  const { data: news, isLoading: newsLoading, error: newsError } = useQuery({
    queryKey: ["/api/admin/news"],
    retry: false,
  });

  const { data: pages, isLoading: pagesLoading, error: pagesError } = useQuery({
    queryKey: ["/api/admin/pages"],
    retry: false,
  });

  const { data: safetyAlerts, isLoading: alertsLoading, error: alertsError } = useQuery({
    queryKey: ["/api/admin/safety-alerts"],
    retry: false,
  });

  const createNewsMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/admin/news", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "News article created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create news article",
        variant: "destructive",
      });
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest(`/api/admin/news/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "News article updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
      setIsEditModalOpen(false);
      setSelectedContent(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update news article",
        variant: "destructive",
      });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/admin/news/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "News article deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/news"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to delete news article",
        variant: "destructive",
      });
    },
  });

  const createPageMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/admin/pages", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Page created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create page",
        variant: "destructive",
      });
    },
  });

  const createSafetyAlertMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/admin/safety-alerts", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Safety alert created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/safety-alerts"] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create safety alert",
        variant: "destructive",
      });
    },
  });

  if (isLoading || newsLoading || pagesLoading || alertsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if ((newsError && isUnauthorizedError(newsError)) || 
      (pagesError && isUnauthorizedError(pagesError)) ||
      (alertsError && isUnauthorizedError(alertsError))) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  const isAdmin = user?.email?.endsWith('@tspolice.gov.in') || user?.email === 'admin@replit.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ModernHeader />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCreateContent = (data: any) => {
    if (contentType === "news") {
      createNewsMutation.mutate(data);
    } else if (contentType === "page") {
      createPageMutation.mutate(data);
    } else if (contentType === "alert") {
      createSafetyAlertMutation.mutate(data);
    }
  };

  const handleUpdateContent = (data: any) => {
    if (selectedContent && activeTab === "news") {
      updateNewsMutation.mutate({
        id: selectedContent.id,
        data
      });
    }
  };

  const handleEditContent = (content: any) => {
    setSelectedContent(content);
    setIsEditModalOpen(true);
  };

  const handleDeleteContent = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      if (activeTab === "news") {
        deleteNewsMutation.mutate(id);
      }
    }
  };

  const openCreateModal = (type: string) => {
    setContentType(type);
    setIsCreateModalOpen(true);
  };

  // Filter content based on search and status
  const filterContent = (items: any[]) => {
    return items?.filter((item: any) => {
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.content?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || 
                           (filterStatus === "published" && item.isPublished) ||
                           (filterStatus === "draft" && !item.isPublished) ||
                           (filterStatus === "active" && item.isActive);
      
      return matchesSearch && matchesStatus;
    }) || [];
  };

  const filteredNews = filterContent(Array.isArray(news) ? news : []);
  const filteredPages = filterContent(Array.isArray(pages) ? pages : []);
  const filteredAlerts = filterContent(Array.isArray(safetyAlerts) ? safetyAlerts : []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      {/* Page Header */}
      <section className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-4">
            <div className="flex space-x-1 text-sm text-gray-600">
              <a href="/admin" className="hover:text-blue-600">Admin Dashboard</a>
              <span>/</span>
              <span>Content Management</span>
            </div>
          </Breadcrumb>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gov-dark">Content Management</h1>
                <p className="text-gov-gray">Create and manage website content</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => openCreateModal("news")}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Content
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      Create New {contentType === "news" ? "News Article" : 
                                  contentType === "page" ? "Page" : "Safety Alert"}
                    </DialogTitle>
                  </DialogHeader>
                  <ContentEditor 
                    type={contentType}
                    onSubmit={handleCreateContent}
                    isLoading={createNewsMutation.isPending || createPageMutation.isPending || createSafetyAlertMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="news">News & Updates</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="alerts">Safety Alerts</TabsTrigger>
            </TabsList>
            
            {/* Filters */}
            <Card className="mt-6 mb-6">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      {activeTab === "alerts" && (
                        <SelectItem value="active">Active</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("");
                  }}>
                    <Filter className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <TabsContent value="news">
              <ContentList 
                items={filteredNews}
                type="news"
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
                onCreate={() => openCreateModal("news")}
                emptyMessage="No news articles found"
                emptyDescription="Start by creating your first news article."
              />
            </TabsContent>
            
            <TabsContent value="pages">
              <ContentList 
                items={filteredPages}
                type="pages"
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
                onCreate={() => openCreateModal("page")}
                emptyMessage="No pages found"
                emptyDescription="Create informational pages for your website."
              />
            </TabsContent>
            
            <TabsContent value="alerts">
              <ContentList 
                items={filteredAlerts}
                type="alerts"
                onEdit={handleEditContent}
                onDelete={handleDeleteContent}
                onCreate={() => openCreateModal("alert")}
                emptyMessage="No safety alerts found"
                emptyDescription="Create safety alerts to inform the public."
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Edit Content Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          
          {selectedContent && (
            <ContentEditor 
              type="news"
              title={selectedContent.title}
              content={selectedContent.content}
              metaTitle={selectedContent.metaTitle}
              metaDescription={selectedContent.metaDescription}
              isPublished={selectedContent.isPublished}
              onSubmit={handleUpdateContent}
              isLoading={updateNewsMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

function ContentList({ 
  items, 
  type, 
  onEdit, 
  onDelete, 
  onCreate,
  emptyMessage,
  emptyDescription 
}: {
  items: any[];
  type: string;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  emptyMessage: string;
  emptyDescription: string;
}) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{emptyMessage}</h3>
          <p className="text-gray-600 mb-6">{emptyDescription}</p>
          <Button onClick={onCreate} className="bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Create {type === "news" ? "News Article" : type === "pages" ? "Page" : "Safety Alert"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item: any) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gov-dark">
                    {item.title || item.name}
                  </h3>
                  <Badge variant={
                    item.isPublished || item.isActive ? "default" : "secondary"
                  }>
                    {item.isPublished || item.isActive ? "Published" : "Draft"}
                  </Badge>
                  {type === "alerts" && item.priority && (
                    <Badge variant={
                      item.priority === "critical" || item.priority === "high" 
                        ? "destructive" 
                        : "outline"
                    }>
                      {item.priority}
                    </Badge>
                  )}
                </div>
                
                {(item.excerpt || item.description) && (
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {item.excerpt || item.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  {item.slug && (
                    <span className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      /{item.slug}
                    </span>
                  )}
                  {item.validUntil && (
                    <span className="flex items-center text-orange-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Valid until {new Date(item.validUntil).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
