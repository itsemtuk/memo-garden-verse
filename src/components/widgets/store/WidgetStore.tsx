import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Widget, WidgetType } from "@/types";
import { Plus } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { validateImageFile } from "@/lib/security";
import { handleValidationError } from "@/lib/errorHandling";
import { widgetTypes } from "./widgetTypes";
import { WidgetSearch } from "./WidgetSearch";
import { WidgetGrid } from "./WidgetGrid";
import { WidgetForm } from "./WidgetForm";
import { createWidget } from "./widgetCreation";

interface WidgetStoreProps {
  onAddWidget: (widget: Widget) => void;
  centerPosition: { x: number; y: number };
  boardId: string;
  isMobile?: boolean;
}

const WidgetStore = ({ onAddWidget, centerPosition, boardId, isMobile = false }: WidgetStoreProps) => {
  const [open, setOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<WidgetType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    noteContent: "",
    imageUrl: "",
    weatherLocation: "",
    temperatureUnit: "C",
    plantName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { uploadImage, uploading } = useFileUpload(boardId);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setFormData({
      noteContent: "",
      imageUrl: "",
      weatherLocation: "",
      temperatureUnit: "C",
      plantName: "",
    });
    setErrors({});
    setSelectedWidget(null);
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const filteredWidgets = useMemo(() => {
    return widgetTypes.filter(widget => {
      const matchesSearch = widget.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          widget.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || widget.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleAddWidget = async () => {
    if (!selectedWidget) return;

    try {
      const newWidget = createWidget({ 
        type: selectedWidget, 
        formData, 
        centerPosition 
      });

      onAddWidget(newWidget);
      if (!isMobile) {
        setOpen(false);
      }
      resetForm();
      clearError('note');
      clearError('image');
      clearError('weather');
      clearError('plant');
    } catch (error) {
      const errorMessage = handleValidationError(error);
      const errorField = selectedWidget === 'plant_reminder' ? 'plant' : selectedWidget;
      setErrors(prev => ({ ...prev, [errorField]: errorMessage }));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, file: validation.error! }));
      return;
    }

    try {
      clearError('file');
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl }));
      setSelectedWidget("image");
    } catch (error) {
      setErrors(prev => ({ ...prev, file: 'Failed to upload image. Please try again.' }));
    }
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    switch (selectedWidget) {
      case "note":
        return formData.noteContent.trim().length > 0;
      case "image":
        return formData.imageUrl.trim().length > 0;
      case "weather":
        return formData.weatherLocation.trim().length > 0;
      case "plant_reminder":
        return formData.plantName.trim().length > 0;
      default:
        return true;
    }
  };

  // For mobile, render content directly without Sheet wrapper
  if (isMobile) {
    return (
      <div className="space-y-4">
        {!selectedWidget ? (
          <>
            <WidgetSearch
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
            />
            
            <WidgetGrid
              widgets={filteredWidgets}
              onSelectWidget={(widgetId) => setSelectedWidget(widgetId as WidgetType)}
            />
          </>
        ) : (
          <WidgetForm
            selectedWidget={selectedWidget}
            formData={formData}
            errors={errors}
            uploading={uploading}
            onFormDataChange={handleFormDataChange}
            onFileUpload={handleFileUpload}
            onAddWidget={handleAddWidget}
            onBack={() => setSelectedWidget(null)}
            isFormValid={isFormValid}
            clearError={clearError}
          />
        )}
      </div>
    );
  }

  // Desktop version with Sheet
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-garden-primary hover:bg-garden-secondary"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Widget Store</SheetTitle>
          <SheetDescription>
            Choose a widget to add to your board
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {!selectedWidget ? (
            <>
              <WidgetSearch
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onSearchChange={setSearchQuery}
                onCategoryChange={setSelectedCategory}
              />
              
              <WidgetGrid
                widgets={filteredWidgets}
                onSelectWidget={(widgetId) => setSelectedWidget(widgetId as WidgetType)}
              />
            </>
          ) : (
            <WidgetForm
              selectedWidget={selectedWidget}
              formData={formData}
              errors={errors}
              uploading={uploading}
              onFormDataChange={handleFormDataChange}
              onFileUpload={handleFileUpload}
              onAddWidget={handleAddWidget}
              onBack={() => setSelectedWidget(null)}
              isFormValid={isFormValid}
              clearError={clearError}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WidgetStore;
