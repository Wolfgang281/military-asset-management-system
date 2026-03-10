# ⚔️ Military Asset Management System

A secure, role-based web application for Indian Army commanders and logistics personnel to manage the movement, assignment and expenditure of critical assets — weapons, vehicles and ammunition — across multiple bases.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [RBAC — Roles & Permissions](#rbac--roles--permissions)
- [Login Credentials](#login-credentials)
- [Screenshots](#screenshots)

---

## Overview

MAMS enables commanders and logistics officers to:

- Track **Opening Balance**, **Closing Balance** and **Net Movement** across bases
- Record **Purchases** of assets from suppliers (OFB, DRDO, BEL, etc.)
- Manage **Transfers** of assets between commands with full status history
- Assign assets to **individual personnel** and mark them as **expended**
- Enforce **role-based access control** so each user sees only what they should
- Maintain a complete **audit trail** of every transaction

### Core Formula

```
Net Movement    = Purchases + Transfers In − Transfers Out
Closing Balance = Opening Balance + Net Movement
```

---

## Features

| Feature            | Description                                                                     |
| ------------------ | ------------------------------------------------------------------------------- |
| 📊 Dashboard       | Key metrics with date, base and category filters. Net Movement modal breakdown. |
| 🛒 Purchases       | Record and view historical asset purchases per base                             |
| ↔️ Transfers       | Transfer assets between bases with pending → in_transit → completed flow        |
| 👤 Assignments     | Assign assets to personnel, mark as returned or expended                        |
| 🔐 User Management | Admin-only user creation and role assignment                                    |
| 📋 Audit Logs      | Full transaction history with user, role, IP and timestamp                      |

---

## Tech Stack

### Backend

| Package            | Purpose                  |
| ------------------ | ------------------------ |
| Node.js + Express  | REST API server          |
| MongoDB + Mongoose | Database + ODM           |
| jsonwebtoken       | JWT-based authentication |
| bcryptjs           | Password hashing         |

### Frontend

| Package         | Purpose                          |
| --------------- | -------------------------------- |
| React 18 (Vite) | UI framework                     |
| Tailwind CSS    | Styling                          |
| Axios           | HTTP client with JWT interceptor |
| React Router v6 | Client-side routing              |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repo

```bash
git clone git@github.com:Wolfgang281/MAMS-military-asset-management-system.git
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm install
node seed/seed.js     # seed demo data
npm run dev           # starts on http://localhost:9000
```

### 3. Setup Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:9000
npm install
npm run dev           # starts on http://localhost:5173
```

---

## Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mams
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:9000
```

---

## API Endpoints

### Auth

| Method | Endpoint        | Access | Description        |
| ------ | --------------- | ------ | ------------------ |
| POST   | /api/auth/login | Public | Login, returns JWT |
| GET    | /api/auth/me    | All    | Get current user   |

### Dashboard

| Method | Endpoint       | Access       | Description          |
| ------ | -------------- | ------------ | -------------------- |
| GET    | /api/dashboard | All (scoped) | Metrics with filters |

### Purchases

| Method | Endpoint           | Access           | Description     |
| ------ | ------------------ | ---------------- | --------------- |
| GET    | /api/purchases     | All (scoped)     | List purchases  |
| POST   | /api/purchases     | Admin, Logistics | Create purchase |
| DELETE | /api/purchases/:id | Admin            | Delete purchase |

### Transfers

| Method | Endpoint                  | Access           | Description     |
| ------ | ------------------------- | ---------------- | --------------- |
| GET    | /api/transfers            | All (scoped)     | List transfers  |
| POST   | /api/transfers            | All roles        | Create transfer |
| PATCH  | /api/transfers/:id/status | Admin, Logistics | Update status   |

### Assignments

| Method | Endpoint                    | Access           | Description       |
| ------ | --------------------------- | ---------------- | ----------------- |
| GET    | /api/assignments            | All (scoped)     | List assignments  |
| POST   | /api/assignments            | Admin, Commander | Create assignment |
| PATCH  | /api/assignments/:id/expend | Admin, Commander | Mark expended     |
| PATCH  | /api/assignments/:id/return | Admin, Commander | Mark returned     |

### Users (Admin only)

| Method | Endpoint       | Access | Description    |
| ------ | -------------- | ------ | -------------- |
| GET    | /api/users     | Admin  | List all users |
| POST   | /api/users     | Admin  | Create user    |
| PATCH  | /api/users/:id | Admin  | Update user    |
| DELETE | /api/users/:id | Admin  | Delete user    |

### Audit Logs (Admin only)

| Method | Endpoint  | Access | Description      |
| ------ | --------- | ------ | ---------------- |
| GET    | /api/logs | Admin  | View audit trail |

---

## RBAC — Roles & Permissions

| Action                     | Admin | Base Commander   | Logistics |
| -------------------------- | ----- | ---------------- | --------- |
| View dashboard (all bases) | ✅    | ❌ own base only | ✅        |
| Create purchase            | ✅    | ❌               | ✅        |
| Create transfer            | ✅    | ✅ from own base | ✅        |
| Update transfer status     | ✅    | ❌               | ✅        |
| Create assignment          | ✅    | ✅ own base      | ❌        |
| Mark expended/returned     | ✅    | ✅ own base      | ❌        |
| User management            | ✅    | ❌               | ❌        |
| View audit logs            | ✅    | ❌               | ❌        |

---

## Login Credentials

After running `node seed/seed.js`:

| Role                      | Email                             | Password      |
| ------------------------- | --------------------------------- | ------------- |
| Admin                     | admin@indianarmy.mil              | Admin@123     |
| Base Commander (Northern) | commander.northern@indianarmy.mil | Base@123      |
| Base Commander (Western)  | commander.western@indianarmy.mil  | Base@123      |
| Base Commander (Southern) | commander.southern@indianarmy.mil | Base@123      |
| Logistics Officer         | logistics@indianarmy.mil          | Logistics@123 |

---

## Screenshots

> _TO BE ADDED_

---

## Deployment

| Service  | Platform                                   |
| -------- | ------------------------------------------ |
| Frontend | [Vercel](https://vercel.com)               |
| Backend  | [Render](https://render.com)               |
| Database | [MongoDB Atlas](https://mongodb.com/atlas) |

---
