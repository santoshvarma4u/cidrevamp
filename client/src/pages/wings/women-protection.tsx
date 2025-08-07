import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Heart,
  Shield,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Users,
  Baby,
  Eye,
  Smartphone,
  ExternalLink,
  Clock,
} from "lucide-react";

export default function WomenProtection() {
  const keyServices = [
    "Women Protection Cell (498A IPC, Dowry cases, rape cases)",
    "Children Wing (abandoned and missing children)",
    "SHE Teams operations and monitoring",
    "Anti Human Trafficking Unit investigations",
    "NRI Women Safety Cell services",
    "Missing Persons Monitoring Cell",
    "SHE Bharosa Cyber Lab support",
    "T-Safe app services and emergency response",
  ];

  const specializedUnits = [
    {
      title: "SHE Teams",
      description: "SHE teams move in hotspots in mufti dress and nab accused who harass women or children, based on collected photographic or videographic evidence.",
      icon: Eye,
      established: "2014",
    },
    {
      title: "SHE Bharosa Cyber Lab",
      description: "Specialized cyber lab for investigating crimes against women and children in digital spaces, providing technical support for evidence collection.",
      icon: Shield,
      established: "2018",
    },
    {
      title: "Anti Human Trafficking Unit",
      description: "Dedicated unit for combating human trafficking, rescue operations, and rehabilitation of victims with inter-state coordination.",
      icon: Users,
      established: "2016",
    },
    {
      title: "NRI Women Safety Cell",
      description: "Formed on 17th July 2019 to deal with cases of NRI spouses/relatives crimes, providing specialized support for international cases.",
      icon: Heart,
      established: "2019",
    },
  ];

  const achievements = [
    {
      operation: "Operation Muskaan",
      period: "01-07-2015 to 31-07-2015",
      rescued: "2,729 children (2254 boys and 475 girls)",
      restored: "1,108 children (868 boys and 240 girls)",
      description: "Major rescue operation for missing and trafficked children across Telangana State",
    },
  ];

  const safetyApps = [
    {
      name: "T-Safe App",
      description: "Emergency response app for women safety with ride monitoring and panic button features",
      features: ["Ride monitoring", "Emergency alerts", "Location sharing", "24/7 support"],
    },
    {
      name: "Dial 100 + 8",
      description: "Press 8 after dialing 100 to activate T-Safe service for immediate assistance",
      features: ["Quick activation", "GPS tracking", "Real-time monitoring", "Emergency response"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Header Section */}
      <section className="bg-gradient-to-r from-pink-600 to-pink-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Heart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Women & Child Protection Wing</h1>
                <p className="text-xl text-pink-100">Comprehensive Safety & Protection Services</p>
              </div>
            </div>
            <p className="text-lg text-pink-100 leading-relaxed">
              The Women Safety Wing was established on 8th March 2018, carved out from the Women Protection Cell, CID. 
              Our wing is designed to handle investigation into crimes against women and children, including prevention of trafficking, 
              sexual offences, domestic violence, juvenile delinquency, NRI issues & cyber crimes.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Key Services */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-pink-600" />
                <span>Core Services & Functions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Our wing provides comprehensive protection services for women and children, combining traditional 
                investigation methods with modern technology and specialized units for effective crime prevention and response.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {keyServices.map((service, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Specialized Units */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Specialized Units</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {specializedUnits.map((unit, index) => (
              <Card key={index} className="border-l-4 border-l-pink-600 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-pink-100 p-3 rounded-lg">
                      <unit.icon className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {unit.title}
                        </h3>
                        <Badge variant="outline">Est. {unit.established}</Badge>
                      </div>
                      <p className="text-gray-600">{unit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Major Achievements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Major Operations & Achievements</h2>
          {achievements.map((achievement, index) => (
            <Card key={index} className="mb-6 border-l-4 border-l-green-600">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement.operation}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                      <Clock className="h-4 w-4" />
                      <span>{achievement.period}</span>
                    </div>
                    <p className="text-gray-600">{achievement.description}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Children Rescued</h4>
                    <p className="text-2xl font-bold text-green-600">{achievement.rescued}</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Children Restored</h4>
                    <p className="text-2xl font-bold text-blue-600">{achievement.restored}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Technology & Apps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Solutions</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {safetyApps.map((app, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="h-6 w-6 text-pink-600" />
                    <span>{app.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{app.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Key Features:</h4>
                    <ul className="space-y-1">
                      {app.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Analysis Module */}
        <section className="mb-12">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Analysis Module</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 mb-4">
                The Analysis Wing of Women Safety Wing technically supports the different modules set up by the wing. 
                It analyses the data of women & child-related cases to prevent and reduce crimes against women & children.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Data Analysis</h4>
                  <p className="text-sm text-blue-700">Crime pattern analysis and trend identification</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Prevention Strategies</h4>
                  <p className="text-sm text-blue-700">Evidence-based crime prevention recommendations</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Technical Support</h4>
                  <p className="text-sm text-blue-700">Technology integration and system maintenance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <Card className="bg-pink-50 border-pink-200">
            <CardHeader>
              <CardTitle className="text-pink-900">Contact Women & Child Protection Wing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-pink-600" />
                    <div>
                      <div className="font-semibold">Office Address</div>
                      <div className="text-gray-600">
                        Women Safety Wing<br />
                        3rd Floor, DGP Office<br />
                        Lakadikapul, Hyderabad-004<br />
                        Telangana State
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-pink-600" />
                    <div>
                      <div className="font-semibold">Emergency Services</div>
                      <div className="text-gray-600">
                        Emergency: 100 (Press 8 for T-Safe)<br />
                        Women Helpline: 181<br />
                        Child Helpline: 1098
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-pink-600" />
                    <div>
                      <div className="font-semibold">Email Support</div>
                      <div className="text-gray-600">
                        womensafety.cid@tspolice.gov.in<br />
                        help.tspolice@cgg.gov.in
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href="/citizen/complaint">
                      <Button className="w-full bg-pink-600 hover:bg-pink-700">
                        <FileText className="mr-2 h-4 w-4" />
                        Lodge Complaint
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://womensafetywing.telangana.gov.in" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Women Safety Wing Portal
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Safety Guidelines */}
        <section>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Safety Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800">Women Safety Tips</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Download and use T-Safe app for travel safety</li>
                    <li>• Share travel details with trusted contacts</li>
                    <li>• Use well-lit and populated routes</li>
                    <li>• Trust your instincts and report suspicious behavior</li>
                    <li>• Keep emergency numbers readily accessible</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800">Child Protection</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Teach children about personal safety</li>
                    <li>• Monitor online activities and social media</li>
                    <li>• Report missing children immediately</li>
                    <li>• Be aware of trafficking signs and report</li>
                    <li>• Educate about good touch and bad touch</li>
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
