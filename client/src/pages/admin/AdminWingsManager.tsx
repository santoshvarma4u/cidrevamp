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

  // Fetch all wings
  const { data: wingsList = [], isLoading: isLoadingWings } = useQuery({
    queryKey: ["/api/admin/wings"],
    queryFn: () => apiRequest("/api/admin/wings"),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertWing) => {
      return apiRequest("/api/admin/wings", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Wing created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/wings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wings"] });
      resetForm();
    },
    onError: (error: Error) => {
      console.error("Create wing error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create wing",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertWing> }) => {
      return apiRequest(`/api/admin/wings/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Wing updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/wings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wings"] });
      resetForm();
    },
    onError: (error: Error) => {
      console.error("Update wing error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update wing",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/wings/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Wing deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/wings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wings"] });
    },
    onError: (error: Error) => {
      console.error("Delete wing error:", error);
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
    setFeatureInput("");
    setIsEditing(false);
    setEditingId(null);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
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
                  placeholder="Brief description of the wing's purpose"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
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
                    value={formData.displayOrder ?? 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label>Features</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add a feature (e.g., Banking fraud investigations)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      {feature}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0"
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
                  checked={formData.isActive ?? true}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Update Wing" : "Create Wing"}
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
      <div className="grid gap-4">
        <h2 className="text-2xl font-semibold">Existing Wings</h2>
        {isLoadingWings ? (
          <div>Loading wings...</div>
        ) : wingsList.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No wings found. Create your first wing to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {wingsList.map((wing: Wing) => (
              <Card key={wing.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
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
  );
}