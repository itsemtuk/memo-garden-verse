
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { File, Upload, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileAttachmentWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const FileAttachmentWidget = ({ widget, isSelected, onClick, onUpdate }: FileAttachmentWidgetProps) => {
  const [files, setFiles] = useState(widget.settings?.files || []);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    const newFiles = uploadedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploaded: new Date().toISOString(),
      url: URL.createObjectURL(file)
    }));
    
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onUpdate({ ...widget.settings, files: updatedFiles });
  };

  const removeFile = (id: number) => {
    const updatedFiles = files.filter((file: any) => file.id !== id);
    setFiles(updatedFiles);
    onUpdate({ ...widget.settings, files: updatedFiles });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      ref={setNodeRef}
      className={`widget absolute bg-white rounded-lg shadow-lg border-2 transition-all duration-200 ${
        isDragging ? 'dragging shadow-xl scale-105' : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        ...style,
        left: `${widget.position.x}px`,
        top: `${widget.position.y}px`,
        width: widget.size?.width || "320px",
        height: widget.size?.height || "350px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3 border-b pb-2">
          <div className="flex items-center gap-2">
            <File className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">File Attachments</h3>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              onClick={(e) => e.stopPropagation()}
            />
            <Button size="sm" variant="ghost" asChild>
              <span>
                <Upload className="w-4 h-4" />
              </span>
            </Button>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {files.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              <File className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No files uploaded yet</p>
              <p className="text-xs">Click the upload button to add files</p>
            </div>
          ) : (
            files.map((file: any) => (
              <div key={file.id} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{file.name}</h4>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(file.url, '_blank');
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FileAttachmentWidget;
