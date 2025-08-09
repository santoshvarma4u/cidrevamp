import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Video, Photo, News } from "@shared/schema";
import VideoPlayer from "@/components/media/VideoPlayer";
import PhotoGallery from "@/components/media/PhotoGallery";
import AutoScrollSlider from "@/components/common/AutoScrollSlider";
import AutoScrollNews from "@/components/common/AutoScrollNews";
import NewsTicker from "@/components/home/NewsTicker";
import { ThemeSelector, Theme } from "@/components/ThemeSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Phone,
  FileText,
  Search,
  Smartphone,
  ChartLine,
  Shield,
  Heart,
  Gavel,
  Users,
  TriangleAlert,
  Play,
  Images,
  Target,
  Clock,
  CheckCircle,
} from "lucide-react";

// Helper function to safely convert dates to ISO strings
const formatDate = (date: any): string => {
  if (!date) return new Date().toISOString();
  if (typeof date === "string") return date;
  return new Date(date).toISOString();
};

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("light-teal");

  const { data: videos = [] } = useQuery<Video[]>({
    queryKey: ["/api/videos", { published: true }],
  });

  const { data: photos = [] } = useQuery<Photo[]>({
    queryKey: ["/api/photos", { published: true }],
  });

  const { data: news = [] } = useQuery<News[]>({
    queryKey: ["/api/news", { published: true }],
  });

  const latestVideos = videos.slice(0, 4);
  const latestPhotos = photos.slice(0, 8);
  const latestNews = news.slice(0, 3);

  const specializedWings = [
    {
      title: "Economic Offences Wing",
      description:
        "Handles financial crimes including banking frauds, counterfeit currency, MLM schemes, and money circulation frauds.",
      icon: ChartLine,
      color: "blue",
      href: "/wings/economic-offences",
      features: [
        "FICN Nodal Agency",
        "PMLA & FEMA Reporting",
        "Banking Fraud Investigation",
      ],
    },
    {
      title: "Cyber Crimes Wing",
      description:
        "Specialized unit for cybercrime investigation, IT Act violations, video piracy, and digital forensics.",
      icon: Shield,
      color: "purple",
      href: "/wings/cyber-crimes",
      features: [
        "State-wide Jurisdiction",
        "Public Awareness Programs",
        "Training & Capacity Building",
      ],
    },
    {
      title: "Women & Child Protection",
      description:
        "Comprehensive protection services including SHE Teams, anti-trafficking unit, and NRI women safety cell.",
      icon: Heart,
      color: "pink",
      href: "/wings/women-protection",
      features: [
        "SHE Teams & SHE Bharosa",
        "Anti Human Trafficking",
        "Missing Persons Monitoring",
      ],
    },
    {
      title: "General Offences Wing",
      description:
        "Handles serious criminal investigations including murder, robbery, and complex inter-district matters.",
      icon: Gavel,
      color: "gray",
      href: "/wings/general-offences",
      features: [
        "Murder Investigations",
        "Serious Crime Cases",
        "Inter-district Coordination",
      ],
    },
  ];

  const safetyAlerts = [
    {
      title: "Cyber Security Alert",
      description:
        "Beware of fake emails asking for OTP/PIN. Never share your banking credentials with anyone.",
      priority: "HIGH PRIORITY",
      icon: Shield,
      color: "red",
    },
    {
      title: "Banking Fraud Warning",
      description:
        "Do not click on suspicious links in SMS claiming lottery wins or prize money.",
      priority: "MEDIUM PRIORITY",
      icon: TriangleAlert,
      color: "yellow",
    },
    {
      title: "Social Media Safety",
      description:
        "Be cautious about sharing personal information on social media platforms.",
      priority: "GENERAL ADVISORY",
      icon: Smartphone,
      color: "green",
    },
  ];

  // Get theme-specific classes
  const getThemeClasses = () => {
    // Use theme-aware CSS variables instead of hardcoded colors
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
      <section
        className={`relative ${themeClasses.heroGradient} text-white overflow-hidden`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1577962917302-cd874c99c7c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative container mx-auto px-4 py-20">
          {/* MULTIPLE ASYMMETRIC LAYOUT DEMOS */}
          <div className="space-y-16">
            
            {/* DEMO 1: L-SHAPE LAYOUT */}
            <div>
              <h2 className="text-3xl font-bold text-yellow-300 mb-4 text-center">DEMO 1: L-SHAPE ASYMMETRIC</h2>
              <div className="grid grid-cols-4 grid-rows-2 gap-4 h-80">
                <!-- Large card spans 2x2 -->
                <div className="col-span-2 row-span-2 bg-blue-600 border-4 border-yellow-400 rounded-xl p-4 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-xl font-bold mb-2">LARGE CARD</h3>
                    <p>Director Message (2x2 space)</p>
                  </div>
                </div>
                <!-- Top right card -->
                <div className="col-span-2 row-span-1 bg-green-600 border-4 border-orange-400 rounded-xl p-4 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-lg font-bold">CARD 2</h3>
                    <p>Video News</p>
                  </div>
                </div>
                <!-- Bottom right card -->
                <div className="col-span-2 row-span-1 bg-purple-600 border-4 border-pink-400 rounded-xl p-4 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-lg font-bold">CARD 3</h3>
                    <p>Quick Services</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DEMO 2: DIAGONAL LAYOUT */}
            <div>
              <h2 className="text-3xl font-bold text-yellow-300 mb-4 text-center">DEMO 2: DIAGONAL/STAGGERED</h2>
              <div className="grid grid-cols-6 grid-rows-3 gap-4 h-80">
                <!-- Card 1: Top left, large -->
                <div className="col-span-3 row-span-2 bg-blue-600 border-4 border-yellow-400 rounded-xl p-4 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-xl font-bold mb-2">CARD 1</h3>
                    <p>Director Message</p>
                  </div>
                </div>
                <!-- Card 2: Middle right -->
                <div className="col-span-2 row-span-1 col-start-4 row-start-1 bg-green-600 border-4 border-orange-400 rounded-xl p-4 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-lg font-bold">CARD 2</h3>
                    <p>Videos</p>
                  </div>
                </div>
                <!-- Card 3: Bottom right, offset -->
                <div className="col-span-2 row-span-1 col-start-5 row-start-3 bg-purple-600 border-4 border-pink-400 rounded-xl p-4 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-lg font-bold">CARD 3</h3>
                    <p>Services</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DEMO 3: PYRAMID LAYOUT */}
            <div>
              <h2 className="text-3xl font-bold text-yellow-300 mb-4 text-center">DEMO 3: PYRAMID/TRIANGLE</h2>
              <div className="grid grid-cols-4 grid-rows-3 gap-4 h-80">
                <!-- Card 1: Top center, wide -->
                <div className="col-span-2 row-span-1 col-start-2 bg-blue-600 border-4 border-yellow-400 rounded-xl p-4 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-lg font-bold">CARD 1</h3>
                    <p>Director</p>
                  </div>
                </div>
                <!-- Card 2: Bottom left -->
                <div className="col-span-2 row-span-2 row-start-2 bg-green-600 border-4 border-orange-400 rounded-xl p-4 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-lg font-bold">CARD 2</h3>
                    <p>Video News</p>
                  </div>
                </div>
                <!-- Card 3: Bottom right -->
                <div className="col-span-2 row-span-2 col-start-3 row-start-2 bg-purple-600 border-4 border-pink-400 rounded-xl p-4 flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-lg font-bold">CARD 3</h3>
                    <p>Quick Services</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DEMO 4: OVERLAPPING LAYOUT */}
            <div>
              <h2 className="text-3xl font-bold text-yellow-300 mb-4 text-center">DEMO 4: OVERLAPPING CARDS</h2>
              <div className="relative h-80">
                <!-- Card 1: Base layer -->
                <div className="absolute top-0 left-0 w-80 h-60 bg-blue-600 border-4 border-yellow-400 rounded-xl p-4 flex items-center justify-center z-10">
                  <div className="text-white text-center">
                    <h3 className="text-xl font-bold mb-2">CARD 1</h3>
                    <p>Director Message</p>
                  </div>
                </div>
                <!-- Card 2: Overlapping top right -->
                <div className="absolute top-8 left-64 w-64 h-48 bg-green-600 border-4 border-orange-400 rounded-xl p-4 flex items-center justify-center z-20">
                  <div className="text-white text-center">
                    <h3 className="text-lg font-bold">CARD 2</h3>
                    <p>Video News</p>
                  </div>
                </div>
                <!-- Card 3: Overlapping bottom -->
                <div className="absolute top-32 left-32 w-64 h-48 bg-purple-600 border-4 border-pink-400 rounded-xl p-4 flex items-center justify-center z-30">
                  <div className="text-white text-center">
                    <h3 className="text-lg font-bold">CARD 3</h3>
                    <p>Quick Services</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          {/* FORCE VISIBLE THIRD CARD - STANDALONE TEST */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-yellow-300 mb-6">STANDALONE THIRD CARD TEST</h2>
            <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-xl p-8 border-8 border-white shadow-2xl mx-auto max-w-md">
              <h3 className="text-2xl font-bold text-white mb-4">🔴 THIRD CARD IS HERE!</h3>
              <p className="text-white text-lg">If you can see this red card, then the issue is with the grid layout above.</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/20 p-4 rounded-lg text-center">
                  <div className="text-white font-bold">Service 1</div>
                </div>
                <div className="bg-white/20 p-4 rounded-lg text-center">
                  <div className="text-white font-bold">Service 2</div>
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
                    <div className="h-full">
                      <AutoScrollSlider photos={latestPhotos} />
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
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-200 h-96">
                {/* News Header */}
                <div className="bg-blue-800 text-white px-6 py-3">
                  <h3 className="text-lg font-bold text-center">News</h3>
                </div>

                {/* News Content */}
                <div className="p-4 h-80 overflow-hidden">
                  {latestNews.length > 0 ? (
                    <AutoScrollNews
                      newsItems={latestNews.map((newsItem, index) => ({
                        id: newsItem.id,
                        title: newsItem.title,
                        content: newsItem.content,
                        excerpt:
                          newsItem.excerpt ||
                          newsItem.content.substring(0, 200) + "...",
                        publishedAt: formatDate(
                          newsItem.publishedAt || newsItem.createdAt,
                        ),
                        borderColor:
                          index % 3 === 0
                            ? "border-orange-400"
                            : index % 3 === 1
                              ? "border-blue-400"
                              : "border-green-400",
                      }))}
                      scrollInterval={6000}
                    />
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>No news articles available at the moment.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Wings */}
      <section
        className="py-16 bg-muted/30"
      >
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
                className="border-l-4 border-l-blue-600 hover:shadow-xl transition-shadow gov-card-hover"
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

      {/* Public Safety Alerts */}
      <section className="py-16 bg-yellow-50 border-l-4 border-yellow-400">
        <div className="container mx-auto px-4">
          <div className="flex items-start space-x-4 mb-8">
            <div className="bg-yellow-400 p-3 rounded-lg">
              <TriangleAlert className="h-6 w-6 text-yellow-900" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-yellow-900 mb-2">
                Public Safety Alerts
              </h2>
              <p className="text-yellow-800">
                Stay informed about latest security threats and safety
                guidelines
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyAlerts.map((alert, index) => (
              <Card key={index} className="bg-white shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <alert.icon
                      className={`h-5 w-5 text-${alert.color === "red" ? "red" : alert.color === "yellow" ? "yellow" : "green"}-600`}
                    />
                    <h3 className="font-bold text-gray-900">{alert.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {alert.description}
                  </p>
                  <Badge
                    variant={
                      alert.color === "red"
                        ? "destructive"
                        : alert.color === "yellow"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {alert.priority}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      {latestNews.length > 0 && (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Latest News
              </h2>
              <p className="text-xl text-gray-600">
                Stay updated with recent developments and announcements
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {latestNews.map((article) => (
                <Card
                  key={article.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{article.category}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {article.createdAt
                          ? new Date(article.createdAt).toLocaleDateString()
                          : "No date"}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{article.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* Theme Selector */}
      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
      />
    </div>
  );
}
