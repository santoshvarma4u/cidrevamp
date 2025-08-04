import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Video, Photo, News } from "@shared/schema";
import VideoPlayer from "@/components/media/VideoPlayer";
import PhotoGallery from "@/components/media/PhotoGallery";
import AutoScrollSlider from "@/components/common/AutoScrollSlider";
import AutoScrollNews from "@/components/common/AutoScrollNews";
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
  const [currentTheme, setCurrentTheme] = useState<Theme>("original");

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
    switch (currentTheme) {
      case "teal":
        return {
          background: "bg-gradient-to-br from-orange-50 to-amber-50",
          heroGradient: "bg-gradient-to-r from-teal-600 to-teal-700",
          cardBg: "bg-white bg-opacity-20",
          textAccent: "text-teal-200",
          sectionBg: "bg-gradient-to-br from-orange-50 to-amber-50",
        };
      case "navy":
        return {
          background: "bg-gradient-to-br from-orange-50 to-amber-50",
          heroGradient: "bg-gradient-to-r from-blue-900 to-blue-800",
          cardBg: "bg-white bg-opacity-15",
          textAccent: "text-blue-200",
          sectionBg: "bg-gradient-to-br from-orange-50 to-amber-50",
        };
      default:
        return {
          background: "bg-gray-50",
          heroGradient: "bg-gradient-to-r from-blue-600 to-blue-700",
          cardBg: "bg-white bg-opacity-10",
          textAccent: "text-blue-200",
          sectionBg: "bg-gray-50",
        };
    }
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
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* Director General Message - Updated Design */}
            <div
              className={`${themeClasses.cardBg} backdrop-blur-sm rounded-xl p-6 h-80 flex flex-col border-2 border-amber-300`}
            >
              <div className="flex gap-6 flex-1">
                {/* Director Photo */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-36 md:w-36 md:h-40 lg:w-40 lg:h-44 rounded-lg overflow-hidden bg-gray-100 shadow-lg border-2 border-white">
                    <img
                      src="/uploads/adgp-photo.png"
                      alt="Ms. Charu Sinha, IPS"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Director Info and Message */}
                <div className="flex-1 overflow-hidden">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-white mb-1">
                      Ms. Charu Sinha, IPS
                    </h3>
                    <p
                      className={`text-base font-semibold ${themeClasses.textAccent} mb-2`}
                    >
                      Addl. Director General of Police, CID, Telangana State.
                    </p>
                  </div>

                  <div
                    className={`${currentTheme === "teal" ? "text-teal-100" : currentTheme === "navy" ? "text-blue-100" : "text-blue-100"} leading-relaxed text-sm space-y-2`}
                  >
                    <p>
                      Crime Investigation Department is the premier investigation agency of Telangana State. Our endeavour is to provide transparent, impartial, efficient and systematic investigation using high end, state of the art equipment with quality forensic support in coordination with national and international agencies.
                    </p>

                    <p>
                      We follow the principle that 'men may lie but material will not'. Our staff is highly trained, motivated, sincere and hardworking to achieve our vision and mission. Our specialized wings include Economic Offences, General Offences, Child and Women Protection, Protection of Civil Rights and Cyber Crimes. We welcome any feedback from the citizens related to any crime.
                    </p>

                    <p className="text-xs italic mt-3">
                      I wish this website paves way for the public awareness about recent crimes and alerts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`${themeClasses.cardBg} backdrop-blur-sm rounded-xl p-6 h-80 flex flex-col`}
            >
              <h3 className="text-xl font-bold mb-3">Latest Video News</h3>
              <div className="flex-1 flex flex-col">
                {latestVideos.length > 0 ? (
                  <div className="w-full aspect-video max-h-52 rounded-lg bg-black mb-3 overflow-hidden">
                    <VideoPlayer
                      video={{
                        ...latestVideos[0],
                        description: latestVideos[0].description || "",
                        thumbnailPath: latestVideos[0].thumbnailPath || "",
                        duration: latestVideos[0].duration || 0,
                        category: latestVideos[0].category || "news",
                        createdAt: formatDate(latestVideos[0].createdAt),
                      }}
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video max-h-52 bg-gray-900 rounded-lg flex items-center justify-center mb-3">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-white mb-4 mx-auto" />
                      <p className="text-white">No videos available</p>
                    </div>
                  </div>
                )}

                <div className="flex-1 space-y-1 overflow-hidden">
                  {latestVideos.slice(1, 2).map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center space-x-3 p-2 bg-white bg-opacity-10 rounded-lg cursor-pointer hover:bg-opacity-20 transition"
                    >
                      <Play className="h-3 w-3 text-blue-200" />
                      <span className="text-xs truncate">{video.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
        className={`py-16 ${currentTheme === "teal" ? "bg-orange-100" : currentTheme === "navy" ? "bg-orange-100" : "bg-gray-50"}`}
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
                    <div className={`bg-${wing.color}-100 p-3 rounded-lg`}>
                      <wing.icon className={`h-6 w-6 text-${wing.color}-600`} />
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
                            <CheckCircle className="h-4 w-4 text-green-600" />
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
