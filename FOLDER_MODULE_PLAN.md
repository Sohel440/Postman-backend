# Folder Module Implementation Plan (Inside Collections)

## 1. Overview
In a Postman clone, a **Folder** organizes requests inside a **Collection**.
This plan outlines how to implement the Folder creation and management API inside collections while strictly preserving existing architectural conventions, database integrity, and ownership verification.

---

## 2. Database Model Reference (Prisma)
From `prisma/schema.prisma` (already existing, **no DB schema changes required**):

```prisma
model Folder {
  id           String     @id @default(uuid())
  collectionId String
  name         String
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  requests     Request[]

  @@index([collectionId])
}
```

---

## 3. Endpoints Design

### Primary Feature (Create Folder inside Collection)
- **POST `/api/collection/:collectionId/folders`**
  - **Route Pattern**: Nested under collection resource so parent-child hierarchy is clear.
  - **Headers**:
    ```http
    Authorization: Bearer <JWT_TOKEN>
    Content-Type: application/json
    ```
  - **Request Body**:
    ```json
    {
      "name": "Auth APIs"
    }
    ```
  - **Responses**:
    - `201 Created`:
      ```json
      {
        "success": true,
        "message": "Folder created successfully",
        "data": {
          "id": "uuid",
          "collectionId": "collection-uuid",
          "name": "Auth APIs",
          "createdAt": "...",
          "updatedAt": "..."
        }
      }
      ```
    - `400 Bad Request`: When `name` is missing, not a string, or empty after trim.
    - `401 Unauthorized`: When token is missing or invalid.
    - `404 Not Found`: When the collection does not exist or does not belong to the user.

---

## 4. Security & Ownership Verification Flow

A folder **must never** be created inside a collection that does not belong to the authenticated user.

```
POST /api/collection/:collectionId/folders
               │
               ▼
       authenticateToken (JWT)
               │
               ▼
       Extract `userId` from req.user
       Extract `collectionId` from req.params.collectionId
       Extract `name` from req.body
               │
               ▼
       Validate Input (name must not be empty or whitespace)
               │
               ▼
       Ownership Check:
       prisma.collection.findFirst({
         where: {
           id: collectionId,
           userId: userId
         }
       })
          /         \
   Not Found        Found & Owned
       │                  │
       ▼                  ▼
    404 Not Found    prisma.folder.create({
  "Collection not      data: {
      found"             name: name.trim(),
                         collectionId: collectionId
                       }
                     })
                          │
                          ▼
                     201 Created Response
```

---

## 5. Proposed File Structure & Changes

### 1) Types (`src/types/folder.types.ts`)
Define request and response interfaces:
- `FolderCreateInput`: `{ name: string; collectionId: string }`
- `FolderResponse`: Standard typed response matching API conventions.

### 2) Service (`src/services/folder.service.ts`)
- Function: `createFolderService(userId: string, collectionId: string, name: string)`
  1. Checks parent collection ownership via `prisma.collection.findFirst({ where: { id: collectionId, userId } })`.
  2. If not found, returns `null`.
  3. Creates folder via `prisma.folder.create({ data: { name, collectionId } })`.
  4. Returns the created record.

### 3) Controller (`src/controllers/folder.controller.ts`)
- Function: `createFolder(req: AuthRequest, res: Response, next: NextFunction)`
  1. Reads `collectionId` from `req.params.collectionId`.
  2. Reads `name` from `req.body`.
  3. Validates that `name` is provided and non-empty after trimming.
  4. Calls `createFolderService`.
  5. Returns `404` if collection not found/unauthorized, or `201` with standard payload structure.

### 4) Route Setup (`src/routes/collection.routes.ts` or `src/routes/folder.routes.ts`)
- Attach the nested route to `collectionRouter`:
  ```typescript
  collectionRouter.route("/:collectionId/folders")
    .post(authenticateToken, createFolder);
  ```
  *(Or optionally register `folderRouter` with Express `mergeParams: true`).*

---

## 6. Review & Approval Checklist
- [ ] Confirm route choice: `POST /api/collection/:collectionId/folders` vs `POST /api/folders`.
- [ ] Confirm response and error status conventions (`201`, `400`, `401`, `404`).
- [ ] Ready to integrate upon confirmation.


8.2 Get All Folders

GET /api/v1/collections/:collectionId/folders

First verify that the collection belongs to the authenticated user.



8.3 Get Folder by ID

GET /api/v1/collections/:collectionId/folders/:folderId

Recommended ownership query:



8.4 Update Folder

PATCH /api/v1/collections/:collectionId/folders/:folderId

Body:

{
  "name": "Authentication APIs"
}

Validation:

Name must be a string when supplied.

Name cannot be empty after trimming.

Folder must belong to the specified collection.

Collection must belong to the authenticated user.


8.5 Delete Folder

DELETE /api/v1/collections/:collectionId/folders/:folderId

Verify:

folder belongs to collection
AND
collection belongs to authenticated user

Response:

{
  "success": true,
  "message": "Folder deleted successfully"
}

Because the Prisma relation uses onDelete: Cascade, deleting the folder also deletes requests belonging to that folder.

History remains preserved because Request -> History uses SetNull.