
import { useCallback } from 'react';
import { Widget } from '@/types';

export const useWidgetLayering = (widgets: Widget[]) => {
  const getMaxZIndex = useCallback(() => {
    return Math.max(0, ...widgets.map(w => w.settings?.zIndex || 0));
  }, [widgets]);

  const getMinZIndex = useCallback(() => {
    return Math.min(0, ...widgets.map(w => w.settings?.zIndex || 0));
  }, [widgets]);

  const handleBringToFront = useCallback(async (widgetId: string, updateWidgetSettings: (id: string, settings: any) => Promise<void>) => {
    const newZIndex = getMaxZIndex() + 1;
    await updateWidgetSettings(widgetId, { 
      zIndex: newZIndex
    });
  }, [getMaxZIndex]);

  const handleSendToBack = useCallback(async (widgetId: string, updateWidgetSettings: (id: string, settings: any) => Promise<void>) => {
    const newZIndex = getMinZIndex() - 1;
    await updateWidgetSettings(widgetId, { 
      zIndex: newZIndex
    });
  }, [getMinZIndex]);

  return {
    getMaxZIndex,
    getMinZIndex,
    handleBringToFront,
    handleSendToBack,
  };
};
