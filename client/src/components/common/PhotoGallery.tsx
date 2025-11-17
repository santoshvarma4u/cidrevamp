import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Calendar, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Share2,
  X,
  ZoomIn,
} from "lucide-react";

interface Photo {
  id: number;
  title: string;
  description?: string;
  fileName: string;
  filePath: string;
  category?: string;
  createdAt: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  columns?: number;
  showTitle?: boolean;
  showCategory?: boolean;
  showDate?: boolean;
  className?: string;
}

export default function PhotoGallery({ 
  photos, 
  columns = 4,
  showTitle = true,
  showCategory = true,
  showDate = true,
  className = "" 
}: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
    }
  };

  const goToNext = () => {
    if (currentIndex < photos.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedPhoto(photos[newIndex]);
    }
  };

  const getGridColumns = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 5: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <Eye className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Photos Available</h3>
        <p className="text-gray-600">Photos will appear here when they are uploaded.</p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid ${getGridColumns()} gap-6 ${className}`}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group cursor-pointer"
            onClick={() => openLightbox(photo, index)}
          >
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src={`/uploads/images/${photo.fileName}`}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Category Badge */}
              {showCategory && photo.category && (
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    {photo.category}
                  </Badge>
                </div>
              )}
            </div>

            {/* Photo Info */}
            {(showTitle || showDate) && (
              <div className="mt-3">
                {showTitle && (
                  <h4 className="font-medium text-gray-900 truncate mb-1">
                    {photo.title}
                  </h4>
                )}
                {showDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(photo.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedPhoto} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-6xl max-h-[95vh] p-0 bg-black">
          {selectedPhoto && (
            <div className="relative h-full">
              {/* Close Button */}
              <Button
                onClick={closeLightbox}
                size="sm"
                variant="ghost"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Navigation Buttons */}
              {currentIndex > 0 && (
                <Button
                  onClick={goToPrevious}
                  size="sm"
                  variant="ghost"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}

              {currentIndex < photos.length - 1 && (
                <Button
                  onClick={goToNext}
                  size="sm"
                  variant="ghost"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}

              {/* Image */}
              <div className="flex items-center justify-center h-[80vh]">
                <img
                  src={`/uploads/images/${selectedPhoto.fileName}`}
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Photo Details */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{selectedPhoto.title}</h2>
                    {selectedPhoto.description && (
                      <p className="text-gray-200 mb-3">{selectedPhoto.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                      {selectedPhoto.category && (
                        <Badge variant="secondary">{selectedPhoto.category}</Badge>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(selectedPhoto.createdAt).toLocaleDateString()}
                      </div>
                      <span>{currentIndex + 1} of {photos.length}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}