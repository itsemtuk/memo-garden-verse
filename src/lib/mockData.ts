
import { Board, Widget } from "@/types";

export const mockWidgets: Widget[] = [
  {
    id: "widget1",
    type: "note",
    content: "Welcome to MemoGarden! Drag me around the board.",
    position: { x: 100, y: 100 },
    rotation: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "widget2",
    type: "note",
    content: "You can add notes, images, and more to your board. Try adding a new widget!",
    position: { x: 400, y: 200 },
    rotation: -1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "widget3",
    type: "image",
    content: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    position: { x: 700, y: 150 },
    rotation: 1,
    size: { width: 200, height: "auto" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "widget4",
    type: "note",
    content: "Create personal boards or browse public ones in the garden!",
    position: { x: 300, y: 400 },
    rotation: -2,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export const mockBoards: Board[] = [
  {
    id: "board1",
    name: "My First Board",
    description: "A personal collection of notes and images",
    is_public: false,
    widgets: mockWidgets,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner_id: "user1",
    collaborators: [],
  },
  {
    id: "board2",
    name: "Project Ideas",
    description: "Collaborative board for brainstorming project ideas",
    is_public: true,
    widgets: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner_id: "user1",
    collaborators: ["user2", "user3"],
  },
  {
    id: "board3",
    name: "Travel Inspirations",
    description: "Places I want to visit",
    is_public: true,
    widgets: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner_id: "user2",
    collaborators: [],
  },
];

export const mockUsers = [
  {
    id: "user1",
    name: "John Doe",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: "user2",
    name: "Jane Smith",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
  {
    id: "user3",
    name: "Bob Johnson",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
  },
];
