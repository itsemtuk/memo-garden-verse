
import React from 'react';
import { Widget } from "@/types";

interface BoardWidgetControlsProps {
  selectedWidgetId: string | null;
  widgets: Widget[];
  handleUpdateWidgetSettings: (widgetId: string, settings: any) => void;
  handleBringToFront: (widgetId: string) => void;
  handleSendToBack: (widgetId: string) => void;
  handleDeleteWidget: (widgetId: string) => void;
  setSelectedWidgetId: (id: string | null) => void;
}

export const useBoardWidgetControls = ({
  selectedWidgetId,
  widgets,
  handleUpdateWidgetSettings,
  handleBringToFront,
  handleSendToBack,
  handleDeleteWidget,
  setSelectedWidgetId
}: BoardWidgetControlsProps) => {
  const handleRotateWidget = () => {
    if (selectedWidgetId) {
      const widget = widgets.find(w => w.id === selectedWidgetId);
      if (widget) {
        const currentRotation = widget.rotation || 0;
        const newRotation = (currentRotation + 15) % 360;
        handleUpdateWidgetSettings(selectedWidgetId, { 
          ...widget.settings,
          rotation: newRotation 
        });
      }
    }
  };

  const handleBringWidgetToFront = () => {
    if (selectedWidgetId) {
      handleBringToFront(selectedWidgetId);
    }
  };

  const handleSendWidgetToBack = () => {
    if (selectedWidgetId) {
      handleSendToBack(selectedWidgetId);
    }
  };

  const handleDeleteSelectedWidget = () => {
    if (selectedWidgetId) {
      handleDeleteWidget(selectedWidgetId);
      setSelectedWidgetId(null);
    }
  };

  return {
    handleRotateWidget,
    handleBringWidgetToFront,
    handleSendWidgetToBack,
    handleDeleteSelectedWidget
  };
};
