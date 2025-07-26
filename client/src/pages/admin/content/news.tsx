import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { News, InsertNews } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import queryClient from "@/lib/queryClient";

const newsFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  category: z.string().default("general"),
  isPublished: z.boolean().default(false),
  isPinned: z.boolean().default(false),
});

type NewsFormData = z.infer<typeof newsFormSchema>;

export default function AdminNews() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  const { data: newsItems = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "general",
      isPublished: false,
      isPinned: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: NewsFormData) => {
      const payload = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        isPublished: data.isPublished,
        isPinned: data.isPinned,
        publishedAt: data.isPublished ? new Date() : null,
      };
      return await apiRequest("/api/news", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "News article created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: NewsFormData) => {
      if (!editingNews) throw new Error("No news item selected for editing");
      const payload = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        isPublished: data.isPublished,
        isPinned: data.isPinned,
        publishedAt: data.isPublished ? new Date() : null,
      };
      return await apiRequest(`/api/news/${editingNews.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setIsDialogOpen(false);
      setEditingNews(null);
      form.reset();
      toast({
        title: "Success",
        description: "News article updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/news/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({
        title: "Success",
        description: "News article deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: NewsFormData) => {
    if (editingNews) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (news: News) => {
    setEditingNews(news);
    form.reset({
      title: news.title,
      content: news.content,
      excerpt: news.excerpt || "",
      category: news.category || "general",
      isPublished: Boolean(news.isPublished),
      isPinned: Boolean(news.isPinned),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this news article?")) {
      deleteMutation.mutate(id);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "alerts": return "bg-red-100 text-red-800";
      case "operations": return "bg-blue-100 text-blue-800";
      case "press_release": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">News Management</h1>
          <p className="text-gray-600">Manage news articles and announcements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingNews(null); form.reset(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add News Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? "Edit News Article" : "Add News Article"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="Enter article title"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  {...form.register("content")}
                  placeholder="Enter article content"
                  rows={6}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                <Textarea
                  id="excerpt"
                  {...form.register("excerpt")}
                  placeholder="Brief summary of the article"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(value) => form.setValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="alerts">Alerts</SelectItem>
                    <SelectItem value="press_release">Press Release</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublished"
                    checked={form.watch("isPublished")}
                    onCheckedChange={(checked) => form.setValue("isPublished", checked)}
                  />
                  <Label htmlFor="isPublished">Published</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPinned"
                    checked={form.watch("isPinned")}
                    onCheckedChange={(checked) => form.setValue("isPinned", checked)}
                  />
                  <Label htmlFor="isPinned">Pinned</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingNews ? "Update" : "Create"} Article
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">Loading news articles...</div>
        ) : newsItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No news articles found</p>
            </CardContent>
          </Card>
        ) : (
          newsItems.map((news) => (
            <Card key={news.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-lg">{news.title}</CardTitle>
                      {news.isPinned && <Badge variant="secondary">Pinned</Badge>}
                      <Badge className={getCategoryColor(news.category || "general")}>
                        {news.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      {news.isPublished ? (
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>Published</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <EyeOff className="h-4 w-4" />
                          <span>Draft</span>
                        </div>
                      )}
                      <span>•</span>
                      <span>
                        {news.createdAt ? new Date(news.createdAt).toLocaleDateString() : 'No date'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(news)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(news.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">
                  {news.excerpt || news.content.substring(0, 200)}
                  {(news.excerpt || news.content).length > 200 && "..."}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}