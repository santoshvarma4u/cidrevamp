import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { Photo } from "@shared/schema";

interface AutoScrollSliderProps {
  photos: Photo[];
  autoScrollInterval?: number;
}

export default function AutoScrollSlider({ 
  photos, 
  autoScrollInterval = 3000 
}: AutoScrollSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === photos.length - 1 ? 0 : prevIndex + 1
      );
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [photos.length, autoScrollInterval]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? photos.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === photos.length - 1 ? 0 : currentIndex + 1);
  };

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full">
      {/* Main Image Display with Modal Trigger */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-100 h-full cursor-pointer hover:opacity-95 transition-opacity">
            <div className="h-full">
              <img
                src={`/${photos[currentIndex].filePath}`}
                alt={photos[currentIndex].title}
                className="w-full h-full object-contain transition-opacity duration-500"
              />
              
              {/* Overlay with title and description */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <h3 className="text-white text-sm font-bold mb-1">
                  {photos[currentIndex].title}
                </h3>
                {photos[currentIndex].description && (
                  <p className="text-white/90 text-xs line-clamp-2">
                    {photos[currentIndex].description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <img
              src={`/${photos[currentIndex].filePath}`}
              alt={photos[currentIndex].title}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Image Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-white text-lg font-bold mb-2">
                {photos[currentIndex].title}
              </h3>
              {photos[currentIndex].description && (
                <p className="text-white/90 text-sm">
                  {photos[currentIndex].description}
                </p>
              )}
            </div>
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Navigation Arrows */}
      {photos.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-8 w-8 z-10"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white h-8 w-8 z-10"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dot Indicators */}
      {photos.length > 1 && (
        <div className="absolute top-2 right-2 flex space-x-1 z-10">
          {photos.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? "bg-white" 
                  : "bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Photo Counter */}
      {photos.length > 1 && (
        <div className="absolute top-2 left-2 text-xs text-white bg-black/30 px-2 py-1 rounded z-10">
          {currentIndex + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}