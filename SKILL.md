---
name: postman-backend
description: Use when working on the Postman-like API client backend (Express + Prisma + PostgreSQL). Triggers on collections, folders, requests, environments, JWT auth, request execution, or any change to the postman-backend codebase.
---

# Postman Backend Skill

Backend API that mimics core Postman functionality: collections, folders, saved requests, environments, request history, and live HTTP request execution.

## Stack

- **Runtime**: Node.js + TypeScript (ESM)
- **Framework**: Express 5
- **ORM / DB**: Prisma 7 + PostgreSQL (`@prisma/adapter-pg`)
- **Auth**: JWT (`jsonwebtoken`) + bcryptjs
- **HTTP client**: Axios (for executing requests)

## Project Layout

```
src/
├── controllers/     # Route handlers (auth, collection, folder, request, environment, execution)
├── services/        # Business logic + Prisma queries
├── routes/          # Express routers
├── middlewares/     # authenticateToken, error handler
├── types/           # Input/result types
├── utils/           # password hashing helpers
├── prisma.ts        # Prisma client singleton
└── server.ts        # App entry
prisma/
└── schema.prisma
```

## Core Domain Rules

1. **Ownership is mandatory**  
   Every collection, folder, request, and environment must be verified against `req.user.userId` before any read/write. Never trust IDs coming only from the URL.

2. **Hierarchy**  
   - User → Collections → Folders → Requests  
   - Requests can also live directly under a Collection (folderId optional)  
   - Cascade deletes are defined in the Prisma schema.

3. **Auth flow**  
   - Register / Login → return JWT  
   - Protected routes use `authenticateToken` middleware  
   - Token payload contains `userId` (and usually email/name)

4. **Request execution**  
   - Saved: load request by ID + ownership check → execute via Axios → optionally store History  
   - Unsaved: accept full request payload in body → execute → return response metadata (status, time, size, headers, body)

## Common Commands

```bash
npm run dev          # tsx watch src/server.ts
npx prisma generate
npx prisma db push   # or migrate
npm run build
```

## When Adding a New Feature

1. Update `prisma/schema.prisma` if new models/relations are needed.
2. Add service functions that always accept `userId` and perform ownership checks.
3. Add controller that extracts `userId` from `AuthRequest` and calls the service.
4. Wire routes under the correct parent (collection / folder) and protect with `authenticateToken`.
5. Keep response shape consistent:
   ```json
   { "success": true|false, "message"?: string, "data"?: any }
   ```

## Important Files to Read First

- `prisma/schema.prisma` – source of truth for models
- `src/middlewares/auth.middleware.ts` – JWT verification
- `src/services/request.service.ts` + `src/services/excute.service.ts` – core request logic
- `src/routes/collection.routes.ts` – nesting of folders & requests

## Anti-patterns to Avoid

- Skipping ownership checks (“I’ll just use the ID from params”)
- Putting business logic in controllers
- Returning raw Prisma errors to the client
- Hard-coding secrets (always use `process.env.JWT_SECRET`)
