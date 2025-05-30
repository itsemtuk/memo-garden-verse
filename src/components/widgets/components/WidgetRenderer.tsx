
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
    console.warn(`Unknown widget type: ${widget.type}`, widget);
    return (
      <div 
        className="bg-red-100 border-2 border-red-500 rounded-lg p-4 text-red-700 cursor-pointer"
        onClick={onClick}
        style={{
          width: typeof widget.size?.width === 'string' ? widget.size.width : `${widget.size?.width || 200}px`,
          height: typeof widget.size?.height === 'string' ? widget.size.height : `${widget.size?.height || 100}px`,
        }}
      >
        <div className="text-sm font-semibold">Unknown Widget</div>
        <div className="text-xs">Type: {widget.type}</div>
        <div className="text-xs">ID: {widget.id.slice(0, 8)}...</div>
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

  // Handle settings-based widgets (calendar, weather, etc.)
  if (SETTINGS_BASED_WIDGETS.includes(widget.type)) {
    console.log(`Rendering settings-based widget: ${widget.type}`, widget);
    return (
      <WidgetComponent
        widget={widget}
        isSelected={isSelected}
        onClick={onClick}
        onUpdate={onUpdateSettings || (() => {})}
      />
    );
  }

  // Fallback for any other widgets - only pass standard props
  console.log(`Rendering fallback widget: ${widget.type}`, widget);
  return (
    <WidgetComponent
      widget={widget}
      isSelected={isSelected}
      onClick={onClick}
      onUpdate={onUpdate}
    />
  );
};
