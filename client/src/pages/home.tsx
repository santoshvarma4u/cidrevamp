import { useState, useEffect } from "react";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import NewsTicker from "@/components/home/NewsTicker";
import AutoScrollNews from "@/components/common/AutoScrollNews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import adgpImagePath from "@assets/adgpImage_1753520299812.png";
// Removed unused import
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState("purple-cyan");
  const [currentPhotoSlide, setCurrentPhotoSlide] = useState(0);

  useEffect(() => {
    localStorage.setItem("theme", currentTheme);
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  // Fetch real data
  const { data: latestVideos = [] } = useQuery({
    queryKey: ["/api/videos"],
    queryFn: () => fetch("/api/videos").then((res) => res.json()),
  });

  const { data: latestPhotos = [] } = useQuery({
    queryKey: ["/api/photos"],
    queryFn: () => fetch("/api/photos").then((res) => res.json()),
  });

  const { data: latestNews = [] } = useQuery({
    queryKey: ["/api/news"],
    queryFn: () => fetch("/api/news").then((res) => res.json()),
  });

  // Static data
  const specializedWings = [
    {
      title: "Economic Offences Wing",
      description:
        "Specialized investigation of financial crimes, fraud cases, and economic offenses",
      features: [
        "Banking fraud investigations",
        "Corporate crime analysis",
        "Money laundering detection",
      ],
      icon: CreditCard,
      href: "/economic-offences",
    },
    {
      title: "Cyber Crimes Unit",
      description:
        "Digital forensics and cybercrime investigation with cutting-edge technology",
      features: [
        "Digital evidence recovery",
        "Online fraud investigation",
        "Cyber security consulting",
      ],
      icon: Computer,
      href: "/cyber-crimes",
    },
    {
      title: "Women & Child Protection",
      description:
        "Dedicated protection services for women and children against violence and exploitation",
      features: [
        "24/7 helpline services",
        "Specialized investigation teams",
        "Victim support programs",
      ],
      icon: Heart,
      href: "/women-child-protection",
    },
    {
      title: "General Offences Wing",
      description:
        "Investigation of serious crimes with state-level ramifications and complex cases",
      features: [
        "Inter-district coordination",
        "Organized crime investigation",
        "Special operations",
      ],
      icon: Scale,
      href: "/general-offences",
    },
  ];

  const safetyAlerts = [
    {
      title: "Cybercrime Prevention",
      description:
        "Be cautious about online transactions and avoid sharing OTPs or banking details.",
      priority: "HIGH PRIORITY",
      icon: Shield,
      color: "red",
    },
    {
      title: "ATM Safety Guidelines",
      description:
        "Always cover your PIN while entering and check for suspicious devices attached to ATMs.",
      priority: "MEDIUM PRIORITY",
      icon: CreditCard,
      color: "yellow",
    },
    {
      title: "Social Media Awareness",
      description:
        "Be cautious about sharing personal information on social media platforms.",
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
      <ModernHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32">
        {/* Hero Background with Gradient - Matching Card Headers */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #672676 0%, rgba(103, 38, 118, 0.9) 50%, #020104 100%)",
          }}
        ></div>

        {/* Geometric Background Elements */}
        <div className="absolute inset-0">
          {/* Large Circular Elements */}
          <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full"></div>
          <div className="absolute top-40 right-32 w-64 h-64 bg-gradient-to-br from-cyan-400/30 to-transparent rounded-full"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-purple-300/15 to-transparent rounded-full"></div>

          {/* Simple Grid Pattern */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/30 to-transparent">
            <div className="w-full h-full bg-gradient-to-r from-purple-600/15 to-cyan-600/15"></div>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 min-h-[70vh] flex items-center">
          <div className="max-w-3xl">
            {/* Hero Content */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                Excellence in
                <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text">
                  Crime Investigation
                </span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-purple-100 mb-10 leading-relaxed max-w-2xl">
                Telangana State's premier law enforcement agency ensuring public
                safety through specialized investigations, advanced technology,
                and community engagement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className={`relative ${themeClasses.sectionBg} py-16`}>
        <div className="container mx-auto px-4">
          {/* Three Card Asymmetric Layout */}
          <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
            {/* Large Director Message Card with Photo */}
            <Card
              className={`lg:flex-[2] ${themeClasses.cardBg} main-card shadow-xl rounded-2xl`}
            >
              <CardHeader className="bg-primary text-primary-foreground rounded-t-2xl card-header-gradient">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Users className="h-8 w-8" />
                  Director General's Message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 flex-1 flex bg-white rounded-b-2xl">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* DGP Photo */}
                  <div className="flex-shrink-0">
                    <img
                      src={adgpImagePath}
                      alt="Director General of Police"
                      className="w-32 h-40 object-cover rounded-lg "
                    />
                  </div>

                  {/* Message Content */}
                  <div className="flex-1">
                    <blockquote className="text-base text-gray-800 mb-6 leading-relaxed">
                      "Crime Investigation Department is the premier
                      investigation agency of Telangana State. Our endeavour is
                      to provide transparent, impartial, efficient and
                      systematic investigation using high end, state of the art
                      equipment with quality forensic support in coordination
                      with national and international agencies. We follow the
                      principle that 'men may lie but material will not'."
                    </blockquote>
                    <div className="mt-6 pt-4">
                      <p className="text-sm text-gray-600 font-medium">
                        - Director General of Police, Telangana State
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Two Stacked Cards */}
            <div className="lg:flex-1 flex flex-col gap-6">
              {/* Latest Videos Card - Bigger */}
              <Card
                className={`flex-[2] ${themeClasses.cardBg} main-card border-2 border-gray-200 shadow-xl rounded-2xl`}
              >
                <CardHeader className="bg-primary text-primary-foreground rounded-t-2xl card-header-gradient">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Play className="h-6 w-6" />
                    Latest Videos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-white rounded-b-2xl">
                  {/* Video Player */}
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                    {latestVideos.length > 0 ? (
                      <video className="w-full h-full object-cover" controls>
                        <source
                          src={`/${latestVideos[0].filePath}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <Play className="h-16 w-16 opacity-50" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* NCL Card - Smaller */}
              <Card
                className={`${themeClasses.cardBg} main-card border-2 border-gray-200 shadow-xl rounded-2xl`}
              >
                <CardHeader className="bg-primary text-primary-foreground rounded-t-2xl card-header-gradient">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <Scale className="h-5 w-5" />
                    NCL
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex items-center justify-center bg-white rounded-b-2xl">
                  <div className="text-center">
                    <p className="text-base text-gray-800 font-medium">
                      <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vS_dO5aAJbeoGT2EnBK3dDrOae9iMCE7-hKuinw7bL-9rbWL7tETIzh9TKzds0cfHKxNUb2Rn9wD1Ep/pubhtml">
                        National Criminal Laws
                      </a>
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
              <Card
                className={`${themeClasses.cardBg} main-card border-2 border-gray-200 shadow-xl rounded-2xl h-96 flex flex-col`}
              >
                <CardHeader className="bg-primary text-primary-foreground rounded-t-2xl card-header-gradient">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <Images className="h-6 w-6" />
                    Latest Photo Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-1 min-h-0 overflow-hidden relative bg-white rounded-b-2xl">
                  {latestPhotos.length > 0 ? (
                    <div className="h-full relative">
                      {/* Photo Grid */}
                      <div className="grid grid-cols-2 gap-3 h-full p-2">
                        {latestPhotos
                          .slice(
                            currentPhotoSlide * 4,
                            currentPhotoSlide * 4 + 4,
                          )
                          .map((photo: any, index: number) => (
                            <Dialog key={photo.id}>
                              <DialogTrigger asChild>
                                <div className="aspect-square rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all">
                                  <img
                                    src={`/${photo.filePath}`}
                                    alt={photo.title || "CID Photo"}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                  />
                                </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] p-4">
                                <div className="relative">
                                  <img
                                    src={`/${photo.filePath}`}
                                    alt={photo.title || "CID Photo"}
                                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                                  />
                                  {photo.title && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 rounded-b-lg">
                                      <h3 className="text-lg font-semibold">
                                        {photo.title}
                                      </h3>
                                      {photo.description && (
                                        <p className="text-sm text-gray-200">
                                          {photo.description}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          ))}
                      </div>

                      {/* Navigation Arrows */}
                      {latestPhotos.length > 4 && (
                        <>
                          <button
                            onClick={() =>
                              setCurrentPhotoSlide((prev) =>
                                prev > 0
                                  ? prev - 1
                                  : Math.ceil(latestPhotos.length / 4) - 1,
                              )
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              setCurrentPhotoSlide((prev) =>
                                prev < Math.ceil(latestPhotos.length / 4) - 1
                                  ? prev + 1
                                  : 0,
                              )
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      {/* Slide Indicators */}
                      {latestPhotos.length > 4 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                          {Array.from({
                            length: Math.ceil(latestPhotos.length / 4),
                          }).map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentPhotoSlide(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                currentPhotoSlide === index
                                  ? "bg-blue-600"
                                  : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
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
                </CardContent>
              </Card>
            </div>

            {/* News Section */}
            <div>
              <Card
                className={`${themeClasses.cardBg} main-card border-2 border-gray-200 shadow-xl rounded-2xl h-96 flex flex-col`}
              >
                <CardHeader className="bg-primary text-primary-foreground rounded-t-2xl card-header-gradient">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <FileText className="h-6 w-6" />
                    Latest News Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-1 min-h-0 overflow-y-auto bg-white">
                  {latestNews.length > 0 ? (
                    <div className="space-y-4">
                      {latestNews.slice(0, 3).map((news: any) => (
                        <div
                          key={news.id}
                          className="border-l-4 border-blue-500 pl-4 pb-3 border-b border-gray-200 last:border-b-0"
                        >
                          <h4 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">
                            {news.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-3">
                            {news.content?.substring(0, 100)}...
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(news.publishedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
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
                </CardContent>
              </Card>
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
                className={`${themeClasses.cardBg} main-card border-2 border-gray-200 shadow-xl rounded-2xl hover:shadow-2xl transition-shadow`}
              >
                <CardHeader className="bg-primary text-primary-foreground rounded-t-2xl card-header-gradient">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <wing.icon className="h-6 w-6" />
                    {wing.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 bg-white rounded-b-2xl">
                  <div className="space-y-4">
                    <p className="text-gray-600 mb-4">{wing.description}</p>
                    <div className="space-y-2 mb-4">
                      {wing.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link href={wing.href}>
                      <Button
                        variant="link"
                        className="p-0 text-primary font-semibold hover:text-primary/80"
                      >
                        Learn More →
                      </Button>
                    </Link>
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
