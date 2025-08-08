import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Shield,
  Monitor,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Search,
  Clock,
  Users,
  Globe,
  ExternalLink,
  Target,
  Smartphone,
} from "lucide-react";

export default function CyberCrimes() {
  const keyJurisdictions = [
    "Cyber crime case registration under IT Act",
    "Information Technology Act violations",
    "Video piracy and copyright infringement",
    "Online fraud and phishing investigations",
    "Social media crimes and harassment",
    "Digital evidence collection and analysis",
    "Cyber security incident response",
    "Public awareness and training programs",
  ];

  const investigationCapabilities = [
    {
      title: "Digital Forensics",
      description: "Advanced digital evidence recovery, analysis of electronic devices, and data reconstruction using state-of-the-art forensic tools.",
      icon: Search,
    },
    {
      title: "Cyber Intelligence",
      description: "Proactive monitoring of cyber threats, dark web investigations, and intelligence gathering for prevention of cyber crimes.",
      icon: Globe,
    },
    {
      title: "Training & Capacity Building",
      description: "Comprehensive training programs for police personnel and public awareness initiatives on cyber security best practices.",
      icon: Users,
    },
    {
      title: "Rapid Response Team",
      description: "24/7 cyber incident response capability for immediate action on critical cyber security threats and attacks.",
      icon: Shield,
    },
  ];

  const recentOperations = [
    {
      type: "Online Fraud Network",
      description: "Dismantled organized online fraud network targeting senior citizens through fake investment schemes",
      status: "Resolved",
      timeline: "90 days",
      priority: "High",
      arrests: "12 arrests",
    },
    {
      type: "Ransomware Attack",
      description: "Investigated and mitigated ransomware attack on government infrastructure with international cooperation",
      status: "Ongoing",
      timeline: "60 days",
      priority: "Critical",
      arrests: "Under investigation",
    },
    {
      type: "Video Piracy Ring",
      description: "Cracked down on major video piracy operation distributing copyrighted content illegally",
      status: "Resolved",
      timeline: "45 days",
      priority: "Medium",
      arrests: "8 arrests",
    },
  ];

  const cyberSecurityServices = [
    "Malware analysis and reverse engineering",
    "Network forensics and traffic analysis",
    "Mobile device forensics (Android/iOS)",
    "Cloud storage investigation",
    "Cryptocurrency transaction tracing",
    "Social engineering investigation",
    "Cyber bullying and harassment cases",
    "Identity theft and impersonation",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Header Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Cyber Crimes Wing</h1>
                <p className="text-xl text-purple-100">Digital Investigation & Cyber Security</p>
              </div>
            </div>
            <p className="text-lg text-purple-100 leading-relaxed">
              The Cyber Crimes Wing is headed by SP (Cyber Crimes) under the supervision of DIG and Addl. DGP, CID, TS. 
              It serves as a Police Station for the entire State of Telangana and deals with offences related to 
              cyber-crimes, video piracy, and violations under the Information Technology Act.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Key Functions */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-purple-600" />
                <span>Core Functions & Jurisdiction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                The Cyber Crimes Wing operates with state-wide jurisdiction, handling cyber crime registration, 
                investigation, and public awareness. We work in collaboration with police training institutions 
                to enhance cyber investigation capabilities across the state.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {keyJurisdictions.map((jurisdiction, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{jurisdiction}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Investigation Capabilities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Investigation Capabilities</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {investigationCapabilities.map((capability, index) => (
              <Card key={index} className="border-l-4 border-l-purple-600 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <capability.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {capability.title}
                      </h3>
                      <p className="text-gray-600">{capability.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Operations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Operations & Cases</h2>
          <div className="space-y-6">
            {recentOperations.map((operation, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {operation.type}
                        </h3>
                        <Badge variant={operation.status === "Resolved" ? "default" : "secondary"}>
                          {operation.status}
                        </Badge>
                        <Badge variant={
                          operation.priority === "Critical" ? "destructive" :
                          operation.priority === "High" ? "default" : "outline"
                        }>
                          {operation.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{operation.description}</p>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{operation.timeline}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-blue-600">
                          <Users className="h-4 w-4" />
                          <span>{operation.arrests}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Cyber Security Services */}
        <section className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-6 w-6 text-purple-600" />
                  <span>Digital Forensics Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Advanced digital investigation techniques for comprehensive cyber crime 
                  evidence collection and analysis.
                </p>
                <ul className="space-y-3">
                  {cyberSecurityServices.slice(0, 4).map((service, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-sm">{service}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-purple-600" />
                  <span>Specialized Investigations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cutting-edge investigative techniques for modern cyber threats 
                  and digital crime scenarios.
                </p>
                <ul className="space-y-3">
                  {cyberSecurityServices.slice(4).map((service, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span className="text-sm">{service}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Public Awareness */}
        <section className="mb-12">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Public Awareness & Training</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 mb-4">
                The Cyber Crimes Wing conducts extensive public awareness programs to educate citizens 
                about cyber threats and prevention measures. We also conduct training programmes for 
                police personnel to enhance cyber investigation capabilities.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Public Seminars</h4>
                  <p className="text-sm text-blue-700">Regular awareness sessions on cyber security for citizens</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Police Training</h4>
                  <p className="text-sm text-blue-700">Capacity building programs for investigating officers</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Digital Outreach</h4>
                  <p className="text-sm text-blue-700">Online campaigns and social media awareness drives</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900">Contact Cyber Crimes Wing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-semibold">Office Address</div>
                      <div className="text-gray-600">
                        Cyber Crimes Wing<br />
                        3rd Floor, DGP Office<br />
                        Lakadikapul, Hyderabad-004<br />
                        Telangana State
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-semibold">Contact Numbers</div>
                      <div className="text-gray-600">
                        Emergency: 100<br />
                        Cyber Helpline: +91-40-2761-5300<br />
                        National Cyber Crime: 1930
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-semibold">Email Support</div>
                      <div className="text-gray-600">
                        cybercrime.cid@tspolice.gov.in<br />
                        help.tspolice@cgg.gov.in
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href="/citizen/complaint">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <FileText className="mr-2 h-4 w-4" />
                        Report Cyber Crime
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        National Cyber Crime Portal
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cyber Security Guidelines */}
        <section>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Cyber Security Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800">Online Safety</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Use strong, unique passwords for all accounts</li>
                    <li>• Enable two-factor authentication wherever possible</li>
                    <li>• Be cautious of phishing emails and suspicious links</li>
                    <li>• Keep software and operating systems updated</li>
                    <li>• Verify the authenticity of online transactions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800">Social Media Security</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Review and adjust privacy settings regularly</li>
                    <li>• Think before sharing personal information</li>
                    <li>• Report and block suspicious accounts</li>
                    <li>• Avoid clicking on unknown links or downloads</li>
                    <li>• Be wary of fake profiles and catfishing attempts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      <Footer />
    </div>
  );
}
