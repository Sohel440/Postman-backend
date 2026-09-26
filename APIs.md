# API List — Local Dev (`http://localhost:5000`)

Base URL: **`http://localhost:5000`**

Most protected routes require:

```http
Authorization: Bearer <token>
```

---

## Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Register user |
| `POST` | `/api/auth/login` | No | Login |
| `GET` | `/api/auth/profile` | Yes | Get current user profile |

**Full URLs:**
- `POST http://localhost:5000/api/auth/register`
- `POST http://localhost:5000/api/auth/login`
- `GET  http://localhost:5000/api/auth/profile`

---

## Collections (`/api/collection`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/collection` | Yes | Create collection |
| `GET` | `/api/collection` | Yes | Get all collections of the user |
| `GET` | `/api/collection/:id` | Yes | Get collection by ID |
| `PATCH` | `/api/collection/:id` | Yes | Update collection |
| `DELETE` | `/api/collection/:id` | Yes | Delete collection |

**Full URLs:**
- `POST   http://localhost:5000/api/collection`
- `GET    http://localhost:5000/api/collection`
- `GET    http://localhost:5000/api/collection/:id`
- `PATCH  http://localhost:5000/api/collection/:id`
- `DELETE http://localhost:5000/api/collection/:id`

---

## Folders (nested under collection)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/collection/:collectionId/folders` | Yes | Create folder |
| `GET` | `/api/collection/:collectionId/folders` | Yes | Get folders in collection |
| `GET` | `/api/collection/:collectionId/folders/:folderId` | Yes | Get folder by ID |
| `PATCH` | `/api/collection/:collectionId/folders/:folderId` | Yes | Update folder |
| `DELETE` | `/api/collection/:collectionId/folders/:folderId` | Yes | Delete folder |

**Full URLs:**
- `POST   http://localhost:5000/api/collection/:collectionId/folders`
- `GET    http://localhost:5000/api/collection/:collectionId/folders`
- `GET    http://localhost:5000/api/collection/:collectionId/folders/:folderId`
- `PATCH  http://localhost:5000/api/collection/:collectionId/folders/:folderId`
- `DELETE http://localhost:5000/api/collection/:collectionId/folders/:folderId`

---

## Requests

### Direct mount (`/api/requests`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/requests` | Yes | Create request |
| `GET` | `/api/requests` | Yes | Get requests |
| `GET` | `/api/requests/:id` | Yes | Get request by ID |
| `PATCH` | `/api/requests/:id` | Yes | Update request |
| `PUT` | `/api/requests/:id` | Yes | Update request |
| `DELETE` | `/api/requests/:id` | Yes | Delete request |
| `POST` | `/api/requests/:id/execute` | Yes | Execute saved request |
| `POST` | `/api/requests/execute` | Yes | Execute request |

**Full URLs:**
- `POST   http://localhost:5000/api/requests`
- `GET    http://localhost:5000/api/requests`
- `GET    http://localhost:5000/api/requests/:id`
- `PATCH  http://localhost:5000/api/requests/:id`
- `PUT    http://localhost:5000/api/requests/:id`
- `DELETE http://localhost:5000/api/requests/:id`
- `POST   http://localhost:5000/api/requests/:id/execute`
- `POST   http://localhost:5000/api/requests/execute`

### Nested under collection / folder

Same handlers (via `mergeParams`):

| Method | Endpoint |
|--------|----------|
| `POST` / `GET` | `/api/collection/:collectionId/requests` |
| `GET` / `PATCH` / `PUT` / `DELETE` | `/api/collection/:collectionId/requests/:id` |
| `POST` | `/api/collection/:collectionId/requests/:id/execute` |
| `POST` / `GET` | `/api/collection/:collectionId/folders/:folderId/requests` |
| `GET` / `PATCH` / `PUT` / `DELETE` | `/api/collection/:collectionId/folders/:folderId/requests/:id` |
| `POST` | `/api/collection/:collectionId/folders/:folderId/requests/:id/execute` |

**Full URLs (examples):**
- `POST   http://localhost:5000/api/collection/:collectionId/requests`
- `GET    http://localhost:5000/api/collection/:collectionId/requests`
- `GET    http://localhost:5000/api/collection/:collectionId/requests/:id`
- `PATCH  http://localhost:5000/api/collection/:collectionId/requests/:id`
- `PUT    http://localhost:5000/api/collection/:collectionId/requests/:id`
- `DELETE http://localhost:5000/api/collection/:collectionId/requests/:id`
- `POST   http://localhost:5000/api/collection/:collectionId/requests/:id/execute`
- `POST   http://localhost:5000/api/collection/:collectionId/folders/:folderId/requests`
- `GET    http://localhost:5000/api/collection/:collectionId/folders/:folderId/requests`
- `GET    http://localhost:5000/api/collection/:collectionId/folders/:folderId/requests/:id`
- `PATCH  http://localhost:5000/api/collection/:collectionId/folders/:folderId/requests/:id`
- `PUT    http://localhost:5000/api/collection/:collectionId/folders/:folderId/requests/:id`
- `DELETE http://localhost:5000/api/collection/:collectionId/folders/:folderId/requests/:id`
- `POST   http://localhost:5000/api/collection/:collectionId/folders/:folderId/requests/:id/execute`

---

## Environments (`/api/v1/environments`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/environments` | Yes | Get all environments |
| `GET` | `/api/v1/environments/:id` | Yes | Get one environment |
| `PATCH` | `/api/v1/environments/:id` | Yes | Update environment |
| `DELETE` | `/api/v1/environments/:id` | Yes | Delete environment |

**Full URLs:**
- `GET    http://localhost:5000/api/v1/environments`
- `GET    http://localhost:5000/api/v1/environments/:id`
- `PATCH  http://localhost:5000/api/v1/environments/:id`
- `DELETE http://localhost:5000/api/v1/environments/:id`

> **Note:** There is a `createEnviromentVariable` controller function, but it is **not** registered in the route file, so there is currently **no POST create environment** endpoint.

---

## Base path summary

```
http://localhost:5000/api/auth
http://localhost:5000/api/collection
http://localhost:5000/api/requests
http://localhost:5000/api/v1/environments
```

Server defaults to port `3000` (`process.env.PORT || 3000`).  
Use `PORT=5000` in `.env` for local dev.
