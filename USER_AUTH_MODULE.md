# User Authentication Module
## Overview
This module handles user authentication using JSON Web Tokens (JWT). It includes features for user registration, user login, and securing routes that require authentication.
## Features
- **Registration**: Create an account with name, email, password.
- **Login**: Authenticate user and receive a JWT.
- **Auth Middleware**: Protect routes by validating JWT.

## Auth Endpoints
### 1. POST /api/auth/register
### 2. POST /api/auth/login
### 3. GET /api/auth/profile (Protected)
- **Description**: Returns the authenticated user's profile.
- **Requires**: `Authorization: Bearer <token>` header.

## Collection Endpoints (Protected)
### 1. GET /api/collection
- **Description**: Returns all collections owned by the authenticated user.
- **Requires**: `Authorization: Bearer <token>` header.
### 2. POST /api/collection
- **Description**: Creates a new collection for the authenticated user.
- **Requires**: `Authorization: Bearer <token>` header.
### 3. GET /api/collection/:id
- **Description**: Returns a specific collection owned by the authenticated user.
- **Requires**: `Authorization: Bearer <token>` header.
### 4. PATCH /api/collection/:id
- **Description**: Updates an existing collection owned by the authenticated user.
- **Requires**: `Authorization: Bearer <token>` header.
### 5. DELETE /api/collection/:id
- **Description**: Deletes an existing collection owned by the authenticated user and cascades deletes to folders and requests.
- **Requires**: `Authorization: Bearer <token>` header.

## Folder Endpoints (Protected)
### 1. POST /api/collection/:collectionId/folders
- **Description**: Creates a new folder inside a collection owned by the authenticated user.
- **Requires**: `Authorization: Bearer <token>` header.
- **Body**: `{ "name": "Folder Name" }`

### 2. GET /api/collection/:collectionId/folders
- **Description**: Returns all folders inside a specific collection owned by the user.
- **Requires**: `Authorization: Bearer <token>` header.

### 3. GET /api/collection/:collectionId/folders/:folderId
- **Description**: Returns a specific folder and its requests.
- **Requires**: `Authorization: Bearer <token>` header.

### 4. PATCH /api/collection/:collectionId/folders/:folderId
- **Description**: Updates a folder's name.
- **Requires**: `Authorization: Bearer <token>` header.
- **Body**: `{ "name": "Updated Name" }`

### 5. DELETE /api/collection/:collectionId/folders/:folderId
- **Description**: Deletes a folder and cascades delete to nested requests.
- **Requires**: `Authorization: Bearer <token>` header.
