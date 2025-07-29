import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import AdminSidebar from "@/components/admin/Sidebar";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react";

interface PageFormData {
  slug: string;
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  showInMenu: boolean;
  menuTitle: string;
  menuParent: string;
  menuOrder: number;
  menuDescription: string;
}

export default function AdminPages() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [formData, setFormData] = useState<PageFormData>({
    slug: "",
    title: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    isPublished: false,
    showInMenu: false,
    menuTitle: "",
    menuParent: "",
    menuOrder: 0,
    menuDescription: "",
  });

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

  const { data: pages = [], isLoading: pagesLoading } = useQuery({
    queryKey: ["/api/pages"],
    enabled: isAuthenticated,
  });

  const createPageMutation = useMutation({
    mutationFn: async (data: PageFormData) => {
      return apiRequest("/api/admin/pages", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({
        title: "Success",
        description: "Page created successfully",
      });
      setIsDialogOpen(false);
      resetForm();
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

  const updatePageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<PageFormData> }) => {
      return apiRequest(`/api/admin/pages/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({
        title: "Success",
        description: "Page updated successfully",
      });
      setIsDialogOpen(false);
      setEditingPage(null);
      resetForm();
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
        description: "Failed to update page",
        variant: "destructive",
      });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/pages/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({
        title: "Success",
        description: "Page deleted successfully",
      });
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
        description: "Failed to delete page",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      isPublished: false,
      showInMenu: false,
      menuTitle: "",
      menuParent: "",
      menuOrder: 0,
      menuDescription: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage) {
      updatePageMutation.mutate({ id: editingPage.id, data: formData });
    } else {
      createPageMutation.mutate(formData);
    }
  };

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content || "",
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
      isPublished: page.isPublished,
      showInMenu: page.showInMenu || false,
      menuTitle: page.menuTitle || "",
      menuParent: page.menuParent || "",
      menuOrder: page.menuOrder || 0,
      menuDescription: page.menuDescription || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this page?")) {
      deletePageMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 lg:ml-64">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pages Management</h1>
                <p className="text-gray-600 mt-2">Create and manage website pages</p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { resetForm(); setEditingPage(null); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Page
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingPage ? "Edit Page" : "Create New Page"}</DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">URL Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          placeholder="e.g., about-us"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <RichTextEditor
                        value={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                        <Input
                          id="metaTitle"
                          value={formData.metaTitle}
                          onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                        <Textarea
                          id="metaDescription"
                          value={formData.metaDescription}
                          onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="published"
                          checked={formData.isPublished}
                          onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                        />
                        <Label htmlFor="published">Publish immediately</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="showInMenu"
                          checked={formData.showInMenu}
                          onCheckedChange={(checked) => setFormData({ ...formData, showInMenu: checked })}
                        />
                        <Label htmlFor="showInMenu">Show in Navigation Menu</Label>
                      </div>
                    </div>
                    
                    {formData.showInMenu && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900">Menu Configuration</h3>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="menuTitle">Menu Title (optional)</Label>
                            <Input
                              id="menuTitle"
                              value={formData.menuTitle}
                              onChange={(e) => setFormData({ ...formData, menuTitle: e.target.value })}
                              placeholder="Leave empty to use page title"
                            />
                          </div>
                          <div>
                            <Label htmlFor="menuParent">Menu Group</Label>
                            <Select 
                              value={formData.menuParent} 
                              onValueChange={(value) => setFormData({ ...formData, menuParent: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select menu group" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="top-level">Top Level (No Group)</SelectItem>
                                <SelectItem value="about">About CID</SelectItem>
                                <SelectItem value="wings">Specialized Wings</SelectItem>
                                <SelectItem value="citizen-services">Citizen Services</SelectItem>
                                <SelectItem value="media">Media & Resources</SelectItem>
                                <SelectItem value="contact">Contact & Information</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="menuOrder">Display Order</Label>
                            <Input
                              id="menuOrder"
                              type="number"
                              value={formData.menuOrder}
                              onChange={(e) => setFormData({ ...formData, menuOrder: parseInt(e.target.value) || 0 })}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="menuDescription">Menu Description (optional)</Label>
                            <Input
                              id="menuDescription"
                              value={formData.menuDescription}
                              onChange={(e) => setFormData({ ...formData, menuDescription: e.target.value })}
                              placeholder="Brief description for dropdown menus"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        type="submit"
                        disabled={createPageMutation.isPending || updatePageMutation.isPending}
                      >
                        {createPageMutation.isPending || updatePageMutation.isPending ? "Saving..." : editingPage ? "Update Page" : "Create Page"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>All Pages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pagesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : pages.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Menu</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pages.map((page: any) => (
                        <TableRow key={page.id}>
                          <TableCell className="font-medium">{page.title}</TableCell>
                          <TableCell>/{page.slug}</TableCell>
                          <TableCell>
                            <Badge variant={page.isPublished ? "default" : "secondary"}>
                              {page.isPublished ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {page.showInMenu ? (
                              <div className="space-y-1">
                                <Badge variant="outline" className="text-xs">
                                  In Menu
                                </Badge>
                                {page.menuParent && (
                                  <div className="text-xs text-gray-500">
                                    Group: {page.menuParent}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">Not in menu</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(page.updatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(page)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(page.id)}
                                disabled={deletePageMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No pages created yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
