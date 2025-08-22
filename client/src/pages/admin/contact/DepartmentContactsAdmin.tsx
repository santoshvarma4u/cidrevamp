import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { DepartmentContact, InsertDepartmentContact } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DepartmentContactsAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<DepartmentContact | null>(null);
  const [formData, setFormData] = useState<Partial<InsertDepartmentContact>>({
    sno: 0,
    rank: "",
    landline: "",
    email: "",
    isActive: true,
    displayOrder: 0,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery<DepartmentContact[]>({
    queryKey: ['/api/admin/department-contacts'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertDepartmentContact) => 
      apiRequest('/api/admin/department-contacts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/department-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact/department-contacts'] });
      toast({ title: "Department contact created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create department contact", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertDepartmentContact> }) =>
      apiRequest(`/api/admin/department-contacts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/department-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact/department-contacts'] });
      toast({ title: "Department contact updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update department contact", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/admin/department-contacts/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/department-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact/department-contacts'] });
      toast({ title: "Department contact deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete department contact", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      sno: 0,
      rank: "",
      landline: "",
      email: "",
      isActive: true,
      displayOrder: 0,
    });
    setEditingContact(null);
  };

  const openCreateDialog = () => {
    resetForm();
    // Auto-suggest next serial number
    const maxSno = Math.max(...contacts.map(c => c.sno), 0);
    setFormData(prev => ({ ...prev, sno: maxSno + 1, displayOrder: maxSno + 1 }));
    setIsDialogOpen(true);
  };

  const openEditDialog = (contact: DepartmentContact) => {
    setEditingContact(contact);
    setFormData({
      sno: contact.sno,
      rank: contact.rank,
      landline: contact.landline || "",
      email: contact.email || "",
      isActive: contact.isActive,
      displayOrder: contact.displayOrder,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.rank || !formData.sno) {
      toast({ title: "Serial number and rank are required", variant: "destructive" });
      return;
    }

    if (editingContact) {
      updateMutation.mutate({ id: editingContact.id, data: formData });
    } else {
      createMutation.mutate(formData as InsertDepartmentContact);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Department Contacts Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} data-testid="button-create-contact">
              <Plus className="h-4 w-4 mr-2" />
              Add Department Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContact ? "Edit Department Contact" : "Create Department Contact"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sno">Serial Number *</Label>
                  <Input
                    id="sno"
                    type="number"
                    value={formData.sno}
                    onChange={(e) => setFormData({ ...formData, sno: parseInt(e.target.value) })}
                    placeholder="1"
                    data-testid="input-contact-sno"
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
                <Label htmlFor="rank">Rank/Position *</Label>
                <Textarea
                  id="rank"
                  value={formData.rank}
                  onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                  placeholder="Official rank or position"
                  rows={2}
                  data-testid="input-contact-rank"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="landline">Landline</Label>
                  <Input
                    id="landline"
                    value={formData.landline || ""}
                    onChange={(e) => setFormData({ ...formData, landline: e.target.value })}
                    placeholder="040-12345678"
                    data-testid="input-contact-landline"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@cid.tspolice.gov.in"
                    data-testid="input-contact-email"
                  />
                </div>
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
                  data-testid="button-save-contact"
                >
                  {editingContact ? "Update" : "Create"}
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
                  SL No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Rank/Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Contact Information
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
              {contacts
                .sort((a, b) => a.sno - b.sno)
                .map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm font-medium text-gray-900">{contact.sno}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">{contact.rank}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {contact.landline && (
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="h-3 w-3 mr-2 text-gray-500" />
                          {contact.landline}
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-3 w-3 mr-2 text-gray-500" />
                          <a 
                            href={`mailto:${contact.email}`}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            {contact.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        contact.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {contact.isActive ? "Active" : "Inactive"}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Order: {contact.displayOrder}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(contact)}
                        data-testid={`button-edit-contact-${contact.id}`}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this department contact?")) {
                            deleteMutation.mutate(contact.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`button-delete-contact-${contact.id}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {contacts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No department contacts found. Click "Add Department Contact" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}