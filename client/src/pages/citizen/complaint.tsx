import ProtectedEmail from "@/components/common/ProtectedEmail";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle,
  Shield,
  Clock,
} from "lucide-react";

interface ComplaintFormData {
  type: string;
  subject: string;
  description: string;
  complainantName: string;
  complainantEmail: string;
  complainantPhone: string;
  complainantAddress: string;
}

export default function ComplaintForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ComplaintFormData>({
    type: "",
    subject: "",
    description: "",
    complainantName: "",
    complainantEmail: "",
    complainantPhone: "",
    complainantAddress: "",
  });
  const [submittedComplaint, setSubmittedComplaint] = useState<any>(null);

  const createComplaintMutation = useMutation({
    mutationFn: async (data: ComplaintFormData) => {
      return apiRequest("/api/complaints", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      setSubmittedComplaint(data);
      toast({
        title: "Complaint Submitted Successfully",
        description: `Your complaint number is ${data.complaintNumber}`,
      });
      // Reset form
      setFormData({
        type: "",
        subject: "",
        description: "",
        complainantName: "",
        complainantEmail: "",
        complainantPhone: "",
        complainantAddress: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit complaint. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.subject || !formData.description || !formData.complainantName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createComplaintMutation.mutate(formData);
  };

  const complaintTypes = [
    { value: "general", label: "General Complaint" },
    { value: "cybercrime", label: "Cyber Crime" },
    { value: "women_safety", label: "Women Safety" },
    { value: "economic_offence", label: "Economic Offence" },
  ];

  if (submittedComplaint) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ModernHeader />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-900 mb-4">
                  Complaint Submitted Successfully
                </h2>
                <div className="bg-white rounded-lg p-6 mb-6">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Complaint Number</Label>
                      <p className="text-xl font-mono font-bold text-gray-900">
                        {submittedComplaint.complaintNumber}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <p>
                        <Badge variant="secondary">Pending</Badge>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Submitted On</Label>
                      <p>{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="text-left bg-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your complaint has been registered and assigned a unique number</li>
                    <li>• You will receive updates via email/SMS if provided</li>
                    <li>• Investigation will begin based on the type and priority</li>
                    <li>• You can track status using your complaint number</li>
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => setSubmittedComplaint(null)}
                    className="flex-1"
                  >
                    Submit Another Complaint
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.location.href = '/citizen/status'}
                  >
                    Track This Complaint
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      {/* Header Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Lodge a Complaint</h1>
            <p className="text-xl text-blue-100">
              File your complaint online with CID Telangana. We are committed to addressing your concerns promptly and fairly.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Important Information */}
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="h-6 w-6 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Important Information</h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Provide accurate and complete information for faster processing</li>
                    <li>• False complaints are punishable under law</li>
                    <li>• Keep your complaint number safe for future reference</li>
                    <li>• For emergencies, call 100 immediately</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complaint Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-6 w-6" />
                <span>Complaint Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                <div>
                  <Label htmlFor="type">Complaint Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select complaint type" />
                    </SelectTrigger>
                    <SelectContent>
                      {complaintTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description of your complaint"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide detailed information about your complaint including date, time, location, and any other relevant details"
                    rows={6}
                    required
                  />
                </div>

                {/* Complainant Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Your Information</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.complainantName}
                        onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.complainantPhone}
                        onChange={(e) => setFormData({ ...formData, complainantPhone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.complainantEmail}
                        onChange={(e) => setFormData({ ...formData, complainantEmail: e.target.value })}
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.complainantAddress}
                        onChange={(e) => setFormData({ ...formData, complainantAddress: e.target.value })}
                        placeholder="Enter your address"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy Notice */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <h4 className="font-semibold mb-1">Privacy & Security</h4>
                        <p>
                          Your personal information will be kept confidential and used only for 
                          investigation purposes. We are committed to protecting your privacy 
                          according to applicable laws.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="text-sm text-gray-600">
                    Fields marked with * are required
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={createComplaintMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createComplaintMutation.isPending ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Submit Complaint
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-8 bg-gray-50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Need Help?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span>Emergency: 100</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <ProtectedEmail 
                    email="help.tspolice@cgg.gov.in" 
                    method="obfuscated"
                    showIcon={false}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span>CID Office, Hyderabad</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
