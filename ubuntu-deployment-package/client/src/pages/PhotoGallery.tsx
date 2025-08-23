import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Download, Calendar, Eye } from "lucide-react";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";

interface Photo {
  id: number;
  title: string;
  description: string;
  fileName: string;
  filePath: string;
  createdAt: string;
}

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of images from CID operations, events, and activities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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

  const handleDownload = (photo: Photo) => {
    const link = document.createElement('a');
    link.href = photo.filePath;
    link.download = photo.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <ModernHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 page-content-spacing pb-8">
        {/* Header */}
        <div className="text-center mb-12 cid-page-header rounded-2xl p-8">
          <h1 className="text-4xl font-bold text-white mb-4 cid-nav-text">Photo Gallery</h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Explore our collection of images from CID operations, events, and activities
          </p>
          <div className="mt-6 flex items-center justify-center text-sm text-purple-200">
            <Eye className="h-4 w-4 mr-2" />
            {photos?.length || 0} photos available
          </div>
        </div>

        {/* Photo Grid */}
        {photos && photos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <Card 
                key={photo.id} 
                className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={photo.filePath}
                    alt={photo.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {photo.title}
                  </h3>
                  {photo.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {photo.description}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(photo.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Photos Available</h3>
            <p className="text-gray-600">
              Photos will appear here once they are published by administrators.
            </p>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          {selectedPhoto && (
            <>
              <DialogHeader className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedPhoto.title}
                    </DialogTitle>
                    {selectedPhoto.description && (
                      <p className="text-gray-600 text-sm">
                        {selectedPhoto.description}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(selectedPhoto.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleDownload(selectedPhoto)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Download"
                    >
                      <Download className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setSelectedPhoto(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </DialogHeader>
              <div className="px-6 pb-6">
                <img
                  src={selectedPhoto.filePath}
                  alt={selectedPhoto.title}
                  className="w-full max-h-[60vh] object-contain rounded-lg"
                />
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