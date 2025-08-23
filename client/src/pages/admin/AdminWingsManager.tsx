import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Edit2, Plus, Save, X } from "lucide-react";
import AdminSidebar from "@/components/admin/Sidebar";
import LoadingSpinner from "@/components/ui/loading-spinner";
import type { Wing, InsertWing } from "@shared/schema";

const iconOptions = [
  { value: "CreditCard", label: "Credit Card (Financial)" },
  { value: "Heart", label: "Heart (Protection)" },
  { value: "Scale", label: "Scale (Justice)" },
  { value: "Computer", label: "Computer (Technology)" },
  { value: "Shield", label: "Shield (Security)" },
  { value: "Users", label: "Users (Community)" },
  { value: "BookOpen", label: "Book (Investigation)" },
  { value: "Phone", label: "Phone (Communication)" },
];

export default function AdminWingsManager() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<InsertWing>({
    title: "",
    description: "",
    features: [],
    icon: "CreditCard",
    href: "",
    isActive: true,
    displayOrder: 0
  });
  const [featureInput, setFeatureInput] = useState("");

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

  // Fetch wings
  const { data: wings = [] } = useQuery<Wing[]>({
    queryKey: ["/api/admin/wings"],
    enabled: isAuthenticated,
  });

  // Create wing mutation
  const createMutation = useMutation({
    mutationFn: (data: InsertWing) => apiRequest("/api/admin/wings", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/wings"] });
      toast({ title: "Success", description: "Wing created successfully" });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create wing",
        variant: "destructive",
      });
    },
  });

  // Update wing mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: InsertWing }) => 
      apiRequest(`/api/admin/wings/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/wings"] });
      toast({ title: "Success", description: "Wing updated successfully" });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update wing",
        variant: "destructive",
      });
    },
  });

  // Delete wing mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/wings/${id}`, {
      method: "DELETE",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/wings"] });
      toast({ title: "Success", description: "Wing deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete wing",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      features: [],
      icon: "CreditCard",
      href: "",
      isActive: true,
      displayOrder: 0
    });
    setIsEditing(false);
    setEditingId(null);
    setFeatureInput("");
  };

  const handleEdit = (wing: Wing) => {
    setFormData({
      title: wing.title,
      description: wing.description,
      features: wing.features,
      icon: wing.icon,
      href: wing.href,
      isActive: wing.isActive,
      displayOrder: wing.displayOrder
    });
    setIsEditing(true);
    setEditingId(wing.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.href.trim()) {
      toast({
        title: "Error",
        description: "Title, description, and href are required",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Loading state
  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Wings Management</h1>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Wing
              </Button>
            )}
          </div>

          {/* Create/Edit Form */}
          {isEditing && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingId ? "Edit Wing" : "Create New Wing"}</CardTitle>
                <CardDescription>
                  {editingId ? "Update the wing information" : "Add a new specialized wing to the CID"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Wing title (e.g., Economic Offences Wing)"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="href">Page Link *</Label>
                      <Input
                        id="href"
                        value={formData.href}
                        onChange={(e) => setFormData(prev => ({ ...prev, href: e.target.value }))}
                        placeholder="/economic-offences"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the wing"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="icon">Icon</Label>
                      <Select 
                        value={formData.icon} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="displayOrder">Display Order</Label>
                      <Input
                        id="displayOrder"
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Features</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        placeholder="Enter a feature"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      />
                      <Button type="button" onClick={addFeature} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="pr-1">
                          {feature}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-1 hover:bg-transparent"
                            onClick={() => removeFeature(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="isActive" 
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Wing"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Wings List */}
          {wings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No wings found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Create specialized wings for your CID structure
                  </p>
                  <Button onClick={() => setIsEditing(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Wing
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {wings.map((wing) => (
                <Card key={wing.id} className="w-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{wing.title}</h3>
                          <Badge variant={wing.isActive ? "default" : "secondary"}>
                            {wing.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">Order: {wing.displayOrder}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{wing.description}</p>
                        <div className="mb-3">
                          <strong>Features:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {wing.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <strong>Icon:</strong> {wing.icon} | <strong>Link:</strong> {wing.href}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(wing)}
                          disabled={isEditing}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(wing.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}