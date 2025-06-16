# 📜 MemoGarden Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

- 🌱 Planned: Board templates, advanced search, and more social widgets.
- 🚧 In Progress: Improved onboarding and public garden browsing.

---

## [1.2.0] – 2025-06-16

### Added
- Virtualized widget rendering for high-performance boards
- Refactored board components for maintainability (`useBoardVirtualization`, `WidgetRow`, `BoardControls`)
- Memoized widget rows and dynamic row height calculation
- Real-time cursor presence tracking and selection state sharing
- Widget resizing (react-rnd) and rotation with persistent state
- Z-index management and mobile-optimized controls

### Improved
- Enhanced mobile touch support and drag sensitivity
- Streamlined mobile drawer for widget store
- Larger, more accessible control buttons and improved visual feedback

---

## [1.1.0] – 2025-06-10

### Added
- Comprehensive widget system: sticky notes, images, weather, plant care, shopping list
- Widget registry for extensible architecture
- Real-time updates for all widget types
- Flexible widget settings (JSONB) and persistence

### Improved
- Enhanced corkboard background with Unsplash imagery and soft-light blend
- Distinct styling for each widget type
- Improved widget pins and shadows

---

## [1.0.0] – 2025-06-01

### Added
- User authentication and profiles (Supabase)
- Board creation, sharing (public/private), and management
- Drag-and-drop with @dnd-kit
- Real-time notes system with database integration
- Initial mobile support and responsive UI
- Beautiful garden-inspired color palette

---

## [0.9.0] – 2025-05-20

### Added
- Project scaffolding with Vite, TypeScript, React, shadcn/ui, Tailwind CSS
- Supabase integration for auth, database, and storage
- Initial board and note models

---

*Older changes are available in the project’s commit history.*

---
