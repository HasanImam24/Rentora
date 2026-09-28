# 🏪 Rentora - Rent & Buy Marketplace

A full-stack **Rent & Buy** marketplace platform built with **Next.js 14**, **Express.js**, **MongoDB**, and **Cloudinary**.

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js (Layered Architecture) |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **Auth** | JWT (HTTP-only cookies + Bearer tokens), bcryptjs |
| **Media** | Cloudinary (via Multer streaming) |
| **Email** | Nodemailer (SMTP) |

---

## 📁 Project Structure

```
rentbuy/
├── frontend/          # Next.js 14 App Router
│   ├── app/           # Pages & layouts
│   ├── components/    # Reusable UI components
│   ├── context/       # Auth context provider
│   └── lib/           # API client & utilities
├── backend/           # Express.js REST API
│   ├── src/
│   │   ├── config/    # DB, Cloudinary, env config
│   │   ├── models/    # Mongoose schemas
│   │   ├── controllers/
│   │   ├── services/  # Business logic layer
│   │   ├── routes/    # API route definitions
│   │   ├── middleware/ # Auth, upload, error handling
│   │   └── utils/     # Helper functions
│   └── seeders/       # Database seed scripts
└── package.json       # Root monorepo scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account (free tier works)
- **SMTP** credentials (Gmail App Password, Mailtrap, etc.)

### 1. Clone & Install

```bash
# Install all dependencies
npm install
npm run install:all
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Frontend
cp frontend/.env.local.example frontend/.env.local
# Edit frontend/.env.local if API URL differs
```

### 3. Seed Admin Account

```bash
npm run seed
# Creates: admin@rentbuy.com / Admin@123
```

### 4. Run Development Servers

```bash
npm run dev
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRE` | Token expiry (e.g., `7d`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP username/email |
| `SMTP_PASS` | SMTP password |
| `ADMIN_EMAIL` | Admin notification email |
| `FRONTEND_URL` | Frontend URL for CORS |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/listings` | Get all listings (public) |
| GET | `/api/listings/:id` | Get listing by ID (public) |
| POST | `/api/listings` | Create listing (auth) |
| PUT | `/api/listings/:id` | Update listing (owner) |
| DELETE | `/api/listings/:id` | Delete listing (owner) |
| GET | `/api/listings/user/me` | Get my listings (auth) |

### Rentals
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rentals` | Create rental (auth) |
| GET | `/api/rentals` | Get my rentals (auth) |
| GET | `/api/rentals/:id` | Get rental by ID (auth) |
| PATCH | `/api/rentals/:id/status` | Update rental status (owner) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create purchase order (auth) |
| GET | `/api/orders` | Get my orders (auth) |
| GET | `/api/orders/:id` | Get order by ID (auth) |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/complaints` | File complaint (auth) |
| GET | `/api/complaints` | Get my complaints (auth) |
| GET | `/api/complaints/:id` | Get complaint by ID (auth) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id/toggle-status` | Toggle user active status |
| GET | `/api/admin/listings` | List all listings |
| PATCH | `/api/admin/listings/:id/status` | Update listing status |
| GET | `/api/admin/complaints` | List all complaints |
| PATCH | `/api/admin/complaints/:id/respond` | Respond to complaint |

---

## 👤 Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@rentbuy.com` | `Admin@123` |

---

## 📄 License

MIT License - feel free to use this project for learning and production.
