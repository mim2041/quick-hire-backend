# quick-hire-backend

Backend API for the **QuickHire** job board assessment.

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB (Mongoose)
- Zod for validation
- JWT auth + RBAC
- Swagger / OpenAPI docs

## Getting Started

### 1. Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the project root. You can copy from `.env.example`:

```bash
cp .env.example .env
```

Key variables:

- `PORT` – API port (default: `9001`)
- `CLUSTER_URL` – Mongo connection string prefix, e.g. `mongodb://localhost:27017/`
- `CENTRAL_DB_NAME` – DB name, e.g. `quick_hire`
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` – long random secrets
- `JWT_ACCESS_EXPIRES_IN` – e.g. `15m`
- `JWT_REFRESH_EXPIRES_IN` – e.g. `7d`
- `ALLOWED_ORIGINS` – comma separated list of allowed frontends
- `ENABLE_SWAGGER` – set to `true` in development to expose docs

### 4. Running the API

```bash
# development (ts-node-dev)
npm run dev

# build and run
npm run build
npm start
```

Health check:

- `GET /health` – basic service info

## API Overview

Base URL (dev): `http://localhost:9001`

### Public

- `GET /api/jobs` – list jobs (supports `searchTerm`, `category`, `location`, `page`, `limit`)
- `GET /api/jobs/:id` – job details
- `POST /api/applications` – submit application

### Auth

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Admin (JWT + RBAC: `admin` role)

- `POST /api/jobs` – create job
- `DELETE /api/jobs/:id` – delete job

## Swagger / OpenAPI Docs

When `ENABLE_SWAGGER=true`:

- `GET /api/docs` – Swagger UI
- `GET /api/docs.json` – raw OpenAPI spec

## Demo Checklist

- List jobs (`GET /api/jobs`)
- View job details (`GET /api/jobs/:id`)
- Apply to a job (`POST /api/applications`)
- Admin login and create/delete a job (`/api/auth/login`, `POST/DELETE /api/jobs`)

