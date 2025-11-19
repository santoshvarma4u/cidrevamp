import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import AdminSidebar from "@/components/admin/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, Edit, Trash2, Shield, DollarSign } from "lucide-react";
import type { RtiOfficer, RtiPayScale } from "@shared/schema";

interface OfficerFormData {
  sno: number;
  category: string;
  name: string;
  designation: string;
  phone: string;
  displayOrder: number;
}

interface PayScaleFormData {
  sno: number;
  category: string;
  basicPay: string;
  sgp6: string;
  spp12_18: string;
  spp24: string;
  displayOrder: number;
}

export function RtiAdmin() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"officers" | "pay-scales">("officers");
  const [isOfficerDialogOpen, setIsOfficerDialogOpen] = useState(false);
  const [isPayScaleDialogOpen, setIsPayScaleDialogOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<RtiOfficer | null>(null);
  const [editingPayScale, setEditingPayScale] = useState<RtiPayScale | null>(null);

  const [officerFormData, setOfficerFormData] = useState<OfficerFormData>({
    sno: 0,
    category: "",
    name: "",
    designation: "",
    phone: "",
    displayOrder: 0,
  });

  const [payScaleFormData, setPayScaleFormData] = useState<PayScaleFormData>({
    sno: 0,
    category: "",
    basicPay: "",
    sgp6: "",
    spp12_18: "",
    spp24: "",
    displayOrder: 0,
  });

  const { data: officers = [], isLoading: officersLoading } = useQuery({
    queryKey: ["/api/admin/rti/officers"],
    enabled: isAuthenticated,
  });

  const { data: payScales = [], isLoading: payScalesLoading } = useQuery({
    queryKey: ["/api/admin/rti/pay-scales"],
    enabled: isAuthenticated,
  });

  const createOfficerMutation = useMutation({
    mutationFn: async (data: OfficerFormData) => {
      return apiRequest("/api/admin/rti/officers", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rti/officers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rti/officers"] });
      setIsOfficerDialogOpen(false);
      resetOfficerForm();
      toast({
        title: "Success",
        description: "RTI Officer created successfully",
      });
    },
    onError: (error: Error) => {
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
        description: error.message || "Failed to create RTI officer",
        variant: "destructive",
      });
    },
  });

  const updateOfficerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<OfficerFormData> }) => {
      return apiRequest(`/api/admin/rti/officers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rti/officers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rti/officers"] });
      setIsOfficerDialogOpen(false);
      setEditingOfficer(null);
      resetOfficerForm();
      toast({
        title: "Success",
        description: "RTI Officer updated successfully",
      });
    },
    onError: (error: Error) => {
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
        description: error.message || "Failed to update RTI officer",
        variant: "destructive",
      });
    },
  });

  const deleteOfficerMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/rti/officers/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rti/officers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rti/officers"] });
      toast({
        title: "Success",
        description: "RTI Officer deleted successfully",
      });
    },
    onError: (error: Error) => {
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
        description: error.message || "Failed to delete RTI officer",
        variant: "destructive",
      });
    },
  });

  const createPayScaleMutation = useMutation({
    mutationFn: async (data: PayScaleFormData) => {
      return apiRequest("/api/admin/rti/pay-scales", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rti/pay-scales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rti/pay-scales"] });
      setIsPayScaleDialogOpen(false);
      resetPayScaleForm();
      toast({
        title: "Success",
        description: "RTI Pay Scale created successfully",
      });
    },
    onError: (error: Error) => {
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
        description: error.message || "Failed to create RTI pay scale",
        variant: "destructive",
      });
    },
  });

  const updatePayScaleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<PayScaleFormData> }) => {
      return apiRequest(`/api/admin/rti/pay-scales/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rti/pay-scales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rti/pay-scales"] });
      setIsPayScaleDialogOpen(false);
      setEditingPayScale(null);
      resetPayScaleForm();
      toast({
        title: "Success",
        description: "RTI Pay Scale updated successfully",
      });
    },
    onError: (error: Error) => {
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
        description: error.message || "Failed to update RTI pay scale",
        variant: "destructive",
      });
    },
  });

  const deletePayScaleMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/rti/pay-scales/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/rti/pay-scales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rti/pay-scales"] });
      toast({
        title: "Success",
        description: "RTI Pay Scale deleted successfully",
      });
    },
    onError: (error: Error) => {
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
        description: error.message || "Failed to delete RTI pay scale",
        variant: "destructive",
      });
    },
  });

  const resetOfficerForm = () => {
    setOfficerFormData({
      sno: 0,
      category: "",
      name: "",
      designation: "",
      phone: "",
      displayOrder: 0,
    });
    setEditingOfficer(null);
  };

  const resetPayScaleForm = () => {
    setPayScaleFormData({
      sno: 0,
      category: "",
      basicPay: "",
      sgp6: "",
      spp12_18: "",
      spp24: "",
      displayOrder: 0,
    });
    setEditingPayScale(null);
  };

  const handleEditOfficer = (officer: RtiOfficer) => {
    setEditingOfficer(officer);
    setOfficerFormData({
      sno: officer.sno,
      category: officer.category,
      name: officer.name,
      designation: officer.designation,
      phone: officer.phone || "",
      displayOrder: officer.displayOrder || 0,
    });
    setIsOfficerDialogOpen(true);
  };

  const handleEditPayScale = (payScale: RtiPayScale) => {
    setEditingPayScale(payScale);
    setPayScaleFormData({
      sno: payScale.sno,
      category: payScale.category,
      basicPay: payScale.basicPay || "",
      sgp6: payScale.sgp6 || "",
      spp12_18: payScale.spp12_18 || "",
      spp24: payScale.spp24 || "",
      displayOrder: payScale.displayOrder || 0,
    });
    setIsPayScaleDialogOpen(true);
  };

  const handleSubmitOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOfficer) {
      updateOfficerMutation.mutate({ id: editingOfficer.id, data: officerFormData });
    } else {
      createOfficerMutation.mutate(officerFormData);
    }
  };

  const handleSubmitPayScale = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPayScale) {
      updatePayScaleMutation.mutate({ id: editingPayScale.id, data: payScaleFormData });
    } else {
      createPayScaleMutation.mutate(payScaleFormData);
    }
  };

  const handleDeleteOfficer = (id: number) => {
    if (confirm("Are you sure you want to delete this RTI officer?")) {
      deleteOfficerMutation.mutate(id);
    }
  };

  const handleDeletePayScale = (id: number) => {
    if (confirm("Are you sure you want to delete this RTI pay scale?")) {
      deletePayScaleMutation.mutate(id);
    }
  };

  if (authLoading) {
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">RTI Management</h1>
              <p className="text-gray-600 mt-2">Manage RTI Officers and Pay Scales</p>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "officers" | "pay-scales")}>
              <TabsList className="mb-6">
                <TabsTrigger value="officers" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  RTI Officers
                </TabsTrigger>
                <TabsTrigger value="pay-scales" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Pay Scales
                </TabsTrigger>
              </TabsList>

              {/* RTI Officers Tab */}
              <TabsContent value="officers">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>RTI Officers</CardTitle>
                      <Dialog open={isOfficerDialogOpen} onOpenChange={setIsOfficerDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={resetOfficerForm}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Officer
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {editingOfficer ? "Edit RTI Officer" : "Add RTI Officer"}
                            </DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmitOfficer} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="sno">Serial Number</Label>
                                <Input
                                  id="sno"
                                  type="number"
                                  value={officerFormData.sno}
                                  onChange={(e) =>
                                    setOfficerFormData({
                                      ...officerFormData,
                                      sno: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="displayOrder">Display Order</Label>
                                <Input
                                  id="displayOrder"
                                  type="number"
                                  value={officerFormData.displayOrder}
                                  onChange={(e) =>
                                    setOfficerFormData({
                                      ...officerFormData,
                                      displayOrder: parseInt(e.target.value) || 0,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="category">Category</Label>
                              <Input
                                id="category"
                                value={officerFormData.category}
                                onChange={(e) =>
                                  setOfficerFormData({
                                    ...officerFormData,
                                    category: e.target.value,
                                  })
                                }
                                required
                                placeholder="e.g., HEAD OF THE DEPARTMENT"
                              />
                            </div>
                            <div>
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                value={officerFormData.name}
                                onChange={(e) =>
                                  setOfficerFormData({
                                    ...officerFormData,
                                    name: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="designation">Designation</Label>
                              <Input
                                id="designation"
                                value={officerFormData.designation}
                                onChange={(e) =>
                                  setOfficerFormData({
                                    ...officerFormData,
                                    designation: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                value={officerFormData.phone}
                                onChange={(e) =>
                                  setOfficerFormData({
                                    ...officerFormData,
                                    phone: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                type="submit"
                                disabled={
                                  createOfficerMutation.isPending ||
                                  updateOfficerMutation.isPending
                                }
                              >
                                {editingOfficer ? "Update" : "Create"} Officer
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsOfficerDialogOpen(false);
                                  resetOfficerForm();
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {officersLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : Array.isArray(officers) && officers.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>S.No</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Designation</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(officers as RtiOfficer[]).map((officer) => (
                            <TableRow key={officer.id}>
                              <TableCell>{officer.sno}</TableCell>
                              <TableCell className="font-medium">{officer.category}</TableCell>
                              <TableCell>{officer.name}</TableCell>
                              <TableCell>{officer.designation}</TableCell>
                              <TableCell>{officer.phone || "N/A"}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditOfficer(officer)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteOfficer(officer.id)}
                                    disabled={deleteOfficerMutation.isPending}
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
                        <p className="text-gray-500">No RTI officers found. Add one to get started.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pay Scales Tab */}
              <TabsContent value="pay-scales">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>RTI Pay Scales</CardTitle>
                      <Dialog open={isPayScaleDialogOpen} onOpenChange={setIsPayScaleDialogOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={resetPayScaleForm}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Pay Scale
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {editingPayScale ? "Edit RTI Pay Scale" : "Add RTI Pay Scale"}
                            </DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmitPayScale} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="payScaleSno">Serial Number</Label>
                                <Input
                                  id="payScaleSno"
                                  type="number"
                                  value={payScaleFormData.sno}
                                  onChange={(e) =>
                                    setPayScaleFormData({
                                      ...payScaleFormData,
                                      sno: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="payScaleDisplayOrder">Display Order</Label>
                                <Input
                                  id="payScaleDisplayOrder"
                                  type="number"
                                  value={payScaleFormData.displayOrder}
                                  onChange={(e) =>
                                    setPayScaleFormData({
                                      ...payScaleFormData,
                                      displayOrder: parseInt(e.target.value) || 0,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="payScaleCategory">Category</Label>
                              <Input
                                id="payScaleCategory"
                                value={payScaleFormData.category}
                                onChange={(e) =>
                                  setPayScaleFormData({
                                    ...payScaleFormData,
                                    category: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="basicPay">Basic Pay</Label>
                                <Input
                                  id="basicPay"
                                  value={payScaleFormData.basicPay}
                                  onChange={(e) =>
                                    setPayScaleFormData({
                                      ...payScaleFormData,
                                      basicPay: e.target.value,
                                    })
                                  }
                                  placeholder="e.g., 56870-103290"
                                />
                              </div>
                              <div>
                                <Label htmlFor="sgp6">6 Years SGP Scale</Label>
                                <Input
                                  id="sgp6"
                                  value={payScaleFormData.sgp6}
                                  onChange={(e) =>
                                    setPayScaleFormData({
                                      ...payScaleFormData,
                                      sgp6: e.target.value,
                                    })
                                  }
                                  placeholder="e.g., ------"
                                />
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="spp12_18">12 & 18 Years SPP Scale</Label>
                                <Input
                                  id="spp12_18"
                                  value={payScaleFormData.spp12_18}
                                  onChange={(e) =>
                                    setPayScaleFormData({
                                      ...payScaleFormData,
                                      spp12_18: e.target.value,
                                    })
                                  }
                                  placeholder="e.g., 46060-98440"
                                />
                              </div>
                              <div>
                                <Label htmlFor="spp24">24 Years SPP-II</Label>
                                <Input
                                  id="spp24"
                                  value={payScaleFormData.spp24}
                                  onChange={(e) =>
                                    setPayScaleFormData({
                                      ...payScaleFormData,
                                      spp24: e.target.value,
                                    })
                                  }
                                  placeholder="e.g., 49870-100770"
                                />
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                type="submit"
                                disabled={
                                  createPayScaleMutation.isPending ||
                                  updatePayScaleMutation.isPending
                                }
                              >
                                {editingPayScale ? "Update" : "Create"} Pay Scale
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsPayScaleDialogOpen(false);
                                  resetPayScaleForm();
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {payScalesLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : Array.isArray(payScales) && payScales.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>S.No</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Basic Pay</TableHead>
                              <TableHead>6 Years SGP</TableHead>
                              <TableHead>12 & 18 Years SPP</TableHead>
                              <TableHead>24 Years SPP-II</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(payScales as RtiPayScale[]).map((payScale) => (
                              <TableRow key={payScale.id}>
                                <TableCell>{payScale.sno}</TableCell>
                                <TableCell className="font-medium">{payScale.category}</TableCell>
                                <TableCell className="font-mono text-sm">{payScale.basicPay || "------"}</TableCell>
                                <TableCell className="font-mono text-sm">{payScale.sgp6 || "------"}</TableCell>
                                <TableCell className="font-mono text-sm">{payScale.spp12_18 || "------"}</TableCell>
                                <TableCell className="font-mono text-sm">{payScale.spp24 || "------"}</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditPayScale(payScale)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeletePayScale(payScale.id)}
                                      disabled={deletePayScaleMutation.isPending}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No RTI pay scales found. Add one to get started.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

