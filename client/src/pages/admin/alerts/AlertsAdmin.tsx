import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import queryClient from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, AlertTriangle, Shield, Users, Building, Globe } from "lucide-react";
import AdminSidebar from "@/components/admin/Sidebar";
import LoadingSpinner from "@/components/ui/loading-spinner";
import type { Alert, InsertAlert } from "@shared/schema";

interface AlertFormData {
  title: string;
  description: string;
  category: string;
  slug: string;
  content: string;
  iconName: string;
  priority: number;
  isActive: boolean;
}

const categories = [
  { value: "cyber-safety", label: "Cyber Safety" },
  { value: "women-children", label: "Women & Children Safety" },
  { value: "general-safety", label: "General Safety" },
  { value: "dos", label: "Do's" },
  { value: "donts", label: "Don'ts" }
];

const iconOptions = [
  { value: "AlertTriangle", label: "Alert Triangle", icon: AlertTriangle },
  { value: "Shield", label: "Shield", icon: Shield },
  { value: "Users", label: "Users", icon: Users },
  { value: "Building", label: "Building", icon: Building },
  { value: "Globe", label: "Globe", icon: Globe }
];

function AlertsAdmin() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [formData, setFormData] = useState<AlertFormData>({
    title: "",
    description: "",
    category: "",
    slug: "",
    content: "",
    iconName: "",
    priority: 0,
    isActive: true,
  });

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["/api/admin/alerts"],
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: async (data: AlertFormData) => {
      return apiRequest("/api/admin/alerts", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/alerts"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Alert created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create alert",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & AlertFormData) => {
      return apiRequest(`/api/admin/alerts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/alerts"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Alert updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update alert",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/alerts/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/alerts"] });
      toast({
        title: "Success",
        description: "Alert deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete alert",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      slug: "",
      content: "",
      iconName: "",
      priority: 0,
      isActive: true,
    });
    setEditingAlert(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAlert) {
      updateMutation.mutate({ id: editingAlert.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (alert: Alert) => {
    setEditingAlert(alert);
    setFormData({
      title: alert.title || "",
      description: alert.description || "",
      category: alert.category || "",
      slug: alert.slug || "",
      content: alert.content || "",
      iconName: alert.iconName || "",
      priority: alert.priority || 0,
      isActive: alert.isActive || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (alert: Alert) => {
    if (confirm("Are you sure you want to delete this alert?")) {
      deleteMutation.mutate(alert.id);
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "cyber-safety":
        return "bg-blue-100 text-blue-800";
      case "women-children":
        return "bg-pink-100 text-pink-800";
      case "general-safety":
        return "bg-green-100 text-green-800";
      case "dos":
        return "bg-yellow-100 text-yellow-800";
      case "donts":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading admin...</p>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64">
          <div className="p-4">Loading alerts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64">
        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Alerts Management</h2>
              <p className="text-sm text-gray-600">Manage safety alerts and guidelines</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} data-testid="button-add-alert">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Alert
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingAlert ? "Edit Alert" : "Add Alert"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Alert title"
                        required
                        data-testid="input-title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Slug</label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="URL slug (optional)"
                        data-testid="input-slug"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Icon</label>
                      <Select
                        value={formData.iconName}
                        onValueChange={(value) => setFormData({ ...formData, iconName: value })}
                      >
                        <SelectTrigger data-testid="select-icon">
                          <SelectValue placeholder="Select icon (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon.value} value={icon.value}>
                              <div className="flex items-center">
                                <icon.icon className="h-4 w-4 mr-2" />
                                {icon.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description"
                      data-testid="textarea-description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Content</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Full alert content"
                      rows={4}
                      data-testid="textarea-content"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Priority</label>
                      <Input
                        type="number"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                        placeholder="Priority (0-100)"
                        min="0"
                        max="100"
                        data-testid="input-priority"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded"
                        data-testid="checkbox-active"
                      />
                      <label className="text-sm font-medium">Active</label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      data-testid="button-submit"
                    >
                      {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {alerts?.map((alert: Alert) => (
              <Card key={alert.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold" data-testid={`text-title-${alert.id}`}>
                          {alert.title}
                        </h3>
                        <Badge className={getCategoryBadgeColor(alert.category || "")}>
                          {categories.find(c => c.value === alert.category)?.label || alert.category}
                        </Badge>
                        <Badge variant={alert.isActive ? "default" : "secondary"}>
                          {alert.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2" data-testid={`text-description-${alert.id}`}>
                        {alert.description}
                      </p>
                      {alert.content && (
                        <p className="text-sm text-gray-500 line-clamp-2" data-testid={`text-content-${alert.id}`}>
                          {alert.content}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {alert.slug && <span>Slug: {alert.slug}</span>}
                        <span>Priority: {alert.priority || 0}</span>
                        {alert.iconName && <span>Icon: {alert.iconName}</span>}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(alert)}
                        data-testid={`button-edit-${alert.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(alert)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`button-delete-${alert.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {alerts?.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No alerts found. Create your first alert to get started.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlertsAdmin;