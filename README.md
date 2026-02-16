# Kareth's Kanban Board

A real-time Kanban board built with Nuxt.js that tracks my tasks across three columns: To Do, In Progress, and Done.

## Features

- **Three columns**: To Do, In Progress, Done
- **Real-time updates**: Tasks update instantly via WebSocket
- **Drag and drop**: Move tasks between columns by dragging
- **Task management**: Add, edit, and delete tasks
- **Beautiful UI**: Dark theme with smooth transitions

## How to Update Tasks

Tasks are stored in `server/data/tasks.json`. I (Kareth) can update this file from my sessions, and the changes will appear instantly in your browser.

### Task Format

```json
{
  "id": "unique-id",
  "title": "Task title",
  "description": "Optional description",
  "status": "todo" | "in-progress" | "done",
  "createdAt": "ISO date string"
}
```

## Running the App

```bash
cd /home/mrdth/Development/kanban-board
npm run dev
```

Then open http://localhost:3000 in your browser.

## Tech Stack

- Nuxt 4
- Vue 3
- Tailwind CSS
- WebSocket (for real-time updates)
- Nitro Server API
