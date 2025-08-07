import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  ChartLine,
  Shield,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Search,
  Clock,
  Users,
  TrendingDown,
  ExternalLink,
  Target,
  Banknote,
} from "lucide-react";

export default function EconomicOffences() {
  const keyJurisdictions = [
    "Financial frauds and misappropriation cases",
    "Counterfeit currency (FICN) investigations",
    "Banking and NBFC fraud cases",
    "Multi-level marketing scheme violations",
    "Money circulation scheme investigations",
    "Vanishing company cases",
    "Government fund diversion cases",
    "Investment and ponzi scheme frauds",
  ];

  const investigationCapabilities = [
    {
      title: "Financial Forensics",
      description: "Advanced financial analysis and forensic accounting to trace money trails and identify fraudulent transactions.",
      icon: Search,
    },
    {
      title: "Banking Coordination",
      description: "Direct coordination with banks, RBI, and financial institutions for rapid investigation and fund recovery.",
      icon: Banknote,
    },
    {
      title: "Multi-Agency Cooperation",
      description: "Seamless collaboration with ED, CBI, and other agencies for complex financial crime investigations.",
      icon: Users,
    },
    {
      title: "Digital Evidence Recovery",
      description: "Specialized techniques for recovering digital financial records and cryptocurrency transaction analysis.",
      icon: Shield,
    },
  ];

  const recentCases = [
    {
      type: "Banking Fraud",
      description: "Exposed multi-crore banking fraud involving fake loan documents and identity theft",
      status: "Resolved",
      timeline: "180 days",
      priority: "High",
      recovery: "₹15.2 Crores",
    },
    {
      type: "Cryptocurrency Scam",
      description: "Dismantled organized cryptocurrency investment scam affecting 2,500+ investors",
      status: "Ongoing",
      timeline: "120 days",
      priority: "Critical",
      recovery: "₹8.5 Crores",
    },
    {
      type: "FICN Case",
      description: "Seized fake currency worth ₹50 lakhs and arrested international smuggling network",
      status: "Resolved",
      timeline: "45 days",
      priority: "Critical",
      recovery: "₹50 Lakhs",
    },
  ];

  const specializedServices = [
    "Asset tracing and recovery operations",
    "Financial intelligence gathering",
    "Corporate fraud investigations",
    "Securities market manipulation cases",
    "Insurance fraud detection",
    "Money laundering investigations",
    "Hawala transaction tracking",
    "Digital payment fraud analysis",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <ChartLine className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Economic Offences Wing</h1>
                <p className="text-xl text-blue-100">Financial Crime Investigation & Asset Recovery</p>
              </div>
            </div>
            <p className="text-lg text-blue-100 leading-relaxed">
              The Economic Offences Wing handles major cases of financial frauds and misappropriation, 
              counterfeit currency cases, banking frauds, multi-level marketing schemes, and money 
              circulation frauds. As the FICN Nodal Agency, we also report cases under PMLA & FEMA to 
              the Enforcement Directorate.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Key Jurisdictions */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-blue-600" />
                <span>Areas of Jurisdiction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                The Economic Offences Wing specializes in complex financial crime investigations, 
                serving as the state's premier agency for economic fraud detection, investigation, 
                and asset recovery operations.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {keyJurisdictions.map((jurisdiction, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
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
              <Card key={index} className="border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <capability.icon className="h-6 w-6 text-blue-600" />
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

        {/* Recent Cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Cases & Operations</h2>
          <div className="space-y-6">
            {recentCases.map((caseItem, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {caseItem.type}
                        </h3>
                        <Badge variant={caseItem.status === "Resolved" ? "default" : "secondary"}>
                          {caseItem.status}
                        </Badge>
                        <Badge variant={
                          caseItem.priority === "Critical" ? "destructive" :
                          caseItem.priority === "High" ? "default" : "outline"
                        }>
                          {caseItem.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{caseItem.description}</p>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{caseItem.timeline}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <TrendingDown className="h-4 w-4" />
                          <span>Recovered: {caseItem.recovery}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Specialized Services */}
        <section className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-6 w-6 text-blue-600" />
                  <span>Financial Investigation Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Our investigations employ cutting-edge financial forensics techniques 
                  for comprehensive fraud detection and asset recovery.
                </p>
                <ul className="space-y-3">
                  {specializedServices.slice(0, 4).map((service, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-sm">{service}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span>Specialized Operations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Advanced investigative techniques and inter-agency coordination 
                  for complex economic crime cases.
                </p>
                <ul className="space-y-3">
                  {specializedServices.slice(4).map((service, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-sm">{service}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FICN & Reporting */}
        <section className="mb-12">
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-900">FICN Nodal Agency & PMLA Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-red-900">FICN Operations</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Fake Indian Currency Notes detection and investigation</li>
                    <li>• Cross-border smuggling network tracking</li>
                    <li>• Coordination with central agencies and international bodies</li>
                    <li>• Technology-based authentication and analysis</li>
                    <li>• Public awareness campaigns on currency security</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-red-900">Legal Compliance</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• PMLA (Prevention of Money Laundering Act) reporting</li>
                    <li>• FEMA (Foreign Exchange Management Act) compliance</li>
                    <li>• Enforcement Directorate coordination</li>
                    <li>• Financial intelligence unit reporting</li>
                    <li>• International cooperation frameworks</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Contact Economic Offences Wing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">Office Address</div>
                      <div className="text-gray-600">
                        Economic Offences Wing<br />
                        3rd Floor, DGP Office<br />
                        Lakadikapul, Hyderabad-004<br />
                        Telangana State
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">Contact Numbers</div>
                      <div className="text-gray-600">
                        Emergency: 100<br />
                        EOW Helpline: +91-40-2761-5200<br />
                        Control Room: +91-40-2761-5000
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">Email Support</div>
                      <div className="text-gray-600">
                        eow.cid@tspolice.gov.in<br />
                        help.tspolice@cgg.gov.in
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href="/citizen/complaint">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <FileText className="mr-2 h-4 w-4" />
                        Report Financial Crime
                      </Button>
                    </Link>
                    <Link href="/citizen/status">
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Check Case Status
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Prevention Guidelines */}
        <section>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Financial Crime Prevention</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800">Investment Safety</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Verify company registration and licenses before investing</li>
                    <li>• Be cautious of schemes promising unrealistic returns</li>
                    <li>• Research thoroughly before joining MLM programs</li>
                    <li>• Avoid get-rich-quick schemes and pyramid structures</li>
                    <li>• Report suspicious investment offers immediately</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800">Banking Security</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Never share banking credentials or OTPs</li>
                    <li>• Verify bank communications through official channels</li>
                    <li>• Monitor account statements regularly</li>
                    <li>• Report unauthorized transactions immediately</li>
                    <li>• Use secure networks for online banking</li>
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
