# 📚 Library Management REST API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

A production-ready, feature-rich RESTful API built for a Library Management System. This project was developed as a Capstone assignment, focusing on robust business logic, role-based security, and professional infrastructure.

---

## 🚀 Key Features

### 📖 Book Management
- Full CRUD operations for library inventory.
- Automatic tracking of **Total vs. Available** copies.
- Inventory-aware borrowing logic.

### 👥 Member & User Management
- **Role-Based Access Control (RBAC)**: Admin, Librarian, and Member roles.
- **Secure Authentication**: JWT-based auth with Access and Refresh tokens.
- **Soft Deletion**: Members are deactivated rather than deleted to preserve historical data.

### 🧠 Intelligent Business Logic
- **Availability Checks**: Prevents borrowing if `availableCopies < 1`.
- **Double-Borrowing Protection**: Members cannot borrow the same book twice simultaneously.
- **Auto-Deadlines**: Automatically calculates 14-day due dates for all borrows.
- **Inventory Automation**: Books are automatically "checked out" and "checked in" on the inventory level.

---

## 🛠️ Tech Stack
- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Security**: Passport-JWT, Bcrypt
- **Documentation**: Swagger UI / OpenAPI 3.0
- **Infrastructure**: Docker & Docker Compose

---

## 📦 Getting Started

### Option A: Running with Docker (Recommended)
The easiest way to get the entire stack (API + DB + pgAdmin) running.

```bash
# Clone the repository
git clone <your-repo-url>
cd library-management-api

# Start everything
docker compose up --build -d
```
- **API**: `http://localhost:3000`
- **Documentation**: `http://localhost:3000/api`
- **pgAdmin**: `http://localhost:5050` (Login: `admin@admin.com` / `admin`)

---

### Option B: Manual Setup (Local)
For development without Docker.

1. **Database**: Create a PostgreSQL database named `library`.
2. **Env**: Create a `.env` file based on `.env.example`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=library
   JWT_SECRET=super-secret-key
   PORT=3000
   ```
3. **Run**:
   ```bash
   npm install
   npm run start:dev
   ```

---

## 📖 API Documentation

The API is fully documented using **Swagger**. 
Once the server is running, visit: **`http://localhost:3000/api`**

### 🧪 Automated Testing (Postman)
A professional Postman collection is included in the root:
`api.postman_collection.json`

**Features of the collection:**
- Automated token management (Login once, test everything).
- Pre-configured variables for IDs.
- Automated test scripts for business rules.

---

## 📁 Architecture
The project follows a modular NestJS architecture:
- `auth/`: Security, JWT, and User Management.
- `books/`: Inventory and catalog logic.
- `members/`: User directory and soft-delete logic.
- `borrows/`: The "Engine" of the app (Lending logic).

---

## 🛡️ License
Distributed under the MIT License.
