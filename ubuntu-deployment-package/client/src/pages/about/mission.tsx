import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import {
  Target,
  Eye,
  Heart,
  Shield,
  Users,
  Scale,
  Lightbulb,
  Award,
  CheckCircle,
  Star,
  Zap,
  Globe,
} from "lucide-react";

export default function Mission() {
  const coreValues = [
    {
      title: "Transparency",
      description: "Open and accountable investigation processes that build public trust",
      icon: Eye,
      color: "blue",
    },
    {
      title: "Impartiality",
      description: "Fair and unbiased investigations without discrimination or favoritism",
      icon: Scale,
      color: "green",
    },
    {
      title: "Efficiency",
      description: "Swift and effective resolution of cases using modern investigative techniques",
      icon: Zap,
      color: "yellow",
    },
    {
      title: "Integrity",
      description: "Upholding the highest ethical standards in all our operations",
      icon: Shield,
      color: "purple",
    },
    {
      title: "Innovation",
      description: "Embracing technology and modern methods for better crime solving",
      icon: Lightbulb,
      color: "orange",
    },
    {
      title: "Service",
      description: "Dedicated commitment to serving citizens and protecting their rights",
      icon: Heart,
      color: "red",
    },
  ];

  const objectives = [
    "Conduct transparent, impartial, efficient and systematic investigation using high-end, state-of-the-art equipment with quality forensic support",
    "Provide specialized investigation services for complex criminal cases across all districts of Telangana",
    "Ensure swift justice delivery through scientific investigation methods and evidence-based prosecutions",
    "Protect the rights of victims, witnesses, and accused persons throughout the investigation process",
    "Maintain highest standards of professionalism and ethical conduct in all operations",
    "Collaborate with national and international agencies for effective crime prevention and investigation",
    "Build public confidence through transparent operations and community engagement programs",
    "Develop and maintain cutting-edge forensic capabilities and investigative technologies",
  ];

  const keyPrinciples = [
    {
      title: "Scientific Investigation",
      description: "Use of modern forensic science and technology for evidence collection and analysis",
      achievements: ["State-of-art forensic labs", "Digital evidence processing", "DNA analysis capabilities"],
    },
    {
      title: "Human Rights Protection",
      description: "Ensuring constitutional rights and dignity of all individuals during investigations",
      achievements: ["Victim support programs", "Witness protection", "Legal aid coordination"],
    },
    {
      title: "Inter-Agency Cooperation",
      description: "Seamless coordination with various law enforcement and legal agencies",
      achievements: ["Multi-state operations", "International cooperation", "Joint task forces"],
    },
    {
      title: "Capacity Building",
      description: "Continuous training and development of investigation officers and staff",
      achievements: ["Regular training programs", "Technology upgrades", "Skill development"],
    },
  ];

  const socialCommitments = [
    "Protecting vulnerable sections of society including women, children, and minorities",
    "Combating economic crimes that affect common citizens and financial institutions",
    "Fighting cyber crimes and creating digital safety awareness",
    "Preventing human trafficking and ensuring rehabilitation of victims",
    "Building community trust through proactive engagement and transparency",
    "Supporting victims of crime with comprehensive assistance and rehabilitation",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      {/* Header Section */}
      <section className="page-hero-gradient text-white header-spacing pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Target className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 cid-nav-text">Mission & Vision</h1>
                <p className="text-xl text-purple-100">Guiding Principles of CID Telangana</p>
              </div>
            </div>
            <p className="text-lg text-purple-100 leading-relaxed">
              Our mission is to provide transparent, impartial, efficient and systematic investigation 
              services to the people of Telangana, ensuring justice delivery through scientific methods 
              and upholding the highest standards of professional excellence.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Mission Statement */}
        <section className="mb-12">
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader className="cid-card-header">
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-white" />
                <span className="cid-nav-text">Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <blockquote className="text-lg text-blue-900 font-medium leading-relaxed">
                  "To serve as the premier investigation agency of Telangana State, providing transparent, 
                  impartial, efficient and systematic investigation using high-end, state-of-the-art equipment 
                  with quality forensic support, ensuring swift justice delivery while upholding the 
                  constitutional rights and dignity of all citizens."
                </blockquote>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-4">Key Objectives:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {objectives.map((objective, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{objective}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Vision Statement */}
        <section className="mb-12">
          <Card className="border-l-4 border-l-purple-600">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-6 w-6 text-purple-600" />
                <span>Our Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-50 rounded-lg p-6">
                <blockquote className="text-lg text-purple-900 font-medium leading-relaxed mb-4">
                  "To be recognized as a world-class crime investigation department that sets benchmarks 
                  in scientific investigation, technological innovation, and service excellence, earning 
                  the trust and confidence of citizens through our commitment to justice and human rights."
                </blockquote>
                
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="font-semibold text-purple-900">Global Standards</div>
                      <div className="text-sm text-purple-700">World-class investigation practices</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="font-semibold text-purple-900">Excellence</div>
                      <div className="text-sm text-purple-700">Continuous improvement in service</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="font-semibold text-purple-900">Public Trust</div>
                      <div className="text-sm text-purple-700">Citizen confidence and satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Core Values */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Values</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`bg-${value.color}-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                    <value.icon className={`h-8 w-8 text-${value.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Principles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Operating Principles</h2>
          <div className="space-y-6">
            {keyPrinciples.map((principle, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {principle.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{principle.description}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Achievements:</h4>
                    <div className="grid md:grid-cols-3 gap-2">
                      {principle.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Badge variant="outline">{achievement}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Social Commitment */}
        <section className="mb-12">
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900 flex items-center space-x-2">
                <Heart className="h-6 w-6" />
                <span>Social Commitment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800 mb-6">
                Our commitment extends beyond investigation to building a safer, more just society 
                for all citizens of Telangana.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {socialCommitments.map((commitment, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-green-700">{commitment}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Performance Metrics */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-blue-600" />
                <span>Performance Commitment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-lg p-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                    <div className="text-sm font-medium text-blue-900">Case Resolution Rate</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-lg p-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">30</div>
                    <div className="text-sm font-medium text-green-900">Average Days to Close</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-lg p-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                    <div className="text-sm font-medium text-purple-900">Evidence Accuracy</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 rounded-lg p-6">
                    <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                    <div className="text-sm font-medium text-orange-900">Emergency Response</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quality Assurance */}
        <section>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center space-x-2">
                <Star className="h-6 w-6" />
                <span>Quality Assurance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800">Investigation Standards</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Scientific evidence collection and preservation</li>
                    <li>• Adherence to legal procedures and protocols</li>
                    <li>• Regular quality audits and reviews</li>
                    <li>• Continuous training and skill development</li>
                    <li>• Use of latest technology and equipment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-800">Service Excellence</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Timely response to complaints and reports</li>
                    <li>• Regular updates to complainants and families</li>
                    <li>• Victim and witness support services</li>
                    <li>• Transparent investigation processes</li>
                    <li>• Feedback collection and improvement</li>
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
