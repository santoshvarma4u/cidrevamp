import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import AdminSidebar from "@/components/admin/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { 
  MessageSquare, 
  Eye, 
  Edit, 
  Clock, 
  User, 
  Phone, 
  Mail,
  MapPin,
  Filter,
  Search
} from "lucide-react";

export default function AdminComplaintsList() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updateData, setUpdateData] = useState({
    status: "",
    notes: "",
    priority: "",
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

  const { data: complaints = [], isLoading: complaintsLoading } = useQuery({
    queryKey: ["/api/admin/complaints", statusFilter !== "all" ? statusFilter : undefined],
    enabled: isAuthenticated,
  });

  const updateComplaintMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest(`/api/admin/complaints/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/complaints"] });
      toast({
        title: "Success",
        description: "Complaint updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedComplaint(null);
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
        description: "Failed to update complaint",
        variant: "destructive",
      });
    },
  });

  const filteredComplaints = complaints.filter((complaint: any) => {
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    const matchesType = typeFilter === "all" || complaint.type === typeFilter;
    const matchesSearch = searchTerm === "" || 
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complaintNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complainantName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const handleView = (complaint: any) => {
    setSelectedComplaint(complaint);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (complaint: any) => {
    setSelectedComplaint(complaint);
    setUpdateData({
      status: complaint.status,
      notes: complaint.notes || "",
      priority: complaint.priority,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (selectedComplaint) {
      updateComplaintMutation.mutate({
        id: selectedComplaint.id,
        data: updateData,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "default";
      case "under_investigation": return "secondary";
      case "closed": return "outline";
      default: return "destructive";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      default: return "outline";
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Complaints Management</h1>
              <p className="text-gray-600 mt-2">Manage and respond to citizen complaints</p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search complaints..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status-filter">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under_investigation">Under Investigation</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type-filter">Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="cybercrime">Cybercrime</SelectItem>
                        <SelectItem value="women_safety">Women Safety</SelectItem>
                        <SelectItem value="economic_offence">Economic Offence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" onClick={() => {
                      setStatusFilter("all");
                      setTypeFilter("all");
                      setSearchTerm("");
                    }}>
                      <Filter className="mr-2 h-4 w-4" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complaints Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>All Complaints ({filteredComplaints.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {complaintsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredComplaints.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Complaint #</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Complainant</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComplaints.map((complaint: any) => (
                        <TableRow key={complaint.id}>
                          <TableCell className="font-mono text-sm">
                            {complaint.complaintNumber}
                          </TableCell>
                          <TableCell className="font-medium max-w-xs truncate">
                            {complaint.subject}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{complaint.complainantName}</div>
                              <div className="text-sm text-gray-500">{complaint.complainantEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{complaint.type.replace('_', ' ')}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(complaint.status)}>
                              {complaint.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getPriorityColor(complaint.priority)}>
                              {complaint.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(complaint.createdAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleView(complaint)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(complaint)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No complaints found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* View Complaint Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
          </DialogHeader>
          
          {selectedComplaint && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Complaint Number</Label>
                  <p className="font-mono">{selectedComplaint.complaintNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date Filed</Label>
                  <p>{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Subject</Label>
                <p className="font-medium">{selectedComplaint.subject}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Description</Label>
                <p className="whitespace-pre-wrap">{selectedComplaint.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Complainant Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Name</Label>
                      <p>{selectedComplaint.complainantName}</p>
                    </div>
                    {selectedComplaint.complainantEmail && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Email</Label>
                        <p className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {selectedComplaint.complainantEmail}
                        </p>
                      </div>
                    )}
                    {selectedComplaint.complainantPhone && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Phone</Label>
                        <p className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {selectedComplaint.complainantPhone}
                        </p>
                      </div>
                    )}
                    {selectedComplaint.complainantAddress && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Address</Label>
                        <p className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                          {selectedComplaint.complainantAddress}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Case Information</h4>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Type</Label>
                      <p>
                        <Badge variant="outline">{selectedComplaint.type.replace('_', ' ')}</Badge>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <p>
                        <Badge variant={getStatusColor(selectedComplaint.status)}>
                          {selectedComplaint.status.replace('_', ' ')}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Priority</Label>
                      <p>
                        <Badge variant={getPriorityColor(selectedComplaint.priority)}>
                          {selectedComplaint.priority}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedComplaint.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Investigation Notes</Label>
                  <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{selectedComplaint.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Complaint Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Complaint</DialogTitle>
          </DialogHeader>
          
          {selectedComplaint && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-500">Complaint Number</Label>
                <p className="font-mono">{selectedComplaint.complaintNumber}</p>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={updateData.status} onValueChange={(value) => setUpdateData({ ...updateData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_investigation">Under Investigation</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={updateData.priority} onValueChange={(value) => setUpdateData({ ...updateData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Investigation Notes</Label>
                <Textarea
                  id="notes"
                  value={updateData.notes}
                  onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                  rows={6}
                  placeholder="Add investigation notes, updates, or comments..."
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleUpdate}
                  disabled={updateComplaintMutation.isPending}
                >
                  {updateComplaintMutation.isPending ? "Updating..." : "Update Complaint"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
