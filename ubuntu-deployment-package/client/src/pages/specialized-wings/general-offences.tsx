import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Gavel, 
  Shield, 
  AlertTriangle, 
  FileText, 
  Users, 
  Phone,
  Mail,
  Building,
  Search,
  Eye,
  Clock,
  MapPin,
  UserCheck,
  LockOpen
} from "lucide-react";

export default function GeneralOffences() {
  const breadcrumbItems = [
    { label: "Specialized Wings", href: "/" },
    { label: "General Offences Wing" }
  ];

  const investigationTypes = [
    {
      type: "Murder Cases",
      description: "Homicide investigations with forensic support",
      priority: "Critical",
      icon: AlertTriangle
    },
    {
      type: "Robbery & Theft",
      description: "Property crimes and organized theft cases",
      priority: "High",
      icon: Shield
    },
    {
      type: "Kidnapping",
      description: "Abduction and ransom case investigations",
      priority: "Critical",
      icon: Search
    },
    {
      type: "Inter-District Cases",
      description: "Cross-jurisdictional criminal matters",
      priority: "Medium",
      icon: MapPin
    },
    {
      type: "Organized Crime",
      description: "Gang-related and syndicated criminal activities",
      priority: "High",
      icon: Users
    },
    {
      type: "Serious Assault",
      description: "Grievous hurt and attempt to murder cases",
      priority: "High",
      icon: LockOpen
    }
  ];

  const investigationProcess = [
    {
      step: "Case Registration",
      description: "FIR registration and preliminary investigation",
      timeframe: "Day 1"
    },
    {
      step: "Crime Scene Analysis",
      description: "Forensic examination and evidence collection",
      timeframe: "Days 1-3"
    },
    {
      step: "Witness Statements",
      description: "Recording statements and gathering testimonies",
      timeframe: "Days 2-7"
    },
    {
      step: "Evidence Analysis",
      description: "Laboratory analysis and expert opinions",
      timeframe: "Days 7-21"
    },
    {
      step: "Suspect Identification",
      description: "Investigation and suspect apprehension",
      timeframe: "Days 14-30"
    },
    {
      step: "Charge Sheet Filing",
      description: "Case preparation and court proceedings",
      timeframe: "Days 60-90"
    }
  ];

  const recentCases = [
    {
      caseType: "Murder",
      location: "Hyderabad",
      status: "Charge Sheet Filed",
      duration: "45 days",
      solved: true
    },
    {
      caseType: "Robbery",
      location: "Warangal",
      status: "Under Investigation",
      duration: "15 days",
      solved: false
    },
    {
      caseType: "Kidnapping",
      location: "Nizamabad",
      status: "Solved",
      duration: "8 days",
      solved: true
    },
    {
      caseType: "Organized Crime",
      location: "Karimnagar",
      status: "Arrests Made",
      duration: "30 days",
      solved: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      {/* Page Header */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <Gavel className="h-12 w-12 text-gray-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gov-dark">General Offences Wing</h1>
              <p className="text-xl text-gov-gray mt-2">
                Specialized unit for serious criminal investigations and complex cases
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
                    <Shield className="h-6 w-6 text-gray-600" />
                    <span>Wing Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gov-gray leading-relaxed mb-6">
                    The General Offences Wing handles serious criminal investigations beyond the scope of 
                    specialized units. This includes murder cases, robbery, kidnapping, organized crime, 
                    and complex inter-district matters that require specialized investigation techniques 
                    and coordination across multiple jurisdictions.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gov-dark mb-2">Jurisdiction</h4>
                      <p className="text-sm text-gov-gray">
                        State-wide jurisdiction for serious crimes requiring specialized investigation 
                        techniques and inter-district coordination.
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gov-dark mb-2">Expertise</h4>
                      <p className="text-sm text-gov-gray">
                        Advanced investigation methods, forensic analysis, and coordination with 
                        specialized units for comprehensive case resolution.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investigation Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-6 w-6 text-gray-600" />
                    <span>Investigation Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {investigationTypes.map((type, index) => {
                      const IconComponent = type.icon;
                      return (
                        <div key={index} className="p-4 border rounded-lg hover:shadow-md transition">
                          <div className="flex items-start space-x-4">
                            <div className="bg-gray-100 p-2 rounded">
                              <IconComponent className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-gov-dark">{type.type}</h5>
                                <Badge variant={
                                  type.priority === "Critical" ? "destructive" : 
                                  type.priority === "High" ? "destructive" : 
                                  "secondary"
                                }>
                                  {type.priority} Priority
                                </Badge>
                              </div>
                              <p className="text-sm text-gov-gray">{type.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Investigation Process */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-6 w-6 text-gray-600" />
                    <span>Investigation Process</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {investigationProcess.map((process, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-semibold text-gov-dark">{process.step}</h5>
                            <span className="text-sm text-gov-blue font-medium">{process.timeframe}</span>
                          </div>
                          <p className="text-sm text-gov-gray">{process.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Cases */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-6 w-6 text-gray-600" />
                    <span>Recent Case Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCases.map((case_, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline">{case_.caseType}</Badge>
                            <span className="text-sm text-gov-gray">{case_.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={case_.solved ? "default" : "secondary"}>
                              {case_.status}
                            </Badge>
                            <span className="text-sm text-gov-gray">{case_.duration}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${case_.solved ? 'bg-green-600' : 'bg-yellow-600'}`}
                            style={{ width: case_.solved ? '100%' : '60%' }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Public Information */}
              <Card className="border-l-4 border-blue-400 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-800">
                    <AlertTriangle className="h-6 w-6" />
                    <span>Reporting Serious Crimes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-blue-800 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">When to Contact General Offences Wing</h4>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Serious crimes like murder, kidnapping, or organized criminal activities</li>
                        <li>Cases involving multiple districts or jurisdictions</li>
                        <li>Complex investigations requiring specialized expertise</li>
                        <li>High-profile cases needing additional investigation resources</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-4 rounded border border-blue-200">
                      <h5 className="font-semibold mb-2">How to Report:</h5>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Call 100 for immediate emergency response</li>
                        <li>Visit nearest police station to file FIR</li>
                        <li>Contact CID directly for complex cases</li>
                        <li>Provide all available evidence and witness information</li>
                      </ol>
                    </div>
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
                    <span>Emergency Response</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-800 mb-2">100</div>
                    <p className="text-sm text-red-700 mb-4">Police Emergency (24x7)</p>
                    
                    <div className="bg-white p-3 rounded border border-red-200">
                      <p className="text-xs text-red-700">
                        For serious crimes in progress, immediately dial 100. 
                        The call will be routed to appropriate response teams.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-gray-600" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Building className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">General Offences Wing</p>
                        <p className="text-xs text-gov-gray">CID Office, Lakadikapul</p>
                        <p className="text-xs text-gov-gray">Hyderabad-004</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-xs text-gov-gray">general.cid@tspolice.gov.in</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <UserCheck className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">Officer in Charge</p>
                        <p className="text-xs text-gov-gray">DIG General Offences</p>
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
                    <Button className="w-full bg-gray-600 text-white hover:bg-gray-700">
                      <FileText className="mr-2 h-4 w-4" />
                      Report Serious Crime
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      Check Case Status
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Search className="mr-2 h-4 w-4" />
                      Missing Person Report
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Emergency Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>2024 Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">234</div>
                      <div className="text-sm text-gov-gray">Total Cases</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">187</div>
                      <div className="text-sm text-gov-gray">Cases Solved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gov-blue">79.9%</div>
                      <div className="text-sm text-gov-gray">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">18</div>
                      <div className="text-sm text-gov-gray">Avg. Days to Solve</div>
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
