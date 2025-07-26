import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Image Display */}
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-gray-100">
        <div className="aspect-video">
          <img
            src={`/uploads/${photos[currentIndex].fileName}`}
            alt={photos[currentIndex].title}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          
          {/* Overlay with title and description */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h3 className="text-white text-xl font-bold mb-2">
              {photos[currentIndex].title}
            </h3>
            {photos[currentIndex].description && (
              <p className="text-white/90 text-sm">
                {photos[currentIndex].description}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {/* Dot Indicators */}
      {photos.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {photos.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex 
                  ? "bg-blue-600" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Photo Counter */}
      {photos.length > 1 && (
        <div className="text-center mt-2 text-sm text-gray-600">
          {currentIndex + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}