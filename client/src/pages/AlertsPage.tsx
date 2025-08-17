import Header from "@/components/layout/ModernHeader";
import { AlertTriangle, Shield, Check, X, Users, FileText, Globe, Building } from "lucide-react";

export function AlertsPage() {
  const cyberSafetyTopics = [
    { title: "Ransomware Attack", slug: "ransomware" },
    { title: "Social Media Deception", slug: "social-media" },
    { title: "E-Banking Fraud", slug: "e-banking" },
    { title: "Email Scam", slug: "email-scam" },
    { title: "Online Social Networking Traps", slug: "online-social" },
    { title: "Online Blackmail", slug: "online-blackmail" }
  ];

  const womenChildrenSafety = [
    { title: "Do's & Don'ts", slug: "childwomensafety" },
    { title: "Banners & Posters", slug: "childandwomensaftey" }
  ];

  const safetyTopics = [
    { title: "Security of Residential Areas", slug: "residentialareas", icon: Building },
    { title: "Senior Citizens", slug: "seniorcitizens", icon: Users },
    { title: "Precautions for Banking", slug: "precautionsbanking", icon: Shield },
    { title: "Double Your Money Schemes", slug: "moneyschemes", icon: AlertTriangle },
    { title: "Emergency Situations", slug: "emergencysituations", icon: AlertTriangle },
    { title: "Gulf Jobs", slug: "gulfjobs", icon: Globe },
    { title: "Prevent Vehicle Theft", slug: "vehicletheft", icon: Shield }
  ];

  const dos = [
    "Do evacuate people immediately to a safe distance.",
    "Open all windows & doors.",
    "Place sand bags around the suspected object.",
    "Inform bomb disposal squad.",
    "Inform fire brigade, Hospital & Ambulance."
  ];

  const donts = [
    "Do not touch or remove the object unless you are duty bound.",
    "Do not open the package. Do not puncture package.",
    "Do not submerge packet into water.",
    "Do not accept identification marks on its face value.",
    "Do not pass metallic object over the package.",
    "Do not direct flash light directly over the suspected object.",
    "Do not cut the strings or wire.",
    "Do not bring suspected device in security control room or police station. Always remove the people and not the bomb from scene.",
    "Do not attempt to open the baggage by hand.",
    "Do not reveal CVV/ PIN/ OTP unless you initiated the transaction",
    "Don't be a dead-hero.",
    "You can reconstruct a building or house but you cannot recreate a dead man alive."
  ];

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12 cid-page-header rounded-2xl p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 cid-nav-text">
              Public Safety Alerts
            </h1>
            <p className="text-lg text-purple-100 max-w-3xl mx-auto">
              Important safety information and guidelines to protect yourself and your community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Suspicious Objects Section */}
              <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <div className="flex items-center mb-6">
                  <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Do's & Don'ts for Suspicious Objects</h2>
                </div>

                {/* DO's Section */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <Check className="h-6 w-6 text-primary mr-2" />
                    <h3 className="text-2xl font-bold text-primary">DO's</h3>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6">
                    <ul className="space-y-3">
                      {dos.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* DON'Ts Section */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <X className="h-6 w-6 text-red-600 mr-2" />
                    <h3 className="text-2xl font-bold text-red-700">DON'Ts</h3>
                  </div>
                  <div className="bg-red-50 rounded-lg p-6">
                    <ul className="space-y-3">
                      {donts.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <X className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                    <h4 className="text-lg font-semibold text-orange-800">Emergency Contact</h4>
                  </div>
                  <p className="text-orange-700">
                    In case of emergency, immediately dial <strong className="text-xl">100</strong> for police assistance
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar - Citizen's Corner */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-28">
                <div className="flex items-center mb-6">
                  <Shield className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Citizen's Corner</h3>
                </div>
                
                <div className="space-y-6">
                  {/* Protect Yourself Section */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Shield className="h-5 w-5 text-primary mr-2" />
                      Protect Yourself
                    </h4>
                    
                    <div className="space-y-4">
                      {/* Public Notification */}
                      <div className="border-l-4 border-purple-400 pl-4">
                        <a href="/cid/citizenimages" className="text-purple-600 hover:text-purple-700 font-medium">
                          Public Notification
                          <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                        </a>
                      </div>

                      {/* Current Page */}
                      <div className="border-l-4 border-orange-400 pl-4 bg-orange-50 p-2 rounded">
                        <span className="text-orange-700 font-medium">
                          DO'S & DON'TS FOR SUSPICIOUS OBJECTS
                        </span>
                      </div>

                      {/* Cyber Safety */}
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">CYBER SAFETY</h5>
                        <div className="space-y-2 ml-4">
                          {cyberSafetyTopics.map((topic, index) => (
                            <div key={index} className="border-l-2 border-gray-200 pl-3">
                              <a href={`/cid/${topic.slug}`} className="text-sm text-gray-600 hover:text-purple-600">
                                {topic.title}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Children & Women Safety */}
                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2">CHILDREN & WOMEN SAFETY</h5>
                        <div className="space-y-2 ml-4">
                          {womenChildrenSafety.map((topic, index) => (
                            <div key={index} className="border-l-2 border-gray-200 pl-3">
                              <a href={`/cid/${topic.slug}`} className="text-sm text-gray-600 hover:text-purple-600">
                                {topic.title}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Other Safety Topics */}
                      <div className="space-y-2">
                        {safetyTopics.map((topic, index) => (
                          <div key={index} className="border-l-4 border-gray-200 pl-4">
                            <a href={`/cid/${topic.slug}`} className="text-gray-600 hover:text-purple-600 font-medium text-sm flex items-center">
                              <topic.icon className="h-4 w-4 mr-2" />
                              {topic.title.toUpperCase()}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Safety Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Emergency Helpline</h3>
              <p className="text-3xl font-bold text-orange-600">100</p>
              <p className="text-gray-600 mt-2">Police Emergency</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Shield className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Women Helpline</h3>
              <p className="text-3xl font-bold text-purple-600">1091</p>
              <p className="text-gray-600 mt-2">24/7 Support</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cyber Crime</h3>
              <p className="text-3xl font-bold text-blue-600">1930</p>
              <p className="text-gray-600 mt-2">Cyber Helpline</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}