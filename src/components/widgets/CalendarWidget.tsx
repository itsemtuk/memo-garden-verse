
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Calendar, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CalendarWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
}

const CalendarWidget = ({ widget, isSelected, onClick, onUpdate }: CalendarWidgetProps) => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "" });
  
  const events: Event[] = widget.settings?.events || [];

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const addEvent = () => {
    if (newEvent.title && newEvent.date) {
      const event: Event = {
        id: Date.now().toString(),
        ...newEvent
      };
      const updatedEvents = [...events, event];
      onUpdate({ ...widget.settings, events: updatedEvents });
      setNewEvent({ title: "", date: "", time: "" });
      setShowAddEvent(false);
    }
  };

  const deleteEvent = (eventId: string) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    onUpdate({ ...widget.settings, events: updatedEvents });
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
        width: widget.size?.width || "280px",
        height: widget.size?.height || "320px",
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
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Calendar</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddEvent(!showAddEvent);
            }}
            className="ml-auto"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {showAddEvent && (
          <div className="mb-3 p-2 bg-gray-50 rounded space-y-2">
            <Input
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex gap-2">
              <Input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                onClick={(e) => e.stopPropagation()}
                className="flex-1"
              />
              <Input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                onClick={(e) => e.stopPropagation()}
                className="flex-1"
              />
            </div>
            <Button size="sm" onClick={addEvent} className="w-full">
              Add Event
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {events.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No events scheduled</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="flex items-start gap-2 p-2 bg-blue-50 rounded text-sm">
                <div className="flex-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-gray-600">
                    {new Date(event.date).toLocaleDateString()}
                    {event.time && ` at ${event.time}`}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEvent(event.id);
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

export default CalendarWidget;
