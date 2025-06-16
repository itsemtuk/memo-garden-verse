# 🧩 MemoGarden Widget System Guide

Welcome to the MemoGarden Widget System! This guide explains how widgets work, how to use and configure them, and how to extend the system with new widget types.

---

## What is a Widget?

A **widget** is an interactive, draggable element you can add to your MemoGarden board. Widgets can be notes, images, tools, or mini-apps—each with its own features and settings. All widgets sync in real time and can be positioned, resized, and rotated on your board.

---

## Available Widget Types

MemoGarden supports a growing set of widgets, including:

- **Sticky Note**: Simple text notes, color-coded and resizable.
- **Image**: Upload or link images, resize and move them freely.
- **Weather**: Displays current weather for a chosen location.
- **Plant Reminder**: Tracks watering schedules for your plants, with interactive reminders.
- **Shopping List**: Manage a checklist of items, mark items as completed.

*More widgets are planned—see [Contributing](#contributing-new-widgets) to suggest or add your own!*

---

## How Widgets Work

- **Drag & Drop**: Place widgets anywhere on your board.
- **Resize & Rotate**: Most widgets can be resized and rotated. Use the control handles on desktop or the control bar on mobile.
- **Real-Time Sync**: All changes are instantly visible to collaborators.
- **Settings**: Each widget type can have its own settings (e.g., weather location, plant name, checklist items).

---

## Adding a Widget

1. **Open the Widget Menu**: Click the "+" button or "Add Widget" menu on your board.
2. **Choose Widget Type**: Select from available types (Sticky Note, Image, Weather, etc.).
3. **Configure Settings**: Enter any required info (e.g., note content, image upload, weather location).
4. **Place on Board**: The widget appears on your board—drag, resize, or rotate as needed.

---

## Editing and Managing Widgets

- **Edit Content/Settings**: Click or tap a widget to edit its content or settings. For example, change the note text, update the weather location, or add items to a shopping list.
- **Resize/Rotate**: Use the handles or control bar to adjust size and orientation.
- **Bring Forward/Send Back**: Change widget layering with z-index controls.
- **Delete**: Remove a widget using the delete/trash button in the widget’s controls.

---

## Widget Settings & Persistence

- Each widget stores its settings (like text, image URL, location, checklist items) in a flexible JSONB field in the database.
- All changes are saved and synchronized in real time across all collaborators.
- Widget state (position, size, rotation, settings) is persistent and will be restored when you revisit the board.

---

## Extending the Widget System

MemoGarden uses a **Widget Registry** architecture, making it easy to add new widget types.

### How to Add a New Widget Type

1. **Create the Widget Component**  
   - Build a React component for your widget (e.g., `QuoteWidget.tsx`).
   - Define its settings and UI.

2. **Register the Widget**  
   - Add your component to the `widgetRegistry` in `WidgetRegistry.tsx`:
     ```
     import QuoteWidget from './QuoteWidget'
     export const widgetRegistry = {
       ...,
       quote: QuoteWidget,
     }
     ```

3. **Define Settings Schema**  
   - Specify what settings your widget needs (e.g., text, author).

4. **Update the Add Widget Menu**  
   - Add your new widget type as an option in the UI.

5. **Test**  
   - Ensure your widget works with drag, resize, rotate, and real-time sync.

### Example: Adding a "Quote" Widget

- Create `QuoteWidget.tsx` with props for `text` and `author`.
- Register it in the widget registry.
- Update the Add Widget menu to include "Quote".
- Now users can add inspirational quotes to their boards!

---

## Contributing New Widgets

We welcome new widget ideas and contributions!  
- Open an issue or discussion to propose a widget.
- Submit a pull request following the steps above.
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## Troubleshooting

- **Widget not appearing?** Refresh the board and check your internet connection.
- **Widget settings not saving?** Ensure you have write access to the board.
- **UI glitch?** Try resizing the window or clearing your browser cache.  
  If problems persist, [open an issue](https://github.com/itsemtuk/memo-garden-verse/issues).

---

## FAQ

**Q: Can I move, resize, and rotate all widgets?**  
A: Yes! Most widgets support full drag, resize, and rotation. Some may have fixed aspect ratios or minimum sizes.

**Q: Are widgets visible to everyone on the board?**  
A: Yes, all widgets are real-time collaborative and visible to all board collaborators.

**Q: Can I create my own custom widgets?**  
A: Absolutely! See [Extending the Widget System](#extending-the-widget-system).

---

Happy gardening! 🌱
