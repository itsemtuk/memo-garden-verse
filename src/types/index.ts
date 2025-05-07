
export type WidgetType = 'note' | 'image';

export interface Widget {
  id: string;
  type: WidgetType;
  content: string;
  position: {
    x: number;
    y: number;
  };
  rotation?: number;
  size?: {
    width: number | string;
    height: number | string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  widgets: Widget[];
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  collaborators?: string[];
}

export interface User {
  id: string;
  name: string;
  profilePic?: string;
}
