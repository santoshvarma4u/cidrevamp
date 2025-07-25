import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Scale,
  Shield,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Users,
  Book,
  Gavel,
  Heart,
  ExternalLink,
  Flag,
} from "lucide-react";

export default function CivilRights() {
  const keyAreas = [
    "Constitutional rights violations investigations",
    "Discrimination cases based on caste, religion, gender",
    "Scheduled Castes and Scheduled Tribes rights protection",
    "Minority rights violation cases",
    "Social justice and equality matters",
    "Hate crimes and communal violence prevention",
    "Human rights abuse investigations",
    "Public interest litigation support",
  ];

  const protectedCategories = [
    {
      title: "Scheduled Castes & Scheduled Tribes",
      description: "Special protection under SC/ST (Prevention of Atrocities) Act, 1989, ensuring dignity and equal treatment.",
      icon: Users,
      act: "SC/ST Act, 1989",
    },
    {
      title: "Religious Minorities",
      description: "Protection of religious freedom and prevention of communal violence and discrimination.",
      icon: Heart,
      act: "Article 25-28",
    },
    {
      title: "Women's Rights",
      description: "Gender equality enforcement and protection against discrimination in workplace and society.",
      icon: Shield,
      act: "Various Gender Laws",
    },
    {
      title: "Disabled Persons",
      description: "Rights protection under Persons with Disabilities Act and ensuring accessibility and equal opportunities.",
      icon: Flag,
      act: "PWD Act, 2016",
    },
  ];

  const legalFramework = [
    "Constitution of India - Fundamental Rights (Articles 14-32)",
    "Protection of Civil Rights Act, 1955",
    "Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989",
    "Persons with Disabilities (Equal Opportunities, Protection of Rights and Full Participation) Act, 2016",
    "Protection of Human Rights Act, 1993",
    "Right to Information Act, 2005",
    "Juvenile Justice (Care and Protection of Children) Act, 2015",
    "Various State-specific Anti-Discrimination Laws",
  ];

  const recentInitiatives = [
    {
      title: "Community Outreach Programs",
      description: "Regular awareness sessions in rural and urban areas about constitutional rights and legal remedies",
      impact: "50+ villages covered",
      status: "Ongoing",
    },
    {
      title: "Fast-Track Investigation",
      description: "Expedited investigation process for cases involving vulnerable communities",
      impact: "30% faster resolution",
      status: "Implemented",
    },
    {
      title: "Legal Aid Coordination",
      description: "Partnership with legal aid societies to provide free legal assistance to victims",
      impact: "200+ cases assisted",
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Scale className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Protection of Civil Rights Wing</h1>
                <p className="text-xl text-indigo-100">Constitutional Rights & Social Justice</p>
              </div>
            </div>
            <p className="text-lg text-indigo-100 leading-relaxed">
              The Protection of Civil Rights Wing is dedicated to upholding constitutional rights and 
              ensuring social justice for all citizens. We investigate violations of civil rights, 
              discrimination cases, and work towards creating an equitable society where every 
              individual's fundamental rights are protected and respected.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Key Areas */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Book className="h-6 w-6 text-indigo-600" />
                <span>Areas of Focus</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Our wing addresses violations of constitutional rights and ensures equal protection under law 
                for all citizens, with special focus on vulnerable and marginalized communities.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {keyAreas.map((area, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{area}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Protected Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Protected Categories</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {protectedCategories.map((category, index) => (
              <Card key={index} className="border-l-4 border-l-indigo-600 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <category.icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.title}
                        </h3>
                        <Badge variant="outline">{category.act}</Badge>
                      </div>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Legal Framework */}
        <section className="mb-12">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center space-x-2">
                <Gavel className="h-6 w-6" />
                <span>Legal Framework & Acts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 mb-6">
                Our investigations and actions are guided by comprehensive legal framework ensuring 
                protection of civil rights and constitutional guarantees.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {legalFramework.map((law, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-700 text-sm">{law}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Initiatives */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Initiatives & Programs</h2>
          <div className="space-y-6">
            {recentInitiatives.map((initiative, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {initiative.title}
                        </h3>
                        <Badge variant={initiative.status === "Implemented" ? "default" : "secondary"}>
                          {initiative.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{initiative.description}</p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-lg font-bold text-indigo-600">{initiative.impact}</div>
                      <div className="text-sm text-gray-500">Impact Achieved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Complaint Process */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-indigo-600" />
                <span>How to Lodge a Civil Rights Complaint</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-indigo-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-indigo-900 mb-2">Document Incident</h4>
                  <p className="text-sm text-indigo-700">Gather evidence and document the rights violation</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-indigo-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-indigo-900 mb-2">File Complaint</h4>
                  <p className="text-sm text-indigo-700">Submit complaint through online portal or office</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-indigo-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-indigo-900 mb-2">Investigation</h4>
                  <p className="text-sm text-indigo-700">Thorough investigation by specialized officers</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-indigo-600 font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-indigo-900 mb-2">Legal Action</h4>
                  <p className="text-sm text-indigo-700">Appropriate legal action and relief measures</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Support Services */}
        <section className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-indigo-600" />
                  <span>Victim Support Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Free legal aid and counseling</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Witness protection programs</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Rehabilitation assistance</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Compensation claim support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Book className="h-6 w-6 text-indigo-600" />
                  <span>Awareness Programs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Constitutional rights education</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Community sensitization programs</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>School and college workshops</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <span>Media campaigns and outreach</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <Card className="bg-indigo-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="text-indigo-900">Contact Civil Rights Wing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                    <div>
                      <div className="font-semibold">Office Address</div>
                      <div className="text-gray-600">
                        Civil Rights Wing<br />
                        3rd Floor, DGP Office<br />
                        Lakadikapul, Hyderabad-004<br />
                        Telangana State
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-indigo-600" />
                    <div>
                      <div className="font-semibold">Helpline Numbers</div>
                      <div className="text-gray-600">
                        Emergency: 100<br />
                        Human Rights: 1098<br />
                        Direct: +91-40-2761-5200
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-indigo-600" />
                    <div>
                      <div className="font-semibold">Email Support</div>
                      <div className="text-gray-600">
                        civilrights.cid@tspolice.gov.in<br />
                        help.tspolice@cgg.gov.in
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href="/citizen/complaint">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                        <FileText className="mr-2 h-4 w-4" />
                        Report Rights Violation
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://nhrc.nic.in" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        National Human Rights Commission
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Know Your Rights */}
        <section>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Know Your Rights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800">Fundamental Rights</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Right to Equality (Article 14-18)</li>
                    <li>• Right to Freedom (Article 19-22)</li>
                    <li>• Right against Exploitation (Article 23-24)</li>
                    <li>• Right to Freedom of Religion (Article 25-28)</li>
                    <li>• Right to Constitutional Remedies (Article 32)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800">What to Do</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Document evidence of rights violation</li>
                    <li>• Seek immediate help if in danger</li>
                    <li>• Contact appropriate authorities promptly</li>
                    <li>• Know your legal remedies and options</li>
                    <li>• Connect with support organizations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
