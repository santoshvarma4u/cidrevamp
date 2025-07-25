import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Eye } from "lucide-react";

interface Photo {
  id: number;
  title?: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  categoryId?: number;
  isPublished: boolean;
  createdAt: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  className?: string;
  showSearch?: boolean;
  columns?: 2 | 3 | 4;
}

export default function PhotoGallery({ 
  photos, 
  className = "", 
  showSearch = false,
  columns = 4 
}: PhotoGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const filteredPhotos = photos.filter(photo =>
    photo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }[columns];

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Photos Available</h3>
        <p className="text-gray-600">Photos will appear here once they are uploaded and published.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {showSearch && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      <div className={`grid ${gridCols} gap-6`}>
        {filteredPhotos.map((photo) => (
          <Dialog key={photo.id}>
            <DialogTrigger asChild>
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={photo.thumbnailUrl || photo.imageUrl}
                      alt={photo.title || "Photo"}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                      <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8" />
                    </div>
                    {photo.title && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black bg-opacity-70 text-white p-2 rounded-lg">
                          <h3 className="font-semibold text-sm truncate">{photo.title}</h3>
                          {photo.createdAt && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              <span className="text-xs">
                                {new Date(photo.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <div className="relative">
                <img
                  src={photo.imageUrl}
                  alt={photo.title || "Photo"}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                {(photo.title || photo.description) && (
                  <div className="p-6 bg-white">
                    {photo.title && (
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{photo.title}</h3>
                    )}
                    {photo.description && (
                      <p className="text-gray-600 mb-4">{photo.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(photo.createdAt).toLocaleDateString()}</span>
                      </span>
                      <Badge variant="secondary">
                        {photo.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {filteredPhotos.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-600">
            No photos match your search term "{searchTerm}". Try a different keyword.
          </p>
        </div>
      )}
    </div>
  );
}
