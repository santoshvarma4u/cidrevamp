import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Image, Plus, Edit, Trash2, Upload } from "lucide-react";
import type { Photo } from "@shared/schema";

interface PhotoFormData {
  title: string;
  description: string;
  category: string;
  isPublished: boolean;
  photo?: File;
}

export default function AdminPhotos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [formData, setFormData] = useState<PhotoFormData>({
    title: "",
    description: "",
    category: "operations",
    isPublished: false,
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos = [], isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
    queryFn: () => fetch('/api/photos', { credentials: 'include' }).then(res => res.json()),
  });

  const createPhotoMutation = useMutation({
    mutationFn: async (data: PhotoFormData) => {
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('description', data.description || '');
      formDataToSend.append('category', data.category);
      formDataToSend.append('isPublished', data.isPublished.toString());
      
      if (data.photo) {
        formDataToSend.append('photo', data.photo);
      }

      const response = await fetch('/api/admin/photos', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      });

      console.log("Upload response status:", response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error("Upload error response:", error);
        throw new Error(error.message || 'Failed to create photo');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({ title: "Photo uploaded successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      console.error("Photo upload error:", error);
      toast({
        title: "Error uploading photo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePhotoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<PhotoFormData> }) => {
      const response = await fetch(`/api/admin/photos/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update photo');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({ title: "Photo updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating photo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/photos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete photo');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({ title: "Photo deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting photo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    console.log("Resetting form");
    setFormData({
      title: "",
      description: "",
      category: "operations",
      isPublished: false,
    });
    setEditingPhoto(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (editingPhoto) {
      updatePhotoMutation.mutate({ 
        id: editingPhoto.id, 
        data: {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          isPublished: formData.isPublished,
        }
      });
    } else {
      if (!formData.photo) {
        toast({
          title: "Error",
          description: "Photo file is required",
          variant: "destructive",
        });
        return;
      }
      createPhotoMutation.mutate(formData);
    }
  };

  const handleEdit = (photo: Photo) => {
    console.log("Edit button clicked for photo:", photo);
    setEditingPhoto(photo);
    setFormData({
      title: photo.title,
      description: photo.description || "",
      category: photo.category || "operations",
      isPublished: photo.isPublished || false,
    });
    setIsDialogOpen(true);
    console.log("Dialog should open now");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      deletePhotoMutation.mutate(id);
    }
  };

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (photo.description && photo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || photo.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Photo Management</h1>
          <p className="text-gray-600 mt-1">Manage photo gallery for the website</p>
          <button 
            onClick={() => console.log("TEST BUTTON CLICKED")}
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm"
          >
            Test Button (Click Me)
          </button>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gov-blue hover:bg-gov-dark-blue">
              <Plus className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" aria-describedby="dialog-description">
            <DialogHeader>
              <DialogTitle>
                {editingPhoto ? "Edit Photo" : "Add New Photo"}
              </DialogTitle>
            </DialogHeader>
            <div id="dialog-description" className="sr-only">
              {editingPhoto ? "Edit the photo details below" : "Upload a new photo and set its details"}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
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
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="awards">Awards</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!editingPhoto && (
                <div>
                  <Label htmlFor="photo">Photo File *</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, photo: file });
                      }
                    }}
                    required
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createPhotoMutation.isPending || updatePhotoMutation.isPending}
                  className="bg-gov-blue hover:bg-gov-dark-blue"
                >
                  {createPhotoMutation.isPending || updatePhotoMutation.isPending ? (
                    "Saving..."
                  ) : editingPhoto ? (
                    "Update Photo"
                  ) : (
                    "Upload Photo"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="awards">Awards</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Photos Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gov-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading photos...</p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Photos Found</h3>
            <p className="text-gray-600 mb-4">
              {photos.length === 0 ? "Get started by uploading your first photo." : "No photos match your current filters."}
            </p>
            {photos.length === 0 && (
              <Button onClick={() => setIsDialogOpen(true)} className="bg-gov-blue hover:bg-gov-dark-blue">
                <Upload className="h-4 w-4 mr-2" />
                Upload First Photo
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-200">
                <img
                  src={`/uploads/${photo.fileName}`}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                  }}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{photo.title}</h3>
                {photo.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{photo.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="capitalize">{photo.category}</span>
                  <span className={`px-2 py-1 rounded-full ${
                    photo.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {photo.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(photo)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(photo.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}