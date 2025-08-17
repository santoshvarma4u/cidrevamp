import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import {
  Gavel,
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
  Scale,
  ExternalLink,
  Target,
} from "lucide-react";

export default function GeneralOffences() {
  const keyJurisdictions = [
    "Murder and homicide investigations",
    "Serious assault and grievous hurt cases",
    "Robbery and dacoity investigations",
    "Kidnapping and abduction cases",
    "Inter-district criminal matters",
    "Complex conspiracy cases",
    "Organized crime investigations",
    "High-profile criminal cases",
  ];

  const investigationCapabilities = [
    {
      title: "Crime Scene Investigation",
      description: "Advanced forensic techniques for evidence collection and analysis at crime scenes using state-of-the-art equipment.",
      icon: Search,
    },
    {
      title: "Inter-State Coordination",
      description: "Seamless coordination with police forces across states for cross-border criminal investigations and operations.",
      icon: Users,
    },
    {
      title: "Witness Protection",
      description: "Comprehensive witness protection programs ensuring safety and security of key witnesses in serious cases.",
      icon: Shield,
    },
    {
      title: "Legal Coordination",
      description: "Close coordination with legal authorities, prosecution, and courts for effective case management and trials.",
      icon: Scale,
    },
  ];

  const recentCases = [
    {
      type: "Murder Investigation",
      description: "Solved complex murder case involving multiple suspects across three districts",
      status: "Solved",
      timeline: "45 days",
      priority: "High",
    },
    {
      type: "Inter-District Robbery",
      description: "Dismantled organized gang involved in highway robberies spanning multiple states",
      status: "Ongoing",
      timeline: "90 days",
      priority: "High",
    },
    {
      type: "Kidnapping Case",
      description: "Successful rescue operation and arrest of kidnappers in cross-border case",
      status: "Solved",
      timeline: "15 days",
      priority: "Critical",
    },
  ];

  const forensicServices = [
    "Ballistics and weapons analysis",
    "DNA profiling and genetic evidence",
    "Digital evidence recovery",
    "Fingerprint analysis and matching",
    "Toxicology and chemical analysis",
    "Document examination and handwriting analysis",
    "Voice recognition and audio analysis",
    "CCTV footage analysis and enhancement",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      {/* Header Section */}
      <section className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Gavel className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">General Offences Wing</h1>
                <p className="text-xl text-gray-100">Serious Crime Investigation & Law Enforcement</p>
              </div>
            </div>
            <p className="text-lg text-gray-100 leading-relaxed">
              The General Offences Wing handles serious criminal investigations including murder, robbery, 
              and complex inter-district matters. Our experienced team of investigators uses advanced 
              forensic techniques and modern investigative methods to solve the most challenging cases.
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
                <Target className="h-6 w-6 text-gray-600" />
                <span>Areas of Jurisdiction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                The General Offences Wing investigates serious crimes and complex criminal matters that require 
                specialized expertise and resources. Our jurisdiction covers the entire state with focus on 
                high-impact cases and inter-district criminal activities.
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
              <Card key={index} className="border-l-4 border-l-gray-600 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <capability.icon className="h-6 w-6 text-gray-600" />
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
                        <Badge variant={caseItem.status === "Solved" ? "default" : "secondary"}>
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
                    </div>
                    <div className="text-right ml-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{caseItem.timeline}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Forensic Services */}
        <section className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-6 w-6 text-gray-600" />
                  <span>Forensic Support Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Our investigations are supported by comprehensive forensic analysis capabilities, 
                  ensuring scientific and evidence-based approach to crime solving.
                </p>
                <ul className="space-y-3">
                  {forensicServices.slice(0, 4).map((service, index) => (
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
                  <Shield className="h-6 w-6 text-gray-600" />
                  <span>Advanced Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cutting-edge technology and scientific methods for complex evidence analysis 
                  and crime reconstruction.
                </p>
                <ul className="space-y-3">
                  {forensicServices.slice(4).map((service, index) => (
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

        {/* Investigation Process */}
        <section className="mb-12">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Investigation Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">Case Registration</h4>
                  <p className="text-sm text-blue-700">Initial complaint and case documentation</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">Evidence Collection</h4>
                  <p className="text-sm text-blue-700">Scientific evidence gathering and preservation</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">Investigation</h4>
                  <p className="text-sm text-blue-700">Comprehensive investigation and analysis</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">Case Closure</h4>
                  <p className="text-sm text-blue-700">Prosecution and legal proceedings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Contact General Offences Wing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold">Office Address</div>
                      <div className="text-gray-600">
                        General Offences Wing<br />
                        3rd Floor, DGP Office<br />
                        Lakadikapul, Hyderabad-004<br />
                        Telangana State
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold">Contact Numbers</div>
                      <div className="text-gray-600">
                        Emergency: 100<br />
                        Direct Line: +91-40-2761-5100<br />
                        Control Room: +91-40-2761-5000
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-semibold">Email Support</div>
                      <div className="text-gray-600">
                        generaloffences.cid@tspolice.gov.in<br />
                        help.tspolice@cgg.gov.in
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href="/citizen/complaint">
                      <Button className="w-full bg-gray-700 hover:bg-gray-800">
                        <FileText className="mr-2 h-4 w-4" />
                        Report Crime
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

        {/* Crime Prevention Tips */}
        <section>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Crime Prevention Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800">Personal Safety</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Be aware of your surroundings at all times</li>
                    <li>• Avoid displaying expensive items in public</li>
                    <li>• Travel in groups when possible, especially at night</li>
                    <li>• Keep emergency contacts readily accessible</li>
                    <li>• Report suspicious activities immediately</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800">Property Security</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Install proper security systems at home/business</li>
                    <li>• Keep valuable documents in secure locations</li>
                    <li>• Maintain good lighting around your property</li>
                    <li>• Verify identity before opening doors to strangers</li>
                    <li>• Regular security audits and updates</li>
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
