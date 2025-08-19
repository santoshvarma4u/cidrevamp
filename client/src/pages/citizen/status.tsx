import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  User,
} from "lucide-react";

export default function ComplaintStatus() {
  const { toast } = useToast();
  const [complaintNumber, setComplaintNumber] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(false);

  const { data: complaint, isLoading, error } = useQuery({
    queryKey: ["/api/complaints/number", complaintNumber],
    enabled: searchAttempted && complaintNumber.length > 0,
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintNumber.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a complaint number",
        variant: "destructive",
      });
      return;
    }
    setSearchAttempted(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "default";
      case "under_investigation": return "secondary";
      case "closed": return "outline";
      default: return "destructive";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return CheckCircle;
      case "under_investigation": return Clock;
      case "closed": return CheckCircle;
      default: return AlertCircle;
    }
  };

  const statusSteps = [
    { status: "pending", label: "Complaint Received", description: "Your complaint has been registered" },
    { status: "under_investigation", label: "Under Investigation", description: "Investigation is in progress" },
    { status: "resolved", label: "Resolved", description: "Case has been resolved" },
    { status: "closed", label: "Closed", description: "Case is closed" },
  ];

  const getCurrentStepIndex = (status: string) => {
    return statusSteps.findIndex(step => step.status === status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      {/* Header Section */}
      <section className="page-hero-gradient text-white py-12 pt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Search className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Check Complaint Status</h1>
            <p className="text-xl text-green-100">
              Track the progress of your complaint using your complaint number
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-6 w-6" />
                <span>Search Your Complaint</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <Label htmlFor="complaintNumber">Complaint Number</Label>
                  <Input
                    id="complaintNumber"
                    value={complaintNumber}
                    onChange={(e) => setComplaintNumber(e.target.value)}
                    placeholder="Enter your complaint number (e.g., CID2024123456)"
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    The complaint number was provided when you submitted your complaint
                  </p>
                </div>
                <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700">
                  <Search className="mr-2 h-5 w-5" />
                  Search Complaint
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching for your complaint...</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && searchAttempted && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 mb-2">Complaint Not Found</h3>
                <p className="text-red-800 mb-4">
                  We couldn't find a complaint with the number "{complaintNumber}". 
                  Please check the number and try again.
                </p>
                <div className="text-sm text-red-700">
                  <p className="mb-2">Common issues:</p>
                  <ul className="text-left inline-block">
                    <li>• Check for typos in the complaint number</li>
                    <li>• Ensure you're using the complete number</li>
                    <li>• Contact us if you're having trouble</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Complaint Details */}
          {complaint && (
            <div className="space-y-6">
              {/* Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <FileText className="h-6 w-6" />
                      <span>Complaint Details</span>
                    </span>
                    <Badge variant={getStatusColor(complaint.status)} className="text-lg px-3 py-1">
                      {complaint.status.replace('_', ' ')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Complaint Number</Label>
                        <p className="font-mono text-lg">{complaint.complaintNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Type</Label>
                        <p>{complaint.type.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Subject</Label>
                        <p className="font-medium">{complaint.subject}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Filed On</Label>
                        <p className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Current Status</Label>
                        <div className="flex items-center space-x-2">
                          {(() => {
                            const StatusIcon = getStatusIcon(complaint.status);
                            return <StatusIcon className="h-4 w-4 text-gray-600" />;
                          })()}
                          <span className="capitalize">{complaint.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Investigation Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statusSteps.map((step, index) => {
                      const currentStepIndex = getCurrentStepIndex(complaint.status);
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      
                      return (
                        <div key={step.status} className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? isCurrent 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            {isCompleted && !isCurrent ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-sm font-bold">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                              {step.label}
                            </h4>
                            <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                              {step.description}
                            </p>
                            {isCurrent && (
                              <Badge variant="default" className="mt-1">Current Status</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
                  {complaint.status === "pending" && (
                    <p className="text-blue-800">
                      Your complaint is being reviewed. You will be contacted if additional information is needed.
                    </p>
                  )}
                  {complaint.status === "under_investigation" && (
                    <p className="text-blue-800">
                      Investigation is in progress. Our team is working on your case and will update you on significant developments.
                    </p>
                  )}
                  {complaint.status === "resolved" && (
                    <p className="text-blue-800">
                      Your complaint has been resolved. If you have any questions about the resolution, please contact us.
                    </p>
                  )}
                  {complaint.status === "closed" && (
                    <p className="text-blue-800">
                      This case has been closed. If you need to reopen or have additional concerns, please file a new complaint.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Help Section */}
          <Card className="mt-8 bg-gray-50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Need Additional Help?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <span>Emergency: 100</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span>help.tspolice@cgg.gov.in</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Office Hours</h4>
                  <div className="text-sm text-gray-600">
                    <p>Monday - Friday: 10:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 2:00 PM</p>
                    <p>Sunday: Closed (Emergency services available)</p>
                  </div>
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
