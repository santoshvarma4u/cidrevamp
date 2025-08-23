import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, FileText, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import type { NclContent } from "@shared/schema";

// Rich text editor component (simplified for this context)
const RichTextEditor = ({ value, onChange, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => {
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onChange(e.target.value);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    const text = prompt("Enter link text:");
    if (url && text) {
      const linkHtml = `<a href="${url}" target="_blank">${text}</a>`;
      setContent(prev => prev + linkHtml);
      onChange(content + linkHtml);
    }
  };

  const insertBold = () => {
    const text = prompt("Enter text to make bold:");
    if (text) {
      const boldHtml = `<strong>${text}</strong>`;
      setContent(prev => prev + boldHtml);
      onChange(content + boldHtml);
    }
  };

  const insertParagraph = () => {
    const text = prompt("Enter paragraph text:");
    if (text) {
      const paragraphHtml = `<p>${text}</p>`;
      setContent(prev => prev + paragraphHtml);
      onChange(content + paragraphHtml);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 mb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertParagraph}
          className="text-xs"
        >
          Add Paragraph
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertBold}
          className="text-xs"
        >
          <strong>B</strong>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertLink}
          className="text-xs"
        >
          🔗 Link
        </Button>
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full min-h-[200px] p-3 border rounded-md resize-none"
        rows={10}
      />
      <div className="text-sm text-gray-500">
        Tip: You can use HTML tags like &lt;p&gt;, &lt;strong&gt;, &lt;a&gt; for formatting
      </div>
    </div>
  );
};

const NclContentForm = ({ content, onSubmit, onCancel, isLoading }: {
  content?: NclContent | null;
  onSubmit: (data: { title: string; content: string; isActive: boolean }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}) => {
  const [title, setTitle] = useState(content?.title || "National Criminal Laws (NCL) Update");
  const [contentText, setContentText] = useState(content?.content || "");
  const [isActive, setIsActive] = useState(content?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content: contentText,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="NCL content title"
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content (HTML supported)</Label>
        <RichTextEditor
          value={contentText}
          onChange={setContentText}
          placeholder="Enter NCL content with HTML formatting and links..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={isActive}
          onCheckedChange={setIsActive}
        />
        <Label htmlFor="isActive">Active (displayed on homepage)</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default function NclContentAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingContent, setEditingContent] = useState<NclContent | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: nclContents = [], isLoading } = useQuery<NclContent[]>({
    queryKey: ["/api/admin/ncl-content"],
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string; isActive: boolean }) =>
      apiRequest("/api/admin/ncl-content", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ncl-content"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "NCL content created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create NCL content",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { title: string; content: string; isActive: boolean } }) =>
      apiRequest(`/api/admin/ncl-content/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ncl-content"] });
      setIsEditDialogOpen(false);
      setEditingContent(null);
      toast({
        title: "Success",
        description: "NCL content updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update NCL content",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/admin/ncl-content/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/ncl-content"] });
      toast({
        title: "Success",
        description: "NCL content deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete NCL content",
        variant: "destructive",
      });
    },
  });

  const handleCreate = (data: { title: string; content: string; isActive: boolean }) => {
    createMutation.mutate(data);
  };

  const handleEdit = (content: NclContent) => {
    setEditingContent(content);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: { title: string; content: string; isActive: boolean }) => {
    if (editingContent) {
      updateMutation.mutate({ id: editingContent.id, data });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this NCL content?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading NCL content...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8" />
          NCL Content Management
        </h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create NCL Content</DialogTitle>
            </DialogHeader>
            <NclContentForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {nclContents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <FileText className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No NCL content found
              </h3>
              <p className="text-gray-500 text-center mb-4">
                Create your first NCL content to display on the homepage
              </p>
            </CardContent>
          </Card>
        ) : (
          nclContents.map((content) => (
            <Card key={content.id} className="w-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {content.title}
                      {content.isActive && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Active
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(content.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(content)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(content.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div
                    dangerouslySetInnerHTML={{ __html: content.content }}
                    className="text-sm text-gray-700"
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit NCL Content</DialogTitle>
          </DialogHeader>
          <NclContentForm
            content={editingContent}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingContent(null);
            }}
            isLoading={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}