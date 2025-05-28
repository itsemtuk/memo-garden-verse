
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShoppingListWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const ShoppingListWidget = ({ widget, isSelected, onClick, onUpdate }: ShoppingListWidgetProps) => {
  const [newItem, setNewItem] = useState("");
  const items = widget.settings?.items || [];

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 50 : isSelected ? 10 : 1,
  };

  const addItem = () => {
    if (newItem.trim()) {
      const updatedItems = [...items, { id: Date.now(), text: newItem.trim(), completed: false }];
      onUpdate?.({ ...widget.settings, items: updatedItems });
      setNewItem("");
    }
  };

  const toggleItem = (itemId: number) => {
    const updatedItems = items.map((item: any) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdate?.({ ...widget.settings, items: updatedItems });
  };

  return (
    <div
      ref={setNodeRef}
      className={`widget widget-shopping absolute ${isDragging ? 'dragging' : ''} ${isSelected ? 'ring-2 ring-garden-primary' : ''}`}
      style={{
        ...style,
        left: `${widget.position.x}px`,
        top: `${widget.position.y}px`,
        width: "220px",
        height: "280px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      {...attributes}
      {...listeners}
    >
      <div className="widget-pin widget-pin-left"></div>
      <div className="widget-pin widget-pin-right"></div>
      
      <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-lg h-full flex flex-col">
        <div className="flex items-center mb-3">
          <ShoppingCart className="w-5 h-5 text-orange-600 mr-2" />
          <div className="text-sm font-medium text-orange-800">Shopping List</div>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-3 space-y-2">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                item.completed 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-400'
              }`}>
                {item.completed && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={`text-sm ${
                item.completed 
                  ? 'line-through text-gray-500' 
                  : 'text-gray-800'
              }`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
                addItem();
              }
            }}
            placeholder="Add item..."
            className="text-xs"
            onClick={(e) => e.stopPropagation()}
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              addItem();
            }}
            size="sm"
            className="px-2"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListWidget;
