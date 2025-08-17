import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Images,
  Video,
  Filter,
  Calendar,
  Eye,
  Play,
  Download,
  Share2,
} from "lucide-react";

export default function MediaGallery() {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const { data: photos = [] } = useQuery({
    queryKey: ["/api/photos", { published: true }],
  });

  const { data: videos = [] } = useQuery({
    queryKey: ["/api/videos", { published: true }],
  });

  const photoCategories = ["all", "operations", "events", "awards", "training", "facilities"];
  const videoCategories = ["all", "news", "operations", "awareness", "training"];

  const filteredPhotos = photos.filter((photo: any) => 
    categoryFilter === "all" || photo.category === categoryFilter
  );

  const filteredVideos = videos.filter((video: any) => 
    categoryFilter === "all" || video.category === categoryFilter
  );

  const handlePhotoClick = (photo: any) => {
    setSelectedPhoto(photo);
  };

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Images className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Media Gallery</h1>
                <p className="text-xl text-indigo-100">Photos & Videos from CID Operations</p>
              </div>
            </div>
            <p className="text-lg text-indigo-100 leading-relaxed">
              Explore our comprehensive collection of photos and videos showcasing CID operations, 
              public awareness campaigns, training programs, and significant achievements in law enforcement.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
            <Button
              variant={activeTab === "photos" ? "default" : "ghost"}
              onClick={() => setActiveTab("photos")}
              className="flex items-center space-x-2"
            >
              <Images className="h-4 w-4" />
              <span>Photos</span>
              <Badge variant="secondary">{photos.length}</Badge>
            </Button>
            <Button
              variant={activeTab === "videos" ? "default" : "ghost"}
              onClick={() => setActiveTab("videos")}
              className="flex items-center space-x-2"
            >
              <Video className="h-4 w-4" />
              <span>Videos</span>
              <Badge variant="secondary">{videos.length}</Badge>
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(activeTab === "photos" ? photoCategories : videoCategories).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        {activeTab === "photos" && (
          <div>
            {filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPhotos.map((photo: any) => (
                  <Card key={photo.id} className="group cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handlePhotoClick(photo)}>
                    <div className="aspect-square bg-gray-200 overflow-hidden rounded-t-lg">
                      <img
                        src={`/uploads/${photo.fileName}`}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 truncate">{photo.title}</h3>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {photo.category}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(photo.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Images className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Photos Found</h3>
                <p className="text-gray-600">No photos available in the selected category.</p>
              </div>
            )}
          </div>
        )}

        {/* Video Gallery */}
        {activeTab === "videos" && (
          <div>
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video: any) => (
                  <Card key={video.id} className="group cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleVideoClick(video)}>
                    <div className="aspect-video bg-gray-900 overflow-hidden rounded-t-lg relative">
                      {video.thumbnailPath ? (
                        <img
                          src={`/uploads/${video.thumbnailPath}`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:scale-110 transition-transform">
                          <Play className="h-8 w-8 text-gray-900" />
                        </div>
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 truncate">{video.title}</h3>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {video.category}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(video.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Videos Found</h3>
                <p className="text-gray-600">No videos available in the selected category.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Photo Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedPhoto && (
            <div>
              <img
                src={`/uploads/${selectedPhoto.fileName}`}
                alt={selectedPhoto.title}
                className="w-full max-h-[70vh] object-contain rounded-t-lg"
              />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedPhoto.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <Badge variant="outline">{selectedPhoto.category}</Badge>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(selectedPhoto.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                {selectedPhoto.description && (
                  <p className="text-gray-700">{selectedPhoto.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedVideo && (
            <div>
              <div className="aspect-video bg-black rounded-t-lg">
                <video
                  controls
                  className="w-full h-full"
                  src={`/uploads/${selectedVideo.fileName}`}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedVideo.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <Badge variant="outline">{selectedVideo.category}</Badge>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(selectedVideo.createdAt).toLocaleDateString()}
                      </div>
                      {selectedVideo.duration && (
                        <div>
                          Duration: {Math.floor(selectedVideo.duration / 60)}:{(selectedVideo.duration % 60).toString().padStart(2, '0')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                {selectedVideo.description && (
                  <p className="text-gray-700">{selectedVideo.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
