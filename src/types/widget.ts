
export interface WidgetSettings {
  size?: {
    width: number;
    height: number;
  };
  imagePath?: string;
  zIndex?: number;
}

export interface CreateWidgetData {
  type: 'note' | 'image';
  content: string;
  x: number;
  y: number;
  settings?: WidgetSettings;
}
