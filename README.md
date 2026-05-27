# TaskManager Client

A Trello-style project management app built with React and Apollo Client. Live demo: [task-manager-client-5dxs.onrender.com](https://task-manager-client-5dxs.onrender.com)

## What it does

TaskManager lets users organize work across boards, lists, and tasks — similar to Trello. Each user has their own private workspace with full CRUD on boards, lists, and tasks.

**Features:**
- JWT authentication (sign up, sign in, protected routes)
- Create, rename, and delete boards, lists, and tasks
- Drag and drop to reorder lists and tasks (with backend persistence)
- Task modal with description and due date
- Optimistic UI updates via Apollo cache
- Auto-redirect to login on token expiration or auth errors

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (Vite) |
| Data fetching | Apollo Client |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Drag and drop | @hello-pangea/dnd |
| Icons | Lucide React |
| Auth | JWT (stored in localStorage) |

## Architecture highlights

- **Apollo cache management** — mutations use `refetchQueries` and `optimisticResponse` to keep the UI in sync without full page reloads
- **Component hierarchy** — `Board → List → Task` with co-located mutation logic (task mutations in `List.jsx`, board mutations in `Dashboard.jsx`)
- **Protected routes** — `ProtectedRoute` validates JWT expiration client-side before rendering; Apollo's `onError` link handles server-side auth failures
- **Cache clearing on logout** — `client.clearStore()` prevents data leaking between user sessions

## Backend

The API is a separate Rails + GraphQL service. See [task-manager](https://github.com/your-username/task-manager) for the backend repo.
