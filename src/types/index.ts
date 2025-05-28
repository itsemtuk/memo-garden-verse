
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
  is_public: boolean;
  owner_id: string;
  collaborators: string[];
  widgets: Widget[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  profilePic?: string;
}

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
