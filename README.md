# ⚔️ Military Asset Management System (MAMS)

A secure, role-based web application for Indian Army commanders and logistics personnel to manage the movement, assignment and expenditure of critical assets — weapons, vehicles, ammunition and equipment — across multiple commands.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [RBAC — Roles & Permissions](#rbac--roles--permissions)
- [Login Credentials](#login-credentials)
- [Deployment](#deployment)

---

## Overview

MAMS enables commanders and logistics officers to:

- Track **Opening Balance**, **Closing Balance** and **Net Movement** across bases
- Record **Purchases** of assets from suppliers
- Manage **Transfers** of assets between commands with full status history (`pending → in_transit → completed`)
- Assign assets to **individual personnel** and mark them as **expended** or **returned**
- Enforce **role-based access control** so each user sees only what they should
- Maintain a complete **audit trail** of every transaction

### Core Formula

```
Net Movement    = Purchases + Transfers In − Transfers Out
Closing Balance = Opening Balance + Net Movement
```

---

## Tech Stack

### Backend

| Technology | Package                    | Purpose                 |
| ---------- | -------------------------- | ----------------------- |
| Runtime    | Node.js 18+ (ESM)          | Server runtime          |
| Framework  | Express 5                  | REST API                |
| Database   | MongoDB Atlas + Mongoose 9 | Data persistence + ODM  |
| Auth       | jsonwebtoken + bcryptjs    | JWT in httpOnly cookies |
| Config     | dotenv                     | Environment variables   |

### Frontend

| Technology | Package           | Purpose                    |
| ---------- | ----------------- | -------------------------- |
| UI         | React 19 + Vite 7 | Component framework        |
| Styling    | Tailwind CSS v4   | Utility-first dark theme   |
| State      | Redux Toolkit     | Auth state management      |
| Routing    | React Router v7   | Client-side routing        |
| HTTP       | Axios             | API calls with credentials |
| Icons      | Lucide React      | Icon set                   |

---

## Project Structure

```
military-asset-management-system/
├── backend/
│   └── src/
│       ├── config/
│       │   ├── database-config.js
│       │   └── index.js
│       ├── constants/
│       │   └── constants.js
│       ├── controllers/
│       │   ├── asset-controller.js
│       │   ├── assignment-controller.js
│       │   ├── auth-controller.js
│       │   ├── dashboard-controller.js
│       │   ├── purchase-controller.js
│       │   ├── transfer-controller.js
│       │   └── index.js
│       ├── middlewares/
│       │   ├── auth-middleware.js
│       │   ├── error-middleware.js
│       │   └── index.js
│       ├── models/
│       │   ├── asset-model.js
│       │   ├── assignment-model.js
│       │   ├── audit-log-model.js
│       │   ├── purchase-model.js
│       │   ├── transfer-model.js
│       │   ├── user-model.js
│       │   └── index.js
│       ├── routes/
│       │   ├── asset-route.js
│       │   ├── assignment-routes.js
│       │   ├── auth-routes.js
│       │   ├── dashboard-routes.js
│       │   ├── purchase-routes.js
│       │   ├── transfer-route.js
│       │   └── index.js
│       ├── seed/
│       │   └── seeder.js
│       ├── utils/
│       │   ├── errors/app-error.js
│       │   ├── jwt/generate-token.js
│       │   └── validators/index.js
│       └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── assignments/
        │   │   ├── AssignmentFilters.jsx
        │   │   ├── AssignmentForm.jsx
        │   │   └── AssignmentTable.jsx
        │   ├── dashboard/
        │   │   ├── FilterBar.jsx
        │   │   ├── MetricCard.jsx
        │   │   ├── MetricsGrid.jsx
        │   │   ├── NetMovementModal.jsx
        │   │   └── TopBar.jsx
        │   ├── purchases/
        │   │   ├── PurchaseFilters.jsx
        │   │   ├── PurchaseForm.jsx
        │   │   └── PurchaseTable.jsx
        │   ├── transfers/
        │   │   ├── TransferFilters.jsx
        │   │   ├── TransferForm.jsx
        │   │   └── TransferTable.jsx
        │   └── ui/
        │       ├── AuthLoader.jsx
        │       └── Toast.jsx
        ├── constants/
        │   └── endpoints.js
        ├── hooks/
        │   └── useGetCurrentUser.jsx
        ├── lib/
        │   ├── axios.js
        │   └── utils.js
        ├── pages/
        │   ├── Assignments.jsx
        │   ├── Dashboard.jsx
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Purchases.jsx
        │   └── Transfers.jsx
        ├── redux/
        │   ├── slices/userSlice.js
        │   └── store.js
        ├── App.jsx
        └── main.jsx
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB >= 6)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Wolfgang281/military-asset-management-system.git
cd military-asset-management-system
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env (see Environment Variables below)
npm run dev
```

The server starts on `http://localhost:9000`.

> To seed demo data, run: `node src/server seed` (or `npm start` which seeds automatically)

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_BACKEND_URL=http://localhost:9000
npm run dev
```

The app starts on `http://localhost:5173`.

---

## Environment Variables

### Backend `.env`

```env
PORT=9000
MONGODB_ATLAS=mongodb+srv://<user>:<password>@cluster.mongodb.net/mams
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_BACKEND_URL=http://localhost:9000
```

---

## API Endpoints

### Auth

| Method | Endpoint           | Access | Description                     |
| ------ | ------------------ | ------ | ------------------------------- |
| POST   | `/api/auth/login`  | Public | Login, sets httpOnly JWT cookie |
| POST   | `/api/auth/logout` | Public | Clears JWT cookie               |
| GET    | `/api/auth/me`     | All    | Get current authenticated user  |

### Assets

| Method | Endpoint         | Access | Description                             |
| ------ | ---------------- | ------ | --------------------------------------- |
| GET    | `/api/asset`     | All    | List active assets. Query: `?category=` |
| GET    | `/api/asset/:id` | All    | Get single asset                        |

### Dashboard

| Method | Endpoint         | Access       | Description                                                                                                           |
| ------ | ---------------- | ------------ | --------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/dashboard` | All (scoped) | Metrics: opening/closing balance, net movement, assigned, expended. Query: `base`, `category`, `startDate`, `endDate` |

### Purchases

| Method | Endpoint            | Access           | Description                                                       |
| ------ | ------------------- | ---------------- | ----------------------------------------------------------------- |
| GET    | `/api/purchase`     | All (scoped)     | List purchases. Query: `base`, `category`, `startDate`, `endDate` |
| POST   | `/api/purchase`     | Admin, Logistics | Create purchase                                                   |
| DELETE | `/api/purchase/:id` | Admin            | Delete purchase                                                   |

### Transfers

| Method | Endpoint                   | Access           | Description                                                                 |
| ------ | -------------------------- | ---------------- | --------------------------------------------------------------------------- |
| GET    | `/api/transfer`            | All (scoped)     | List transfers. Query: `base`, `category`, `status`, `startDate`, `endDate` |
| POST   | `/api/transfer`            | All roles        | Create transfer                                                             |
| GET    | `/api/transfer/:id`        | All (scoped)     | Get single transfer                                                         |
| PATCH  | `/api/transfer/:id/status` | Admin, Logistics | Update status: `pending → in_transit → completed`                           |

### Assignments

| Method | Endpoint                     | Access           | Description                                                                   |
| ------ | ---------------------------- | ---------------- | ----------------------------------------------------------------------------- |
| GET    | `/api/assignment`            | All (scoped)     | List assignments. Query: `base`, `category`, `status`, `startDate`, `endDate` |
| POST   | `/api/assignment`            | Admin, Commander | Create assignment                                                             |
| PATCH  | `/api/assignment/:id/expend` | Admin, Commander | Mark asset as expended                                                        |
| PATCH  | `/api/assignment/:id/return` | Admin, Commander | Mark asset as returned                                                        |

---

## RBAC — Roles & Permissions

| Action                 | Admin     | Base Commander   | Logistics |
| ---------------------- | --------- | ---------------- | --------- |
| View dashboard         | All bases | Own base only    | All bases |
| Create purchase        | ✅        | ❌               | ✅        |
| Delete purchase        | ✅        | ❌               | ❌        |
| Create transfer        | ✅        | ✅ from own base | ✅        |
| Update transfer status | ✅        | ❌               | ✅        |
| Create assignment      | ✅        | ✅ own base      | ❌        |
| Expend / Return asset  | ✅        | ✅ own base      | ❌        |
| View audit logs        | ✅        | ❌               | ❌        |

RBAC is enforced by two middleware functions chained on every route:

```js
authenticate; // verifies JWT from httpOnly cookie → attaches req.user
checkRole([roles]); // returns 403 if req.user.role not in allowed list
```

Base Commander data scoping is applied inside each controller — queries are additionally filtered by `req.user.assignedBase`.

---

## Login Credentials

After seeding (`npm start` or `node src/server seed`):

| Role                      | Email                               | Password        |
| ------------------------- | ----------------------------------- | --------------- |
| Admin                     | `admin@indianarmy.mil`              | `Admin@123`     |
| Base Commander (Northern) | `commander.northern@indianarmy.mil` | `Base@123`      |
| Base Commander (Western)  | `commander.western@indianarmy.mil`  | `Base@123`      |
| Base Commander (Southern) | `commander.southern@indianarmy.mil` | `Base@123`      |
| Logistics Officer         | `logistics@indianarmy.mil`          | `Logistics@123` |
| Logistics Officer 2       | `logistics2@indianarmy.mil`         | `Logistics@123` |

> The Login page includes one-click demo credential buttons for quick evaluation.

---

## Deployment

| Layer    | Platform      | Notes                                                     |
| -------- | ------------- | --------------------------------------------------------- |
| Frontend | Vercel        | Root dir: `frontend`, add `VITE_BACKEND_URL` env var      |
| Backend  | Render        | Root dir: `backend`, start: `npm start`, add all env vars |
| Database | MongoDB Atlas | Whitelist `0.0.0.0/0` for Render's dynamic IPs            |

> In production, update `FRONTEND_URL` in backend `.env` to your Vercel URL for CORS.

---

## About

Built by **Utkarsh Gupta** as a take-home engineering project demonstrating a full-stack secure application with role-based access control, RESTful APIs, MongoDB aggregation pipelines and a responsive React frontend.

© 2026 Utkarsh Gupta
