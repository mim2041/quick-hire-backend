# QuickHire — Job Board Backend API

A production-style backend API for QuickHire, built with Express and TypeScript. It powers public job browsing, job details, application submission with resume upload, and admin management workflows.

---

## 🔗 Live & Documentation

| Resource | URL |
|----------|-----|
| **API base** | [https://quickhire-api.mimkhatun.me/](https://quickhire-api.mimkhatun.me/) |
| **API documentation** | [https://quickhire-api.mimkhatun.me/api/docs/](https://quickhire-api.mimkhatun.me/api/docs/) |
| **OpenAPI JSON** | [https://quickhire-api.mimkhatun.me/api/docs.json](https://quickhire-api.mimkhatun.me/api/docs.json) |
| **Live frontend** | [https://quick-hire.mimkhatun.me/](https://quick-hire.mimkhatun.me/) |
| **Admin panel** | [https://quick-hire-console.mimkhatun.me/](https://quick-hire-console.mimkhatun.me/) |

---

## 🛠 Tech Stack

- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Validation:** Zod
- **Authentication:** JWT (access + refresh)
- **File upload:** Multer + Cloudinary
- **Security:** Helmet, CORS allow-list, Express rate limit
- **API docs:** Swagger UI + OpenAPI 3
- **Logging:** Morgan + Winston

---

## ✨ Features

- **Public jobs API**
	- List jobs with search, filters, pagination
	- Get single job details
- **Application system**
	- Submit application with resume upload
	- Resume is uploaded to Cloudinary and stored as URL (`resumeLink`)
- **Auth module**
	- Login, refresh token, logout, current user endpoint
- **Admin module**
	- Create, update, delete jobs
	- Manage application records
- **Platform quality**
	- Centralized error handling
	- Request validation on routes
	- Structured API response format

---

## 📁 Project Structure

```bash
src/
├── app.ts
├── server.ts
├── app/
│   ├── builder/                      # Query builder utilities
│   ├── config/                       # Env/config/constants/rbac
│   ├── docs/                         # openapi.ts + swagger setup
│   ├── errors/                       # Custom error transformers
│   ├── manager/                      # database, logger, cloudinary
│   ├── middleware/                   # auth, validateRequest, upload, errors
│   ├── modules/
│   │   ├── auth/
│   │   ├── job/
│   │   ├── application/
│   │   ├── company/
│   │   └── category/
│   ├── routes/                       # App-level route composition
│   └── utils/                        # catchAsync, sendResponse
└── scripts/
		└── seedAdmin.ts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB local/Atlas connection

### 1. Clone and install

```bash
git clone https://github.com/mim2041/quick-hire-backend.git
cd quick-hire-backend
npm install
```

### 2. Environment variables

Copy the example file:

```bash
cp .env.example .env
```

Set the required values in `.env`:

```env
NODE_ENV=development
PORT=9001

CLUSTER_URL=mongodb://localhost:27017/
CENTRAL_DB_NAME=quick_hire

JWT_ACCESS_SECRET=your_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

ALLOWED_ORIGINS=http://localhost:3000,https://quick-hire-console.vercel.app
ENABLE_SWAGGER=true

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_URL=
```

### 3. Run locally

```bash
npm run dev
```

API runs at: [http://localhost:9001](http://localhost:9001)

### 4. Build for production

```bash
npm run build
npm start
```

---

## 📐 API Overview

### Public

- `GET /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/applications` (multipart/form-data with `resume` file)

### Auth

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Admin (JWT + admin role)

- `POST /api/jobs`
- `PATCH /api/jobs/:id`
- `DELETE /api/jobs/:id`
- `GET /api/applications`
- `GET /api/applications/:id`
- `PATCH /api/applications/:id`
- `DELETE /api/applications/:id`

### Health Check

- `GET /health`

---

## 🏗 Architecture Notes

- **Modular domain design:** Each module contains controllers, services, repositories, validations, and routes.
- **Validation layer:** Zod schemas enforce payload integrity at route-level middleware.
- **Error pipeline:** Unified global handler transforms validation, DB, and custom errors into consistent API responses.
- **Upload workflow:** Multer receives file buffer, Cloudinary upload returns URL, URL is persisted in application data.
- **Security-first defaults:** Helmet, strict CORS policy, and rate-limited API surface.

---

## 🗂 Database ERD

![QuickHire ERD](./erd.svg)

---

## 📜 Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript into `dist/` |
| `npm start` | Start production server from build output |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run seed:admin` | Seed admin user data |

---

## 📦 Repositories

- Backend: [https://github.com/mim2041/quick-hire-backend](https://github.com/mim2041/quick-hire-backend)
- Frontend: [https://github.com/mim2041/quick-hire-frontend](https://github.com/mim2041/quick-hire-frontend)
- Admin Console: [https://github.com/mim2041/quick-hire-console](https://github.com/mim2041/quick-hire-console)

---

## 📄 License

This project was developed as an assessment submission. All rights reserved.

---

## 👤 Author

**Mim Khatun**  
Full Stack Developer  
📧 [mimkhatun.4941@gmail.com](mailto:mimkhatun.4941@gmail.com)  
📞 +8801705934910

