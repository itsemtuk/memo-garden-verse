
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";
import { Newspaper, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsFeedWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

const NewsFeedWidget = ({ widget, isSelected, onClick, onUpdate }: NewsFeedWidgetProps) => {
  const [news, setNews] = useState<NewsItem[]>(widget.settings?.news || []);
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

  // Mock news fetch - in real implementation you'd use a news API
  const fetchNews = async () => {
    setLoading(true);
    // Mock news data since we'd need API keys for real news
    const mockNews: NewsItem[] = [
      {
        title: "Technology Trends 2024",
        description: "Latest developments in AI and machine learning",
        url: "#",
        publishedAt: new Date().toISOString()
      },
      {
        title: "Global Market Update",
        description: "Financial markets showing positive trends",
        url: "#",
        publishedAt: new Date().toISOString()
      }
    ];
    
    setTimeout(() => {
      setNews(mockNews);
      onUpdate({ ...widget.settings, news: mockNews });
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (news.length === 0) {
      fetchNews();
    }
  }, []);

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
        height: widget.size?.height || "280px",
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
          <Newspaper className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">News Feed</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              fetchNews();
            }}
            disabled={loading}
            className="ml-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {news.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">
              {loading ? 'Loading news...' : 'No news available'}
            </p>
          ) : (
            news.map((item, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                <h4 className="font-medium text-gray-800 mb-1">{item.title}</h4>
                <p className="text-gray-600 text-xs mb-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                  <Button size="sm" variant="ghost" className="h-6 px-2">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsFeedWidget;
