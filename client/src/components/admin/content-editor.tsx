import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bold, Italic, List, Link, Image, Save, Eye } from "lucide-react";

interface ContentEditorProps {
  title?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
  onSave: (data: {
    title: string;
    content: string;
    metaTitle: string;
    metaDescription: string;
    isPublished: boolean;
  }) => void;
  isLoading?: boolean;
}

export default function ContentEditor({
  title = "",
  content = "",
  metaTitle = "",
  metaDescription = "",
  isPublished = false,
  onSave,
  isLoading = false
}: ContentEditorProps) {
  const [formData, setFormData] = useState({
    title,
    content,
    metaTitle,
    metaDescription,
    isPublished,
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const insertText = (before: string, after: string = "") => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    const newText = beforeText + before + selectedText + after + afterText;
    setFormData(prev => ({ ...prev, content: newText }));

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Content Editor
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant={previewMode ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "Edit" : "Preview"}
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter title..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                {!previewMode && (
                  <div className="border rounded-md">
                    <div className="flex items-center space-x-2 p-2 border-b bg-gray-50">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertText("**", "**")}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertText("*", "*")}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertText("\n- ")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertText("[", "](url)")}
                      >
                        <Link className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => insertText("![alt text](", ")")}
                      >
                        <Image className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      id="content-textarea"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Enter content..."
                      className="min-h-[400px] border-0 focus:ring-0"
                    />
                  </div>
                )}

                {previewMode && (
                  <div 
                    className="min-h-[400px] p-4 border rounded-md bg-white prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderPreview(formData.content) }}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="SEO title (recommended: 50-60 characters)"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaTitle.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Brief description for search engines (recommended: 150-160 characters)"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaDescription.length}/160 characters
                </p>
              </div>

              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Search Preview</h4>
                  <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {formData.metaTitle || formData.title || "Page Title"}
                  </div>
                  <div className="text-green-700 text-sm">
                    cid.tspolice.gov.in › page-slug
                  </div>
                  <div className="text-gray-600 text-sm">
                    {formData.metaDescription || "Meta description will appear here..."}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2">Publishing options:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Published content will be visible to all website visitors</li>
                  <li>Unpublished content will only be visible to administrators</li>
                  <li>You can change this setting at any time</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </form>
  );
}
