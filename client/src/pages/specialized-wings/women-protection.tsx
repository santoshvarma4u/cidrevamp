import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Shield, 
  AlertTriangle, 
  FileText, 
  Users, 
  Phone,
  Mail,
  Building,
  Smartphone,
  UserCheck,
  Baby,
  Globe,
  MapPin,
  Clock
} from "lucide-react";

export default function WomenProtection() {
  const breadcrumbItems = [
    { label: "Specialized Wings", href: "/" },
    { label: "Women & Child Protection Wing" }
  ];

  const wingComponents = [
    {
      name: "Women Protection Cell",
      description: "Handles cases related to 498A IPC, Dowry Prohibition Act, and rape cases",
      icon: Heart,
      color: "pink"
    },
    {
      name: "Children Wing", 
      description: "Focus on abandoned and missing children, investigation guidelines",
      icon: Baby,
      color: "blue"
    },
    {
      name: "SHE Teams",
      description: "Safety and security teams for women and children in public places",
      icon: UserCheck,
      color: "green"
    },
    {
      name: "Anti Human Trafficking Unit",
      description: "Prevention and investigation of human trafficking cases",
      icon: Shield,
      color: "purple"
    },
    {
      name: "NRI Women Safety Cell",
      description: "Dedicated cell for NRI spouses/relatives crimes (Est. July 17, 2019)",
      icon: Globe,
      color: "orange"
    },
    {
      name: "Missing Persons Monitoring Cell",
      description: "Monitoring and tracking of missing persons cases",
      icon: MapPin,
      color: "red"
    }
  ];

  const initiatives = [
    {
      name: "SHE Bharosa Cyber Lab",
      description: "Advanced cyber forensics facility for women-related cyber crimes",
      status: "Active"
    },
    {
      name: "T-Safe App",
      description: "Emergency response app - Dial 100 and press 8 to activate",
      status: "Operational"
    },
    {
      name: "Operation Muskaan",
      description: "Child rescue operation - 2,729 children rescued in July 2015",
      status: "Ongoing"
    },
    {
      name: "Analysis Wing",
      description: "Data analysis to prevent and reduce crimes against women & children",
      status: "Active"
    }
  ];

  const helplines = [
    { name: "Women Helpline", number: "181", description: "24x7 helpline for women in distress" },
    { name: "Child Helpline", number: "1098", description: "Emergency helpline for children" },
    { name: "Police Emergency", number: "100", description: "General police emergency" },
    { name: "T-Safe Service", number: "100 → 8", description: "Women safety service activation" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      {/* Page Header */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <div className="flex items-center space-x-4">
            <div className="bg-pink-100 p-4 rounded-lg">
              <Heart className="h-12 w-12 text-pink-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gov-dark">Women & Child Protection Wing</h1>
              <p className="text-xl text-gov-gray mt-2">
                Comprehensive protection services for women and children safety
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
                    <Shield className="h-6 w-6 text-pink-600" />
                    <span>Wing Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gov-gray leading-relaxed mb-6">
                    The Women Safety Wing (WSW) was carved out from the Women Protection Cell, CID on March 8, 2018. 
                    The Wing has been designed to handle the investigation into crimes against women that specifically 
                    include prevention of trafficking, sexual offences, domestic violence, juvenile delinquency, 
                    NRI issues & cyber crimes.
                  </p>
                  
                  <div className="bg-pink-50 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold text-gov-dark mb-3">Established: March 8, 2018</h4>
                    <p className="text-sm text-gov-gray">
                      Created on International Women's Day to provide dedicated services for women and child protection 
                      across Telangana State with specialized units and advanced technology integration.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Wing Components */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-pink-600" />
                    <span>Specialized Units</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {wingComponents.map((component, index) => {
                      const IconComponent = component.icon;
                      const colorClasses = {
                        pink: "bg-pink-100 text-pink-600",
                        blue: "bg-blue-100 text-blue-600", 
                        green: "bg-green-100 text-green-600",
                        purple: "bg-purple-100 text-purple-600",
                        orange: "bg-orange-100 text-orange-600",
                        red: "bg-red-100 text-red-600"
                      };
                      
                      return (
                        <div key={index} className="p-4 border rounded-lg hover:shadow-md transition">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded ${colorClasses[component.color as keyof typeof colorClasses]}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-gov-dark mb-1">{component.name}</h5>
                              <p className="text-sm text-gov-gray">{component.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Key Initiatives */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="h-6 w-6 text-pink-600" />
                    <span>Technology & Initiatives</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {initiatives.map((initiative, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gov-dark">{initiative.name}</h4>
                          <Badge variant="default">{initiative.status}</Badge>
                        </div>
                        <p className="text-sm text-gov-gray">{initiative.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SHE Teams Special Focus */}
              <Card className="border-l-4 border-green-400 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <UserCheck className="h-6 w-6" />
                    <span>SHE Teams Operations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-green-800 space-y-4">
                    <p className="text-sm">
                      SHE teams were formed with the vision of providing safety and security to women and children. 
                      They move in hotspots in mufti dress and nab the accused who harass women or children, 
                      based on collected photographic or videographic evidence.
                    </p>
                    
                    <div className="bg-white p-4 rounded border border-green-200">
                      <h5 className="font-semibold mb-2">Key Features:</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Plain clothes surveillance in public areas</li>
                        <li>• Evidence-based action with photo/video proof</li>
                        <li>• Mobile patrol units in identified hotspots</li>
                        <li>• Immediate response to harassment complaints</li>
                        <li>• Coordination with local police stations</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operation Muskaan */}
              <Card className="border-l-4 border-blue-400 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-800">
                    <Baby className="h-6 w-6" />
                    <span>Operation Muskaan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-blue-800">
                    <p className="text-sm mb-4">
                      A dedicated campaign conducted from July 1-31, 2015 in Telangana State for child rescue and rehabilitation.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded border border-blue-200 text-center">
                        <div className="text-2xl font-bold text-blue-600">2,729</div>
                        <div className="text-sm">Children Rescued</div>
                        <div className="text-xs text-blue-600 mt-1">(2,254 boys, 475 girls)</div>
                      </div>
                      
                      <div className="bg-white p-4 rounded border border-blue-200 text-center">
                        <div className="text-2xl font-bold text-green-600">1,108</div>
                        <div className="text-sm">Children Restored</div>
                        <div className="text-xs text-green-600 mt-1">(868 boys, 240 girls)</div>
                      </div>
                      
                      <div className="bg-white p-4 rounded border border-blue-200 text-center">
                        <div className="text-2xl font-bold text-orange-600">31</div>
                        <div className="text-sm">Operation Days</div>
                        <div className="text-xs text-orange-600 mt-1">July 2015</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Helplines */}
              <Card className="border-l-4 border-red-400 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-800">
                    <Phone className="h-5 w-5" />
                    <span>Emergency Helplines</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {helplines.map((helpline, index) => (
                      <div key={index} className="bg-white p-3 rounded border border-red-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-red-800">{helpline.number}</div>
                            <div className="text-sm font-medium text-red-700">{helpline.name}</div>
                          </div>
                          <Phone className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="text-xs text-red-600 mt-1">{helpline.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* T-Safe App */}
              <Card className="border-l-4 border-blue-400 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-800">
                    <Smartphone className="h-5 w-5" />
                    <span>T-Safe App</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-blue-800">
                    <p className="text-sm mb-4">
                      A woman, out of abundant precaution, dials up 100 and presses number 8 to activate T-Safe service.
                    </p>
                    
                    <div className="bg-white p-3 rounded border border-blue-200 mb-4">
                      <h5 className="font-semibold mb-2">How to Use:</h5>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Dial 100 (Emergency Number)</li>
                        <li>Press 8 when connected</li>
                        <li>T-Safe service activates automatically</li>
                        <li>Location tracking begins</li>
                        <li>Emergency response dispatched</li>
                      </ol>
                    </div>
                    
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                      Download T-Safe App
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-pink-600" />
                    <span>Contact WSW</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Building className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">Women Safety Wing</p>
                        <p className="text-xs text-gov-gray">Telangana Police</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <p className="text-xs text-gov-gray">womensafetywing.telangana.gov.in</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-xs text-gov-gray">wsw.telangana@gov.in</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full bg-pink-600 text-white hover:bg-pink-700">
                      <Heart className="mr-2 h-4 w-4" />
                      Report Women Safety Issue
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Baby className="mr-2 h-4 w-4" />
                      Report Missing Child
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      Domestic Violence Help
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Clock className="mr-2 h-4 w-4" />
                      Check Case Status
                    </Button>
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
