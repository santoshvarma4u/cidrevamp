import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";
import ModernHeader from "@/components/layout/ModernHeader";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, queryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import PhotoUpload from "@/components/admin/PhotoUpload";
import { 
  Image as ImageIcon, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Upload,
  FolderPlus,
  Calendar,
  Eye
} from "lucide-react";

export default function PhotoManagement() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("photos");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [isPhotoEditModalOpen, setIsPhotoEditModalOpen] = useState(false);
  const [isAlbumEditModalOpen, setIsAlbumEditModalOpen] = useState(false);
  const [isPhotoUploadModalOpen, setIsPhotoUploadModalOpen] = useState(false);
  const [isAlbumCreateModalOpen, setIsAlbumCreateModalOpen] = useState(false);

  const breadcrumbItems = [
    { label: "Admin Dashboard", href: "/admin" },
    { label: "Photo Management" }
  ];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: photos, isLoading: photosLoading, error: photosError } = useQuery({
    queryKey: ["/api/admin/photos"],
    retry: false,
  });

  const { data: albums, isLoading: albumsLoading, error: albumsError } = useQuery({
    queryKey: ["/api/admin/albums"],
    retry: false,
  });

  const updatePhotoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PUT", `/api/admin/photos/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Photo updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/photos"] });
      setIsPhotoEditModalOpen(false);
      setSelectedPhoto(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update photo",
        variant: "destructive",
      });
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/photos/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/photos"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    },
  });

  const createAlbumMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/albums", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Album created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/albums"] });
      setIsAlbumCreateModalOpen(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create album",
        variant: "destructive",
      });
    },
  });

  if (isLoading || photosLoading || albumsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if ((photosError && isUnauthorizedError(photosError)) || (albumsError && isUnauthorizedError(albumsError))) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  const isAdmin = user?.email?.endsWith('@tspolice.gov.in') || user?.email === 'admin@replit.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ModernHeader />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter photos
  const filteredPhotos = photos?.filter((photo: any) => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || photo.category === filterCategory;
    const matchesStatus = !filterStatus || 
                         (filterStatus === "published" && photo.isPublished) ||
                         (filterStatus === "draft" && !photo.isPublished);
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const categories = ["operations", "events", "training", "ceremonies", "public-awareness"];

  const handleEditPhoto = (photo: any) => {
    setSelectedPhoto(photo);
    setIsPhotoEditModalOpen(true);
  };

  const handleUpdatePhoto = (formData: any) => {
    if (selectedPhoto) {
      updatePhotoMutation.mutate({
        id: selectedPhoto.id,
        data: formData
      });
    }
  };

  const handleDeletePhoto = (id: string) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      deletePhotoMutation.mutate(id);
    }
  };

  const handleCreateAlbum = (formData: any) => {
    createAlbumMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      {/* Page Header */}
      <section className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <ImageIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gov-dark">Photo Management</h1>
                <p className="text-gov-gray">Upload, organize, and manage photo galleries</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Dialog open={isAlbumCreateModalOpen} onOpenChange={setIsAlbumCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    New Album
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Album</DialogTitle>
                  </DialogHeader>
                  <AlbumCreateForm 
                    onSubmit={handleCreateAlbum}
                    isLoading={createAlbumMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
              
              <Dialog open={isPhotoUploadModalOpen} onOpenChange={setIsPhotoUploadModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 text-white hover:bg-green-700">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photos
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Upload New Photos</DialogTitle>
                  </DialogHeader>
                  <PhotoUpload 
                    albums={albums || []}
                    onSuccess={() => setIsPhotoUploadModalOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="albums">Albums</TabsTrigger>
            </TabsList>
            
            <TabsContent value="photos" className="mt-6">
              {/* Filters and Search */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search photos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" onClick={() => {
                      setSearchTerm("");
                      setFilterCategory("");
                      setFilterStatus("");
                    }}>
                      <Filter className="mr-2 h-4 w-4" />
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Photos Grid */}
              {filteredPhotos.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos found</h3>
                    <p className="text-gray-600 mb-6">
                      {photos?.length === 0 
                        ? "Start by uploading your first photo." 
                        : "Try adjusting your search or filters."}
                    </p>
                    <Button 
                      onClick={() => setIsPhotoUploadModalOpen(true)}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Upload Photos
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredPhotos.map((photo: any) => (
                    <Card key={photo.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={photo.imageUrl} 
                          alt={photo.title}
                          className="w-full h-48 object-cover"
                        />
                        
                        <div className="absolute top-2 right-2">
                          <Badge variant={photo.isPublished ? "default" : "secondary"}>
                            {photo.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleEditPhoto(photo)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm text-gov-dark line-clamp-1">{photo.title}</h4>
                        {photo.category && (
                          <p className="text-xs text-gray-500 mt-1">
                            {photo.category.replace('-', ' ')}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(photo.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="albums" className="mt-6">
              {/* Albums Grid */}
              {!albums || albums.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FolderPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No albums found</h3>
                    <p className="text-gray-600 mb-6">Create your first photo album to organize your images.</p>
                    <Button 
                      onClick={() => setIsAlbumCreateModalOpen(true)}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      <FolderPlus className="mr-2 h-4 w-4" />
                      Create Album
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {albums.map((album: any) => (
                    <Card key={album.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        {album.coverImageUrl ? (
                          <img 
                            src={album.coverImageUrl} 
                            alt={album.name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <FolderPlus className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="absolute top-2 right-2">
                          <Badge variant={album.isPublished ? "default" : "secondary"}>
                            {album.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gov-dark mb-2">{album.name}</h3>
                        {album.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{album.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(album.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Edit Photo Modal */}
      <Dialog open={isPhotoEditModalOpen} onOpenChange={setIsPhotoEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <PhotoEditForm 
              photo={selectedPhoto}
              albums={albums || []}
              onSubmit={handleUpdatePhoto}
              isLoading={updatePhotoMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

function PhotoEditForm({ photo, albums, onSubmit, isLoading }: { 
  photo: any;
  albums: any[];
  onSubmit: (data: any) => void; 
  isLoading: boolean; 
}) {
  const [formData, setFormData] = useState({
    title: photo.title || "",
    description: photo.description || "",
    category: photo.category || "",
    albumId: photo.albumId || "",
    isPublished: photo.isPublished || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const categories = ["operations", "events", "training", "ceremonies", "public-awareness"];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <div className="w-32 h-32 flex-shrink-0">
          <img 
            src={photo.imageUrl} 
            alt={photo.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="album">Album</Label>
          <Select value={formData.albumId} onValueChange={(value) => setFormData({ ...formData, albumId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select album" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Album</SelectItem>
              {albums.map((album) => (
                <SelectItem key={album.id} value={album.id}>
                  {album.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.isPublished}
          onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
        />
        <Label htmlFor="published">Published</Label>
      </div>
      
      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Updating..." : "Update Photo"}
        </Button>
      </div>
    </form>
  );
}

function AlbumCreateForm({ onSubmit, isLoading }: { 
  onSubmit: (data: any) => void; 
  isLoading: boolean; 
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublished: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Album Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.isPublished}
          onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
        />
        <Label htmlFor="published">Published</Label>
      </div>
      
      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Creating..." : "Create Album"}
        </Button>
      </div>
    </form>
  );
}
