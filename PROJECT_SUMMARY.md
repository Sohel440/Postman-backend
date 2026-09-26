# Postman Backend – Project Summary

## What This Project Is

A backend API that re-implements the core features of Postman:

- User accounts with JWT authentication
- Collections (like Postman workspaces/folders for APIs)
- Folders inside collections
- Saved HTTP requests (method, URL, headers, query params, authorization, body)
- Environments (named sets of variables)
- Ability to **execute** both saved and unsaved requests
- Request history (status, response time, size, headers, body)

Tech stack: **Node.js + TypeScript + Express 5 + Prisma 7 + PostgreSQL + JWT + Axios**.

---

## What Was Built (Implemented)

### 1. Authentication Module
- `POST /api/auth/register` – create user (name, email, password)
- `POST /api/auth/login` – return JWT
- `GET /api/auth/profile` – protected profile endpoint
- Password hashing with bcrypt
- JWT middleware (`authenticateToken`) used on all protected routes

### 2. Collection Module
- Create / list / get / update / delete collections
- All operations scoped to the authenticated user
- Cascade delete of folders and requests when a collection is deleted

### 3. Folder Module
- Create folders inside a collection
- List folders of a collection
- Get / update / delete a specific folder
- Ownership is verified through the parent collection

### 4. Request Module
- Create requests under a collection (optionally inside a folder)
- List, get, update, delete requests
- Ownership checks via collection → user

### 5. Request Execution
- Execute a **saved** request by ID
- Execute an **unsaved** request (full payload in body)
- Uses Axios under the hood
- Returns status, response time, size, headers, and body
- Designed to also write to the `History` model

### 6. Environment Module
- Create / list / get / update / delete environments
- Stores arbitrary key-value variables as JSON
- Scoped to the authenticated user

### 7. Data Model (Prisma)
```
User
 ├── Collection
 │    ├── Folder
 │    │    └── Request
 │    └── Request (folderId optional)
 ├── Environment
 └── History
```

---

## Requirements That Were Followed

| Requirement | Status | Notes |
|-------------|--------|-------|
| User registration & login with JWT | ✅ Done | bcrypt + jsonwebtoken |
| Protected routes | ✅ Done | `authenticateToken` middleware |
| Collections owned by user | ✅ Done | Every query filters by `userId` |
| Folders nested under collections | ✅ Done | Nested routes + ownership check |
| Requests under collection or folder | ✅ Done | `folderId` is optional |
| CRUD for all main resources | ✅ Done | Create, Read, Update, Delete |
| Execute HTTP requests | ✅ Done | Saved + unsaved paths |
| Environments with variables | ✅ Done | JSON field |
| Cascade deletes | ✅ Done | Defined in Prisma schema |
| Consistent JSON response shape | ✅ Mostly | `{ success, message?, data? }` |
| TypeScript + ESM | ✅ Done | `"type": "module"` |
| PostgreSQL via Prisma | ✅ Done | `@prisma/adapter-pg` |

---

## Project Structure

```
postman-backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── collection.controller.ts
│   │   ├── folder.controller.ts
│   │   ├── request.controller.ts
│   │   ├── environment.controller.ts
│   │   └── excution.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── collection.service.ts
│   │   ├── folder.service.ts
│   │   ├── request.service.ts
│   │   ├── environment.service.ts
│   │   └── excute.service.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── collection.routes.ts
│   │   ├── request.routes.ts
│   │   └── enviroment.route.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── types/
│   ├── utils/
│   ├── prisma.ts
│   └── server.ts
├── package.json
├── FOLDER_MODULE_PLAN.md
└── USER_AUTH_MODULE.md
```

---

## How to Run

```bash
# Install
npm install

# Environment
cp .env.example .env   # set DATABASE_URL and JWT_SECRET

# Database
npx prisma generate
npx prisma db push

# Development
npm run dev
```

---

## Known Gaps / Possible Next Steps

- Full History persistence after every execution
- Environment variable substitution (`{{var}}`) inside request URL/headers/body
- Import / export of collections (Postman JSON format)
- Role-based sharing of collections
- Rate limiting & request validation (Zod / Joi)
- Unit + integration tests
- OpenAPI / Swagger documentation

---

## Summary

This project delivers a solid, ownership-aware backend that covers the main workflows of Postman: organizing APIs into collections and folders, saving requests, managing environments, and actually executing HTTP calls. The architecture cleanly separates routes → controllers → services and uses Prisma for type-safe database access.
