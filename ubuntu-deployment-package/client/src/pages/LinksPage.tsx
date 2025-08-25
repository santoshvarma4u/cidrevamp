import React from "react";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import { ExternalLink, Shield, Globe, Building, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LOGO_PLACEHOLDERS, createLogoPlaceholder } from "@/utils/placeholders";

interface LinkItem {
  title: string;
  url: string;
  description?: string;
  category: string;
  image?: string;
}

export default function LinksPage() {
  const links: LinkItem[] = [
    // Central Agencies
    {
      title: "BPRD",
      url: "http://www.bprd.nic.in/",
      description: "Bureau of Police Research and Development",
      category: "Central Agencies",
      image: LOGO_PLACEHOLDERS.bprd
    },
    {
      title: "Central Bureau of Investigation",
      url: "http://cbi.gov.in/",
      description: "Premier investigating agency of India",
      category: "Central Agencies",
      image: LOGO_PLACEHOLDERS.cbi
    },
    {
      title: "@Cyber Dost 2018",
      url: "https://twitter.com/cyberdost?lang=en",
      description: "Cyber security awareness initiative",
      category: "Central Agencies",
      image: LOGO_PLACEHOLDERS.cyberDost
    },
    {
      title: "Cybercrime.gov.in",
      url: "https://cybercrime.gov.in/cybercitizen/home.htm",
      description: "National cybercrime reporting portal",
      category: "Central Agencies",
      image: LOGO_PLACEHOLDERS.cybercrime
    },
    {
      title: "Ministry of Home Affairs",
      url: "https://mha.gov.in/",
      description: "Government of India, Ministry of Home Affairs",
      category: "Central Agencies",
      image: LOGO_PLACEHOLDERS.mha
    },
    {
      title: "Narcotics Control Bureau",
      url: "http://narcoticsindia.nic.in/",
      description: "Nodal drug law enforcement agency",
      category: "Central Agencies",
      image: LOGO_PLACEHOLDERS.ncb
    },
    {
      title: "National Investigation Agency",
      url: "http://www.nia.gov.in/",
      description: "Counter-terrorism task force of India",
      category: "Central Agencies",
      image: LOGO_PLACEHOLDERS.nia
    },
    {
      title: "National Crime Records Bureau",
      url: "http://ncrb.gov.in/",
      description: "Repository of information on crime and criminals",
      category: "Central Agencies",
      image: LOGO_PLACEHOLDERS.ncrb
    },
    {
      title: "Sardar Vallabhbhai Patel National Police Academy",
      url: "http://www.svpnpa.gov.in/",
      description: "Premier police training academy",
      category: "Central Agencies",
      image: LOGO_PLACEHOLDERS.svpnpa
    },

    // Other States - CID
    {
      title: "Andhra Pradesh CID",
      url: "http://cid.appolice.gov.in/",
      description: "Crime Investigation Department, Andhra Pradesh", 
      category: "Other States - CID"
    },
    {
      title: "Jammu Kashmir CID",
      url: "http://crimebranchjkpolice.nic.in/",
      description: "Crime Branch, J&K Police",
      category: "Other States - CID",
      image: LOGO_PLACEHOLDERS.jkCid
    },
    {
      title: "Maharashtra CID",
      url: "http://mahacid.com/",
      description: "Crime Investigation Department, Maharashtra",
      category: "Other States - CID",
      image: LOGO_PLACEHOLDERS.maharastraCid
    },
    {
      title: "Mizoram CID",
      url: "https://cidcrime.mizoram.gov.in/",
      description: "Crime Investigation Department, Mizoram",
      category: "Other States - CID",
      image: LOGO_PLACEHOLDERS.mizoramCid
    },
    {
      title: "Odisha CID",
      url: "http://odishapolicecidcb.gov.in/",
      description: "Crime Investigation Department, Odisha",
      category: "Other States - CID",
      image: LOGO_PLACEHOLDERS.odishaCid
    },
    {
      title: "West Bengal CID",
      url: "https://cidwestbengal.gov.in/",
      description: "Crime Investigation Department, West Bengal",
      category: "Other States - CID",
      image: LOGO_PLACEHOLDERS.westBengalCid
    },

    // Telangana State
    {
      title: "Cyberabad Metropolitan Police",
      url: "http://www.cyberabadpolice.gov.in/",
      description: "Cyberabad Police Commissionerate",
      category: "Telangana State",
      image: LOGO_PLACEHOLDERS.cyberabadPolice
    },
    {
      title: "Hyderabad Police",
      url: "http://www.hyderabadpolice.gov.in/",
      description: "Hyderabad City Police",
      category: "Telangana State",
      image: LOGO_PLACEHOLDERS.hydPolice
    },
    {
      title: "Telangana State Police",
      url: "http://www.tspolice.gov.in/",
      description: "Official website of Telangana State Police",
      category: "Telangana State",
      image: LOGO_PLACEHOLDERS.telanganaStatePolice
    },
    {
      title: "Telangana State Government",
      url: "http://www.telangana.gov.in/",
      description: "Official website of Government of Telangana",
      category: "Telangana State",
      image: LOGO_PLACEHOLDERS.telanganaGov
    },

    // Other States - Police (Major states only for brevity)
    {
      title: "Andaman and Nicobar Islands Police",
      url: "http://www.police.andaman.gov.in",
      description: "Police Department, Port Blair",
      category: "Other States - Police",
      image: createLogoPlaceholder("Andaman Police")
    },
    {
      title: "Andhra Pradesh Police",
      url: "http://www.appolice.gov.in",
      description: "Andhra Pradesh Police, Amaravathi",
      category: "Other States - Police",
      image: createLogoPlaceholder("AP Police")
    },
    {
      title: "Arunachal Pradesh Police",
      url: "http://www.arunpol.nic.in",
      description: "Arunachal Pradesh Police, Itanagar",
      category: "Other States - Police",
      image: createLogoPlaceholder("Arunachal Police")
    },
    {
      title: "Assam Police",
      url: "http://www.assampolice.gov.in",
      description: "Assam Police, Dispur",
      category: "Other States - Police",
      image: createLogoPlaceholder("Assam Police")
    },
    {
      title: "Bihar Police",
      url: "http://www.biharpolice.bih.nic.in",
      description: "Bihar Police, Patna",
      category: "Other States - Police",
      image: createLogoPlaceholder("BP Police")
    },
    {
      title: "Chandigarh Police",
      url: "http://chandigarhpolice.gov.in/",
      description: "Chandigarh Police",
      category: "Other States - Police",
      image: createLogoPlaceholder("Chandigarh Police")
    },
    {
      title: "Chhattisgarh Police",
      url: "http://www.cgpolice.gov.in",
      description: "Chhattisgarh Police, Raipur",
      category: "Other States - Police",
      image: createLogoPlaceholder("CG Police")
    },
    {
      title: "Dadra and Nagar Haveli Police",
      url: "http://www.dnhpolice.gov.in",
      description: "DNH Police, Silvassa",
      category: "Other States - Police",
      image: createLogoPlaceholder("DNH Police")
    },
    {
      title: "Daman and Diu Police",
      url: "http://www.ddpolice.gov.in",
      description: "Daman and Diu Police",
      category: "Other States - Police",
      image: createLogoPlaceholder("DDP Police")
    },
    {
      title: "Goa Police",
      url: "https://www.goapolice.gov.in/",
      description: "Goa Police, Panaji",
      category: "Other States - Police",
      image: createLogoPlaceholder("GP Police")
    },
    {
      title: "Gujarat Police",
      url: "https://police.gujarat.gov.in",
      description: "Gujarat Police, Gandhinagar",
      category: "Other States - Police",
      image: createLogoPlaceholder("GP Police")
    },
    {
      title: "Haryana Police",
      url: "http://www.haryanapoliceonline.gov.in",
      description: "Haryana Police, Chandigarh",
      category: "Other States - Police",
      image: createLogoPlaceholder("HP Police")
    },
    {
      title: "Himachal Pradesh Police",
      url: "http://www.citizenportal.hppolice.gov.in",
      description: "Himachal Pradesh Police, Shimla",
      category: "Other States - Police",
      image: createLogoPlaceholder("HP Police")
    },
    {
      title: "Jammu & Kashmir Police",
      url: "http://www.jkpolice.gov.in",
      description: "J&K Police, Srinagar & Jammu",
      category: "Other States - Police",
      image: createLogoPlaceholder("J&K Police")
    },
    {
      title: "Jharkhand Police",
      url: "https://jhpolice.gov.in/",
      description: "Jharkhand Police, Ranchi",
      category: "Other States - Police",
      image: createLogoPlaceholder("JH Police")
    },
    {
      title: "Karnataka Police",
      url: "http://www.ksp.gov.in",
      description: "Karnataka State Police, Bangalore",
      category: "Other States - Police",
      image: createLogoPlaceholder("KP Police")
    },
    {
      title: "Kerala Police",
      url: "http://www.keralapolice.org",
      description: "Kerala Police, Thiruvananthapuram",
      category: "Other States - Police",
      image: createLogoPlaceholder("KE Police")
    },
    {
      title: "Madhya Pradesh Police",
      url: "http://www.mppolice.gov.in",
      description: "Madhya Pradesh Police, Bhopal",
      category: "Other States - Police",
      image: createLogoPlaceholder("MP Police")
    },
    {
      title: "Maharashtra Police",
      url: "http://www.mahapolice.gov.in",
      description: "Maharashtra Police, Mumbai",
      category: "Other States - Police",
      image: createLogoPlaceholder("MH Police")
    }
  ];

  const categories = Array.from(new Set(links.map(link => link.category)));

  const getIconForCategory = (category: string) => {
    switch (category) {
      case "Central Agencies":
        return <Shield className="h-5 w-5 text-primary" />;
      case "Other States - CID":
        return <Shield className="h-5 w-5 text-primary" />;
      case "Telangana State":
        return <Building className="h-5 w-5 text-primary" />;
      case "Other States - Police":
        return <MapPin className="h-5 w-5 text-primary" />;
      default:
        return <ExternalLink className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />
      
      <main className="header-spacing pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12 cid-page-header rounded-2xl p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 cid-nav-text">
              Important Links
            </h1>
            <p className="text-lg text-purple-100 max-w-3xl mx-auto">
              Quick access to central agencies, state police departments, and law enforcement organizations across India
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
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {links
                    .filter(link => link.category === category)
                    .map((link, index) => (
                      <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl overflow-hidden">
                        <CardHeader className="pb-3">
                          {link.image && (
                            <div className="flex justify-center mb-3 bg-gray-50 rounded-lg p-3">
                              <img 
                                src={link.image} 
                                alt={`${link.title} logo`}
                                className="h-16 w-auto object-contain"
                              />
                            </div>
                          )}
                          <CardTitle className="text-base text-gray-900 flex items-start gap-2 leading-tight">
                            <ExternalLink className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
                            <span className="line-clamp-2">{link.title}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {link.description && (
                            <CardDescription className="text-gray-600 mb-4 text-sm line-clamp-2">
                              {link.description}
                            </CardDescription>
                          )}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium w-full justify-center"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Visit Website
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
            <Card className="bg-white shadow-lg border-0 rounded-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900 flex items-center justify-center gap-2">
                  <Shield className="h-6 w-6 text-purple-600" />
                  Contact CID Telangana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Emergency Contact</h3>
                    <p className="text-gray-600 mb-3 text-sm">For urgent matters and emergencies</p>
                    <a
                      href="tel:100"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium text-sm"
                    >
                      <Shield className="h-4 w-4" />
                      Call 100
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">CID Office</h3>
                    <p className="text-gray-600 mb-3 text-sm">Crime Investigation Department</p>
                    <div className="text-sm text-gray-700">
                      <p>3rd Floor, DGP Office</p>
                      <p>Lakdikapul, Hyderabad-004</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Online Services</h3>
                    <p className="text-gray-600 mb-3 text-sm">Digital platforms and portals</p>
                    <a
                      href="https://cybercrime.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium text-sm"
                    >
                      <Globe className="h-4 w-4" />
                      Cybercrime Portal
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