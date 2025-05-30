
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { BookOpen, Plus, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BookTrackerWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

interface Book {
  id: string;
  title: string;
  author: string;
  status: 'reading' | 'completed' | 'want-to-read';
  rating: number;
  progress: number;
}

const BookTrackerWidget = ({ widget, isSelected, onClick, onUpdate }: BookTrackerWidgetProps) => {
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState({ title: "", author: "", status: "want-to-read" as const, rating: 0, progress: 0 });
  
  const books: Book[] = widget.settings?.books || [];

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const addBook = () => {
    if (newBook.title && newBook.author) {
      const book: Book = {
        id: Date.now().toString(),
        ...newBook
      };
      const updatedBooks = [...books, book];
      onUpdate({ ...widget.settings, books: updatedBooks });
      setNewBook({ title: "", author: "", status: "want-to-read", rating: 0, progress: 0 });
      setShowAddBook(false);
    }
  };

  const removeBook = (bookId: string) => {
    const updatedBooks = books.filter(book => book.id !== bookId);
    onUpdate({ ...widget.settings, books: updatedBooks });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reading': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'want-to-read': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
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
        <div className="flex items-center gap-2 mb-3 border-b pb-2">
          <BookOpen className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-gray-800">Book Tracker</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddBook(!showAddBook);
            }}
            className="ml-auto"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {showAddBook && (
          <div className="mb-3 p-2 bg-gray-50 rounded space-y-2">
            <Input
              placeholder="Book title"
              value={newBook.title}
              onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
            <Input
              placeholder="Author"
              value={newBook.author}
              onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
            <select
              value={newBook.status}
              onChange={(e) => setNewBook(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full p-2 border rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="want-to-read">Want to Read</option>
              <option value="reading">Currently Reading</option>
              <option value="completed">Completed</option>
            </select>
            <Button size="sm" onClick={addBook} className="w-full">
              Add Book
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {books.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No books tracked yet</p>
          ) : (
            books.map((book) => (
              <div key={book.id} className="flex items-start gap-2 p-2 bg-orange-50 rounded text-sm">
                <div className="flex-1">
                  <div className="font-medium">{book.title}</div>
                  <div className="text-gray-600 text-xs">by {book.author}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(book.status)}`}>
                      {book.status.replace('-', ' ')}
                    </span>
                    {book.rating > 0 && (
                      <div className="flex items-center gap-1">
                        {renderStars(book.rating)}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBook(book.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookTrackerWidget;
