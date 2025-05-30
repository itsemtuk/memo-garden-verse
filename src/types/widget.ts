
export interface WidgetSettings {
  size?: {
    width: number;
    height: number;
  };
  imagePath?: string;
  zIndex?: number;
  rotation?: number;
  [key: string]: any; // Allow additional properties for different widget types
}

export interface CreateWidgetData {
  type: 'note' | 'image';
  content: string;
  x: number;
  y: number;
  settings?: WidgetSettings;
}
