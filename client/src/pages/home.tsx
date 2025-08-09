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
          {/* BASIC VISIBILITY TEST */}
          <div style={{ marginBottom: '64px', padding: '32px', backgroundColor: '#ffffff', color: '#000000', borderRadius: '8px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#dc2626', marginBottom: '32px', textAlign: 'center', backgroundColor: '#ffffff', padding: '16px', border: '4px solid #000000' }}>
              🚨 VISIBILITY TEST - CAN YOU SEE THIS? 🚨
            </h1>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <div style={{ width: '200px', height: '100px', backgroundColor: '#dc2626', color: '#ffffff', padding: '16px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px', border: '4px solid #000000' }}>
                RED BOX 1
              </div>
              <div style={{ width: '200px', height: '100px', backgroundColor: '#16a34a', color: '#ffffff', padding: '16px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px', border: '4px solid #000000' }}>
                GREEN BOX 2
              </div>
              <div style={{ width: '200px', height: '100px', backgroundColor: '#2563eb', color: '#ffffff', padding: '16px', textAlign: 'center', fontWeight: 'bold', fontSize: '20px', border: '4px solid #000000' }}>
                BLUE BOX 3
              </div>
            </div>
          </div>
          
          {/* THREE CARD LAYOUT - SIMPLE FLEXBOX APPROACH */}
          <div style={{ marginBottom: '64px', padding: '32px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#000000', marginBottom: '32px', textAlign: 'center', backgroundColor: '#fbbf24', padding: '16px', border: '4px solid #000000' }}>
              THREE CARD ASYMMETRIC LAYOUT
            </h2>
            <div style={{ display: 'flex', gap: '16px', height: '400px', border: '2px solid #000000', padding: '16px' }}>
              {/* Large card - takes up more space */}
              <div style={{ flex: '2', backgroundColor: '#2563eb', border: '4px solid #fbbf24', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'white', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>🔵 CARD 1</h3>
                  <p style={{ fontSize: '16px' }}>Director Message</p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>(Large - Double Width)</p>
                </div>
              </div>
              
              {/* Right column with two stacked cards */}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Top right card */}
                <div style={{ flex: '1', backgroundColor: '#16a34a', border: '4px solid #fb923c', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ color: 'white', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>🟢 CARD 2</h3>
                    <p>Video News</p>
                  </div>
                </div>
                
                {/* Bottom right card */}
                <div style={{ flex: '1', backgroundColor: '#9333ea', border: '4px solid #f472b6', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ color: 'white', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>🟣 CARD 3</h3>
                    <p>Quick Services</p>
                  </div>
                </div>
              </div>
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