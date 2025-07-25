import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Download, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Photo } from "@shared/schema";

interface PhotoGalleryProps {
  photos: Photo[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export default function PhotoGallery({ photos, className = "", columns = 4 }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    const nextIndex = (currentIndex + 1) % photos.length;
    setCurrentIndex(nextIndex);
    setSelectedPhoto(photos[nextIndex]);
  };

  const prevPhoto = () => {
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setCurrentIndex(prevIndex);
    setSelectedPhoto(photos[prevIndex]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  };

  // Add keyboard event listeners
  if (selectedPhoto) {
    document.addEventListener('keydown', handleKeyDown);
  } else {
    document.removeEventListener('keydown', handleKeyDown);
  }

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <>
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6 ${className}`}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="photo-item cursor-pointer group"
            onClick={() => openLightbox(photo, index)}
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <ZoomIn className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-semibold text-sm">{photo.title}</h3>
                {photo.description && (
                  <p className="text-white text-xs opacity-90 mt-1 line-clamp-2">
                    {photo.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl mx-auto">
            {/* Close button */}
            <Button
              onClick={closeLightbox}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation buttons */}
            {photos.length > 1 && (
              <>
                <Button
                  onClick={prevPhoto}
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  onClick={nextPhoto}
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Image */}
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />

            {/* Image info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-white text-xl font-bold">{selectedPhoto.title}</h2>
                  {selectedPhoto.description && (
                    <p className="text-white text-sm opacity-90 mt-2">
                      {selectedPhoto.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 mt-3 text-white text-sm opacity-80">
                    {selectedPhoto.category && (
                      <span className="bg-gov-blue px-2 py-1 rounded text-xs">
                        {selectedPhoto.category}
                      </span>
                    )}
                    <span>{currentIndex + 1} of {photos.length}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20 ml-4"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedPhoto.imageUrl;
                    link.download = selectedPhoto.title;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
