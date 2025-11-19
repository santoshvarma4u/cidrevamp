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

// Helper function to safely parse dates
const safeParseDate = (dateValue: any): Date | null => {
  if (!dateValue) return null;
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch (error) {
    console.error("Error parsing date:", dateValue, error);
    return null;
  }
};

// Helper function to safely format date for input field
const safeFormatDateForInput = (dateValue: any): string => {
  const date = safeParseDate(dateValue);
  if (!date) return "";
  try {
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error("Error formatting date for input:", dateValue, error);
    return "";
  }
};

// Helper function to safely format date for display
const safeFormatDateForDisplay = (dateValue: any): string => {
  const date = safeParseDate(dateValue);
  if (!date) return "N/A";
  try {
    return date.toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date for display:", dateValue, error);
    return "N/A";
  }
};

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
  menuLocation: string;
  displayUntilDate: string;
  isNew: boolean;
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
    menuParent: "none",
    menuOrder: 0,
    menuDescription: "",
    menuLocation: "more",
    displayUntilDate: "",
    isNew: false,
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
      menuParent: "none",
      menuOrder: 0,
      menuDescription: "",
      menuLocation: "more",
      displayUntilDate: "",
      isNew: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert "none" back to empty string for database and handle date formatting
    let displayUntilDateValue = "";
    if (formData.displayUntilDate) {
      try {
        const date = new Date(formData.displayUntilDate + 'T23:59:59');
        if (!isNaN(date.getTime())) {
          displayUntilDateValue = date.toISOString();
        }
      } catch (error) {
        console.error("Error formatting displayUntilDate:", error);
        toast({
          title: "Invalid Date",
          description: "Please enter a valid date for 'Display Until Date'",
          variant: "destructive",
        });
        return;
      }
    }
    
    const submissionData = {
      ...formData,
      menuParent: formData.menuParent === "none" ? "" : formData.menuParent,
      displayUntilDate: displayUntilDateValue
    };
    
    if (editingPage) {
      updatePageMutation.mutate({ id: editingPage.id, data: submissionData });
    } else {
      createPageMutation.mutate(submissionData);
    }
  };

  const handleEdit = (page: any) => {
    try {
      setEditingPage(page);
      setFormData({
        slug: page.slug || "",
        title: page.title || "",
        content: page.content || "",
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
        isPublished: page.isPublished || false,
        showInMenu: page.showInMenu || false,
        menuTitle: page.menuTitle || "",
        menuParent: page.menuParent || "none",
        menuOrder: page.menuOrder || 0,
        menuDescription: page.menuDescription || "",
        menuLocation: page.menuLocation || "more",
        displayUntilDate: safeFormatDateForInput(page.displayUntilDate),
        isNew: page.isNew || false,
      });
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error editing page:", error);
      toast({
        title: "Error",
        description: "Failed to load page data. Please try again.",
        variant: "destructive",
      });
    }
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
                    
                    <div className="grid md:grid-cols-3 gap-4">
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
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isNew"
                          checked={formData.isNew}
                          onCheckedChange={(checked) => setFormData({ ...formData, isNew: checked })}
                        />
                        <Label htmlFor="isNew">
                          <span className="flex items-center gap-1">
                            New Badge 
                            <span className="text-xs text-orange-600 font-bold animate-pulse">✨NEW</span>
                          </span>
                        </Label>
                      </div>
                    </div>
                    
                    {formData.showInMenu && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900">Menu Configuration</h3>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="menuTitle">Menu Title</Label>
                            <Input
                              id="menuTitle"
                              value={formData.menuTitle}
                              onChange={(e) => setFormData({ ...formData, menuTitle: e.target.value })}
                              placeholder="Leave empty to use page title"
                            />
                            <p className="text-xs text-gray-500 mt-1">Text displayed in navigation menu</p>
                          </div>
                          <div>
                            <Label htmlFor="menuParent">Parent Menu</Label>
                            <Select 
                              value={formData.menuParent} 
                              onValueChange={(value) => setFormData({ ...formData, menuParent: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select parent menu or leave blank for main menu" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Main Menu (No Parent)</SelectItem>
                                {Array.isArray(pages) && (pages as any[])
                                  .filter((page: any) => page.showInMenu && !page.menuParent)
                                  .sort((a: any, b: any) => a.menuOrder - b.menuOrder)
                                  .map((page: any) => (
                                    <SelectItem key={page.id} value={page.slug}>
                                      {page.menuTitle || page.title}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500 mt-1">
                              {formData.menuParent && formData.menuParent !== "none" ? "Will appear as dropdown item" : "Will appear as main menu item"}
                            </p>
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
                            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                          </div>
                          <div>
                            <Label htmlFor="menuDescription">Menu Description (optional)</Label>
                            <Input
                              id="menuDescription"
                              value={formData.menuDescription}
                              onChange={(e) => setFormData({ ...formData, menuDescription: e.target.value })}
                              placeholder="Brief description for dropdown menus"
                            />
                            <p className="text-xs text-gray-500 mt-1">Shown in dropdown tooltips</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-900">Menu Location & Visibility</h4>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="menuLocation">Menu Location</Label>
                              <Select 
                                value={formData.menuLocation} 
                                onValueChange={(value) => setFormData({ ...formData, menuLocation: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select menu location" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="more">More Section (Always visible)</SelectItem>
                                  <SelectItem value="main_menu">Main Menu Bar (Temporary)</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-blue-600 mt-1">
                                {formData.menuLocation === 'main_menu' ? 
                                  'Will appear in main navigation until expiry date' : 
                                  'Will appear in "More" dropdown menu'
                                }
                              </p>
                            </div>
                            
                            {formData.menuLocation === 'main_menu' && (
                              <div>
                                <Label htmlFor="displayUntilDate">Display Until Date</Label>
                                <Input
                                  id="displayUntilDate"
                                  type="date"
                                  value={formData.displayUntilDate}
                                  onChange={(e) => setFormData({ ...formData, displayUntilDate: e.target.value })}
                                  min={new Date().toISOString().split('T')[0]}
                                />
                                <p className="text-xs text-blue-600 mt-1">
                                  After this date, page will automatically move to "More" section
                                </p>
                              </div>
                            )}
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
                ) : Array.isArray(pages) && pages.length > 0 ? (
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
                      {(pages as any[]).map((page: any) => (
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
                                <div className="text-xs text-gray-500">
                                  Location: {page.menuLocation === "main_menu" ? "Main Menu" : "More Menu"}
                                </div>
                                {page.menuParent ? (
                                  <div className="text-xs text-gray-500">
                                    Under: {page.menuParent}
                                  </div>
                                ) : (
                                  <div className="text-xs text-gray-500">
                                    Top Level
                                  </div>
                                )}
                                {page.menuLocation === "main_menu" && page.displayUntilDate && (
                                  <div className="text-xs text-orange-500">
                                    Until: {safeFormatDateForDisplay(page.displayUntilDate)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">Not in menu</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {safeFormatDateForDisplay(page.updatedAt)}
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
