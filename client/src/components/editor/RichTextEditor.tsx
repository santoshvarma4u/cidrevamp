import { useEffect, useRef, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  label?: string;
  placeholder?: string;
  height?: number;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  label = "Content",
  placeholder = "Start writing...",
  height = 300
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Dialog states
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current && !isUpdatingRef.current) {
      isUpdatingRef.current = true;
      const content = editorRef.current.innerHTML;
      onChange(content);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Important for session cookies
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.url) {
        const imgHtml = `<img src="${data.url}" alt="${imageAlt || file.name}" style="max-width: 100%; height: auto;" />`;
        document.execCommand('insertHTML', false, imgHtml);
        editorRef.current?.focus();
        handleInput();
        
        toast({
          title: "Image uploaded",
          description: "Image has been added to the content",
        });
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const insertImageFromUrl = () => {
    if (imageUrl) {
      const imgHtml = `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto;" />`;
      document.execCommand('insertHTML', false, imgHtml);
      editorRef.current?.focus();
      handleInput();
      setIsImageDialogOpen(false);
      setImageUrl('');
      setImageAlt('');
    }
  };

  const insertLink = () => {
    if (linkUrl) {
      const selectedText = window.getSelection()?.toString() || linkText;
      if (selectedText) {
        const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;
        document.execCommand('insertHTML', false, linkHtml);
      } else {
        formatText('createLink', linkUrl);
      }
      editorRef.current?.focus();
      handleInput();
      setIsLinkDialogOpen(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const insertTable = () => {
    const tableHtml = `
      <table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">
        <tr>
          <th style="padding: 8px; background-color: #f5f5f5;">Header 1</th>
          <th style="padding: 8px; background-color: #f5f5f5;">Header 2</th>
          <th style="padding: 8px; background-color: #f5f5f5;">Header 3</th>
        </tr>
        <tr>
          <td style="padding: 8px;">Cell 1</td>
          <td style="padding: 8px;">Cell 2</td>
          <td style="padding: 8px;">Cell 3</td>
        </tr>
        <tr>
          <td style="padding: 8px;">Cell 4</td>
          <td style="padding: 8px;">Cell 5</td>
          <td style="padding: 8px;">Cell 6</td>
        </tr>
      </table>
    `;
    document.execCommand('insertHTML', false, tableHtml);
    editorRef.current?.focus();
    handleInput();
  };

  const changeTextColor = (color: string) => {
    formatText('foreColor', color);
  };

  const changeBackgroundColor = (color: string) => {
    formatText('backColor', color);
  };

  return (
    <div className="space-y-2 rich-text-editor">
      {label && <Label>{label}</Label>}
      
      {/* Toolbar */}
      <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => formatText('bold')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 underline"
          title="Underline"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => formatText('strikeThrough')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200 line-through"
          title="Strikethrough"
        >
          S
        </button>
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
        {/* Text Colors */}
        <div className="flex items-center gap-1">
          <label title="Text Color" className="cursor-pointer">
            <input
              type="color"
              onChange={(e) => changeTextColor(e.target.value)}
              className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
              defaultValue="#000000"
            />
          </label>
          <label title="Background Color" className="cursor-pointer">
            <input
              type="color"
              onChange={(e) => changeBackgroundColor(e.target.value)}
              className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
              defaultValue="#ffffff"
            />
          </label>
        </div>
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
        {/* Font Size */}
        <select
          onChange={(e) => formatText('fontSize', e.target.value)}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Font Size"
          defaultValue="3"
        >
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="4">Medium</option>
          <option value="5">Large</option>
          <option value="6">X-Large</option>
          <option value="7">XX-Large</option>
        </select>
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
        {/* Headings */}
        <button
          type="button"
          onClick={() => formatText('formatBlock', 'h1')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => formatText('formatBlock', 'h2')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => formatText('formatBlock', 'h3')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => formatText('formatBlock', 'p')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Paragraph"
        >
          P
        </button>
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
        {/* Lists */}
        <button
          type="button"
          onClick={() => formatText('insertUnorderedList')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => formatText('insertOrderedList')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Numbered List"
        >
          1.
        </button>
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
        {/* Images */}
        <button
          type="button"
          onClick={() => setIsImageDialogOpen(true)}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Insert Image"
        >
          🖼️
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Upload Image"
        >
          📁
        </button>
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
        {/* Links and Tables */}
        <button
          type="button"
          onClick={() => setIsLinkDialogOpen(true)}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Insert Link"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => formatText('unlink')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Remove Link"
        >
          🔗❌
        </button>
        <button
          type="button"
          onClick={insertTable}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Insert Table"
        >
          📊
        </button>
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
        {/* Alignment */}
        <button
          type="button"
          onClick={() => formatText('justifyLeft')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Align Left"
        >
          ⬅
        </button>
        <button
          type="button"
          onClick={() => formatText('justifyCenter')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Align Center"
        >
          ↔
        </button>
        <button
          type="button"
          onClick={() => formatText('justifyRight')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Align Right"
        >
          ➡
        </button>
        <button
          type="button"
          onClick={() => formatText('justifyFull')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Justify"
        >
          ⬌
        </button>
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
        {/* Indentation */}
        <button
          type="button"
          onClick={() => formatText('indent')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Indent"
        >
          ➡️
        </button>
        <button
          type="button"
          onClick={() => formatText('outdent')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Outdent"
        >
          ⬅️
        </button>
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() => formatText('removeFormat')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Clear Formatting"
        >
          🧹
        </button>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImageUpload(file);
            }
          }}
          style={{ display: 'none' }}
        />
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="border border-gray-300 rounded-b-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        style={{ minHeight: height }}
        onInput={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
      
      <style>{`
        .rich-text-editor [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>

      {/* Image Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <DialogDescription>
              Add an image from URL to your content
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="imageAlt">Alt Text (optional)</Label>
              <Input
                id="imageAlt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Describe the image"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={insertImageFromUrl} disabled={!imageUrl}>
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>
              Add a link to your content
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="linkText">Link Text (optional)</Label>
              <Input
                id="linkText"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Leave empty to use selected text"
              />
              <p className="text-xs text-gray-500 mt-1">
                If you have text selected, it will be used as the link text
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={insertLink} disabled={!linkUrl}>
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
