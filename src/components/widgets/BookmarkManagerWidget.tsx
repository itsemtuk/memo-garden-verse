
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Bookmark, Plus, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BookmarkManagerWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const BookmarkManagerWidget = ({ widget, isSelected, onClick, onUpdate }: BookmarkManagerWidgetProps) => {
  const [bookmarks, setBookmarks] = useState(widget.settings?.bookmarks || []);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const addBookmark = () => {
    if (newUrl.trim() && newTitle.trim()) {
      const bookmark = {
        id: Date.now(),
        title: newTitle.trim(),
        url: newUrl.trim(),
        created: new Date().toISOString()
      };
      const updatedBookmarks = [...bookmarks, bookmark];
      setBookmarks(updatedBookmarks);
      onUpdate({ ...widget.settings, bookmarks: updatedBookmarks });
      setNewUrl("");
      setNewTitle("");
      setIsAdding(false);
    }
  };

  const removeBookmark = (id: number) => {
    const updatedBookmarks = bookmarks.filter((bookmark: any) => bookmark.id !== id);
    setBookmarks(updatedBookmarks);
    onUpdate({ ...widget.settings, bookmarks: updatedBookmarks });
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
        height: widget.size?.height || "400px",
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
            <Bookmark className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Bookmarks</h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setIsAdding(!isAdding);
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {isAdding && (
          <div className="mb-3 space-y-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Bookmark title..."
              onClick={(e) => e.stopPropagation()}
            />
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addBookmark}>Add</Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {bookmarks.map((bookmark: any) => (
            <div key={bookmark.id} className="border rounded-lg p-3 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{bookmark.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{bookmark.url}</p>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(bookmark.url, '_blank');
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBookmark(bookmark.id);
                    }}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookmarkManagerWidget;
