
import { Widget } from "@/types";
import { WidgetRenderer } from "./components/WidgetRenderer";

interface WidgetRendererProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (content: string) => void;
  onUpdateSettings?: (settings: any) => void;
}

export { WidgetRenderer };

export default WidgetRenderer;
