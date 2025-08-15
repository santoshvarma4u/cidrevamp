import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChartLine, 
  Shield, 
  AlertTriangle, 
  FileText, 
  Users, 
  Phone,
  Mail,
  Building,
  CreditCard,
  Banknote,
  TrendingDown
} from "lucide-react";

export default function EconomicOffences() {
  const breadcrumbItems = [
    { label: "Specialized Wings", href: "/" },
    { label: "Economic Offences Wing" }
  ];

  const keyFunctions = [
    "Financial frauds and misappropriation cases",
    "Counterfeit currency investigations (FICN)",
    "Banking frauds and NBFC frauds",
    "Multilevel marketing schemes",
    "Money circulation schemes",
    "Vanishing companies investigations",
    "Government fund diversion cases"
  ];

  const recentCases = [
    {
      type: "Banking Fraud",
      amount: "₹2.5 Crores",
      status: "Under Investigation",
      priority: "High"
    },
    {
      type: "FICN Detection",
      amount: "₹50 Lakhs",
      status: "Resolved",
      priority: "Critical"
    },
    {
      type: "MLM Scheme",
      amount: "₹1.8 Crores",
      status: "Investigating",
      priority: "Medium"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="page-hero-gradient py-16">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <ChartLine className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white cid-nav-text">Economic Offences Wing</h1>
              <p className="text-xl text-purple-100 mt-2">
                Specialized unit for financial crimes and economic fraud investigations
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
                    <Building className="h-6 w-6 text-gov-blue" />
                    <span>Wing Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gov-gray leading-relaxed mb-6">
                    The Economic Offences Wing (EOW) of CID Telangana is a specialized unit that handles major cases 
                    of financial frauds and misappropriation, counterfeit currency cases, frauds by non-banking finance 
                    companies, banking frauds, multilevel marketing cases, vanishing companies, diversion/misappropriation 
                    of Government funds and money circulation schemes which constitute a major chunk of economic offences.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gov-dark mb-2">FICN Nodal Agency</h4>
                      <p className="text-sm text-gov-gray">
                        EOW serves as the Nodal Agency to supervise cases of Fake Indian Currency Notes (FICN) 
                        across Telangana State.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gov-dark mb-2">PMLA & FEMA Reporting</h4>
                      <p className="text-sm text-gov-gray">
                        Acts as the Nodal Agency for reporting cases under Prevention of Money Laundering Act (PMLA) 
                        & Foreign Exchange Management Act (FEMA) to the Enforcement Directorate.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Functions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-gov-blue" />
                    <span>Key Functions & Responsibilities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {keyFunctions.map((func, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gov-blue rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gov-gray">{func}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Case Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingDown className="h-6 w-6 text-gov-blue" />
                    <span>Recent Case Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCases.map((case_, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="bg-white p-2 rounded">
                            {case_.type === "Banking Fraud" && <CreditCard className="h-5 w-5 text-red-600" />}
                            {case_.type === "FICN Detection" && <Banknote className="h-5 w-5 text-yellow-600" />}
                            {case_.type === "MLM Scheme" && <Users className="h-5 w-5 text-purple-600" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gov-dark">{case_.type}</h4>
                            <p className="text-sm text-gov-gray">Amount: {case_.amount}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={case_.status === "Resolved" ? "default" : "secondary"}>
                            {case_.status}
                          </Badge>
                          <Badge variant={
                            case_.priority === "Critical" ? "destructive" : 
                            case_.priority === "High" ? "destructive" : 
                            "secondary"
                          }>
                            {case_.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Public Advisory */}
              <Card className="border-l-4 border-yellow-400 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-yellow-800">
                    <AlertTriangle className="h-6 w-6" />
                    <span>Public Advisory</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-yellow-800">
                    <div>
                      <h4 className="font-semibold mb-2">Beware of Investment Frauds</h4>
                      <p className="text-sm">
                        Do not invest in get-rich-quick schemes or multilevel marketing plans that promise 
                        unrealistic returns. Always verify the credentials of financial institutions.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Banking Security</h4>
                      <p className="text-sm">
                        Never share your banking credentials, OTP, or PIN with anyone. Banks never ask 
                        for such information over phone or email.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Report Suspicious Activities</h4>
                      <p className="text-sm">
                        If you suspect any economic fraud or counterfeit currency, immediately report 
                        to the nearest police station or contact EOW directly.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-gov-blue" />
                    <span>Contact EOW</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Building className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">CID Office</p>
                        <p className="text-xs text-gov-gray">3rd Floor, DGP Office</p>
                        <p className="text-xs text-gov-gray">Lakadikapul, Hyderabad-004</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">Emergency</p>
                        <p className="text-xs text-gov-gray">100 (24x7)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gov-gray" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-xs text-gov-gray">eow.tspolice@gov.in</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gov-blue" />
                    <span>Quick Links</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <a href="/citizen-services/lodge-complaint" className="block text-sm text-gov-blue hover:text-blue-700 transition">
                      File Economic Fraud Complaint
                    </a>
                    <a href="/citizen-services/check-status" className="block text-sm text-gov-blue hover:text-blue-700 transition">
                      Check Complaint Status
                    </a>
                    <a href="/public-awareness" className="block text-sm text-gov-blue hover:text-blue-700 transition">
                      Fraud Prevention Guidelines
                    </a>
                    <a href="/media/news" className="block text-sm text-gov-blue hover:text-blue-700 transition">
                      Latest EOW News
                    </a>
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
                      <div className="text-2xl font-bold text-gov-blue">₹45 Cr</div>
                      <div className="text-sm text-gov-gray">Amount Recovered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">156</div>
                      <div className="text-sm text-gov-gray">Cases Resolved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emergency">89</div>
                      <div className="text-sm text-gov-gray">Arrests Made</div>
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
