# Project Management System (Client)

React + Vite front-end for a project management system with authentication, project CRUD, and admin user management.

## Features

- Email/password login
- Invite-only registration flow (`/register?token=...`)
- Role-based access control (ADMIN-only User Management page)
- Projects CRUD with optimistic updates (edit/delete feel instant)
- Automatic access-token refresh + request retry on `401` (single-flight refresh to avoid duplicate refresh calls)

## Tech Stack

- React (Vite)
- React Router (Data Router)
- TanStack Query (React Query) + Devtools (dev only)
- Tailwind CSS
- Axios

## Getting Started

### Prerequisites

- Node.js (LTS recommended) + npm
- A compatible backend API running locally or remotely (see "Backend API" below)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

`VITE_API_BASE_URL` is used by `src/api/axios.js` as the Axios `baseURL`.

### Run the App (Dev)

```bash
npm run dev
```

## Scripts

- `npm run dev` - start the dev server
- `npm run build` - build for production
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

## Pages & Routing

Public:

- `/login`
- `/register?token=...`

Protected (requires authentication):

- `/dashboard`
- `/projects`

Admin-only:

- `/users`

Routes are defined in `src/app/router.jsx` and guarded by `src/auth/RequireAuth.jsx` and `src/auth/RequireRole.jsx`.

## Authentication Model (Client-Side)

This client uses a short-lived access token (Bearer) with a refresh-token cookie strategy:

- Access token is stored in memory (`src/utils/accessToken.js`).
- Requests include cookies (`withCredentials: true` in `src/api/axios.js`) to support refresh-token cookies.
- On app boot, `src/auth/AuthProvider.jsx` calls:
  - `POST /auth/refresh` to hydrate an access token
  - `GET /auth/me` to fetch the current user
- When an API request returns `401`, `src/api/axios.js` automatically:
  - refreshes the access token (`POST /auth/refresh`)
  - retries the original request once
  - redirects to `/login` if refresh fails

Requests can opt out of the refresh interceptor via `{ skipAuthRefresh: true }` (used by login/register/logout endpoints).

## Backend API

This client expects a backend with endpoints similar to:

Auth:

- `POST /auth/login` -> `{ accessToken, user }`
- `POST /auth/refresh` -> `{ accessToken, user? }`
- `GET /auth/me` -> `{ user }`
- `POST /auth/logout`
- `POST /auth/invite` -> `{ inviteLink }` or `{ token }`
- `POST /auth/register-via-invite` -> `{ accessToken, user }`

Projects:

- `GET /projects` -> `Project[]` (also supports `{ items }`, `{ projects }`, or `{ data }`)
- `POST /projects`
- `PATCH /projects/:id`
- `DELETE /projects/:id`

Users:

- `GET /users?page=1&limit=10` -> `{ items, total, page, limit }`
- `PATCH /users/:id/role` -> `{ ... }`
- `PATCH /users/:id/status` -> `{ ... }`

Note: Because the client uses `withCredentials`, your backend must be configured for CORS credentials in development (allowed origin must match the Vite dev server origin, and `Access-Control-Allow-Credentials: true` must be enabled).

## Project Structure

```text
src/
  api/            # Axios client and API modules
  app/            # Router and React Query client
  auth/           # Auth provider + route guards
  components/     # UI + feature components
  pages/          # Route-level pages
  utils/          # Small helpers (storage, errors, ids, etc.)
```

## Troubleshooting

- **Stuck on login / redirecting to `/login`**: verify `VITE_API_BASE_URL` and confirm your backend sets refresh cookies correctly and allows credentialed CORS.
- **Invite "Copy" fails**: clipboard write requires a secure context (HTTPS) or `localhost`.
