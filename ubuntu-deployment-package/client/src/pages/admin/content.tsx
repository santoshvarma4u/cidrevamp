import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ContentEditor from "@/components/admin/content-editor";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  Eye,
  Globe,
} from "lucide-react";

export default function AdminContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pages, isLoading } = useQuery({
    queryKey: ["/api/pages"],
  });

  const { data: news } = useQuery({
    queryKey: ["/api/news"],
  });

  const createPageMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/pages", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({ title: "Page created successfully" });
      setIsDialogOpen(false);
      setEditingPage(null);
    },
    onError: (error) => {
      toast({
        title: "Error creating page",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest("PUT", `/api/pages/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({ title: "Page updated successfully" });
      setIsDialogOpen(false);
      setEditingPage(null);
    },
    onError: (error) => {
      toast({
        title: "Error updating page",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({ title: "Page deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error deleting page",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createNewsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/news", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "News article created successfully" });
      setIsDialogOpen(false);
      setEditingPage(null);
    },
    onError: (error) => {
      toast({
        title: "Error creating news article",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = (data: any) => {
    if (editingPage) {
      if (editingPage.type === 'news') {
        // Handle news update
        console.log('Update news:', data);
      } else {
        updatePageMutation.mutate({ id: editingPage.id, data });
      }
    } else {
      // Determine if this is a page or news based on context
      createPageMutation.mutate(data);
    }
  };

  const handleEdit = (item: any, type: 'page' | 'news' = 'page') => {
    setEditingPage({ ...item, type });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number, type: 'page' | 'news' = 'page') => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'page') {
        deletePageMutation.mutate(id);
      } else {
        // Handle news deletion
        console.log('Delete news:', id);
      }
    }
  };

  const openNewDialog = (type: 'page' | 'news' = 'page') => {
    setEditingPage({ type });
    setIsDialogOpen(true);
  };

  const allContent = [
    ...(pages?.map((page: any) => ({ ...page, type: 'page' })) || []),
    ...(news?.map((article: any) => ({ ...article, type: 'news' })) || []),
  ];

  const filteredContent = allContent.filter((item: any) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ||
                         (statusFilter === "published" && item.isPublished) ||
                         (statusFilter === "draft" && !item.isPublished);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
          <p className="text-gray-600">Manage pages, news articles, and website content</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openNewDialog('page')}>
                <Plus className="mr-2 h-4 w-4" />
                New Page
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => openNewDialog('news')}>
                <Plus className="mr-2 h-4 w-4" />
                New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPage 
                    ? `Edit ${editingPage.type === 'news' ? 'Article' : 'Page'}`
                    : `Create New ${editingPage?.type === 'news' ? 'Article' : 'Page'}`
                  }
                </DialogTitle>
              </DialogHeader>
              
              <ContentEditor
                title={editingPage?.title || ""}
                content={editingPage?.content || ""}
                metaTitle={editingPage?.metaTitle || ""}
                metaDescription={editingPage?.metaDescription || ""}
                isPublished={editingPage?.isPublished || false}
                onSave={handleSave}
                isLoading={createPageMutation.isPending || updatePageMutation.isPending || createNewsMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pages</p>
                <p className="text-3xl font-bold text-gray-900">{pages?.length || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">News Articles</p>
                <p className="text-3xl font-bold text-gray-900">{news?.length || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-gray-900">
                  {allContent.filter(item => item.isPublished).length}
                </p>
              </div>
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-3xl font-bold text-gray-900">
                  {allContent.filter(item => !item.isPublished).length}
                </p>
              </div>
              <Edit className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Content</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-16 bg-gray-200 rounded" />
                    <div className="h-8 w-8 bg-gray-200 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredContent && filteredContent.length > 0 ? (
        <div className="space-y-4">
          {filteredContent.map((item: any) => (
            <Card key={`${item.type}-${item.id}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <Badge variant={item.type === 'news' ? 'default' : 'secondary'}>
                        {item.type === 'news' ? 'News' : 'Page'}
                      </Badge>
                      <Badge variant={item.isPublished ? 'default' : 'outline'}>
                        {item.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    
                    {item.content && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {item.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {item.type === 'news' && item.publishedAt 
                            ? new Date(item.publishedAt).toLocaleDateString()
                            : new Date(item.createdAt).toLocaleDateString()
                          }
                        </span>
                      </div>
                      {item.slug && (
                        <div className="flex items-center space-x-1">
                          <Globe className="h-4 w-4" />
                          <span className="font-mono">/{item.slug}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {item.isPublished && (
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item, item.type)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.type)}
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
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "No content matches your current filters."
                : "Start by creating your first page or article."
              }
            </p>
            <div className="flex justify-center space-x-2">
              <Button onClick={() => openNewDialog('page')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Page
              </Button>
              <Button variant="outline" onClick={() => openNewDialog('news')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Article
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
