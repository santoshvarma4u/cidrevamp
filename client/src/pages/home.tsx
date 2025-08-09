import { useState, useEffect } from "react";
import Header from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import NewsTicker from "@/components/home/NewsTicker";
import AutoScrollNews from "@/components/common/AutoScrollNews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Link } from "wouter";
import {
  Shield,
  Users,
  AlertTriangle,
  Globe,
  Computer,
  Heart,
  Scale,
  CheckCircle,
  Clock,
  Images,
  TriangleAlert,
  CreditCard,
  Smartphone,
  UserX,
  Play,
  FileText,
  Phone,
} from "lucide-react";
import adgpImagePath from "@assets/adgpImage_1753520299812.png";
// Removed unused import
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState("light-teal");

  useEffect(() => {
    localStorage.setItem("theme", currentTheme);
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  // Simplified for demo
  const latestPhotos: any[] = [];
  const latestNews: any[] = [];
  const latestVideos: any[] = [];

  // Static data
  const specializedWings = [
    {
      title: "Economic Offences Wing",
      description: "Specialized investigation of financial crimes, fraud cases, and economic offenses",
      features: ["Banking fraud investigations", "Corporate crime analysis", "Money laundering detection"],
      icon: CreditCard,
      href: "/economic-offences",
    },
    {
      title: "Cyber Crimes Unit",
      description: "Digital forensics and cybercrime investigation with cutting-edge technology",
      features: ["Digital evidence recovery", "Online fraud investigation", "Cyber security consulting"],
      icon: Computer,
      href: "/cyber-crimes",
    },
    {
      title: "Women & Child Protection",
      description: "Dedicated protection services for women and children against violence and exploitation",
      features: ["24/7 helpline services", "Specialized investigation teams", "Victim support programs"],
      icon: Heart,
      href: "/women-child-protection",
    },
    {
      title: "General Offences Wing",
      description: "Investigation of serious crimes with state-level ramifications and complex cases",
      features: ["Inter-district coordination", "Organized crime investigation", "Special operations"],
      icon: Scale,
      href: "/general-offences",
    },
  ];

  const safetyAlerts = [
    {
      title: "Cybercrime Prevention",
      description: "Be cautious about online transactions and avoid sharing OTPs or banking details.",
      priority: "HIGH PRIORITY",
      icon: Shield,
      color: "red",
    },
    {
      title: "ATM Safety Guidelines",
      description: "Always cover your PIN while entering and check for suspicious devices attached to ATMs.",
      priority: "MEDIUM PRIORITY", 
      icon: CreditCard,
      color: "yellow",
    },
    {
      title: "Social Media Awareness",
      description: "Be cautious about sharing personal information on social media platforms.",
      priority: "GENERAL ADVISORY",
      icon: Smartphone,
      color: "green",
    },
  ];

  // Get theme-specific classes
  const getThemeClasses = () => {
    return {
      background: "bg-background",
      heroGradient: "bg-primary",
      cardBg: "bg-card/80 backdrop-blur-sm",
      textAccent: "text-primary-foreground",
      sectionBg: "bg-muted/50",
    };
  };

  const themeClasses = getThemeClasses();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className={`relative ${themeClasses.sectionBg} min-h-screen pt-24`}>
        <div className="container mx-auto px-4 py-12">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Crime Investigation Department
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Telangana State's premier law enforcement agency ensuring public safety through
              specialized investigations, advanced technology, and community engagement
            </p>
          </div>
          
          {/* Three Card Asymmetric Layout */}
          <div className="flex gap-6 min-h-[500px]">
            {/* Large Director Message Card with Photo */}
            <Card className={`flex-[2] ${themeClasses.cardBg} border-2 border-gray-200 shadow-xl rounded-2xl`}>
              <CardHeader className="bg-primary text-primary-foreground rounded-t-2xl">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Users className="h-8 w-8" />
                  Director General's Message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 flex-1 flex">
                <div className="flex gap-6">
                  {/* DGP Photo */}
                  <div className="flex-shrink-0">
                    <img 
                      src={adgpImagePath} 
                      alt="Director General of Police" 
                      className="w-32 h-40 object-cover rounded-lg border-2 border-gray-300"
                    />
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1">
                    <blockquote className="text-base text-gray-800 mb-6 leading-relaxed">
                      "Crime Investigation Department is the premier investigation agency of Telangana State. Our endeavour is to provide transparent, impartial, efficient and systematic investigation using high end, state of the art equipment with quality forensic support in coordination with national and international agencies. We follow the principle that 'men may lie but material will not'. Our staff is highly trained, motivated, sincere and hardworking to achieve our vision and mission. Our specialized wings include Economic Offences, General Offences, Child and Women Protection, Protection of Civil Rights and Cyber Crimes. We welcome any feedback from the citizens related to any crime. I wish this website paves way for the public awareness about recent crimes and alerts."
                    </blockquote>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 font-medium">- Director General of Police, Telangana State</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Right Column - Two Stacked Cards */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Latest Videos Card - Bigger */}
              <Card className={`flex-[2] ${themeClasses.cardBg} border-2 border-gray-200 shadow-xl rounded-2xl`}>
                <CardHeader className="bg-primary text-primary-foreground rounded-t-2xl">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Play className="h-6 w-6" />
                    Latest Videos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Video Player */}
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                      <video 
                        className="w-full h-full object-cover"
                        controls
                        poster="/api/placeholder/400/225"
                      >
                        <source src="/api/placeholder/video" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    
                    {/* Video Info */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className={`font-semibold ${themeClasses.textAccent} mb-2`}>CID Training Programs</h4>
                      <p className="text-sm text-gray-600 mb-3">Professional development and investigation training for officers</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Watch More
                        </Button>
                        <Button size="sm" variant="outline">
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* NCL Card - Smaller */}
              <Card className={`${themeClasses.cardBg} border-2 border-gray-200 shadow-xl rounded-2xl`}>
                <CardHeader className="bg-primary text-primary-foreground rounded-t-2xl">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <Scale className="h-5 w-5" />
                    NCL
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className={`text-3xl font-bold ${themeClasses.textAccent} mb-3`}>NCL</h3>
                    <p className="text-base text-gray-800 font-medium">
                      National Criminal Laws
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Legal framework and provisions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* News Ticker */}
      <NewsTicker />

      {/* Photo Gallery & News */}
      <section className={`py-12 ${themeClasses.sectionBg}`}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Photo Gallery */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200 h-96 flex flex-col">
                <h3 className="text-xl font-bold text-blue-800 mb-3 text-center">
                  Latest Photo Gallery
                </h3>
                <div className="flex-1 min-h-0 overflow-hidden">
                  {latestPhotos.length > 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-600">Photo gallery would go here</p>
                    </div>
                  ) : (
                    <div className="text-center h-full flex items-center justify-center">
                      <div>
                        <Images className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">
                          No photos available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* News Section */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200 h-96 flex flex-col">
                <h3 className="text-xl font-bold text-blue-800 mb-3 text-center">
                  Latest News Updates
                </h3>
                <div className="flex-1 min-h-0">
                  {latestNews.length > 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-600">News updates would go here</p>
                    </div>
                  ) : (
                    <div className="text-center h-full flex items-center justify-center">
                      <div>
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">
                          No news available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Wings */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Specialized Wings
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our specialized departments handle diverse criminal investigations
              with expert knowledge and advanced technology
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {specializedWings.map((wing, index) => (
              <Card
                key={index}
                className="border-l-4 border-l-blue-600 hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <wing.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {wing.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{wing.description}</p>
                      <div className="space-y-2 mb-4">
                        {wing.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Link href={wing.href}>
                        <Button
                          variant="link"
                          className="p-0 text-blue-600 font-semibold"
                        >
                          Learn More →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Theme Selector */}
      <ThemeSelector
        currentTheme={currentTheme as any}
        onThemeChange={setCurrentTheme}
      />
    </div>
  );
}