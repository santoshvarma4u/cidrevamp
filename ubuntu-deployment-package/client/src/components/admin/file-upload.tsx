import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, X, Image, Video, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { getAuthHeaders } from "@/lib/auth";

interface FileUploadProps {
  onUpload: (url: string, filename: string) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

interface UploadedFile {
  file: File;
  url?: string;
  progress: number;
  error?: string;
}

export default function FileUpload({
  onUpload,
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  },
  maxSize = 50 * 1024 * 1024, // 50MB
  multiple = false,
  className = ""
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!multiple && acceptedFiles.length > 1) {
      acceptedFiles = [acceptedFiles[0]];
    }

    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setIsUploading(true);

    try {
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        
        try {
          // Simulate progress
          const progressInterval = setInterval(() => {
            setFiles(prev => prev.map(f => 
              f.file === file.file 
                ? { ...f, progress: Math.min(f.progress + 10, 90) }
                : f
            ));
          }, 100);

          const url = await uploadFile(file.file);
          
          clearInterval(progressInterval);
          
          setFiles(prev => prev.map(f => 
            f.file === file.file 
              ? { ...f, progress: 100, url }
              : f
          ));

          onUpload(url, file.file.name);
        } catch (error) {
          setFiles(prev => prev.map(f => 
            f.file === file.file 
              ? { ...f, error: error instanceof Error ? error.message : 'Upload failed' }
              : f
          ));
        }
      }
    } finally {
      setIsUploading(false);
    }
  }, [multiple, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  });

  const removeFile = (fileToRemove: File) => {
    setFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (file.type.startsWith('video/')) return <Video className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  return (
    <div className={className}>
      <Card 
        {...getRootProps()} 
        className={`cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${isUploading ? 'pointer-events-none' : ''}`}
      >
        <CardContent className="p-8">
          <input {...getInputProps()} />
          <div className="text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Drop files here' : 'Upload files'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to select files
            </p>
            <Button variant="outline" disabled={isUploading}>
              Choose Files
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Max file size: {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          {files.map((uploadedFile, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getFileIcon(uploadedFile.file)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.round(uploadedFile.file.size / 1024)} KB
                    </p>
                    
                    {uploadedFile.error ? (
                      <p className="text-xs text-red-600 mt-1">{uploadedFile.error}</p>
                    ) : uploadedFile.url ? (
                      <p className="text-xs text-green-600 mt-1">Upload complete</p>
                    ) : (
                      <div className="mt-2">
                        <Progress value={uploadedFile.progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          {uploadedFile.progress}% uploaded
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadedFile.file)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
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
