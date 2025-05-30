
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { WidgetTypeInfo } from "./widgetTypes";

interface WidgetGridProps {
  widgets: WidgetTypeInfo[];
  onSelectWidget: (widgetId: string) => void;
}

export const WidgetGrid = ({ widgets, onSelectWidget }: WidgetGridProps) => {
  return (
    <ScrollArea className="h-[600px]">
      <div className="grid gap-3 pr-4">
        {widgets.map((widget) => {
          const Icon = widget.icon;
          return (
            <button
              key={widget.id}
              onClick={() => onSelectWidget(widget.id)}
              className={`p-4 rounded-lg border-2 border-transparent hover:border-garden-primary transition-all ${widget.color} text-left`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Icon className="w-8 h-8 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{widget.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{widget.description}</p>
                  <span className="text-xs text-gray-500 mt-1 block capitalize">
                    {widget.category}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
        
        {widgets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No widgets found matching your search.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
