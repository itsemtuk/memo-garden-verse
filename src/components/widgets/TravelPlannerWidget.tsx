
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { MapPin, Plus, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TravelPlannerWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

interface TravelItem {
  id: string;
  type: 'destination' | 'activity' | 'accommodation';
  title: string;
  date: string;
  notes: string;
}

const TravelPlannerWidget = ({ widget, isSelected, onClick, onUpdate }: TravelPlannerWidgetProps) => {
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", date: "", notes: "", type: "destination" as const });
  
  const items: TravelItem[] = widget.settings?.items || [];

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const addItem = () => {
    if (newItem.title) {
      const item: TravelItem = {
        id: Date.now().toString(),
        ...newItem
      };
      const updatedItems = [...items, item];
      onUpdate({ ...widget.settings, items: updatedItems });
      setNewItem({ title: "", date: "", notes: "", type: "destination" });
      setShowAddItem(false);
    }
  };

  const removeItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    onUpdate({ ...widget.settings, items: updatedItems });
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'destination': return '📍';
      case 'activity': return '🎯';
      case 'accommodation': return '🏨';
      default: return '📋';
    }
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
        width: widget.size?.width || "300px",
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
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Travel Planner</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddItem(!showAddItem);
            }}
            className="ml-auto"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {showAddItem && (
          <div className="mb-3 p-2 bg-gray-50 rounded space-y-2">
            <select
              value={newItem.type}
              onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full p-2 border rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="destination">Destination</option>
              <option value="activity">Activity</option>
              <option value="accommodation">Accommodation</option>
            </select>
            <Input
              placeholder="Title"
              value={newItem.title}
              onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
            <Input
              type="date"
              value={newItem.date}
              onChange={(e) => setNewItem(prev => ({ ...prev, date: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
            <Input
              placeholder="Notes"
              value={newItem.notes}
              onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
            <Button size="sm" onClick={addItem} className="w-full">
              Add Item
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {items.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No travel items yet</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-start gap-2 p-2 bg-blue-50 rounded text-sm">
                <span className="text-lg">{getItemIcon(item.type)}</span>
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  {item.date && (
                    <div className="text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  )}
                  {item.notes && <div className="text-gray-600">{item.notes}</div>}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.id);
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

export default TravelPlannerWidget;
