# 🏗️ MemoGarden Architecture Overview

This document provides a high-level overview of MemoGarden’s architecture, design principles, and major components. MemoGarden is a real-time, collaborative digital pinboard platform inspired by the flexibility and creativity of physical corkboards and noticeboards[1][3][6][7].

---

## 🌳 Core Design Philosophy

- **Visual Freedom**: Users can arrange, resize, rotate, and layer widgets anywhere on the board, much like a real corkboard or creative pinboard wall[1][2][6].
- **Real-Time Collaboration**: All changes are instantly synced across users, enabling seamless teamwork and co-creation.
- **Extensibility**: The widget system is modular, supporting new types and features as the platform grows.
- **Mobile-First & Accessible**: Optimized for touch, keyboard, and screen readers.

---

## 🏛️ High-Level Architecture

[ Client (React/Vite/TS) ] <--> [ Supabase (DB, Auth, Realtime, Storage) ]

text

### **Frontend**
- **React + TypeScript**: Component-driven UI, hooks for state and logic.
- **Vite**: Fast dev/build tooling.
- **Tailwind CSS & shadcn/ui**: Utility-first styling and accessible UI components.
- **@dnd-kit**: Drag-and-drop, touch, and keyboard interactivity.
- **react-rnd**: Widget resizing and rotation.

### **Backend**
- **Supabase**:  
  - **Postgres Database**: Stores users, boards, widgets, and settings.
  - **Auth**: Secure user authentication and profiles.
  - **Realtime**: Live sync for widgets, boards, and presence.
  - **Row-Level Security (RLS)**: Fine-grained access control.
  - **Storage**: Image and file uploads.

---

## 🗂️ Main Data Models

- **User (Profile)**: Authenticated user with profile, avatar, and settings.
- **Board**: A digital pinboard, can be public or private, with collaborators.
- **Widget (Note)**: Any draggable/resizable element (note, image, weather, etc.), with flexible `widget_type` and `widget_settings`.
- **Board Members**: Users with access to a board (roles: owner, editor, viewer).

---

## 🔄 Real-Time Sync

- **Supabase Realtime**:  
  - Subscribes to changes in `boards` and `notes` tables.
  - Updates all connected clients instantly (positions, content, presence, etc.).
- **Presence Channels**:  
  - Tracks and displays active collaborators and their cursors.

---

## 🧩 Widget System

- **Widget Registry**: Maps widget types to React components.
- **Flexible Settings**: Each widget stores its config in a JSONB field.
- **Extensible**: New widget types can be added with minimal changes.

---

## 🖼️ Board Rendering

- **Virtualized Rendering**: Only visible widgets are rendered for performance.
- **Absolute Positioning**: Widgets are placed anywhere on the board, with support for z-index, rotation, and resizing.
- **Mobile & Desktop**: Touch and mouse support, responsive controls.

---

## 🔐 Security

- **Row-Level Security**: Users can only access boards and widgets they own or are shared with them.
- **Auth Guards**: Protected routes and actions for authenticated users only.
- **Secure File Storage**: Images/files are stored with access controls.

---

## 📦 Deployment & Scaling

- **Supabase Cloud**: Managed backend services.
- **Vercel/Netlify**: Suggested for frontend hosting.
- **Stateless Frontend**: All state is managed via Supabase, enabling easy scaling.

---

## 🛠️ Planned/Optional Architecture Features

- **Operational Transform/CRDT**: For advanced conflict-free real-time editing.
- **Widget Marketplace**: Community-created widget templates.
- **AR/3D Board Views**: For immersive, spatial board experiences.
- **IoT Integrations**: For plant care and smart garden widgets.

---

## 📝 References & Inspiration

- [Stylish Pinboards & Noticeboards][1]
- [Scandinavian Memory Boards][6]
- [IKEA Noticeboards][7]
- [Creative Pinboard Wall Ideas][2][9]

---

*Last updated: 2025-06-16*

[1]: https://www.livingetc.com/shopping/stylish-pinboards
[2]: https://www.pinterest.com/pin/home--14707136270466185/
[3]: https://www.notonthehighstreet.com/home/storage-organisers/noticeboards
[6]: https://www.finnishdesignshop.com/en-us/decor/posters-memory-boards/memory-boards
[7]: https://www.ikea.com/in/en/cat/noticeboards-10574/
[9]: https://www.pinterest.com/ideas/office-memo-board-ideas/936750612788/
