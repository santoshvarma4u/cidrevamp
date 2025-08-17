import { Link } from "wouter";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import VideoPlayer from "@/components/common/VideoPlayer";
import PhotoGallery from "@/components/common/PhotoGallery";
import { useQuery } from "@tanstack/react-query";
import type { Video, Photo } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Phone, FileText, Search, Smartphone, Play, ChevronRight, TriangleAlert, ChartLine, Users, Gavel, Heart } from "lucide-react";

export default function Landing() {
  const { data: videos = [] } = useQuery<Video[]>({
    queryKey: ["/api/videos", { published: true }],
  });

  const { data: photos = [] } = useQuery<Photo[]>({
    queryKey: ["/api/photos", { published: true }],
  });

  const { data: safetyAlerts = [] } = useQuery<any[]>({
    queryKey: ["/api/news", { published: true }],
  });

  const featuredVideos = videos?.slice(0, 3) || [];
  const featuredPhotos = photos?.slice(0, 8) || [];
  const activeAlerts = safetyAlerts?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gov-blue to-gov-light-blue text-white">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div 
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          className="absolute inset-0"
        ></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Transparent, Impartial & Efficient Investigation
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Premier investigation agency of Telangana State using high-end, state-of-the-art equipment with quality forensic support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/citizen-services/lodge-complaint">
                  <Button className="bg-white text-gov-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                    <FileText className="mr-2 h-5 w-5" />
                    Lodge Complaint
                  </Button>
                </Link>
                <Link href="/citizen-services/check-status">
                  <Button variant="outline" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gov-blue transition">
                    <Search className="mr-2 h-5 w-5" />
                    Check Status
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">Latest Video News</h3>
              {featuredVideos.length > 0 ? (
                <div className="space-y-4">
                  <VideoPlayer video={featuredVideos[0]} />
                  <div className="space-y-2">
                    {featuredVideos.slice(1).map((video) => (
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
              ) : (
                <div className="bg-black rounded-lg overflow-hidden mb-4">
                  <div className="aspect-video bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-white mb-4 mx-auto" />
                      <p className="text-white">No videos available</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-emergency text-white shadow-lg hover:shadow-xl transition cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Phone className="h-8 w-8" />
                  <div>
                    <h3 className="text-xl font-bold">Emergency</h3>
                    <p className="text-lg">100</p>
                    <p className="text-sm opacity-90">Press 8 for T-Safe</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Link href="/citizen-services/lodge-complaint">
              <Card className="bg-gov-blue text-white shadow-lg hover:shadow-xl transition cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8" />
                    <div>
                      <h3 className="text-xl font-bold">Lodge Complaint</h3>
                      <p className="text-sm opacity-90">File online petition</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/citizen-services/check-status">
              <Card className="bg-success text-white shadow-lg hover:shadow-xl transition cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Search className="h-8 w-8" />
                    <div>
                      <h3 className="text-xl font-bold">Check Status</h3>
                      <p className="text-sm opacity-90">Track your complaint</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Card className="bg-gov-dark text-white shadow-lg hover:shadow-xl transition cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Smartphone className="h-8 w-8" />
                  <div>
                    <h3 className="text-xl font-bold">T-Safe App</h3>
                    <p className="text-sm opacity-90">Women safety app</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Specialized Wings */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gov-dark mb-4">Specialized Wings</h2>
            <p className="text-xl text-gov-gray max-w-3xl mx-auto">
              Our specialized departments handle diverse criminal investigations with expert knowledge and advanced technology
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <ChartLine className="h-8 w-8 text-gov-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gov-dark mb-3">Economic Offences Wing</h3>
                    <p className="text-gov-gray mb-4">
                      Handles financial crimes including banking frauds, counterfeit currency, MLM schemes, and money circulation frauds.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">FICN Nodal Agency</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">PMLA & FEMA Reporting</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">Banking Fraud Investigation</span>
                      </div>
                    </div>
                    <Link href="/specialized-wings/economic-offences">
                      <Button variant="ghost" className="text-gov-blue font-semibold hover:text-blue-700 p-0">
                        Learn More <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gov-dark mb-3">Cyber Crimes Wing</h3>
                    <p className="text-gov-gray mb-4">
                      Specialized unit for cybercrime investigation, IT Act violations, video piracy, and digital forensics.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">State-wide Jurisdiction</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">Public Awareness Programs</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">Training & Capacity Building</span>
                      </div>
                    </div>
                    <Link href="/specialized-wings/cyber-crimes">
                      <Button variant="ghost" className="text-gov-blue font-semibold hover:text-blue-700 p-0">
                        Learn More <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <Heart className="h-8 w-8 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gov-dark mb-3">Women & Child Protection</h3>
                    <p className="text-gov-gray mb-4">
                      Comprehensive protection services including SHE Teams, anti-trafficking unit, and NRI women safety cell.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">SHE Teams & SHE Bharosa</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">Anti Human Trafficking</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">Missing Persons Monitoring</span>
                      </div>
                    </div>
                    <Link href="/specialized-wings/women-protection">
                      <Button variant="ghost" className="text-gov-blue font-semibold hover:text-blue-700 p-0">
                        Learn More <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <Gavel className="h-8 w-8 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gov-dark mb-3">General Offences Wing</h3>
                    <p className="text-gov-gray mb-4">
                      Handles serious criminal investigations including murder, robbery, and complex inter-district matters.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">Murder Investigations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">Serious Crime Cases</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">Inter-district Coordination</span>
                      </div>
                    </div>
                    <Link href="/specialized-wings/general-offences">
                      <Button variant="ghost" className="text-gov-blue font-semibold hover:text-blue-700 p-0">
                        Learn More <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      {featuredPhotos.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gov-dark mb-4">Photo Gallery</h2>
              <p className="text-xl text-gov-gray">Recent operations and activities by CID Telangana</p>
            </div>
            
            <PhotoGallery photos={featuredPhotos} />
            
            <div className="text-center mt-8">
              <Link href="/media/photos">
                <Button className="bg-gov-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  View All Photos <Users className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Public Safety Alerts */}
      {activeAlerts.length > 0 && (
        <section className="py-16 bg-yellow-50 border-l-4 border-yellow-400">
          <div className="container mx-auto px-4">
            <div className="flex items-start space-x-4 mb-8">
              <div className="bg-yellow-400 p-3 rounded-lg">
                <TriangleAlert className="h-8 w-8 text-yellow-900" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-yellow-900 mb-2">Public Safety Alerts</h2>
                <p className="text-yellow-800">Stay informed about latest security threats and safety guidelines</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className="bg-white shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="h-5 w-5 text-emergency" />
                      <h3 className="font-bold text-gov-dark">{alert.title}</h3>
                    </div>
                    <p className="text-gov-gray text-sm mb-4">{alert.content}</p>
                    <span className={`text-xs font-semibold ${
                      alert.priority === 'high' || alert.priority === 'critical' 
                        ? 'text-emergency' 
                        : alert.priority === 'medium' 
                        ? 'text-yellow-600' 
                        : 'text-success'
                    }`}>
                      {alert.priority?.toUpperCase()} PRIORITY
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Login prompt for admin access */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gov-dark mb-4">Admin Access</h2>
          <p className="text-xl text-gov-gray mb-8">
            Access the comprehensive content management system for authorized personnel
          </p>
          <Button asChild className="bg-gov-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            <a href="/api/login">
              <Users className="mr-2 h-5 w-5" />
              Admin Login
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
