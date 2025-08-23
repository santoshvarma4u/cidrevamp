import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { RegionalOffice, InsertRegionalOffice } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function RegionalOfficesAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<RegionalOffice | null>(null);
  const [formData, setFormData] = useState<Partial<InsertRegionalOffice>>({
    name: "",
    address: "",
    phone: "",
    email: "",
    mapUrl: "",
    isActive: true,
    displayOrder: 0,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: offices = [], isLoading } = useQuery<RegionalOffice[]>({
    queryKey: ['/api/admin/regional-offices'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertRegionalOffice) => 
      apiRequest('/api/admin/regional-offices', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/regional-offices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact/regional-offices'] });
      toast({ title: "Regional office created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create regional office", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertRegionalOffice> }) =>
      apiRequest(`/api/admin/regional-offices/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/regional-offices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact/regional-offices'] });
      toast({ title: "Regional office updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update regional office", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/admin/regional-offices/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/regional-offices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact/regional-offices'] });
      toast({ title: "Regional office deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete regional office", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      mapUrl: "",
      isActive: true,
      displayOrder: 0,
    });
    setEditingOffice(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (office: RegionalOffice) => {
    setEditingOffice(office);
    setFormData({
      name: office.name,
      address: office.address,
      phone: office.phone || "",
      email: office.email || "",
      mapUrl: office.mapUrl || "",
      isActive: office.isActive,
      displayOrder: office.displayOrder,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) {
      toast({ title: "Name and address are required", variant: "destructive" });
      return;
    }

    if (editingOffice) {
      updateMutation.mutate({ id: editingOffice.id, data: formData });
    } else {
      createMutation.mutate(formData as InsertRegionalOffice);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 p-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-b-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} data-testid="button-create-office">
              <Plus className="h-4 w-4 mr-2" />
              Add Regional Office
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOffice ? "Edit Regional Office" : "Create Regional Office"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Office name"
                    data-testid="input-office-name"
                  />
                </div>
                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder || 0}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    data-testid="input-display-order"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                  rows={3}
                  data-testid="input-office-address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                    data-testid="input-office-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email address"
                    data-testid="input-office-email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mapUrl">Map URL</Label>
                <Input
                  id="mapUrl"
                  value={formData.mapUrl || ""}
                  onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                  placeholder="Google Maps URL"
                  data-testid="input-map-url"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  data-testid="switch-is-active"
                />
                <Label htmlFor="isActive">Active</Label>
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
                  data-testid="button-save-office"
                >
                  {editingOffice ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Office Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offices.map((office) => (
                <tr key={office.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{office.name}</div>
                      <div className="text-sm text-gray-500 max-w-xs">{office.address}</div>
                      {office.mapUrl && (
                        <a
                          href={office.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-purple-600 hover:text-purple-700 text-xs mt-1"
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          View Map
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {office.phone && (
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="h-3 w-3 mr-2 text-gray-500" />
                          {office.phone}
                        </div>
                      )}
                      {office.email && (
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-3 w-3 mr-2 text-gray-500" />
                          {office.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        office.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {office.isActive ? "Active" : "Inactive"}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Order: {office.displayOrder}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(office)}
                        data-testid={`button-edit-office-${office.id}`}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this regional office?")) {
                            deleteMutation.mutate(office.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`button-delete-office-${office.id}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {offices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No regional offices found. Click "Add Regional Office" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}