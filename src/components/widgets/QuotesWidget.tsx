
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";
import { Quote, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuotesWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

interface QuoteData {
  content: string;
  author: string;
}

const QuotesWidget = ({ widget, isSelected, onClick, onUpdate }: QuotesWidgetProps) => {
  const [quote, setQuote] = useState<QuoteData | null>(widget.settings?.currentQuote || null);
  const [loading, setLoading] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      const newQuote = { content: data.content, author: data.author };
      setQuote(newQuote);
      onUpdate({ ...widget.settings, currentQuote: newQuote });
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!quote) {
      fetchQuote();
    }
  }, []);

  return (
    <div
      ref={setNodeRef}
      className={`widget absolute bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-lg border-2 transition-all duration-200 ${
        isDragging ? 'dragging shadow-xl scale-105' : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        ...style,
        left: `${widget.position.x}px`,
        top: `${widget.position.y}px`,
        width: widget.size?.width || "300px",
        height: widget.size?.height || "200px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3 border-b border-purple-200 pb-2">
          <Quote className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">Daily Quote</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              fetchQuote();
            }}
            disabled={loading}
            className="ml-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {quote ? (
            <>
              <blockquote className="text-sm italic text-gray-700 mb-3 leading-relaxed">
                "{quote.content}"
              </blockquote>
              <div className="text-right text-sm font-medium text-purple-600">
                — {quote.author}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              {loading ? 'Loading quote...' : 'Click refresh to load a quote'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotesWidget;
