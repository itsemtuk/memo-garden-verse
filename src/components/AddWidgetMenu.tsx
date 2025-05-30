
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Widget, WidgetType } from "@/types";
import { Cloud, Leaf, ShoppingCart, StickyNote, Image } from "lucide-react";
import { WidgetTabContent } from "./widgets/forms/WidgetTabContent";
import { useWidgetCreator } from "./widgets/WidgetCreator";

interface AddWidgetMenuProps {
  onAddWidget: (widget: Widget) => void;
  centerPosition: { x: number; y: number };
  boardId: string;
}

const AddWidgetMenu = ({ onAddWidget, centerPosition, boardId }: AddWidgetMenuProps) => {
  const [open, setOpen] = useState(false);
  
  const {
    formData,
    errors,
    uploading,
    updateFormData,
    resetForm,
    isFormValid,
    handleFileUpload,
    createWidget,
  } = useWidgetCreator({ boardId, centerPosition, onAddWidget });

  const handleAddWidget = async (type: WidgetType) => {
    const success = await createWidget(type);
    if (success) {
      setOpen(false);
      resetForm();
    }
  };

  const widgetTypes = [
    { id: "note", label: "Note", icon: StickyNote },
    { id: "image", label: "Image", icon: Image },
    { id: "weather", label: "Weather", icon: Cloud },
    { id: "plant_reminder", label: "Plant Care", icon: Leaf },
    { id: "shopping_list", label: "Shopping", icon: ShoppingCart },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-garden-primary hover:bg-garden-secondary"
          size="icon"
        >
          <span className="text-2xl font-bold">+</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Tabs defaultValue="note" className="w-full">
          <TabsList className="grid w-full grid-cols-5 text-xs">
            {widgetTypes.map((widget) => {
              const Icon = widget.icon;
              return (
                <TabsTrigger key={widget.id} value={widget.id} className="p-1">
                  <Icon className="w-4 h-4" />
                </TabsTrigger>
              );
            })}
          </TabsList>

          {widgetTypes.map((widget) => (
            <WidgetTabContent
              key={widget.id}
              type={widget.id as WidgetType}
              formData={formData}
              errors={errors}
              uploading={uploading}
              onFormDataChange={updateFormData}
              onFileUpload={handleFileUpload}
              onAddWidget={handleAddWidget}
              isFormValid={isFormValid}
            />
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default AddWidgetMenu;
