import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  Shield, 
  AlertTriangle, 
  FileText, 
  Users, 
  Phone,
  Mail,
  Building,
  Book,
  UserCheck,
  Heart,
  Globe,
  Megaphone,
  CheckCircle
} from "lucide-react";

export default function CivilRights() {
  const breadcrumbItems = [
    { label: "Specialized Wings", href: "/" },
    { label: "Protection of Civil Rights Wing" }
  ];

  const protectedRights = [
    {
      right: "Right to Equality",
      description: "Protection against discrimination based on religion, race, caste, sex, or place of birth",
      articles: "Articles 14-18",
      icon: Users
    },
    {
      right: "Right to Freedom",
      description: "Freedom of speech, assembly, association, movement, and profession",
      articles: "Articles 19-22",
      icon: Megaphone
    },
    {
      right: "Right against Exploitation",
      description: "Protection against forced labor, child labor, and human trafficking",
      articles: "Articles 23-24",
      icon: Shield
    },
    {
      right: "Right to Freedom of Religion",
      description: "Freedom of conscience and free profession, practice, and propagation of religion",
      articles: "Articles 25-28",
      icon: Heart
    },
    {
      right: "Cultural and Educational Rights",
      description: "Rights of minorities to conserve their culture, language, and script",
      articles: "Articles 29-30",
      icon: Book
    },
    {
      right: "Right to Constitutional Remedies",
      description: "Right to move Supreme Court for enforcement of fundamental rights",
      articles: "Article 32",
      icon: Scale
    }
  ];

  const actsCovered = [
    "Protection of Civil Rights Act, 1955",
    "Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989",
    "Juvenile Justice (Care and Protection of Children) Act, 2015",
    "Rights of Persons with Disabilities Act, 2016",
    "Senior Citizens Maintenance and Welfare Act, 2007",
    "Prohibition of Child Marriage Act, 2006"
  ];

  const serviceAreas = [
    {
      area: "Discrimination Cases",
      description: "Investigation of caste, religion, or gender-based discrimination",
      priority: "High"
    },
    {
      area: "Atrocity Prevention",
      description: "Cases under SC/ST Prevention of Atrocities Act",
      priority: "Critical"
    },
    {
      area: "Minority Rights",
      description: "Protection of religious and linguistic minority rights",
      priority: "Medium"
    },
    {
      area: "Disability Rights",
      description: "Ensuring rights and accessibility for persons with disabilities",
      priority: "High"
    },
    {
      area: "Child Rights",
      description: "Protection of children's constitutional and legal rights",
      priority: "Critical"
    },
    {
      area: "Women's Rights",
      description: "Gender equality and women's constitutional rights",
      priority: "High"
    }
  ];

  const recentInitiatives = [
    {
      initiative: "Awareness Campaigns",
      description: "Public education on constitutional rights and legal remedies",
      status: "Ongoing",
      impact: "50,000+ people reached"
    },
    {
      initiative: "Fast Track Courts",
      description: "Expedited processing of civil rights violation cases",
      status: "Active",
      impact: "30% faster resolution"
    },
    {
      initiative: "Legal Aid Clinics",
      description: "Free legal assistance for marginalized communities",
      status: "Operational",
      impact: "1,200+ cases assisted"
    },
    {
      initiative: "Community Outreach",
      description: "Village-level programs on rights awareness",
      status: "Expanding",
      impact: "500+ villages covered"
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
            <div className="bg-indigo-100 p-4 rounded-lg">
              <Scale className="h-12 w-12 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gov-dark">Protection of Civil Rights Wing</h1>
              <p className="text-xl text-gov-gray mt-2">
                Safeguarding constitutional rights and ensuring social justice for all citizens
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
                    <Shield className="h-6 w-6 text-indigo-600" />
                    <span>Wing Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gov-gray leading-relaxed mb-6">
                    The Protection of Civil Rights Wing is dedicated to safeguarding the fundamental rights 
                    enshrined in the Indian Constitution. This specialized unit investigates violations of 
                    civil rights, discrimination cases, and ensures that constitutional guarantees are 
                    upheld for all citizens, with special focus on protecting vulnerable and marginalized communities.
                  </p>
                  
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gov-dark mb-3">Constitutional Mandate</h4>
                    <p className="text-sm text-gov-gray">
                      Our mission is rooted in the constitutional principles of equality, liberty, and justice. 
                      We work to ensure that every citizen can exercise their fundamental rights without fear 
                      of discrimination or violation, regardless of their caste, religion, gender, or social status.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Protected Rights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Book className="h-6 w-6 text-indigo-600" />
                    <span>Protected Fundamental Rights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {protectedRights.map((right, index) => {
                      const IconComponent = right.icon;
                      return (
                        <div key={index} className="p-4 border rounded-lg hover:shadow-md transition">
                          <div className="flex items-start space-x-4">
                            <div className="bg-indigo-100 p-2 rounded">
                              <IconComponent className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-gov-dark">{right.right}</h5>
                                <Badge variant="outline">{right.articles}</Badge>
                              </div>
                              <p className="text-sm text-gov-gray">{right.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Service Areas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserCheck className="h-6 w-6 text-indigo-600" />
                    <span>Service Areas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {serviceAreas.map((service, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gov-dark">{service.area}</h5>
                          <Badge variant={
                            service.priority === "Critical" ? "destructive" : 
                            service.priority === "High" ? "destructive" : 
                            "secondary"
                          }>
                            {service.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gov-gray">{service.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Legal Framework */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Scale className="h-6 w-6 text-indigo-600" />
                    <span>Legal Framework</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-gov-dark mb-4">Acts and Legislation Covered:</h4>
                  <div className="grid gap-2">
                    {actsCovered.map((act, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gov-gray">{act}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-semibold text-yellow-800 mb-2">Important Note:</h5>
                    <p className="text-sm text-yellow-700">
                      This wing works in close coordination with National Human Rights Commission (NHRC), 
                      State Human Rights Commission (SHRC), and other constitutional bodies to ensure 
                      comprehensive protection of civil rights.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Initiatives */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-6 w-6 text-indigo-600" />
                    <span>Recent Initiatives</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentInitiatives.map((initiative, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gov-dark">{initiative.initiative}</h5>
                          <Badge variant="default">{initiative.status}</Badge>
                        </div>
                        <p className="text-sm text-gov-gray mb-2">{initiative.description}</p>
                        <div className="text-sm font-medium text-indigo-600">{initiative.impact}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* How to Report */}
              <Card className="border-l-4 border-blue-400 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-800">
                    <AlertTriangle className="h-6 w-6" />
                    <span>How to Report Civil Rights Violations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-blue-800 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">What Constitutes a Civil Rights Violation?</h4>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Discrimination based on caste, religion, race, or gender</li>
                        <li>Denial of access to public places or services</li>
                        <li>Atrocities against scheduled castes and tribes</li>
                        <li>Violation of rights of persons with disabilities</li>
                        <li>Religious or linguistic persecution</li>
                        <li>Forced labor or human trafficking</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-4 rounded border border-blue-200">
                      <h5 className="font-semibold mb-2">Reporting Process:</h5>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>File a complaint at the nearest police station</li>
                        <li>Contact Civil Rights Wing directly for serious violations</li>
                        <li>Approach State Human Rights Commission</li>
                        <li>Seek legal aid through government schemes</li>
                        <li>Follow up on case progress through official channels</li>
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
                    <span>Emergency Helplines</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border border-red-200">
                      <div className="font-bold text-red-800">100</div>
                      <div className="text-sm text-red-700">Police Emergency</div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-red-200">
                      <div className="font-bold text-red-800">14433</div>
                      <div className="text-sm text-red-700">NHRC Helpline</div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-red-200">
                      <div className="font-bold text-red-800">1076</div>
                      <div className="text-sm text-red-700">SHRC Helpline</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-indigo-600" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Building className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">Civil Rights Wing</p>
                        <p className="text-xs text-gov-gray">CID Office, Lakadikapul</p>
                        <p className="text-xs text-gov-gray">Hyderabad-004</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-xs text-gov-gray">civilrights.cid@tspolice.gov.in</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <UserCheck className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">Officer in Charge</p>
                        <p className="text-xs text-gov-gray">DIG Civil Rights Protection</p>
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
                    <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                      <FileText className="mr-2 h-4 w-4" />
                      Report Rights Violation
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Book className="mr-2 h-4 w-4" />
                      Know Your Rights
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Scale className="mr-2 h-4 w-4" />
                      Legal Aid Information
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Globe className="mr-2 h-4 w-4" />
                      File Online Complaint
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>2024 Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">156</div>
                      <div className="text-sm text-gov-gray">Cases Investigated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">142</div>
                      <div className="text-sm text-gov-gray">Cases Resolved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gov-blue">91%</div>
                      <div className="text-sm text-gov-gray">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">50K+</div>
                      <div className="text-sm text-gov-gray">People Educated</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Book className="h-5 w-5 text-indigo-600" />
                    <span>Legal Resources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <a href="#" className="block text-sm text-indigo-600 hover:text-indigo-700 transition">
                      Constitution of India - Fundamental Rights
                    </a>
                    <a href="#" className="block text-sm text-indigo-600 hover:text-indigo-700 transition">
                      Civil Rights Act, 1955
                    </a>
                    <a href="#" className="block text-sm text-indigo-600 hover:text-indigo-700 transition">
                      SC/ST Prevention of Atrocities Act
                    </a>
                    <a href="#" className="block text-sm text-indigo-600 hover:text-indigo-700 transition">
                      Know Your Rights Guide
                    </a>
                    <a href="#" className="block text-sm text-indigo-600 hover:text-indigo-700 transition">
                      Legal Aid Schemes
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
