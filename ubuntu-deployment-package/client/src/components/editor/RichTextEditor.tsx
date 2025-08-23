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
      // Set the HTML content directly so it renders properly
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
    const tableHtml = `<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;" class="editor-table"><tr><th style="padding: 8px; background-color: #f5f5f5; border: 1px solid #ddd;" contenteditable="true">Header 1</th><th style="padding: 8px; background-color: #f5f5f5; border: 1px solid #ddd;" contenteditable="true">Header 2</th><th style="padding: 8px; background-color: #f5f5f5; border: 1px solid #ddd;" contenteditable="true">Header 3</th></tr><tr><td style="padding: 8px; border: 1px solid #ddd;" contenteditable="true">Cell 1</td><td style="padding: 8px; border: 1px solid #ddd;" contenteditable="true">Cell 2</td><td style="padding: 8px; border: 1px solid #ddd;" contenteditable="true">Cell 3</td></tr><tr><td style="padding: 8px; border: 1px solid #ddd;" contenteditable="true">Cell 4</td><td style="padding: 8px; border: 1px solid #ddd;" contenteditable="true">Cell 5</td><td style="padding: 8px; border: 1px solid #ddd;" contenteditable="true">Cell 6</td></tr></table>`;
    document.execCommand('insertHTML', false, tableHtml);
    editorRef.current?.focus();
    handleInput();
  };

  const addTableRow = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let element = selection.anchorNode as Element;
      
      // Find the table element
      while (element && element.tagName !== 'TABLE') {
        element = element.parentElement!;
      }
      
      if (element && element.tagName === 'TABLE') {
        const table = element as HTMLTableElement;
        const columnCount = table.rows[0]?.cells.length || 3;
        const newRow = table.insertRow();
        
        for (let i = 0; i < columnCount; i++) {
          const cell = newRow.insertCell();
          cell.style.padding = '8px';
          cell.style.border = '1px solid #ddd';
          cell.contentEditable = 'true';
          cell.textContent = `New Cell ${i + 1}`;
        }
        
        handleInput();
        toast({
          title: "Row added",
          description: "New row has been added to the table",
        });
      } else {
        toast({
          title: "No table selected",
          description: "Please click inside a table to add rows",
          variant: "destructive",
        });
      }
    }
  };

  const addTableColumn = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let element = selection.anchorNode as Element;
      
      // Find the table element
      while (element && element.tagName !== 'TABLE') {
        element = element.parentElement!;
      }
      
      if (element && element.tagName === 'TABLE') {
        const table = element as HTMLTableElement;
        
        for (let i = 0; i < table.rows.length; i++) {
          const cell = table.rows[i].insertCell();
          cell.style.padding = '8px';
          cell.style.border = '1px solid #ddd';
          cell.contentEditable = 'true';
          
          if (i === 0 && table.rows[0].cells[0].tagName === 'TH') {
            // First row with headers
            cell.outerHTML = `<th style="padding: 8px; background-color: #f5f5f5; border: 1px solid #ddd;" contenteditable="true">New Header</th>`;
          } else {
            cell.textContent = `New Cell`;
          }
        }
        
        handleInput();
        toast({
          title: "Column added",
          description: "New column has been added to the table",
        });
      } else {
        toast({
          title: "No table selected",
          description: "Please click inside a table to add columns",
          variant: "destructive",
        });
      }
    }
  };

  const removeTableRow = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let element = selection.anchorNode as Element;
      
      // Find the row element
      while (element && element.tagName !== 'TR') {
        element = element.parentElement!;
      }
      
      if (element && element.tagName === 'TR') {
        const row = element as HTMLTableRowElement;
        const table = row.parentElement as HTMLTableElement;
        
        if (table.rows.length > 1) {
          row.remove();
          handleInput();
          toast({
            title: "Row removed",
            description: "Row has been removed from the table",
          });
        } else {
          toast({
            title: "Cannot remove row",
            description: "Table must have at least one row",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "No row selected",
          description: "Please click inside a table row to remove it",
          variant: "destructive",
        });
      }
    }
  };

  const removeTableColumn = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      let element = selection.anchorNode as Element;
      
      // Find the cell element
      while (element && element.tagName !== 'TD' && element.tagName !== 'TH') {
        element = element.parentElement!;
      }
      
      if (element && (element.tagName === 'TD' || element.tagName === 'TH')) {
        const cell = element as HTMLTableCellElement;
        const table = cell.closest('table') as HTMLTableElement;
        const cellIndex = cell.cellIndex;
        
        if (table.rows[0].cells.length > 1) {
          for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].deleteCell(cellIndex);
          }
          
          handleInput();
          toast({
            title: "Column removed",
            description: "Column has been removed from the table",
          });
        } else {
          toast({
            title: "Cannot remove column",
            description: "Table must have at least one column",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "No column selected",
          description: "Please click inside a table cell to remove the column",
          variant: "destructive",
        });
      }
    }
  };

  const insertOfficerGrid = () => {
    const gridHtml = `<div style="text-align: center; margin-bottom: 40px;"><h1 style="color: #1e40af; font-size: 2.5rem; font-weight: bold; margin-bottom: 20px;">Senior Officers</h1></div><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1200px; margin: 0 auto; padding: 20px;"><div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 30px; text-align: center; border: 1px solid #e5e7eb;"><div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; margin: 0 auto 20px; border: 4px solid #3b82f6;"><img src="https://via.placeholder.com/120x120/4f46e5/ffffff?text=OFFICER" alt="Officer Name" style="width: 100%; height: 100%; object-fit: cover;"></div><h3 style="color: #1e40af; font-weight: bold; margin-bottom: 8px; font-size: 1.1rem;">OFFICER NAME, IPS</h3><p style="color: #6b7280; margin-bottom: 4px; font-weight: 600;">Designation</p><p style="color: #6b7280; margin-bottom: 4px;">Department</p><p style="color: #6b7280; margin-bottom: 15px;">CID, Telangana</p><a href="mailto:officer@tspolice.gov.in" style="color: #3b82f6; text-decoration: none; font-size: 0.9rem;">officer@tspolice.gov.in</a></div><div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 30px; text-align: center; border: 1px solid #e5e7eb;"><div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; margin: 0 auto 20px; border: 4px solid #3b82f6;"><img src="https://via.placeholder.com/120x120/059669/ffffff?text=OFFICER" alt="Officer Name" style="width: 100%; height: 100%; object-fit: cover;"></div><h3 style="color: #1e40af; font-weight: bold; margin-bottom: 8px; font-size: 1.1rem;">OFFICER NAME, IPS</h3><p style="color: #6b7280; margin-bottom: 4px; font-weight: 600;">Designation</p><p style="color: #6b7280; margin-bottom: 4px;">Department</p><p style="color: #6b7280; margin-bottom: 15px;">CID, Telangana</p><a href="mailto:officer@tspolice.gov.in" style="color: #3b82f6; text-decoration: none; font-size: 0.9rem;">officer@tspolice.gov.in</a></div><div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 30px; text-align: center; border: 1px solid #e5e7eb;"><div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; margin: 0 auto 20px; border: 4px solid #3b82f6;"><img src="https://via.placeholder.com/120x120/dc2626/ffffff?text=OFFICER" alt="Officer Name" style="width: 100%; height: 100%; object-fit: cover;"></div><h3 style="color: #1e40af; font-weight: bold; margin-bottom: 8px; font-size: 1.1rem;">OFFICER NAME, IPS</h3><p style="color: #6b7280; margin-bottom: 4px; font-weight: 600;">Designation</p><p style="color: #6b7280; margin-bottom: 4px;">Department</p><p style="color: #6b7280; margin-bottom: 15px;">CID, Telangana</p><a href="mailto:officer@tspolice.gov.in" style="color: #3b82f6; text-decoration: none; font-size: 0.9rem;">officer@tspolice.gov.in</a></div></div>`;
    document.execCommand('insertHTML', false, gridHtml);
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
        <button
          type="button"
          onClick={addTableRow}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Add Table Row"
        >
          ➕📋
        </button>
        <button
          type="button"
          onClick={addTableColumn}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Add Table Column"
        >
          ➕📊
        </button>
        <button
          type="button"
          onClick={removeTableRow}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Remove Table Row"
        >
          ➖📋
        </button>
        <button
          type="button"
          onClick={removeTableColumn}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Remove Table Column"
        >
          ➖📊
        </button>
        <button
          type="button"
          onClick={insertOfficerGrid}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Insert Officer Grid"
        >
          👥
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
