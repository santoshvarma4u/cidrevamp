import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Calendar, Clock, Eye, X, Download } from "lucide-react";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";

interface Video {
  id: number;
  title: string;
  description: string;
  fileName: string;
  filePath: string;
  createdAt: string;
}

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const { data: videos, isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Video Gallery</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Watch videos from CID operations, training sessions, and public awareness campaigns
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleDownload = (video: Video) => {
    const link = document.createElement('a');
    link.href = video.filePath;
    link.download = video.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getVideoThumbnail = (filePath: string) => {
    // For now, return a placeholder. In production, you'd generate actual video thumbnails
    return `https://via.placeholder.com/400x225/6366f1/ffffff?text=VIDEO`;
  };

  return (
    <>
      <ModernHeader />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 cid-page-header rounded-2xl p-8">
          <h1 className="text-4xl font-bold text-white mb-4 cid-nav-text">Video Gallery</h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Watch videos from CID operations, training sessions, and public awareness campaigns
          </p>
          <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
            <Play className="h-4 w-4 mr-2" />
            {videos?.length || 0} videos available
          </div>
        </div>

        {/* Video Grid */}
        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card 
                key={video.id} 
                className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-purple-100 to-purple-200">
                    <img
                      src={getVideoThumbnail(video.filePath)}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                        <Play className="h-6 w-6 text-purple-600 ml-1" />
                      </div>
                    </div>
                    {/* Duration badge - placeholder for now */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Video
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Videos Available</h3>
            <p className="text-gray-600">
              Videos will appear here once they are published by administrators.
            </p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          {selectedVideo && (
            <>
              <DialogHeader className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedVideo.title}
                    </DialogTitle>
                    {selectedVideo.description && (
                      <p className="text-gray-600 text-sm">
                        {selectedVideo.description}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(selectedVideo.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleDownload(selectedVideo)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </DialogHeader>
              <div className="px-6 pb-6">
                <video
                  src={selectedVideo.filePath}
                  controls
                  className="w-full max-h-[60vh] rounded-lg bg-black"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      </div>
      <Footer />
    </>
  );
}