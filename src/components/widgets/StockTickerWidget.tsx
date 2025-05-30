
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface StockTickerWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const StockTickerWidget = ({ widget, isSelected, onClick, onUpdate }: StockTickerWidgetProps) => {
  const [stocks, setStocks] = useState([
    { symbol: 'AAPL', price: 150.25, change: 2.45, changePercent: 1.66 },
    { symbol: 'GOOGL', price: 2750.80, change: -15.20, changePercent: -0.55 },
    { symbol: 'MSFT', price: 305.15, change: 8.90, changePercent: 3.00 },
    { symbol: 'TSLA', price: 245.67, change: 12.34, changePercent: 5.29 },
  ]);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  useEffect(() => {
    // Simulate stock price updates
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => ({
        ...stock,
        price: stock.price + (Math.random() - 0.5) * 5,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 3,
      })));
    }, 5000);

    return () => clearInterval(interval);
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
        width: widget.size?.width || "300px",
        height: widget.size?.height || "250px",
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
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Stock Ticker</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {stocks.map((stock, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{stock.symbol}</span>
                {stock.change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">${stock.price.toFixed(2)}</div>
                <div className={`text-xs ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockTickerWidget;
