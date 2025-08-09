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
      <section className="relative bg-gray-900 text-white min-h-screen">
        <div className="container mx-auto px-4 py-20">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              Crime Investigation Department
            </h1>
            <p className="text-xl text-gray-200 max-w-4xl mx-auto">
              Telangana State's premier law enforcement agency ensuring public safety through
              specialized investigations, advanced technology, and community engagement
            </p>
          </div>
          
          {/* Three Card Asymmetric Layout */}
          <div className="flex gap-6 min-h-[500px]">
            {/* Large Director Message Card */}
            <Card className="flex-[2] bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Users className="h-8 w-8" />
                  Director General's Message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="flex-1">
                  <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                    "The Telangana State Police is committed to maintaining law and order, preventing and detecting crime, and ensuring the safety and security of all citizens. Our Crime Investigation Department employs scientific methods, advanced technology, and dedicated personnel to deliver justice efficiently and effectively."
                  </blockquote>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-blue-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Scientific Crime Investigation</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Modern Forensic Technology</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Citizen-Centric Policing</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Specialized Investigation Wings</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-blue-200">
                  <p className="text-sm text-gray-600 font-medium">- Director General of Police, Telangana State</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Right Column - Two Stacked Cards */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Latest Videos Card - Smaller */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <Play className="h-5 w-5" />
                    Latest Videos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border border-green-200 hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-green-800 mb-2 text-sm">Cyber Crime Awareness</h4>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">
                        Watch Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* NCL Card */}
              <Card className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Shield className="h-6 w-6" />
                    NCL
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-4xl font-bold text-purple-700 mb-4">NCL</h3>
                    <p className="text-lg text-purple-600">
                      National Crime Laboratory
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Advanced forensic analysis and scientific investigation support
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