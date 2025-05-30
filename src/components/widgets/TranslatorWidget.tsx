
import { Widget } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TranslatorWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (settings: any) => void;
}

const TranslatorWidget = ({ widget, isSelected, onClick, onUpdate }: TranslatorWidgetProps) => {
  const [inputText, setInputText] = useState(widget.settings?.inputText || "");
  const [outputText, setOutputText] = useState(widget.settings?.outputText || "");
  const [fromLang, setFromLang] = useState(widget.settings?.fromLang || "en");
  const [toLang, setToLang] = useState(widget.settings?.toLang || "es");

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: widget.id,
    data: { widget },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    rotate: `${widget.rotation || 0}deg`,
    zIndex: isDragging ? 1000 : (widget.settings?.zIndex || 1),
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
  ];

  const updateSettings = (newSettings: any) => {
    onUpdate({ ...widget.settings, ...newSettings });
  };

  const handleTranslate = () => {
    // Placeholder translation - in real implementation would use Google Translate API
    const translated = `[Translated from ${fromLang} to ${toLang}]: ${inputText}`;
    setOutputText(translated);
    updateSettings({ inputText, outputText: translated, fromLang, toLang });
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    updateSettings({ inputText: value, outputText, fromLang, toLang });
  };

  const handleFromLangChange = (value: string) => {
    setFromLang(value);
    updateSettings({ inputText, outputText, fromLang: value, toLang });
  };

  const handleToLangChange = (value: string) => {
    setToLang(value);
    updateSettings({ inputText, outputText, fromLang, toLang: value });
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
        width: widget.size?.width || "320px",
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
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Translator</h3>
        </div>

        <div className="flex gap-2 mb-3">
          <Select value={fromLang} onValueChange={handleFromLangChange}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ArrowRight className="w-4 h-4 mt-2 text-gray-400" />
          <Select value={toLang} onValueChange={handleToLangChange}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <Textarea
            placeholder="Enter text to translate..."
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            className="flex-1"
            onClick={(e) => e.stopPropagation()}
          />
          
          <Button onClick={handleTranslate} disabled={!inputText} className="w-full">
            Translate
          </Button>
          
          <Textarea
            placeholder="Translation will appear here..."
            value={outputText}
            readOnly
            className="flex-1 bg-gray-50"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
};

export default TranslatorWidget;
