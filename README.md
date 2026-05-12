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

### Completed (EPIC-03: Supplier CRUD)

- Supplier CRUD operations (list, get by ID, create, update, delete)
- Relationship mapping between Products and Suppliers
- Delete guard — prevents deleting suppliers with linked products
- Role-based route protection (write operations: ADMIN only)
- Zod schema validation (`createSupplierSchema`, `updateSupplierSchema`)
- Integration tests for Supplier endpoints

### Completed (EPIC-04: Product Enhancement)

- Dynamic SKU generator (`ELE-000001` format — based on category prefix)
- Pagination utility (`paginate`, `paginationMeta`) — supports `?page=`, `?limit=`
- Product filtering by name (`?name=`)
- Product list returns paginated response `{ data, meta }`
- Product detail includes nested `category` and `supplier` relations
- Category-aware SKU: auto-increments per category (`ELE-000001`, `ELE-000002`)
- Automatic local time conversion for all date fields (`withLocalTime` utility)

### Upcoming

- EPIC-05: Stock Transactions (IN/OUT with atomic operations)
- EPIC-06: Reports & Dashboard (Excel export)
- EPIC-07: Notifications (BullMQ + email alerts)
- EPIC-08: Testing & Documentation (Enhance coverage & Swagger UI)

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
| GET | `/api/products` | List products (paginated, filterable by `?name=`, `?page=`, `?limit=`) |
| GET | `/api/products/:id` | Get product by ID (includes category & supplier) |
| POST | `/api/products` | Create new product (auto-generates SKU) |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/categories` | List all categories (with product count) |
| GET | `/api/categories/:id` | Get category by ID |
| GET | `/api/suppliers` | List all suppliers |
| GET | `/api/suppliers/:id` | Get supplier by ID |

### Admin Only (ADMIN role + Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/users` | Create new user (ADMIN/STAFF) |
| POST | `/api/admin/categories` | Create new category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |
| POST | `/api/admin/suppliers` | Create new supplier |
| PUT | `/api/admin/suppliers/:id` | Update supplier |
| DELETE | `/api/admin/suppliers/:id` | Delete supplier |

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
│   ├── supplier.controller.ts
│   └── user.controller.ts
├── middlewares/
│   ├── auth.middleware.ts
│   ├── role.middleware.ts
│   ├── validate.middleware.ts
│   └── error-handler.middleware.ts
├── services/
│   ├── category.service.ts
│   ├── product.service.ts
│   ├── supplier.service.ts
│   └── user.service.ts
├── schemas/
│   ├── category.schema.ts
│   ├── product.schema.ts
│   ├── supplier.schema.ts
│   └── user.schema.ts
├── routes/
│   └── api.ts
├── types/
│   └── user.d.ts
├── utils/
│   ├── jwt.util.ts
│   ├── date.util.ts
│   ├── async-handler.ts
│   ├── pagination.util.ts
│   ├── sku.util.ts
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