# Task Management System — Backend

Express + MongoDB (Mongoose) + JWT auth API matching the frontend contract.

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB Atlas (or local) connection string
- `JWT_SECRET` — any long random string
- `CLIENT_URL` — your frontend origin (default `http://localhost:5173`)

Run it:

```bash
npm run dev
```

Server starts on `http://localhost:5000` (or whatever `PORT` you set).

## Folder structure

```
backend/
├── config/db.js               MongoDB connection
├── models/
│   ├── User.js                 name, email, hashed password
│   └── Task.js                 title, description, dueDate, priority, status, user (owner)
├── controllers/
│   ├── authController.js       register, login, getMe
│   └── taskController.js       full CRUD, ownership-checked
├── middleware/
│   ├── authMiddleware.js       JWT verification (protect)
│   └── errorMiddleware.js      centralized error handling
├── routes/
│   ├── authRoutes.js
│   └── taskRoutes.js
├── server.js
└── package.json
```

## API Endpoints

| Method | Endpoint | Access | Body |
|---|---|---|---|
| POST | /api/auth/register | Public | `{ name, email, password }` |
| POST | /api/auth/login | Public | `{ email, password }` |
| GET | /api/auth/me | Private | — |
| POST | /api/tasks | Private | `{ title, description, dueDate, priority, status }` |
| GET | /api/tasks | Private | — |
| GET | /api/tasks/:id | Private | — |
| PUT | /api/tasks/:id | Private | any subset of task fields |
| DELETE | /api/tasks/:id | Private | — |

All `/api/tasks` routes require header: `Authorization: Bearer <token>`

## Ownership check (the fix noted in the AI usage report)

Every `GET/PUT/DELETE /api/tasks/:id` call checks `task.user.toString() === req.user._id.toString()`
before allowing access — so a logged-in user can only read, edit, or delete their **own** tasks,
even if they know another task's ID. This is the exact gap the assignment's AI usage report calls out
(AI-generated CRUD code that didn't check ownership before updating).

## Testing

Import the included `postman_collection.json` into Postman, set a `baseUrl` variable
(`http://localhost:5000/api`), run Register → Login (copy the returned token into the
collection's `token` variable) → then the Task endpoints.

## Deployment

- Backend → Render or Railway (set the same env vars there)
- Database → MongoDB Atlas (get the connection string from the Atlas dashboard)
- Update the frontend's `VITE_API_URL` to point at the deployed backend URL
