import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import VideoPlayer from "@/components/media/VideoPlayer";
import PhotoGallery from "@/components/media/PhotoGallery";
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

export default function Home() {
  const { data: videos = [] } = useQuery({
    queryKey: ["/api/videos", { published: true }],
  });

  const { data: photos = [] } = useQuery({
    queryKey: ["/api/photos", { published: true }],
  });

  const { data: news = [] } = useQuery({
    queryKey: ["/api/news", { published: true }],
  });

  const latestVideos = videos.slice(0, 4);
  const latestPhotos = photos.slice(0, 8);
  const latestNews = news.slice(0, 3);

  const specializedWings = [
    {
      title: "Economic Offences Wing",
      description: "Handles financial crimes including banking frauds, counterfeit currency, MLM schemes, and money circulation frauds.",
      icon: ChartLine,
      color: "blue",
      href: "/wings/economic-offences",
      features: ["FICN Nodal Agency", "PMLA & FEMA Reporting", "Banking Fraud Investigation"],
    },
    {
      title: "Cyber Crimes Wing",
      description: "Specialized unit for cybercrime investigation, IT Act violations, video piracy, and digital forensics.",
      icon: Shield,
      color: "purple",
      href: "/wings/cyber-crimes",
      features: ["State-wide Jurisdiction", "Public Awareness Programs", "Training & Capacity Building"],
    },
    {
      title: "Women & Child Protection",
      description: "Comprehensive protection services including SHE Teams, anti-trafficking unit, and NRI women safety cell.",
      icon: Heart,
      color: "pink",
      href: "/wings/women-protection",
      features: ["SHE Teams & SHE Bharosa", "Anti Human Trafficking", "Missing Persons Monitoring"],
    },
    {
      title: "General Offences Wing",
      description: "Handles serious criminal investigations including murder, robbery, and complex inter-district matters.",
      icon: Gavel,
      color: "gray",
      href: "/wings/general-offences",
      features: ["Murder Investigations", "Serious Crime Cases", "Inter-district Coordination"],
    },
  ];

  const safetyAlerts = [
    {
      title: "Cyber Security Alert",
      description: "Beware of fake emails asking for OTP/PIN. Never share your banking credentials with anyone.",
      priority: "HIGH PRIORITY",
      icon: Shield,
      color: "red",
    },
    {
      title: "Banking Fraud Warning",
      description: "Do not click on suspicious links in SMS claiming lottery wins or prize money.",
      priority: "MEDIUM PRIORITY",
      icon: TriangleAlert,
      color: "yellow",
    },
    {
      title: "Social Media Safety",
      description: "Be cautious about sharing personal information on social media platforms.",
      priority: "GENERAL ADVISORY",
      icon: Smartphone,
      color: "green",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-black bg-opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1577962917302-cd874c99c7c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Transparent, Impartial & Efficient Investigation
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Premier investigation agency of Telangana State using high-end, state-of-the-art equipment with quality forensic support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/citizen/complaint">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    <FileText className="mr-2 h-5 w-5" />
                    Lodge Complaint
                  </Button>
                </Link>
                <Link href="/citizen/status">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    <Search className="mr-2 h-5 w-5" />
                    Check Status
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">Latest Video News</h3>
              {latestVideos.length > 0 ? (
                <VideoPlayer video={latestVideos[0]} />
              ) : (
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-16 w-16 text-white mb-4 mx-auto" />
                    <p className="text-white">No videos available</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2 mt-4">
                {latestVideos.slice(1, 3).map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center space-x-3 p-3 bg-white bg-opacity-10 rounded-lg cursor-pointer hover:bg-opacity-20 transition"
                  >
                    <Play className="h-4 w-4 text-blue-200" />
                    <span className="text-sm">{video.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-red-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition gov-card-hover">
              <div className="flex items-center space-x-4">
                <Phone className="h-8 w-8" />
                <div>
                  <h3 className="text-xl font-bold">Emergency</h3>
                  <p className="text-lg">100</p>
                  <p className="text-sm opacity-90">Press 8 for T-Safe</p>
                </div>
              </div>
            </div>

            <Link href="/citizen/complaint">
              <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition gov-card-hover cursor-pointer">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8" />
                  <div>
                    <h3 className="text-xl font-bold">Lodge Complaint</h3>
                    <p className="text-sm opacity-90">File online petition</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/citizen/status">
              <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition gov-card-hover cursor-pointer">
                <div className="flex items-center space-x-4">
                  <Search className="h-8 w-8" />
                  <div>
                    <h3 className="text-xl font-bold">Check Status</h3>
                    <p className="text-sm opacity-90">Track your complaint</p>
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition gov-card-hover cursor-pointer">
              <div className="flex items-center space-x-4">
                <Smartphone className="h-8 w-8" />
                <div>
                  <h3 className="text-xl font-bold">T-Safe App</h3>
                  <p className="text-sm opacity-90">Women safety app</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Wings */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Specialized Wings</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our specialized departments handle diverse criminal investigations with expert knowledge and advanced technology
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {specializedWings.map((wing, index) => (
              <Card key={index} className="border-l-4 border-l-blue-600 hover:shadow-xl transition-shadow gov-card-hover">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className={`bg-${wing.color}-100 p-3 rounded-lg`}>
                      <wing.icon className={`h-6 w-6 text-${wing.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{wing.title}</h3>
                      <p className="text-gray-600 mb-4">{wing.description}</p>
                      <div className="space-y-2 mb-4">
                        {wing.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Link href={wing.href}>
                        <Button variant="link" className="p-0 text-blue-600 font-semibold">
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

      {/* Photo Gallery */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h2>
            <p className="text-xl text-gray-600">Recent operations and activities by CID Telangana</p>
          </div>

          {latestPhotos.length > 0 ? (
            <>
              <PhotoGallery photos={latestPhotos} />
              <div className="text-center mt-8">
                <Link href="/media/gallery">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Images className="mr-2 h-5 w-5" />
                    View All Photos
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Images className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No photos available at the moment</p>
            </div>
          )}
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
              <h2 className="text-3xl font-bold text-yellow-900 mb-2">Public Safety Alerts</h2>
              <p className="text-yellow-800">Stay informed about latest security threats and safety guidelines</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyAlerts.map((alert, index) => (
              <Card key={index} className="bg-white shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <alert.icon className={`h-5 w-5 text-${alert.color === 'red' ? 'red' : alert.color === 'yellow' ? 'yellow' : 'green'}-600`} />
                    <h3 className="font-bold text-gray-900">{alert.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{alert.description}</p>
                  <Badge variant={alert.color === 'red' ? 'destructive' : alert.color === 'yellow' ? 'secondary' : 'outline'}>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest News</h2>
              <p className="text-xl text-gray-600">Stay updated with recent developments and announcements</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {latestNews.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{article.category}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(article.createdAt).toLocaleDateString()}
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
    </div>
  );
}
