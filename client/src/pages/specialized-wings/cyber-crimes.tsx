import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Monitor, 
  AlertTriangle, 
  FileText, 
  Users, 
  Phone,
  Mail,
  Building,
  Smartphone,
  Wifi,
  Lock,
  Globe,
  Eye,
  BookOpen
} from "lucide-react";

export default function CyberCrimes() {
  const breadcrumbItems = [
    { label: "Specialized Wings", href: "/" },
    { label: "Cyber Crimes Wing" }
  ];

  const services = [
    {
      title: "Cyber Crime Registration",
      description: "Register cyber crime cases under Information Technology Act",
      icon: FileText
    },
    {
      title: "Digital Forensics",
      description: "Advanced digital evidence analysis and recovery",
      icon: Monitor
    },
    {
      title: "Public Awareness",
      description: "Educational programs on cyber security best practices",
      icon: Users
    },
    {
      title: "Training Programs",
      description: "Capacity building for investigation officers",
      icon: BookOpen
    }
  ];

  const cyberThreats = [
    {
      type: "Online Fraud",
      cases: "1,247",
      trend: "increasing",
      description: "UPI frauds, fake job offers, lottery scams"
    },
    {
      type: "Social Media Crimes",
      cases: "892",
      trend: "stable",
      description: "Cyberbullying, harassment, fake profiles"
    },
    {
      type: "Financial Crimes",
      cases: "634",
      trend: "decreasing",
      description: "Banking frauds, credit card scams, investment frauds"
    },
    {
      type: "Ransomware Attacks",
      cases: "23",
      trend: "increasing",
      description: "Business email compromise, data encryption attacks"
    }
  ];

  const safetyTips = [
    "Never share OTP, passwords, or banking credentials with anyone",
    "Verify caller identity before sharing personal information",
    "Use strong passwords and enable two-factor authentication",
    "Keep software and antivirus updated regularly",
    "Be cautious of suspicious links and email attachments",
    "Report suspicious activities immediately to cyber police"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-4 rounded-lg">
              <Shield className="h-12 w-12 text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gov-dark">Cyber Crimes Wing</h1>
              <p className="text-xl text-gov-gray mt-2">
                Specialized unit for cybercrime investigation and digital forensics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Monitor className="h-6 w-6 text-purple-600" />
                    <span>Wing Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gov-gray leading-relaxed mb-6">
                    The Cyber Crimes Wing is headed by SP (Cyber Crimes) under the supervision of DIG and 
                    Addl. DGP, CID, TS. It is deemed to be a Police Station for the entire State of Telangana 
                    and deals with offences related to cyber-crimes, video piracy, under Information Technology Act.
                  </p>
                  
                  <div className="bg-purple-50 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold text-gov-dark mb-3">State-wide Jurisdiction</h4>
                    <p className="text-sm text-gov-gray">
                      This wing has jurisdiction across the entire state of Telangana and can investigate 
                      cyber crimes reported from any district. It works in coordination with local police 
                      stations and specialized cyber units.
                    </p>
                  </div>

                  {/* Services Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.map((service, index) => {
                      const IconComponent = service.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                          <div className="bg-purple-100 p-2 rounded">
                            <IconComponent className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-gov-dark">{service.title}</h5>
                            <p className="text-sm text-gov-gray mt-1">{service.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Key Functions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-6 w-6 text-purple-600" />
                    <span>Functions & Responsibilities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-400 pl-4">
                      <h4 className="font-semibold text-gov-dark mb-2">Case Registration</h4>
                      <p className="text-sm text-gov-gray">
                        Registration of Cyber Crime cases whenever a cognizable cyber-crime is reported under 
                        Information Technology Act with due permission from Addl. Director General of Police, CID.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-400 pl-4">
                      <h4 className="font-semibold text-gov-dark mb-2">Public Awareness</h4>
                      <p className="text-sm text-gov-gray">
                        Spreading awareness to the common public about cyber-crime, latest trends etc., 
                        through websites, seminars and through media.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-400 pl-4">
                      <h4 className="font-semibold text-gov-dark mb-2">Training & Capacity Building</h4>
                      <p className="text-sm text-gov-gray">
                        Conducting training programmes in collaboration with police training institutions 
                        or otherwise to enable more IOs in the state to investigate into cyber-crimes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cyber Threat Landscape */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-6 w-6 text-purple-600" />
                    <span>Cyber Threat Landscape 2024</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cyberThreats.map((threat, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gov-dark">{threat.type}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-purple-600">{threat.cases}</span>
                            <Badge variant={
                              threat.trend === "increasing" ? "destructive" : 
                              threat.trend === "decreasing" ? "default" : 
                              "secondary"
                            }>
                              {threat.trend}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gov-gray">{threat.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Safety Guidelines */}
              <Card className="border-l-4 border-green-400 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <Lock className="h-6 w-6" />
                    <span>Cyber Safety Guidelines</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {safetyTips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-green-800">{tip}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-green-200">
                    <Button className="bg-green-600 text-white hover:bg-green-700">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Report Cyber Crime
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Contact */}
              <Card className="border-l-4 border-red-400 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-800">
                    <Phone className="h-5 w-5" />
                    <span>Emergency Cyber Helpline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-800 mb-2">1930</div>
                    <p className="text-sm text-red-700 mb-4">National Cyber Crime Helpline</p>
                    <div className="text-xl font-bold text-red-800 mb-2">100</div>
                    <p className="text-sm text-red-700">Telangana Police Emergency</p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-purple-600" />
                    <span>Contact Cyber Wing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Building className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">Cyber Crimes Police Station</p>
                        <p className="text-xs text-gov-gray">CID Office, Lakadikapul</p>
                        <p className="text-xs text-gov-gray">Hyderabad-004</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-xs text-gov-gray">cybercrime.cid@tspolice.gov.in</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">Online Portal</p>
                        <p className="text-xs text-gov-gray">cybercrime.gov.in</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                      <FileText className="mr-2 h-4 w-4" />
                      File Cyber Complaint
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      Check Complaint Status
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Cyber Safety Guide
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Wifi className="mr-2 h-4 w-4" />
                      Report Suspicious Website
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>2024 Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">2,796</div>
                      <div className="text-sm text-gov-gray">Total Cases</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">1,934</div>
                      <div className="text-sm text-gov-gray">Cases Resolved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gov-blue">₹12.5 Cr</div>
                      <div className="text-sm text-gov-gray">Amount Saved</div>
                    </div>
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
