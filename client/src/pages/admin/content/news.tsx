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
import AdminSidebar from "@/components/admin/Sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { News, InsertNews } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import queryClient from "@/lib/queryClient";

const newsFormSchema = z.object({
  language: z.enum(["english", "telugu"]),
  title: z.string().optional(),
  content: z.string().optional(),
  titleTelugu: z.string().optional(),
  contentTelugu: z.string().optional(),
  excerpt: z.string().optional(),
  category: z.string().default("general"),
  isPublished: z.boolean().default(false),
  isPinned: z.boolean().default(false),
}).refine((data) => {
  if (data.language === "english") {
    return !!(data.title && data.title.trim().length > 0 && data.content && data.content.trim().length > 0);
  } else {
    return !!(data.titleTelugu && data.titleTelugu.trim().length > 0 && data.contentTelugu && data.contentTelugu.trim().length > 0);
  }
}, {
  message: "Title and content are required for the selected language",
  path: ["title"],
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
      language: "english",
      title: "",
      content: "",
      titleTelugu: "",
      contentTelugu: "",
      excerpt: "",
      category: "general",
      isPublished: false,
      isPinned: false,
    },
  });

  const selectedLanguage = form.watch("language");

  const createMutation = useMutation({
    mutationFn: async (data: NewsFormData) => {
      const payload = {
        title: data.language === "english" ? (data.title || null) : null,
        content: data.language === "english" ? (data.content || null) : null,
        titleTelugu: data.language === "telugu" ? (data.titleTelugu || null) : null,
        contentTelugu: data.language === "telugu" ? (data.contentTelugu || null) : null,
        excerpt: data.excerpt || null,
        category: data.category,
        isPublished: data.isPublished,
        isPinned: data.isPinned,
        publishedAt: data.isPublished ? new Date().toISOString() : null,
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
        title: data.language === "english" ? (data.title || null) : null,
        content: data.language === "english" ? (data.content || null) : null,
        titleTelugu: data.language === "telugu" ? (data.titleTelugu || null) : null,
        contentTelugu: data.language === "telugu" ? (data.contentTelugu || null) : null,
        excerpt: data.excerpt || null,
        category: data.category,
        isPublished: data.isPublished,
        isPinned: data.isPinned,
        publishedAt: data.isPublished ? new Date().toISOString() : null,
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
    const hasTelugu = (news as any).titleTelugu || (news as any).contentTelugu;
    const language = hasTelugu ? "telugu" : "english";
    form.reset({
      language: language,
      title: news.title || "",
      content: news.content || "",
      titleTelugu: (news as any).titleTelugu || "",
      contentTelugu: (news as any).contentTelugu || "",
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
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">News Management</h1>
          <p className="text-gray-600">Manage news articles and announcements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { 
              setEditingNews(null); 
              form.reset({
                language: "english",
                title: "",
                content: "",
                titleTelugu: "",
                contentTelugu: "",
                excerpt: "",
                category: "general",
                isPublished: false,
                isPinned: false,
              }); 
            }}>
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
                <Label htmlFor="language">Language</Label>
                <Select
                  value={selectedLanguage}
                  onValueChange={(value) => {
                    form.setValue("language", value as "english" | "telugu");
                    // Clear the other language's fields when switching
                    if (value === "english") {
                      form.setValue("titleTelugu", "");
                      form.setValue("contentTelugu", "");
                    } else {
                      form.setValue("title", "");
                      form.setValue("content", "");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.language && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.language.message}
                  </p>
                )}
              </div>

              {selectedLanguage === "english" ? (
                <>
                  <div>
                    <Label htmlFor="title">Title (English) *</Label>
                    <Input
                      id="title"
                      {...form.register("title")}
                      placeholder="Enter article title in English"
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="content">Content (English) *</Label>
                    <Textarea
                      id="content"
                      {...form.register("content")}
                      placeholder="Enter article content in English"
                      rows={6}
                    />
                    {form.formState.errors.content && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.content.message}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="titleTelugu">Title (Telugu) *</Label>
                    <Input
                      id="titleTelugu"
                      {...form.register("titleTelugu")}
                      placeholder="Enter article title in Telugu"
                    />
                    {form.formState.errors.titleTelugu && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.titleTelugu.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contentTelugu">Content (Telugu) *</Label>
                    <Textarea
                      id="contentTelugu"
                      {...form.register("contentTelugu")}
                      placeholder="Enter article content in Telugu"
                      rows={6}
                    />
                    {form.formState.errors.contentTelugu && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.contentTelugu.message}
                      </p>
                    )}
                  </div>
                </>
              )}

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
          newsItems.map((news) => {
            const hasTelugu = (news as any).titleTelugu || (news as any).contentTelugu;
            const hasEnglish = news.title || news.content;
            const displayTitle = hasTelugu && !hasEnglish ? (news as any).titleTelugu : news.title;
            const displayContent = hasTelugu && !hasEnglish ? (news as any).contentTelugu : news.content;
            
            return (
              <Card key={news.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle 
                          className="text-lg"
                          style={hasTelugu && !hasEnglish ? { fontFamily: 'Noto Sans Telugu, sans-serif' } : {}}
                        >
                          {displayTitle || 'Untitled'}
                        </CardTitle>
                        {news.isPinned && <Badge variant="secondary">Pinned</Badge>}
                        <Badge className={getCategoryColor(news.category || "general")}>
                          {news.category}
                        </Badge>
                        {hasTelugu && !hasEnglish && (
                          <Badge className="bg-purple-100 text-purple-800">Telugu</Badge>
                        )}
                        {hasEnglish && (
                          <Badge className="bg-blue-100 text-blue-800">English</Badge>
                        )}
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
                  <p 
                    className="text-gray-600 line-clamp-3"
                    style={hasTelugu && !hasEnglish ? { fontFamily: 'Noto Sans Telugu, sans-serif' } : {}}
                  >
                    {news.excerpt || (displayContent ? displayContent.substring(0, 200) : 'No content')}
                    {displayContent && displayContent.length > 200 && "..."}
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
}