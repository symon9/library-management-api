# Library Management REST API

A Library Management REST API built for a bootcamp capstone assignment.

## Tech Stack
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Docker
- JWT
- Swagger

## Running locally

```bash
# Install dependencies
npm install

# Start the development server
npm run start:dev
```

## Running with Docker

```bash
# Build and start containers in the background
docker compose up --build -d
```

## Environment Variables

Check the `.env.example` file for required environment variables:
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USERNAME`: Database user
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRES_IN`: JWT expiration time (e.g., 15m)
- `PORT`: API Port

## API Endpoints

| Resource | Method | Endpoint | Description |
|---|---|---|---|
| Auth | POST | `/api/auth/register` | Register a new member |
| Auth | POST | `/api/auth/login` | Login and receive JWT |
| Books | GET | `/api/books` | Get all books |
| Books | GET | `/api/books/:id` | Get book by ID |
| Books | POST | `/api/books` | Add a new book |
| Books | PATCH | `/api/books/:id` | Update a book |
| Books | DELETE| `/api/books/:id` | Delete a book |
| Members | GET | `/api/members` | Get all members |
| Members | GET | `/api/members/:id` | Get member by ID |
| Members | POST | `/api/members` | Add a new member |
| Members | PATCH | `/api/members/:id` | Update a member |
| Members | DELETE| `/api/members/:id` | Delete a member |
| Borrows | POST | `/api/borrows` | Borrow a book |
| Borrows | POST | `/api/borrows/:id/return`| Return a book |
