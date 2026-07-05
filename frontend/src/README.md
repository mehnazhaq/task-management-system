# Frontend Pages — Setup Notes

These files assume a Vite React app with `react-router-dom` and `axios` installed:

```bash
npm install react-router-dom axios
```

## Where each file goes (inside `frontend/src/`)

```
src/
├── App.jsx                    → replace your existing App.jsx
├── styles/theme.css
├── api/axios.js
├── context/AuthContext.jsx
├── components/
│   ├── Navbar.jsx
│   ├── TaskCard.jsx
│   ├── Loader.jsx
│   ├── EmptyState.jsx
│   ├── ConfirmDialog.jsx
│   └── ProtectedRoute.jsx
└── pages/
    ├── Login.jsx
    ├── Register.jsx
    ├── Dashboard.jsx
    ├── AddTask.jsx
    ├── EditTask.jsx
    └── TaskDetail.jsx
```

## Backend contract these pages expect

- `POST /api/auth/register` → `{ name, email, password }` → returns `{ token, user }`
- `POST /api/auth/login` → `{ email, password }` → returns `{ token, user }`
- `GET /api/auth/me` → returns `{ id, name, email }` (requires `Authorization: Bearer <token>`)
- `GET /api/tasks` → returns array of tasks for the logged-in user
- `POST /api/tasks` → creates a task
- `GET /api/tasks/:id` → single task
- `PUT /api/tasks/:id` → update task (partial updates supported, e.g. just `{ status }`)
- `DELETE /api/tasks/:id` → delete task

Each task object is expected to look like:
```json
{
  "_id": "...",
  "title": "string",
  "description": "string",
  "dueDate": "ISO date string",
  "priority": "Low | Medium | High",
  "status": "Pending | In Progress | Completed",
  "createdDate": "ISO date string"
}
```

## Environment variable

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

## Design note

The UI uses a "library ticket / catalogue card" theme — tasks are shown as index
cards with a small ticket number and stamped priority/status tags — defined
entirely in `styles/theme.css` via CSS variables, no Tailwind/UI kit required.
