import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ExternalLink, Shield, Globe, FileText, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LinkItem {
  title: string;
  url: string;
  description: string;
  category: string;
}

export default function LinksPage() {
  const links: LinkItem[] = [
    // Government Links
    {
      title: "Telangana State Portal",
      url: "https://www.telangana.gov.in",
      description: "Official website of Government of Telangana",
      category: "Government"
    },
    {
      title: "Telangana State Police",
      url: "https://www.tspolice.gov.in",
      description: "Official website of Telangana State Police",
      category: "Government"
    },
    {
      title: "Director General of Police",
      url: "https://www.tsdgp.gov.in",
      description: "Office of the Director General of Police, Telangana",
      category: "Government"
    },
    {
      title: "Chief Minister's Office",
      url: "https://www.cmo.telangana.gov.in",
      description: "Official website of Chief Minister of Telangana",
      category: "Government"
    },
    
    // Law Enforcement
    {
      title: "Central Bureau of Investigation",
      url: "https://www.cbi.gov.in",
      description: "Premier investigating agency of India",
      category: "Law Enforcement"
    },
    {
      title: "National Investigation Agency",
      url: "https://www.nia.gov.in",
      description: "Counter-terrorism task force of India",
      category: "Law Enforcement"
    },
    {
      title: "Enforcement Directorate",
      url: "https://www.enforcementdirectorate.gov.in",
      description: "Economic intelligence and investigation agency",
      category: "Law Enforcement"
    },
    {
      title: "National Crime Records Bureau",
      url: "https://www.ncrb.gov.in",
      description: "Repository of information on crime and criminals",
      category: "Law Enforcement"
    },

    // Cyber Security
    {
      title: "Indian Computer Emergency Response Team",
      url: "https://www.cert-in.org.in",
      description: "National nodal agency for responding to cyber security incidents",
      category: "Cyber Security"
    },
    {
      title: "Cyber Crime Coordination Centre",
      url: "https://www.cybercrime.gov.in",
      description: "Platform for reporting cybercrime complaints",
      category: "Cyber Security"
    },
    {
      title: "National Cyber Security Strategy",
      url: "https://www.ncss.gov.in",
      description: "National framework for cyber security",
      category: "Cyber Security"
    },

    // Legal Resources
    {
      title: "Supreme Court of India",
      url: "https://www.sci.gov.in",
      description: "Apex court of India",
      category: "Legal"
    },
    {
      title: "High Court of Telangana",
      url: "https://www.hcts.gov.in",
      description: "High Court of Telangana and Andhra Pradesh",
      category: "Legal"
    },
    {
      title: "National Legal Services Authority",
      url: "https://www.nalsa.gov.in",
      description: "Legal aid and services authority",
      category: "Legal"
    },

    // Emergency Services
    {
      title: "National Emergency Number - 112",
      url: "tel:112",
      description: "Single emergency helpline number",
      category: "Emergency"
    },
    {
      title: "Police Emergency - 100",
      url: "tel:100",
      description: "Police emergency helpline",
      category: "Emergency"
    },
    {
      title: "Women Helpline - 181",
      url: "tel:181",
      description: "24x7 helpline for women in distress",
      category: "Emergency"
    },
    {
      title: "Child Helpline - 1098",
      url: "tel:1098",
      description: "Helpline for children in need of care and protection",
      category: "Emergency"
    }
  ];

  const categories = Array.from(new Set(links.map(link => link.category)));

  const getIconForCategory = (category: string) => {
    switch (category) {
      case "Government":
        return <Shield className="h-5 w-5 text-primary" />;
      case "Law Enforcement":
        return <Shield className="h-5 w-5 text-primary" />;
      case "Cyber Security":
        return <Globe className="h-5 w-5 text-primary" />;
      case "Legal":
        return <FileText className="h-5 w-5 text-primary" />;
      case "Emergency":
        return <Phone className="h-5 w-5 text-primary" />;
      default:
        return <ExternalLink className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-100 to-cyan-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Important Links
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Quick access to government portals, law enforcement agencies, legal resources, and emergency services
            </p>
          </div>

          {/* Links by Category */}
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-6">
                  {getIconForCategory(category)}
                  <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {links
                    .filter(link => link.category === category)
                    .map((link, index) => (
                      <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-primary" />
                            {link.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-gray-600 mb-4">
                            {link.description}
                          </CardDescription>
                          <a
                            href={link.url}
                            target={link.url.startsWith('tel:') ? '_self' : '_blank'}
                            rel={link.url.startsWith('tel:') ? '' : 'noopener noreferrer'}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 text-sm font-medium"
                          >
                            {link.url.startsWith('tel:') ? (
                              <>
                                <Phone className="h-4 w-4" />
                                Call Now
                              </>
                            ) : (
                              <>
                                <ExternalLink className="h-4 w-4" />
                                Visit Website
                              </>
                            )}
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="mt-16">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900 flex items-center justify-center gap-2">
                  <Mail className="h-6 w-6 text-primary" />
                  Contact CID Telangana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8 text-center">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Emergency Contact</h3>
                    <p className="text-gray-600 mb-2">For urgent matters and emergencies</p>
                    <a
                      href="tel:100"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                    >
                      <Phone className="h-4 w-4" />
                      Call 100
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">General Inquiries</h3>
                    <p className="text-gray-600 mb-2">For general information and assistance</p>
                    <a
                      href="mailto:cid@tspolice.gov.in"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium"
                    >
                      <Mail className="h-4 w-4" />
                      Send Email
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}