import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  FileText, 
  AlertTriangle, 
  Shield, 
  Upload,
  CheckCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

const complaintSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

export default function LodgeComplaint() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [complaintNumber, setComplaintNumber] = useState("");
  const { toast } = useToast();

  const breadcrumbItems = [
    { label: "Citizen Services", href: "/" },
    { label: "Lodge Complaint" }
  ];

  const form = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      category: "",
      subject: "",
      description: "",
    },
  });

  const submitComplaintMutation = useMutation({
    mutationFn: async (data: ComplaintFormData) => {
      const response = await apiRequest("POST", "/api/public/complaints", data);
      return response.json();
    },
    onSuccess: (data) => {
      setComplaintNumber(data.complaintNumber);
      setIsSubmitted(true);
      toast({
        title: "Complaint Submitted Successfully",
        description: `Your complaint number is ${data.complaintNumber}`,
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

  const onSubmit = (data: ComplaintFormData) => {
    submitComplaintMutation.mutate(data);
  };

  const categories = [
    { value: "cyber_crime", label: "Cyber Crime" },
    { value: "economic_offence", label: "Economic Offence" },
    { value: "women_protection", label: "Women Protection" },
    { value: "child_protection", label: "Child Protection" },
    { value: "general_crime", label: "General Crime" },
    { value: "civil_rights", label: "Civil Rights Violation" },
    { value: "corruption", label: "Corruption" },
    { value: "other", label: "Other" }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-800 mb-2">
                    Complaint Submitted Successfully
                  </h2>
                  <p className="text-green-700 mb-6">
                    Your complaint has been registered and will be reviewed by our team.
                  </p>
                  
                  <div className="bg-white border border-green-200 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Your Complaint Number:</h3>
                    <div className="text-2xl font-bold text-gov-blue bg-blue-50 py-3 px-4 rounded border">
                      {complaintNumber}
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      Please save this number for future reference. You can use it to track your complaint status.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={() => window.print()} 
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      Print Receipt
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/citizen-services/check-status'}
                      className="bg-gov-blue text-white hover:bg-blue-700 flex-1 sm:flex-none"
                    >
                      Track Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <FileText className="h-12 w-12 text-gov-blue" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gov-dark">Lodge Complaint</h1>
              <p className="text-xl text-gov-gray mt-2">
                Submit your complaint to CID Telangana
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-2">Important Information</h3>
                  <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
                    <li>For emergencies, call 100 immediately</li>
                    <li>Provide accurate and complete information</li>
                    <li>You will receive a complaint number for tracking</li>
                    <li>False complaints are punishable by law</li>
                    <li>Your complaint will be reviewed within 24-48 hours</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Form */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-gov-blue" />
                    <span>Complaint Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gov-dark border-b pb-2">
                          Personal Information
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Enter your email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter your complete address" 
                                  rows={3}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Complaint Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gov-dark border-b pb-2">
                          Complaint Information
                        </h3>
                        
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complaint Category *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select complaint category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category.value} value={category.value}>
                                      {category.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject *</FormLabel>
                              <FormControl>
                                <Input placeholder="Brief subject of your complaint" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Detailed Description *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Provide detailed information about your complaint including date, time, location, and any other relevant details"
                                  rows={6}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end space-x-4 pt-6">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => form.reset()}
                        >
                          Clear Form
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={submitComplaintMutation.isPending}
                          className="bg-gov-blue text-white hover:bg-blue-700"
                        >
                          {submitComplaintMutation.isPending ? "Submitting..." : "Submit Complaint"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Contact */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Emergency Contact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-800 mb-2">100</div>
                    <p className="text-red-700 text-sm mb-3">
                      For immediate emergency assistance
                    </p>
                    <div className="text-xl font-bold text-red-800 mb-2">
                      100 → Press 8
                    </div>
                    <p className="text-red-700 text-sm">
                      For T-Safe women safety service
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>CID Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gov-blue mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-sm text-gray-600">
                          3rd Floor, DGP Office<br />
                          Lakadikapul, Hyderabad-004
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gov-blue" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-600">help.tspolice@cgg.gov.in</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle>Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-gov-blue rounded-full mt-2 flex-shrink-0"></div>
                      <p>Provide accurate and truthful information</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-gov-blue rounded-full mt-2 flex-shrink-0"></div>
                      <p>Include all relevant details and evidence</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-gov-blue rounded-full mt-2 flex-shrink-0"></div>
                      <p>Keep your complaint number safe for tracking</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-gov-blue rounded-full mt-2 flex-shrink-0"></div>
                      <p>You may be contacted for additional information</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <a href="/citizen-services/check-status" className="block text-sm text-gov-blue hover:text-blue-700 transition">
                      Check Complaint Status
                    </a>
                    <a href="/specialized-wings/cyber-crimes" className="block text-sm text-gov-blue hover:text-blue-700 transition">
                      Cyber Crime Information
                    </a>
                    <a href="/specialized-wings/women-protection" className="block text-sm text-gov-blue hover:text-blue-700 transition">
                      Women Safety Services
                    </a>
                    <a href="/public-awareness" className="block text-sm text-gov-blue hover:text-blue-700 transition">
                      Safety Guidelines
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
