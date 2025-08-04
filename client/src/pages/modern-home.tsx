import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import type { Video, Photo, News } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Shield,
  Heart,
  Gavel,
  ChartLine,
  Users,
  Phone,
  FileText,
  CheckCircle,
  Play,
  Images,
  Clock,
  ArrowRight,
} from "lucide-react";
import VideoPlayer from "@/components/media/VideoPlayer";
import AutoScrollNews from "@/components/common/AutoScrollNews";

// Helper function to safely convert dates to ISO strings
const formatDate = (date: any): string => {
  if (!date) return new Date().toISOString();
  if (typeof date === "string") return date;
  return new Date(date).toISOString();
};

export default function ModernHome() {
  const { data: videos = [] } = useQuery<Video[]>({
    queryKey: ["/api/videos", { published: true }],
  });

  const { data: photos = [] } = useQuery<Photo[]>({
    queryKey: ["/api/photos", { published: true }],
  });

  const { data: news = [] } = useQuery<News[]>({
    queryKey: ["/api/news", { published: true }],
  });

  const latestVideos = videos.slice(0, 3);
  const latestPhotos = photos.slice(0, 6);
  const latestNews = news.slice(0, 3);

  // Theme classes for consistent styling
  const themeClasses = {
    cardBg: "bg-white/90 dark:bg-gray-800/90",
  };

  const specializedWings = [
    {
      title: "Economic Offences Wing",
      description:
        "Handles financial crimes including banking frauds, counterfeit currency, MLM schemes, and money circulation frauds.",
      icon: ChartLine,
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
      href: "/wings/general-offences",
      features: [
        "Murder Investigations",
        "Serious Crime Cases",
        "Inter-district Coordination",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Director General and Latest Video Section */}
      <section className="mt-60 pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Director General Message - Updated Design */}
            <div
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 h-full flex flex-col border-2 border-amber-300"
            >
              <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="relative flex-shrink-0 mx-auto lg:mx-0">
                  <img
                    src="/uploads/officers/charu-sinha-adgp.jpeg"
                    alt="Ms. Charu Sinha, IPS"
                    className="w-40 h-48 object-cover rounded-xl shadow-xl border-4 border-white"
                    data-testid="director-photo"
                  />
                  <div className="absolute -bottom-3 -right-3 bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-card-foreground mb-2">
                    Ms. Charu Sinha, IPS
                  </h3>
                  <p className="text-primary font-bold mb-4 text-lg">
                    Additional Director General of Police, CID
                  </p>
                  <div className="bg-muted/20 rounded-lg p-4">
                    <p className="text-card-foreground leading-relaxed">
                      "Crime Investigation Department is the premier investigation
                      agency of Telangana State. Our endeavour is to provide
                      transparent, impartial, efficient and systematic
                      investigation using state-of-the-art equipment with quality 
                      forensic support in coordination with national and international agencies.
                      We follow the principle that 'men may lie but material will not'."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Video */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 h-full flex flex-col border-2 border-teal-300">
              <h2 className="text-2xl font-bold text-card-foreground mb-6">
                Latest Video News
              </h2>
              <div className="flex-1">
                {latestVideos.length > 0 ? (
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
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
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-gray-400 mb-4 mx-auto" />
                      <p className="text-gray-500">No videos available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling News Section - Mandatory */}
      {latestNews.length > 0 && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="section-container">
              <h2 className="text-2xl font-bold text-card-foreground mb-6 text-center">
                Latest News Updates
              </h2>
              <div className="bg-muted/30 rounded-lg p-4">
                <AutoScrollNews
                  newsItems={latestNews.map((article) => ({
                    id: article.id,
                    title: article.title,
                    content: article.content,
                    excerpt: article.excerpt || "",
                    publishedAt: formatDate(article.createdAt),
                    borderColor: "border-primary",
                  }))}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CID Structure Section */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="section-container">
            <h2 className="text-3xl font-bold text-card-foreground mb-8 text-center">
              This is our CID Structure
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-4xl mx-auto">
              CID is a comprehensive investigation agency comprising multiple
              specialized wings. It is primarily the investigation departments
              and administrative units that handle different types of crimes.
              These departments work together to ensure effective law
              enforcement across Telangana State.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {specializedWings.map((wing, index) => (
                <div
                  key={index}
                  className="interactive-element modern-card p-6"
                >
                  <div className="text-center">
                    <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <wing.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-3">
                      {wing.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {wing.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      {wing.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-primary mr-2 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link href={wing.href}>
                      <Button className="modern-button w-full">
                        Learn More <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Videos Section */}
      {latestVideos.length > 0 && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="section-container">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-card-foreground">
                  Latest Videos
                </h2>
                <Link href="/video-gallery">
                  <Button variant="outline" className="flex items-center">
                    <Play className="h-4 w-4 mr-2" />
                    View All Videos
                  </Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestVideos.map((video) => (
                  <div key={video.id} className="modern-card overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      {video.thumbnailPath ? (
                        <img
                          src={`/api/uploads/${video.thumbnailPath}`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-card-foreground mb-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {video.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Photo Gallery Section */}
      {latestPhotos.length > 0 && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="section-container">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-card-foreground">
                  Photo Gallery
                </h2>
                <Link href="/photo-gallery">
                  <Button variant="outline" className="flex items-center">
                    <Images className="h-4 w-4 mr-2" />
                    View All Photos
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {latestPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="modern-card overflow-hidden aspect-square"
                  >
                    <img
                      src={`/${photo.filePath}`}
                      alt={photo.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Citizen Services Section */}
      {/* <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="section-container">
            <h2 className="text-3xl font-bold text-card-foreground mb-8 text-center">
              Citizen Services
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Link href="/citizen/complaint">
                <div className="interactive-element modern-card p-8 text-center">
                  <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">
                    File a Complaint
                  </h3>
                  <p className="text-muted-foreground">
                    Submit your complaint online and track its status through our secure portal.
                  </p>
                </div>
              </Link>
              <Link href="/citizen/status">
                <div className="interactive-element modern-card p-8 text-center">
                  <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">
                    Track Complaint Status
                  </h3>
                  <p className="text-muted-foreground">
                    Check the current status of your complaint using your reference number.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
 */}
      <Footer />
    </div>
  );
}
