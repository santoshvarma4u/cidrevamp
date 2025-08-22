import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, User, Save, Trash2, Edit, UserCheck } from "lucide-react";

interface DirectorInfo {
  id: number;
  name: string;
  title: string;
  message: string;
  photoPath?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDirectorManager() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "Director General of Police",
    message: "",
    isActive: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  // Fetch all director info
  const { data: directorInfoList = [], isLoading: isLoadingDirectors } = useQuery({
    queryKey: ["/api/admin/director-info"],
    queryFn: () => apiRequest("/api/admin/director-info").then((res) => res.json()),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/admin/director-info", {
        method: "POST",
        credentials: "include",
        body: data,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`${response.status}: ${errorData.message || response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Director information created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/director-info"] });
      queryClient.invalidateQueries({ queryKey: ["/api/director-info"] });
      resetForm();
    },
    onError: (error: Error) => {
      console.error("Create director error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create director information",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await fetch(`/api/admin/director-info/${id}`, {
        method: "PUT",
        credentials: "include",
        body: data,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`${response.status}: ${errorData.message || response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Director information updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/director-info"] });
      queryClient.invalidateQueries({ queryKey: ["/api/director-info"] });
      resetForm();
    },
    onError: (error: Error) => {
      console.error("Update director error:", error);
      toast({
        title: "Error", 
        description: error.message || "Failed to update director information",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/director-info/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Director information deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/director-info"] });
      queryClient.invalidateQueries({ queryKey: ["/api/director-info"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete director information",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      title: "Director General of Police",
      message: "",
      isActive: true
    });
    setSelectedFile(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (info: DirectorInfo) => {
    setFormData({
      name: info.name,
      title: info.title,
      message: info.message,
      isActive: info.isActive
    });
    setEditingId(info.id);
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("message", formData.message);
    formDataToSend.append("isActive", formData.isActive.toString());
    
    if (selectedFile) {
      formDataToSend.append("photo", selectedFile);
    }

    if (isEditing && editingId) {
      updateMutation.mutate({ id: editingId, data: formDataToSend });
    } else {
      createMutation.mutate(formDataToSend);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this director information?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading || isLoadingDirectors) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <div className="flex items-center justify-center p-8">
            <div className="text-lg">Loading director information...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="h-6 w-6" />
          Director Information Management
        </h1>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {isEditing ? "Edit Director Information" : "Add Director Information"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Director's full name"
                  required
                  data-testid="input-director-name"
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Official title"
                  data-testid="input-director-title"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Director's message to the public"
                rows={5}
                required
                data-testid="textarea-director-message"
              />
            </div>

            <div>
              <Label htmlFor="photo">Photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                data-testid="input-director-photo"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload a professional photo of the director
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                data-testid="switch-director-active"
              />
              <Label htmlFor="isActive">Active (Display on website)</Label>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-director"
              >
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Update" : "Save"}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm} data-testid="button-cancel-edit">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List of existing director info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Existing Director Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {directorInfoList.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No director information found</p>
          ) : (
            <div className="space-y-4">
              {directorInfoList.map((info: DirectorInfo) => (
                <div
                  key={info.id}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {info.photoPath && (
                      <img
                        src={`/${info.photoPath}`}
                        alt={info.name}
                        className="w-16 h-20 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{info.name}</h3>
                      <p className="text-sm text-gray-600">{info.title}</p>
                      <p className="text-sm text-gray-500 mt-1 max-w-md truncate">
                        {info.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            info.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {info.isActive ? "Active" : "Inactive"}
                        </span>
                        <span className="text-xs text-gray-500">
                          Updated: {new Date(info.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(info)}
                      data-testid={`button-edit-director-${info.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(info.id)}
                      className="text-red-600 hover:text-red-700"
                      data-testid={`button-delete-director-${info.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}