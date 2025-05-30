
import { Widget } from "@/types";
import { widgetRegistry } from "../config/widgetConfig";
import { 
  CONTENT_WIDGETS, 
  IMAGE_WIDGETS, 
  TRANSLATOR_WIDGETS, 
  SETTINGS_BASED_WIDGETS 
} from "../config/widgetCategories";
import { 
  renderNoteWidget, 
  renderImageWidget, 
  renderTranslatorWidget 
} from "../handlers/WidgetTypeHandlers";

interface WidgetRendererProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (content: string) => void;
  onUpdateSettings?: (settings: any) => void;
}

export const WidgetRenderer = ({ 
  widget, 
  isSelected, 
  onClick, 
  onUpdate, 
  onUpdateSettings 
}: WidgetRendererProps) => {
  const WidgetComponent = widgetRegistry[widget.type as keyof typeof widgetRegistry];
  
  if (!WidgetComponent) {
    console.warn(`Unknown widget type: ${widget.type}`);
    return (
      <div className="absolute bg-red-100 border-2 border-red-500 rounded-lg p-4 text-red-700"
           style={{
             left: `${widget.position.x}px`,
             top: `${widget.position.y}px`,
             transform: `rotate(${widget.rotation || 0}deg)`,
             zIndex: widget.settings?.zIndex || 1,
           }}>
        Unknown widget type: {widget.type}
      </div>
    );
  }

  // Handle content-based widgets (note, social, etc.)
  if (CONTENT_WIDGETS.includes(widget.type)) {
    return renderNoteWidget({ widget, isSelected, onClick, onUpdate, onUpdateSettings });
  }

  // Handle image widgets
  if (IMAGE_WIDGETS.includes(widget.type)) {
    return renderImageWidget({ widget, isSelected, onClick, onUpdate, onUpdateSettings });
  }

  // Handle translator widget
  if (TRANSLATOR_WIDGETS.includes(widget.type)) {
    return renderTranslatorWidget({ widget, isSelected, onClick, onUpdate, onUpdateSettings });
  }

  // Handle settings-based widgets
  if (SETTINGS_BASED_WIDGETS.includes(widget.type)) {
    return (
      <WidgetComponent
        widget={widget}
        isSelected={isSelected}
        onClick={onClick}
        onUpdate={onUpdateSettings || (() => {})}
      />
    );
  }

  // Fallback for any other widgets
  return (
    <WidgetComponent
      widget={widget}
      isSelected={isSelected}
      onClick={onClick}
      onUpdate={onUpdate}
      onUpdateSettings={onUpdateSettings}
    />
  );
};
