# Environment Variables Setup Plan

## Context
The user noticed that `.env` variables (like `PORT`) were not being loaded into `process.env`.

## Root Cause
- The `dotenv` package was not installed.
- `dotenv.config()` was not called at the entry point of the application (`server.ts`).

## Proposed Changes

### 1. Install Dependencies
- Install `dotenv` to handle environment variable loading.

### 2. Configure Entry Point
- Add `import 'dotenv/config'` at the very top of `src/server.ts`.
- This ensures all subsequent imports (like the DB configuration) have access to the environment variables.

## Verification
- Run `npm run dev` and check if the server starts on the port defined in `.env` (if any).
