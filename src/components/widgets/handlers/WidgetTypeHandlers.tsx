
import { Widget } from "@/types";
import NoteWidget from "../Note";
import ImageWidget from "../ImageWidget";
import TranslatorWidget from "../TranslatorWidget";

interface WidgetHandlerProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (content: string) => void;
  onUpdateSettings?: (settings: any) => void;
}

export const renderNoteWidget = ({ widget, isSelected, onClick, onUpdate }: WidgetHandlerProps) => {
  return (
    <NoteWidget
      widget={widget}
      isSelected={isSelected}
      onClick={onClick}
      onUpdate={onUpdate}
    />
  );
};

export const renderImageWidget = ({ widget, isSelected, onClick }: WidgetHandlerProps) => {
  return (
    <ImageWidget
      widget={widget}
      isSelected={isSelected}
      onClick={onClick}
    />
  );
};

export const renderTranslatorWidget = ({ widget, isSelected, onClick, onUpdateSettings }: WidgetHandlerProps) => {
  return (
    <TranslatorWidget
      widget={widget}
      isSelected={isSelected}
      onClick={onClick}
      onUpdate={onUpdateSettings || (() => {})}
    />
  );
};
