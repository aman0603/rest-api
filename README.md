# Scalable REST API & Frontend

This project implements a scalable REST API with Authentication (JWT, RBAC) using FastAPI and a modern Frontend using Next.js.

## Tech Stack
- **Backend**: FastAPI, SQLAlchemy (Async), PostgreSQL, Pydantic, Alembic.
- **Frontend**: Next.js (App Router), TailwindCSS, Axios, Lucide React.
- **Package Manager**: `uv` (Backend), `npm` (Frontend).

## Project Structure
- `backend/`: FastAPI application.
- `frontend/`: Next.js application.

## Setup & Running

### Backend
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   uv sync
   ```
3. Run the server:
   ```bash
   uv run uvicorn app.main:app --reload
   ```
   Server will start at `http://localhost:8000`.
   Swagger Docs: `http://localhost:8000/docs`.

### Frontend
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   App will start at `http://localhost:3000`.

## Features
- **Authentication**: Secure Login and Registration with JWT.
- **RBAC**: Role-based access control (User vs Superuser).
- **CRUD**: Full Create, Read, Delete support for Tasks.
- **Modern UI**: Cyber-Industrial aesthetic with responsive design.
