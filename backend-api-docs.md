# Project Management System Server — API Documentation

Generated from the current Express routes/controllers in `src/app.js`, `src/routes/*`, `src/controllers/*`.

## Base URL

- Default: `http://localhost:5000`
- Port: `PORT` env (fallback `5000`)

## Content type

- Send JSON bodies with: `Content-Type: application/json`

## Authentication & Authorization

### Access token (Bearer)

- Header: `Authorization: Bearer <accessToken>`
- JWT payload contains:
  - `sub` (user id)
  - `role` (`ADMIN|MANAGER|STAFF`)
  - `type: "access"` (enforced)
- If `JWT_ISSUER` / `JWT_AUDIENCE` are set, tokens must match them.

### Refresh token (HttpOnly cookie)

- Cookie name: `refreshToken`
- Used by: `POST /auth/refresh` (no Bearer token required)
- Rotation is implemented:
  - Refresh tokens are stored server-side as SHA-256 hashes in MongoDB (`RefreshToken` model).
  - On refresh, the current token is revoked and replaced.

### Roles

- `requireRole('ADMIN')` returns:
  - `401` if unauthenticated
  - `403` if authenticated but forbidden

### Inactive users

- Any Bearer-protected route rejects inactive users:
  - `403 { "message": "User is inactive" }`

## Error format

Most errors are returned as:

```json
{ "message": "..." }
```

Common statuses:

- `400` validation errors (Zod)
- `401` missing/invalid access token
- `403` forbidden / invalid refresh token / inactive user
- `404` not found
- `409` conflict (e.g., last admin protection, duplicate user/invite)
- `500` internal server error

## Rate limiting (built-in)

- `POST /auth/login`: 10 requests / 15 minutes
- `POST /auth/register-via-invite`: 10 requests / 15 minutes
- `POST /auth/refresh`: 30 requests / 5 minutes

## CORS & Cookies

- CORS runs with `credentials: true`.
- `CORS_ORIGIN`:
  - If set: comma-separated allowed origins
  - If not set: reflects request origin (`true`)
- Refresh cookie options:
  - `httpOnly: true`
  - `secure: NODE_ENV === "production"`
  - `sameSite: COOKIE_SAMESITE` (default `Strict`)
  - `domain: COOKIE_DOMAIN` (optional)
  - `maxAge`: from `REFRESH_TOKEN_TTL` (fallback 7 days if unparsable)

---

# Health

## GET `/health`

No auth.

### Response `200`

```json
{ "ok": true }
```

---

# Auth (`/auth`)

## POST `/auth/login`

No auth.

### Body

```json
{ "email": "user@example.com", "password": "min 6 chars" }
```

### Response `200`

- Sets `refreshToken` HttpOnly cookie

```json
{
  "accessToken": "string",
  "user": { "id": "string", "name": "string", "email": "string", "role": "ADMIN|MANAGER|STAFF", "status": "ACTIVE|INACTIVE" }
}
```

### Errors

- `401` Invalid credentials
- `403` User is inactive

## GET `/auth/me`

Bearer auth required.

### Response `200`

```json
{
  "user": { "id": "string", "name": "string", "email": "string", "role": "ADMIN|MANAGER|STAFF", "status": "ACTIVE|INACTIVE" }
}
```

## POST `/auth/refresh`

Uses `refreshToken` cookie (no Bearer token).

### Response `200`

- Rotates refresh token cookie

```json
{
  "accessToken": "string",
  "user": { "id": "string", "name": "string", "email": "string", "role": "ADMIN|MANAGER|STAFF", "status": "ACTIVE|INACTIVE" }
}
```

### Errors

- `401 { "message": "No refresh token" }` (cookie missing)
- `403` Invalid refresh token / invalid type / user inactive / user not found

## POST `/auth/logout`

No auth required (cookie optional).

### Response

- `204 No Content`
- Clears refresh cookie
- If a refresh cookie was present and matches an active session, that session is revoked.

## POST `/auth/invite`

Bearer auth required + `ADMIN` role.

### Body

```json
{ "email": "new.user@example.com", "role": "ADMIN|MANAGER|STAFF" }
```

### Response `201`

```json
{
  "message": "Invite created",
  "invite": {
    "id": "string",
    "email": "string",
    "role": "ADMIN|MANAGER|STAFF",
    "token": "string",
    "expiresAt": "ISO date"
  },
  "inviteLink": "/register?token=<token>"
}
```

### Errors

- `409` User already exists
- `409` Active invite already exists

## POST `/auth/register-via-invite`

No auth.

### Body

```json
{ "token": "string (min length 10)", "name": "string (min length 2)", "password": "string (min length 6)" }
```

### Response `201`

- Sets `refreshToken` HttpOnly cookie

```json
{
  "message": "Registration complete",
  "accessToken": "string",
  "user": { "id": "string", "name": "string", "email": "string", "role": "ADMIN|MANAGER|STAFF", "status": "ACTIVE|INACTIVE" }
}
```

### Errors

- `400` Invalid invite token / Invite already used / Invite expired
- `409` User already exists

---

# Users (`/users`) — ADMIN only

All `/users/*` routes require:

- `Authorization: Bearer <accessToken>`
- role `ADMIN`

## GET `/users?page=&limit=`

### Query

- `page` (string -> number, default `1`, min `1`)
- `limit` (string -> number, default `10`, min `1`, max `100`)

### Response `200`

Returns Mongoose user documents with `password` excluded (note: shape includes `_id`, timestamps, etc.).

```json
{
  "page": 1,
  "limit": 10,
  "total": 123,
  "items": [
    {
      "_id": "…",
      "name": "…",
      "email": "…",
      "role": "ADMIN|MANAGER|STAFF",
      "status": "ACTIVE|INACTIVE",
      "createdAt": "…",
      "updatedAt": "…"
    }
  ]
}
```

## PATCH `/users/:id/role`

Prevents removing the last active admin.

### Body

```json
{ "role": "ADMIN|MANAGER|STAFF" }
```

### Response `200`

```json
{
  "message": "Role updated",
  "user": { "id": "string", "email": "string", "role": "ADMIN|MANAGER|STAFF" }
}
```

### Errors

- `404` User not found
- `409` Cannot remove the last active admin

## PATCH `/users/:id/status`

Prevents deactivating the last active admin.

### Body

```json
{ "status": "ACTIVE|INACTIVE" }
```

### Response `200`

```json
{
  "message": "Status updated",
  "user": { "id": "string", "email": "string", "status": "ACTIVE|INACTIVE" }
}
```

### Errors

- `404` User not found
- `409` Cannot deactivate the last active admin

## DELETE `/users/:id`

Prevents deleting the last active admin.

### Response `200`

```json
{
  "message": "User deleted",
  "user": { "id": "string", "email": "string", "role": "ADMIN|MANAGER|STAFF" }
}
```

### Errors

- `404` User not found
- `409` Cannot delete the last active admin

---

# Projects (`/projects`)

All `/projects/*` routes require Bearer auth.

## POST `/projects`

### Body

```json
{ "name": "string (min length 2)", "description": "string (optional)" }
```

### Response `201`

Returns the created Mongoose project document.

```json
{
  "message": "Project created",
  "project": {
    "_id": "…",
    "name": "…",
    "description": "…",
    "status": "ACTIVE",
    "isDeleted": false,
    "createdBy": "…",
    "createdAt": "…",
    "updatedAt": "…"
  }
}
```

## GET `/projects`

### Response `200`

Lists only `isDeleted: false`.

```json
{
  "status": "success",
  "projects": [
    {
      "_id": "…",
      "name": "…",
      "status": "ACTIVE|ARCHIVED",
      "isDeleted": false,
      "createdBy": "…",
      "createdAt": "…",
      "updatedAt": "…"
    }
  ]
}
```

## PATCH `/projects/:id` (ADMIN only)

### Body (all optional)

```json
{ "name": "string (min length 2)", "description": "string", "status": "ACTIVE|ARCHIVED" }
```

### Response `200`

```json
{
  "message": "Project updated",
  "project": {
    "_id": "…",
    "name": "…",
    "description": "…",
    "status": "…",
    "isDeleted": false,
    "createdBy": "…",
    "createdAt": "…",
    "updatedAt": "…"
  }
}
```

### Errors

- `404` Project not found (also returned if soft-deleted)

## DELETE `/projects/:id` (ADMIN only)

Soft-deletes the project by setting:

- `isDeleted = true`
- `status = "DELETED"`

### Response `200`

```json
{ "message": "Project soft-deleted" }
```

### Errors

- `404` Project not found (also returned if already soft-deleted)

---

# Environment variables (server)

Required:

- `MONGO_URI` (server fails to start without it)

Common:

- `PORT`
- `CORS_ORIGIN`
- `NODE_ENV`

JWT / cookies:

- `ACCESS_TOKEN_SECRET` (dev fallback exists but not safe)
- `REFRESH_TOKEN_SECRET` (dev fallback exists but not safe)
- `ACCESS_TOKEN_TTL` (default `15m`)
- `REFRESH_TOKEN_TTL` (default `7d`)
- `JWT_ISSUER` (optional)
- `JWT_AUDIENCE` (optional)
- `COOKIE_SAMESITE` (default `Strict`)
- `COOKIE_DOMAIN` (optional)

Invites:

- `INVITE_TOKEN_BYTES` (default `32`)
- `INVITE_EXPIRES_HOURS` (default `48`)

---

# Admin recovery (script)

If you lose admin access:

- `node src/scripts/seedAdmin.js`
- Docs: `docs/admin-recovery.md`

