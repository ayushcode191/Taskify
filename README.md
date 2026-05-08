# Taskify — Team & Project Management App

Taskify is a full-stack MERN application built to help teams manage projects, assign tasks, and track work progress efficiently. The platform provides role-based access control, project organization tools, Kanban-style task management, dashboards, and a modern responsive interface.

The application is designed with a clean SaaS-inspired UI and focuses on improving collaboration between admins, managers, and team members.

---

## Project Structure

```bash
taskify/
├── backend/
└── frontend/
```

---

# Tech Stack

## Frontend
- React.js
- Tailwind CSS
- React Router
- React Query

## Backend
- Node.js
- Express.js
- MongoDB

---

# Features

## Authentication
- User Signup & Login
- JWT Authentication
- Protected Routes
- Role-Based Access Control

---

## Role Management

### Admin
- Full access to the system
- Manage users, projects, and tasks

### Manager
- Create and manage projects
- Assign tasks to team members

### Member
- Access assigned projects
- Update personal task status

> The first registered user automatically becomes the admin.

---

# Project Management
- Create projects
- Set project priority and status
- Assign members
- Track project progress
- Edit and delete projects

---

# Task Management
- Create and assign tasks
- Drag-and-drop Kanban board
- Update task status
- Set due dates and priorities
- Filter and search tasks

---

# Dashboard
- Active projects overview
- Open and overdue tasks
- Team statistics
- Charts and analytics
- Recent activity section

---

# Profile Section
- Update profile details
- Upload profile image preview
- Change password
- Role display section

---

# UI Features
- Responsive layout
- Modern dashboard UI
- Sidebar navigation
- Interactive cards and modals
- Toast notifications
- Loading skeletons
- Empty states

---

# API Routes

## Authentication

```bash
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
PATCH  /api/auth/me
POST   /api/auth/change-password
```

---

## Users

```bash
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id/role
DELETE /api/users/:id
```

---

## Projects

```bash
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PATCH  /api/projects/:id
DELETE /api/projects/:id
```

---

## Tasks

```bash
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

---

## Dashboard

```bash
GET /api/dashboard/stats
```

---

# Installation

## Backend Setup

```bash
cd backend
npm install
npm run seed
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Environment Variables

## Backend `.env`

```env
PORT=5000
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb://127.0.0.1:27017/taskify

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
```

---

## Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

# Demo Accounts

| Role    | Email               | Password   |
|----------|--------------------|------------|
| Admin    | admin@taskify.app  | admin123   |
| Manager  | manager@taskify.app| manager123 |
| Member   | member@taskify.app | member123  |

---

# Scripts

## Backend

```bash
npm run dev
npm start
npm run seed
```

---

## Frontend

```bash
npm run dev
npm run build
npm run preview
```

---

# Future Improvements
- Real-time notifications
- Team chat system
- File uploads
- Activity logs
- Dark mode support

---

# Conclusion

Taskify is a complete MERN stack project management platform developed to simplify team collaboration and workflow organization. The project demonstrates practical implementation of authentication, role-based access control, REST APIs, database relationships, responsive frontend design, and modern UI development.