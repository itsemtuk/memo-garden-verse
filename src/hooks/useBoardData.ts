
import { useState, useCallback } from 'react';
import { Widget } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useWidgetOperations } from './boardData/useWidgetOperations';
import { useWidgetPositioning } from './boardData/useWidgetPositioning';
import { useWidgetLayering } from './boardData/useWidgetLayering';

export const useBoardData = (boardId: string) => {
  const { user } = useAuth();
  const [imageWidgets, setImageWidgets] = useState<Widget[]>([]);

  // Initialize widget layering hook first (needs widgets)
  const { getMaxZIndex, getMinZIndex, handleBringToFront, handleSendToBack } = useWidgetLayering([]);

  // Initialize widget operations
  const {
    notesAsWidgets,
    handleAddWidget: handleAddWidgetCore,
    handleUpdateWidget: handleUpdateWidgetCore,
    handleDeleteWidget: handleDeleteWidgetCore,
    handleUpdateWidgetSettings: handleUpdateWidgetSettingsCore,
  } = useWidgetOperations(boardId, getMaxZIndex);

  // Initialize positioning
  const { handleWidgetPositionChange: handleWidgetPositionChangeCore } = useWidgetPositioning(boardId, notesAsWidgets);

  // Combine notes from database with local image widgets
  const allWidgets = [...notesAsWidgets, ...imageWidgets];

  // Update layering hook with current widgets
  const layering = useWidgetLayering(allWidgets);

  // Wrapper functions that include user context
  const handleAddWidget = useCallback(async (widget: Widget) => {
    return handleAddWidgetCore(widget, user?.id);
  }, [handleAddWidgetCore, user?.id]);

  const handleUpdateWidget = useCallback(async (widgetId: string, updatedContent: string) => {
    return handleUpdateWidgetCore(widgetId, updatedContent, user?.id);
  }, [handleUpdateWidgetCore, user?.id]);

  const handleWidgetPositionChange = useCallback(async (widgetId: string, x: number, y: number) => {
    return handleWidgetPositionChangeCore(widgetId, x, y, user?.id);
  }, [handleWidgetPositionChangeCore, user?.id]);

  const handleDeleteWidget = useCallback(async (widgetId: string) => {
    return handleDeleteWidgetCore(widgetId, user?.id);
  }, [handleDeleteWidgetCore, user?.id]);

  const handleUpdateWidgetSettings = useCallback(async (widgetId: string, settings: any) => {
    return handleUpdateWidgetSettingsCore(widgetId, settings, user?.id);
  }, [handleUpdateWidgetSettingsCore, user?.id]);

  const handleBringToFrontWrapper = useCallback(async (widgetId: string) => {
    await layering.handleBringToFront(widgetId, handleUpdateWidgetSettings);
  }, [layering.handleBringToFront, handleUpdateWidgetSettings]);

  const handleSendToBackWrapper = useCallback(async (widgetId: string) => {
    await layering.handleSendToBack(widgetId, handleUpdateWidgetSettings);
  }, [layering.handleSendToBack, handleUpdateWidgetSettings]);

  return {
    widgets: allWidgets,
    loading: false, // Loading is now handled by useNotes internally
    handleAddWidget,
    handleUpdateWidget,
    handleUpdateWidgetSettings,
    handleWidgetPositionChange,
    handleBringToFront: handleBringToFrontWrapper,
    handleSendToBack: handleSendToBackWrapper,
    handleDeleteWidget,
  };
};
