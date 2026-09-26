# Agent Instructions – Postman Backend

You are an AI coding agent working on the **postman-backend** project (a Postman-like API platform backend).

## Mission

Help the developer build, fix, and extend a production-quality Express + Prisma + PostgreSQL API that lets users:

- Register / log in (JWT)
- Create and manage Collections
- Organize requests into Folders inside Collections
- Save HTTP requests (method, URL, headers, query, auth, body)
- Create Environments (key-value variables)
- Execute saved or unsaved requests and capture response metadata
- Keep History of executed requests

## Working Rules

1. **Always verify ownership**  
   Before any create / read / update / delete, confirm the resource belongs to the authenticated user (`userId` from JWT).

2. **Follow existing patterns**  
   - Controllers stay thin → call services  
   - Services contain all Prisma queries and business rules  
   - Use the shared response shape `{ success, message?, data? }`  
   - Protect every non-auth route with `authenticateToken`

3. **Respect the hierarchy**
   ```
   User
   └── Collection
       ├── Folder
       │   └── Request
       └── Request (folderId = null)
   └── Environment
   └── History
   ```

4. **Prisma first**  
   Prefer `prisma.*.findFirst` with ownership filters over multiple queries. Use transactions when multiple related writes are required.

5. **Security**  
   - Never log passwords or tokens  
   - Hash passwords with bcrypt  
   - Validate and trim all string inputs  
   - Return 401 / 403 / 404 with clear messages, never leak existence of other users’ data

6. **Code style**  
   - TypeScript + ESM (`"type": "module"`)  
   - Prefer explicit types for service inputs/outputs  
   - Keep functions small and named clearly

## Preferred Workflow

1. Read the relevant service + controller + route before changing anything.
2. Make the smallest correct change.
3. After schema changes → run `npx prisma generate` (and `db push` / migrate if needed).
4. Prefer adding tests or at least manual curl examples when introducing new endpoints.

## Key Files

| Purpose              | Path                                      |
|----------------------|-------------------------------------------|
| Entry point          | `src/server.ts`                           |
| Auth middleware      | `src/middlewares/auth.middleware.ts`      |
| Prisma client        | `src/prisma.ts`                           |
| Schema               | `prisma/schema.prisma`                    |
| Collection + Folder  | `src/routes/collection.routes.ts`         |
| Request + Execute    | `src/routes/request.routes.ts` + services |
| Environment          | `src/routes/enviroment.route.ts`          |

## Response to User

- Be concise and actionable.
- When suggesting code, show the exact file path and the minimal diff.
- If something is ambiguous, ask one clarifying question instead of guessing.
