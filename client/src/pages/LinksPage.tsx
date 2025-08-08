import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ExternalLink, Shield, Globe, Building, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import bprdLogo from "@assets/logo-bprd_1754309296617.png";
import cbiLogo from "@assets/cbi_logo-1_1754309364119.png";
import cyberDostLogo from "@assets/cyber_dost_1754309439375.jpg";
import cybercrimeLogo from "@assets/cybercrime_1754309439375.jpg";
import mhaLogo from "@assets/MinistryofHomeAffairs_1754309439374.png";
import ncbLogo from "@assets/NarcoticsControlBureau_1754309439374.jpg";
import niaLogo from "@assets/nia-logo_1754309439374.png";
import ncrbLogo from "@assets/NCRB-Logo_1754309439374.jpg";
import svpnpaLogo from "@assets/nationalpoliceacademy_logo_1754309439374.png";
import westBengalCidLogo from "@assets/WestBengalCID_1754309667445.jpg";
import jkCidLogo from "@assets/JammuandkashimirCIDLogo_1754309667445.png";
import maharastraCidLogo from "@assets/MaharastraCID_1754309667446.png";
import mizoramCidLogo from "@assets/nationalpoliceacademy_logo (1)_1754309667446.png";
import odishaCidLogo from "@assets/OrissaCID_1754309667446.png";
import telanganaStatePoliceLogo from "@assets/police_1754309846963.png";
import telanganaGovLogo from "@assets/TSLogo_1754309846963.png";
import cyberabadPoliceLogo from "@assets/HeadLogo_1754309846963.png";
import hydPoliceLogo from "@assets/hyd-police_1754309846963.png";
import bpPoliceLogo from "@assets/bp_1754310158218.jpg";
import chandigarhPoliceLogo from "@assets/chandigarh_1754310158218.jpg";
import cgPoliceLogo from "@assets/cg_1754310158218.jpg";
import hpPoliceLogo from "@assets/hp_1754310158218.jpg";
import ddpPoliceLogo from "@assets/ddp_1754310158218.png";
import gpPoliceLogo from "@assets/gp_1754310158218.jpg";
import gp2PoliceLogo from "@assets/gp2_1754310158219.jpg";
import hp2PoliceLogo from "@assets/hp2_1754310158219.jpg";
import jkPoliceLogo from "@assets/jk_1754310158219.jpg";
import jhPoliceLogo from "@assets/jh_1754310158219.jpg";
import kpPoliceLogo from "@assets/kp_1754310158219.jpg";
import kePoliceLogo from "@assets/ke_1754310158220.jpg";
import andamanPoliceLogo from "@assets/andaman_1754310318707.jpg";
import apPoliceLogo from "@assets/ap_1754310336571.jpg";
import arunachalPoliceLogo from "@assets/ap2_1754310353719.jpg";
import assamPoliceLogo from "@assets/ap3_1754310367811.jpg";
import dnhPoliceLogo from "@assets/dnhp_1754310421743.png";
import mpPoliceLogo from "@assets/mp_1754310449139.jpg";
import mahPoliceLogo from "@assets/mah_1754310460101.jpg";

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
      image: bprdLogo
    },
    {
      title: "Central Bureau of Investigation",
      url: "http://cbi.gov.in/",
      description: "Premier investigating agency of India",
      category: "Central Agencies",
      image: cbiLogo
    },
    {
      title: "@Cyber Dost 2018",
      url: "https://twitter.com/cyberdost?lang=en",
      description: "Cyber security awareness initiative",
      category: "Central Agencies",
      image: cyberDostLogo
    },
    {
      title: "Cybercrime.gov.in",
      url: "https://cybercrime.gov.in/cybercitizen/home.htm",
      description: "National cybercrime reporting portal",
      category: "Central Agencies",
      image: cybercrimeLogo
    },
    {
      title: "Ministry of Home Affairs",
      url: "https://mha.gov.in/",
      description: "Government of India, Ministry of Home Affairs",
      category: "Central Agencies",
      image: mhaLogo
    },
    {
      title: "Narcotics Control Bureau",
      url: "http://narcoticsindia.nic.in/",
      description: "Nodal drug law enforcement agency",
      category: "Central Agencies",
      image: ncbLogo
    },
    {
      title: "National Investigation Agency",
      url: "http://www.nia.gov.in/",
      description: "Counter-terrorism task force of India",
      category: "Central Agencies",
      image: niaLogo
    },
    {
      title: "National Crime Records Bureau",
      url: "http://ncrb.gov.in/",
      description: "Repository of information on crime and criminals",
      category: "Central Agencies",
      image: ncrbLogo
    },
    {
      title: "Sardar Vallabhbhai Patel National Police Academy",
      url: "http://www.svpnpa.gov.in/",
      description: "Premier police training academy",
      category: "Central Agencies",
      image: svpnpaLogo
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
      image: jkCidLogo
    },
    {
      title: "Maharashtra CID",
      url: "http://mahacid.com/",
      description: "Crime Investigation Department, Maharashtra",
      category: "Other States - CID",
      image: maharastraCidLogo
    },
    {
      title: "Mizoram CID",
      url: "https://cidcrime.mizoram.gov.in/",
      description: "Crime Investigation Department, Mizoram",
      category: "Other States - CID",
      image: mizoramCidLogo
    },
    {
      title: "Odisha CID",
      url: "http://odishapolicecidcb.gov.in/",
      description: "Crime Investigation Department, Odisha",
      category: "Other States - CID",
      image: odishaCidLogo
    },
    {
      title: "West Bengal CID",
      url: "https://cidwestbengal.gov.in/",
      description: "Crime Investigation Department, West Bengal",
      category: "Other States - CID",
      image: westBengalCidLogo
    },

    // Telangana State
    {
      title: "Cyberabad Metropolitan Police",
      url: "http://www.cyberabadpolice.gov.in/",
      description: "Cyberabad Police Commissionerate",
      category: "Telangana State",
      image: cyberabadPoliceLogo
    },
    {
      title: "Hyderabad Police",
      url: "http://www.hyderabadpolice.gov.in/",
      description: "Hyderabad City Police",
      category: "Telangana State",
      image: hydPoliceLogo
    },
    {
      title: "Telangana State Police",
      url: "http://www.tspolice.gov.in/",
      description: "Official website of Telangana State Police",
      category: "Telangana State",
      image: telanganaStatePoliceLogo
    },
    {
      title: "Telangana State Government",
      url: "http://www.telangana.gov.in/",
      description: "Official website of Government of Telangana",
      category: "Telangana State",
      image: telanganaGovLogo
    },

    // Other States - Police (Major states only for brevity)
    {
      title: "Andaman and Nicobar Islands Police",
      url: "http://www.police.andaman.gov.in",
      description: "Police Department, Port Blair",
      category: "Other States - Police",
      image: andamanPoliceLogo
    },
    {
      title: "Andhra Pradesh Police",
      url: "http://www.appolice.gov.in",
      description: "Andhra Pradesh Police, Amaravathi",
      category: "Other States - Police",
      image: apPoliceLogo
    },
    {
      title: "Arunachal Pradesh Police",
      url: "http://www.arunpol.nic.in",
      description: "Arunachal Pradesh Police, Itanagar",
      category: "Other States - Police",
      image: arunachalPoliceLogo
    },
    {
      title: "Assam Police",
      url: "http://www.assampolice.gov.in",
      description: "Assam Police, Dispur",
      category: "Other States - Police",
      image: assamPoliceLogo
    },
    {
      title: "Bihar Police",
      url: "http://www.biharpolice.bih.nic.in",
      description: "Bihar Police, Patna",
      category: "Other States - Police",
      image: bpPoliceLogo
    },
    {
      title: "Chandigarh Police",
      url: "http://chandigarhpolice.gov.in/",
      description: "Chandigarh Police",
      category: "Other States - Police",
      image: chandigarhPoliceLogo
    },
    {
      title: "Chhattisgarh Police",
      url: "http://www.cgpolice.gov.in",
      description: "Chhattisgarh Police, Raipur",
      category: "Other States - Police",
      image: cgPoliceLogo
    },
    {
      title: "Dadra and Nagar Haveli Police",
      url: "http://www.dnhpolice.gov.in",
      description: "DNH Police, Silvassa",
      category: "Other States - Police",
      image: dnhPoliceLogo
    },
    {
      title: "Daman and Diu Police",
      url: "http://www.ddpolice.gov.in",
      description: "Daman and Diu Police",
      category: "Other States - Police",
      image: ddpPoliceLogo
    },
    {
      title: "Goa Police",
      url: "https://www.goapolice.gov.in/",
      description: "Goa Police, Panaji",
      category: "Other States - Police",
      image: gpPoliceLogo
    },
    {
      title: "Gujarat Police",
      url: "https://police.gujarat.gov.in",
      description: "Gujarat Police, Gandhinagar",
      category: "Other States - Police",
      image: gp2PoliceLogo
    },
    {
      title: "Haryana Police",
      url: "http://www.haryanapoliceonline.gov.in",
      description: "Haryana Police, Chandigarh",
      category: "Other States - Police",
      image: hp2PoliceLogo
    },
    {
      title: "Himachal Pradesh Police",
      url: "http://www.citizenportal.hppolice.gov.in",
      description: "Himachal Pradesh Police, Shimla",
      category: "Other States - Police",
      image: hpPoliceLogo
    },
    {
      title: "Jammu & Kashmir Police",
      url: "http://www.jkpolice.gov.in",
      description: "J&K Police, Srinagar & Jammu",
      category: "Other States - Police",
      image: jkPoliceLogo
    },
    {
      title: "Jharkhand Police",
      url: "https://jhpolice.gov.in/",
      description: "Jharkhand Police, Ranchi",
      category: "Other States - Police",
      image: jhPoliceLogo
    },
    {
      title: "Karnataka Police",
      url: "http://www.ksp.gov.in",
      description: "Karnataka State Police, Bangalore",
      category: "Other States - Police",
      image: kpPoliceLogo
    },
    {
      title: "Kerala Police",
      url: "http://www.keralapolice.org",
      description: "Kerala Police, Thiruvananthapuram",
      category: "Other States - Police",
      image: kePoliceLogo
    },
    {
      title: "Madhya Pradesh Police",
      url: "http://www.mppolice.gov.in",
      description: "Madhya Pradesh Police, Bhopal",
      category: "Other States - Police",
      image: mpPoliceLogo
    },
    {
      title: "Maharashtra Police",
      url: "http://www.mahapolice.gov.in",
      description: "Maharashtra Police, Mumbai",
      category: "Other States - Police",
      image: mahPoliceLogo
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
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Important Links
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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
                            <ExternalLink className="h-4 w-4 text-teal-600 mt-1 flex-shrink-0" />
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
                            className="inline-flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 text-sm font-medium w-full justify-center"
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
                  <Shield className="h-6 w-6 text-teal-600" />
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
                      className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium text-sm"
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