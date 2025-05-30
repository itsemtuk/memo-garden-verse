
import { Board, Widget } from "@/types";

export const mockBoards: Board[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000", // Valid UUID format
    name: "My Garden Board",
    description: "A beautiful board for organizing thoughts and ideas",
    is_public: false,
    owner_id: "550e8400-e29b-41d4-a716-446655440001", // Valid UUID format
    collaborators: [],
    widgets: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002", // Valid UUID format
    name: "Work Notes",
    description: "Professional workspace for project management",
    is_public: false,
    owner_id: "550e8400-e29b-41d4-a716-446655440001", // Valid UUID format
    collaborators: [],
    widgets: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
