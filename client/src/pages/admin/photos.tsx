import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/admin/file-upload";
import PhotoGallery from "@/components/common/photo-gallery";
import {
  Image,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  Folder,
  Upload,
} from "lucide-react";

const photoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Valid image URL is required"),
  thumbnailUrl: z.string().url().optional(),
  categoryId: z.number().optional(),
  isPublished: z.boolean().default(false),
});

type PhotoFormData = z.infer<typeof photoSchema>;

export default function AdminPhotos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos, isLoading } = useQuery({
    queryKey: ["/api/photos"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/photo-categories"],
  });

  const form = useForm<PhotoFormData>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      thumbnailUrl: "",
      isPublished: false,
    },
  });

  const createPhotoMutation = useMutation({
    mutationFn: async (data: PhotoFormData) => {
      const response = await apiRequest("POST", "/api/photos", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({ title: "Photo added successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error adding photo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePhotoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<PhotoFormData> }) => {
      const response = await apiRequest("PUT", `/api/photos/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({ title: "Photo updated successfully" });
      setIsDialogOpen(false);
      setEditingPhoto(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error updating photo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/photos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({ title: "Photo deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error deleting photo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: PhotoFormData) => {
    if (editingPhoto) {
      updatePhotoMutation.mutate({ id: editingPhoto.id, data });
    } else {
      createPhotoMutation.mutate(data);
    }
  };

  const handleEdit = (photo: any) => {
    setEditingPhoto(photo);
    form.reset({
      title: photo.title || "",
      description: photo.description || "",
      imageUrl: photo.imageUrl,
      thumbnailUrl: photo.thumbnailUrl || "",
      categoryId: photo.categoryId || undefined,
      isPublished: photo.isPublished,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      deletePhotoMutation.mutate(id);
    }
  };

  const handleImageUpload = (url: string) => {
    form.setValue("imageUrl", url);
    // Generate thumbnail URL (in real app, this would be handled by the server)
    form.setValue("thumbnailUrl", url);
  };

  const openNewDialog = () => {
    setEditingPhoto(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const filteredPhotos = photos?.filter((photo: any) => {
    const matchesSearch = photo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ||
                         (statusFilter === "published" && photo.isPublished) ||
                         (statusFilter === "draft" && !photo.isPublished);
    const matchesCategory = categoryFilter === "all" || photo.categoryId?.toString() === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Photo Management</h1>
          <p className="text-gray-600">Manage photo galleries and image collections</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Photos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPhoto ? "Edit Photo" : "Add New Photo"}
                </DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div>
                    <Label>Image File</Label>
                    <FileUpload
                      onUpload={handleImageUpload}
                      accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] }}
                      className="mt-2"
                    />
                    {form.watch("imageUrl") && (
                      <div className="mt-4">
                        <img
                          src={form.watch("imageUrl")}
                          alt="Preview"
                          className="w-full max-w-md h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter photo title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter photo description..." 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category: any) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Published</FormLabel>
                          <div className="text-sm text-gray-600">
                            Make this photo visible to the public
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createPhotoMutation.isPending || updatePhotoMutation.isPending}
                    >
                      {createPhotoMutation.isPending || updatePhotoMutation.isPending ? "Saving..." : "Save Photo"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Photos</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Photos Grid/List */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPhotos && filteredPhotos.length > 0 ? (
        <div className="space-y-6">
          {/* Admin Actions for each photo */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo: any) => (
              <Card key={photo.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={photo.thumbnailUrl || photo.imageUrl}
                    alt={photo.title || "Photo"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={photo.isPublished ? "default" : "secondary"}>
                      {photo.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(photo)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(photo.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {photo.title || "Untitled"}
                  </h3>
                  
                  {photo.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {photo.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(photo.createdAt).toLocaleDateString()}</span>
                    </div>
                    {photo.categoryId && (
                      <div className="flex items-center space-x-1">
                        <Folder className="h-3 w-3" />
                        <span>
                          {categories?.find((cat: any) => cat.id === photo.categoryId)?.name || "Uncategorized"}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Photos Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "No photos match your current filters."
                : "Start by uploading your first photo."
              }
            </p>
            <Button onClick={openNewDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Photo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
