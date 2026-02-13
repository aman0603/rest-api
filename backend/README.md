# Scalable REST API Backend

This is the backend service for the Scalable REST API, built with **FastAPI**, **PostgreSQL (Async)**, and **SQLAlchemy**. It handles user authentication, role-based access control, and task management.

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- `uv` package manager (recommended) or `pip`
- PostgreSQL Database (Neon DB or local)

### Installation

1.  **Clone & Enter Directory**:
    ```bash
    cd backend
    ```

2.  **Install Dependencies**:
    Using `uv`:
    ```bash
    uv sync
    ```
    Or using `pip`:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the `backend/` directory (if not exists) with the following content:
    ```ini
    PROJECT_NAME="Scalable REST API"
    API_V1_STR="/api/v1"
    # Replace with your actual Neon/Postgres connection string
    DATABASE_URL="postgresql+asyncpg://user:password@host/dbname"
    SECRET_KEY="your-super-secret-key-change-this-in-production"
    ALGORITHM="HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```

4.  **Run the Server**:
    ```bash
    uv run uvicorn app.main:app --reload
    ```
    The server will start at `http://127.0.0.1:8000`.

---

## 🧪 Testing Process & API Guide

You can test the API using:
1.  **Swagger UI (Interactive Docs)**: Go to `http://127.0.0.1:8000/docs`. This is the easiest way.
2.  **frontend**: The included Next.js frontend.
3.  **cURL / Postman**: For manual testing.

### 🔑 Authentication Flow

#### 1. Register a New User
Create a new account to get started.

*   **Endpoint**: `POST /api/v1/auth/register`
*   **Body (JSON)**:
    ```json
    {
      "email": "user@example.com",
      "password": "strongpassword123"
    }
    ```
*   **Response**: Returns the created user object (without password).

#### 1.1 Create Superuser (Admin)
Since the public registration endpoint only creates standard users, use the provided script to create an admin.
1.  Run the script:
    ```bash
    uv run python create_superuser.py
    ```
2.  Enter the desired email and password when prompted.
3.  This user will have `is_superuser=True` and can access admin-only features (if any).

#### 2. Login (Get Access Token)
Exchange your credentials for a JWT access token.

*   **Endpoint**: `POST /api/v1/auth/access-token`
*   **Content-Type**: `application/x-www-form-urlencoded`
*   **Body (Form Data)**:
    *   `username`: `user1@gmail.com` (Note: OAuth2 spec uses "username" field for email)
    *   `password`: `strongpassword123`
*   **Response**:
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR...",
      "token_type": "bearer"
    }
    ```
*   **Important**: Copy the `access_token` for subsequent requests.

### 📝 Task Management (Protected Routes)

All task endpoints require the **Authorization Header**.
*   **Header**: `Authorization: Bearer <your_access_token>`

#### 3. Create a Task
*   **Endpoint**: `POST /api/v1/tasks/`
*   **Body (JSON)**:
    ```json
    {
      "title": "Complete Backend Documentation",
      "description": "Write a detailed README for the API."
    }
    ```
*   **Response**: Returns the created task.

#### 4. Get All Tasks
Retrieves tasks belonging to the logged-in user.

*   **Endpoint**: `GET /api/v1/tasks/`
*   **Parameters**:
    *   `skip` (query, optional, default=0): Number of records to skip.
    *   `limit` (query, optional, default=100): Max records to return.
*   **Response**: Array of task objects.

#### 5. Get Single Task
*   **Endpoint**: `GET /api/v1/tasks/{id}`
*   **Path Param**: `id` (integer) - The ID of the task.

#### 6. Delete Task
*   **Endpoint**: `DELETE /api/v1/tasks/{id}`
*   **Path Param**: `id` (integer)

---

## 🏗️ Project Structure
```
backend/
├── app/
│   ├── api/            # API Endpoints (Auth, Tasks)
│   ├── core/           # Config & Security (JWT, Hashing)
│   ├── crud/           # Database Operations (CRUD Logic)
│   ├── db/             # Database Session & Base Models
│   ├── models/         # SQLAlchemy Database Models
│   ├── schemas/        # Pydantic Schemas (Request/Response)
│   └── main.py         # App Entry Point
├── .env                # Environment Variables
├── pyproject.toml      # Project Metadata & Dependnecies
└── README.md           # This file
```
