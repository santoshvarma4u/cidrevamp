import { useEffect, useRef } from 'react';
import { Label } from "@/components/ui/label";

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

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      formatText('createLink', url);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      {/* Toolbar */}
      <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
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
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
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
        
        <button
          type="button"
          onClick={insertLink}
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
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
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
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => formatText('removeFormat')}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          title="Clear Formatting"
        >
          🧹
        </button>
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
      
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
