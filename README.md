# Practice Express

A Node.js Express.js practice project for learning and building RESTful APIs.

## Features

### Done
- RESTful API with Express.js
- Prisma ORM with SQLite database
- JWT authentication (register/login)
- Product management (CRUD operations)
- User management
- Jest testing setup
- Input validation with Zod

### In Progress
- Excel file export functionality
- Winston logging

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed database
# npx prisma db seed
```

## Running Locally

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm run start
```

Server runs at `http://localhost:3000`

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3000
NODE_ENV="development"
```