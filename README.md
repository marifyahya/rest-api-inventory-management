# Inventory Management REST API

REST API for inventory management — built as a learning project to practice **Node.js**, **Express 5**, **TypeScript**, and **Prisma ORM**.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express 5
- **Language:** TypeScript
- **ORM:** Prisma (SQLite)
- **Auth:** JWT + bcryptjs
- **Validation:** Zod
- **Testing:** Jest + Supertest
- **Docs:** OpenAPI 3.0

## Features

### Completed (EPIC-01: Auth Hardening)

- JWT authentication with bcrypt password hashing
- Role-based access control (ADMIN / STAFF)
- Auth middleware (token verification)
- Role middleware (permission guard)
- Route grouping (public / protected / admin)
- Input validation with Zod schemas
- Product CRUD operations
- User management (ADMIN only)
- Jest unit & integration testing

### Completed (EPIC-02: Category CRUD)

- Category CRUD operations (list, get by ID, create, update, delete)
- Product count aggregation per category (`_count.products`)
- Delete guard — prevents deleting categories with linked products
- Role-based route protection (write operations: ADMIN only)
- Zod schema validation (`createCategorySchema`, `updateCategorySchema`)
- Unit & integration tests for Category Service and Controller
- OpenAPI documentation for Category endpoints

### Upcoming

- EPIC-03: Supplier CRUD
- EPIC-04: Product Enhancement (SKU, pagination, filters)
- EPIC-05: Stock Transactions (IN/OUT with atomic operations)
- EPIC-06: Reports & Dashboard (Excel export)
- EPIC-07: Notifications (BullMQ + email alerts)
- EPIC-08: Testing & Documentation

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed default ADMIN user
npx prisma db seed
```

## Running Locally

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm run start
```

Server runs at `http://localhost:3002`

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## API Endpoints

Base URL: `http://localhost:3002`

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/auth/login` | Login and get JWT token |

### Protected (Bearer token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Get current user profile |
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/categories` | List all categories (with product count) |
| GET | `/api/categories/:id` | Get category by ID |

### Admin Only (ADMIN role + Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/users` | Create new user (ADMIN/STAFF) |
| POST | `/api/admin/categories` | Create new category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |

## Default Credentials

After running `npx prisma db seed`:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password | ADMIN |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"
PORT=3002
NODE_ENV="development"
TIME_ZONE="Asia/Jakarta"
```

## Project Structure

```
src/
├── controllers/
│   ├── auth.controller.ts
│   ├── category.controller.ts
│   ├── product.controller.ts
│   └── user.controller.ts
├── middlewares/
│   ├── auth.middleware.ts
│   ├── role.middleware.ts
│   ├── validate.middleware.ts
│   └── error-handler.middleware.ts
├── services/
│   ├── category.service.ts
│   ├── user.service.ts
│   └── product.service.ts
├── schemas/
│   ├── category.schema.ts
│   ├── user.schema.ts
│   └── product.schema.ts
├── routes/
│   └── api.ts
├── types/
│   └── user.d.ts
├── utils/
│   ├── jwt.util.ts
│   ├── date.util.ts
│   ├── async-handler.ts
│   └── errors/
│       └── AppError.ts
├── lib/
│   └── prisma.ts
├── __tests__/
│   ├── integration/
│   ├── unit/
│   └── utils/
├── app.ts
└── server.ts
```

## API Documentation

OpenAPI 3.0 documentation is available at `docs/openapi.yaml`.

## License

MIT