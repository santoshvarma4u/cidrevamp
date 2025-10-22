import ProtectedEmail from "@/components/common/ProtectedEmail";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, User, Phone, Mail, MapPin, Camera } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { SeniorOfficer, InsertSeniorOfficer } from "@shared/schema";

interface FormData {
  position: string;
  name: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  displayOrder: number;
  isActive: boolean;
  photo?: File;
}

export function SeniorOfficersAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<SeniorOfficer | null>(null);
  const [formData, setFormData] = useState<FormData>({
    position: "",
    name: "",
    description: "",
    location: "",
    phone: "",
    email: "",
    displayOrder: 0,
    isActive: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: officers = [], isLoading } = useQuery<SeniorOfficer[]>({
    queryKey: ["/api/admin/senior-officers"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formDataToSend = new FormData();
      Object.entries(data||{}).forEach(([key, value]) => {
        if (key === "photo" && value instanceof File) {
          formDataToSend.append("photo", value);
        } else if (value !== undefined && value !== null) {
          // Handle special data type conversions for server validation
          if (key === "displayOrder") {
            formDataToSend.append(key, String(Number(value)));
          } else if (key === "isActive") {
            formDataToSend.append(key, String(Boolean(value)));
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      return apiRequest("/api/admin/senior-officers", {
        method: "POST",
        body: formDataToSend,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/senior-officers"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Senior officer created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create senior officer",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "photo" && value instanceof File) {
          formDataToSend.append("photo", value);
        } else if (value !== undefined && value !== null) {
          // Handle special data type conversions for server validation
          if (key === "displayOrder") {
            formDataToSend.append(key, String(Number(value)));
          } else if (key === "isActive") {
            formDataToSend.append(key, String(Boolean(value)));
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      return apiRequest(`/api/admin/senior-officers/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/senior-officers"] });
      setIsDialogOpen(false);
      resetForm();
      setEditingOfficer(null);
      toast({
        title: "Success",
        description: "Senior officer updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update senior officer",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/senior-officers/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/senior-officers"] });
      toast({
        title: "Success",
        description: "Senior officer deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete senior officer",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      position: "",
      name: "",
      description: "",
      location: "",
      phone: "",
      email: "",
      displayOrder: 0,
      isActive: true,
    });
  };

  const handleEdit = (officer: SeniorOfficer) => {
    setEditingOfficer(officer);
    setFormData({
      position: officer.position,
      name: officer.name,
      description: officer.description ?? "",
      location: officer.location ?? "",
      phone: officer.phone ?? "",
      email: officer.email ?? "",
      displayOrder: officer.displayOrder ?? 0,
      isActive: Boolean(officer.isActive),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOfficer) {
      updateMutation.mutate({ id: editingOfficer.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (officer: SeniorOfficer) => {
    if (window.confirm(`Are you sure you want to delete ${officer.name}?`)) {
      deleteMutation.mutate(officer.id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading senior officers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Senior Officers</h2>
          <p className="text-sm text-gray-600">Manage senior officers information</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} data-testid="button-add-officer">
              <Plus className="h-4 w-4 mr-2" />
              Add Officer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingOfficer ? "Edit Senior Officer" : "Add Senior Officer"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                  </label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g. Director General of Police"
                    required
                    data-testid="input-position"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Officer name"
                    required
                    data-testid="input-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of role and responsibilities"
                  rows={3}
                  data-testid="input-description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Office location"
                    data-testid="input-location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <Input
                    type="number"
                    value={formData.displayOrder.toString()}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    data-testid="input-display-order"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  data-testid="input-photo"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  data-testid="switch-active"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active (visible on public pages)
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                    setEditingOfficer(null);
                  }}
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
        {officers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No senior officers</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first senior officer.</p>
              <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-first-officer">
                <Plus className="h-4 w-4 mr-2" />
                Add Senior Officer
              </Button>
            </CardContent>
          </Card>
        ) : (
          officers.map((officer: SeniorOfficer) => (
            <Card key={officer.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {officer.photoPath ? (
                      <img
                        src={officer.photoPath}
                        alt={officer.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{officer.name}</CardTitle>
                      <p className="text-blue-600 font-medium">{officer.position}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant={officer.isActive ? "default" : "secondary"}>
                          {officer.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Order: {officer.displayOrder || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(officer)}
                      data-testid={`button-edit-${officer.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(officer)}
                      className="text-red-600 hover:text-red-700"
                      data-testid={`button-delete-${officer.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {(officer.description || officer.location || officer.phone || officer.email) && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {officer.description && (
                      <p className="text-gray-600">{officer.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      {officer.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {officer.location}
                        </div>
                      )}
                      {officer.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {officer.phone}
                        </div>
                      )}
                      {officer.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          <ProtectedEmail 
                            email={officer.email} 
                            method="obfuscated"
                            showIcon={false}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
