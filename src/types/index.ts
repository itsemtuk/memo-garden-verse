export type WidgetType = 'note' | 'image' | 'weather' | 'plant_reminder' | 'shopping_list' | 'social' | 'calendar' | 'todo_list' | 'rich_text' | 'timer' | 'habit_tracker' | 'news_feed' | 'quotes';

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
  settings?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
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
