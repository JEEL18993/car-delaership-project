# Car Dealership Inventory System

A basic full-stack Car Dealership Inventory System built with Node.js, Express, React (Vite), and lightweight local JSON file persistence. Developed with strict Test-Driven Development (TDD) principles and clean architecture separation.

---

## Project Overview

The **Car Dealership Inventory System** is a student web application designed to demonstrate full-stack software development best practices. It enables users to browse, search, filter, and purchase vehicles, while granting administrators complete control over inventory management, vehicle creation, stock updates, restocking, and deletions.

---

## Features

- 👤 **User Registration & Authentication**: Secure sign-up and sign-in using `bcryptjs` password hashing and JWT token issuance.
- 🔑 **Role-Based Access Control**: Distinguishes between regular users (`user`) and administrators (`admin`).
- 🚘 **Vehicle Catalog**: Responsive grid displaying vehicle details, images, pricing, and real-time inventory counts.
- 🔍 **Live Search & Multi-field Filtering**: Instant search by make, model, category, and minimum/maximum price bounds.
- 🛒 **Vehicle Purchase Workflow**: Authenticated users can purchase vehicles in real time. Automatically decreases stock quantity and disables purchase when out of stock (`quantity = 0`) via stock-validated purchase operations.
- 📦 **Admin Inventory Management**: Add new vehicles, update vehicle specifications, restock inventory units, and delete vehicles with confirmation dialogs.
- 🛡️ **Protected Routes & Expiration Handling**: React Router route guards and Axios request/response interceptors to handle JWT bearer headers and token expiry gracefully.

---

## Technology Stack

- **Frontend**:
  - **Framework**: React (JavaScript) with Vite
  - **Routing**: React Router DOM (v6)
  - **HTTP Client**: Axios (with custom request & 401 response interceptors)
  - **Styling**: Plain Vanilla CSS3 (Custom CSS variables, Flexbox & CSS Grid, responsive design)
  - **Testing**: Vitest & React Testing Library

- **Backend**:
  - **Runtime & Framework**: Node.js & Express.js
  - **Security**: `bcryptjs` (password hashing) & `jsonwebtoken` (JWT auth)
  - **Testing**: Jest & Supertest (TDD methodology)

- **Storage**:
  - **Local JSON Files**: `backend/src/data/users.json` and `backend/src/data/vehicles.json` with reusable async repository utilities.

---

## Intentional Simplifications & Architecture Scope

> [!NOTE]
> **Database & CSS Framework Notice**:
> This project intentionally uses **local JSON file storage** instead of an external database (such as MongoDB, PostgreSQL, or MySQL) and **plain Vanilla CSS3** instead of Tailwind CSS. These were intentional architectural choices to keep the project basic, readable, lightweight, and easy to review without requiring external database server installations or build setup overhead.

---

## Folder Structure

```text
dealership project/
├── .gitignore
├── README.md
├── PROMPTS.md
├── TEST_REPORT.md
├── docs/
│   └── screenshots/
│       ├── .gitkeep
│       ├── login.png
│       ├── vehicles.png
│       └── admin.png
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── scripts/
│   │   └── seedAdmin.js
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── data/
│   │   │   ├── users.json
│   │   │   └── vehicles.json
│   │   ├── repositories/
│   │   │   ├── jsonRepository.js
│   │   │   ├── userRepository.js
│   │   │   └── vehicleRepository.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── vehicleService.js
│   │   │   └── inventoryService.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── validations/
│   │   │   ├── authValidation.js
│   │   │   └── vehicleValidation.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── vehicleController.js
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       └── vehicleRoutes.js
│   └── tests/
│       ├── unit/
│       └── integration/
└── frontend/
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── api/
        │   ├── axios.js
        │   ├── authApi.js
        │   ├── vehicleApi.js
        │   └── healthApi.js
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── VehicleCard.jsx
        │   ├── VehicleList.jsx
        │   ├── SearchFilters.jsx
        │   ├── VehicleForm.jsx
        │   ├── ConfirmDialog.jsx
        │   ├── RestockModal.jsx
        │   ├── LoadingSpinner.jsx
        │   └── EmptyState.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── AdminDashboard.jsx
        │   └── NotFound.jsx
        ├── App.jsx
        ├── App.test.jsx
        └── index.css
```

---

## Backend API Endpoints

| Method | Endpoint | Description | Auth Required | Role |
| --- | --- | --- | --- | --- |
| `GET` | `/api/health` | Backend status & health check | No | Public |
| `POST` | `/api/auth/register` | Register a new user | No | Public |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT token | No | Public |
| `GET` | `/api/vehicles` | Retrieve all vehicles from inventory | Yes | User / Admin |
| `GET` | `/api/vehicles/search` | Search & filter vehicles by make, model, price | Yes | User / Admin |
| `POST` | `/api/vehicles` | Add a new vehicle to inventory | Yes | **Admin Only** |
| `PUT` | `/api/vehicles/:id` | Update an existing vehicle record | Yes | **Admin Only** |
| `DELETE` | `/api/vehicles/:id` | Remove a vehicle from inventory | Yes | **Admin Only** |
| `POST` | `/api/vehicles/:id/purchase` | Purchase 1 unit of a vehicle | Yes | User / Admin |
| `POST` | `/api/vehicles/:id/restock` | Restock vehicle inventory quantity | Yes | **Admin Only** |

---

## Installation Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed default admin user:
   ```bash
   npm run seed:admin
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
   The backend API will run at `http://localhost:5000`.

---

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite development server:
   ```bash
   npm run dev
   ```
   The frontend app will run at `http://localhost:5173`.

---

## Environment Variables Example

### Backend Configuration (`backend/.env.example`)
```env
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Admin Seeding Variables
ADMIN_NAME=Your Admin Name
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=replace_with_a_strong_password
```

### Frontend Configuration (`frontend/.env.example`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running Tests

### Running Backend Tests (Jest + Supertest)
```bash
cd backend
npm test
```

### Running Backend Coverage
```bash
cd backend
npm run test:coverage
```

### Running Frontend Tests (Vitest + RTL)
```bash
cd frontend
npm test
```

---

## Test Coverage Summary

### Backend Test Metrics (Jest)
- **Test Suites**: 6 Passed
- **Total Tests**: 57 Passed (0 Failed)
- **Statements**: 92.74%
- **Branches**: 83.15%
- **Functions**: 93.75%
- **Lines**: 93.24%

### Frontend Test Metrics (Vitest)
- **Test Suites**: 4 Passed
- **Total Tests**: 14 Passed (0 Failed)

---

## Admin Account Setup

To create an initial admin account without exposing hardcoded passwords in source code, copy `.env.example` to `.env`, set your desired secret values, and run the seeding script:

```bash
cd backend
npm run seed:admin
```

This reads credentials from `.env` (`ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`) and creates a hashed admin user if one does not already exist.

---

## Screenshots

> [!NOTE]
> Screenshot files (`docs/screenshots/login.png`, `docs/screenshots/vehicles.png`, `docs/screenshots/admin.png`) are referenced below. Actual application screenshots still need to be captured and added to the `docs/screenshots/` directory.

### 1. User Login Page
![User Login](docs/screenshots/login.png)

### 2. Vehicle Catalog & Filtering Page
![Vehicle Catalog](docs/screenshots/vehicles.png)

### 3. Admin Inventory Dashboard
![Admin Dashboard](docs/screenshots/admin.png)

---

## Known Limitations

> [!IMPORTANT]
> **Data Storage Transparency**:
> This project uses **local JSON files** (`users.json` and `vehicles.json`) for data persistence. **It does NOT use MongoDB, MySQL, PostgreSQL, SQLite, Prisma, or Sequelize.**
>
> Local JSON storage was intentionally chosen to keep this project lightweight, basic, and easy to run without requiring database server installation or containerization.
>
> **Concurrency & Scalability Notice**: Local file-based storage does not provide production-grade multi-process file locking, ACID transactions, or horizontal scalability. It is intended purely for educational and student demonstration purposes.

---

## My AI Usage

An AI coding assistant (**Google Antigravity**) was used during the development of this project:

1. **Role of AI**: AI assisted in architectural planning, boilerplate code generation, TDD test case generation, CSS layout design, error debugging, and documentation formatting.
2. **Manual Oversight & Review**: Every piece of AI-generated code, component, and validation function was **manually reviewed, edited, and verified** for correctness.
3. **Automated Verification**: AI-generated logic was rigorously validated using automated unit and integration tests (57 backend tests + 14 frontend tests).
4. **Git Commit Co-Authoring**: Commit messages include co-author trailers (`Co-authored-by: AI Assistant <ai-assistant@users.noreply.github.com>`) for transparent attribution.
5. **Prompt History**: The complete sequence of prompts used during development is recorded in [`PROMPTS.md`](./PROMPTS.md).

> [!NOTE]
> **Reflection**: Utilizing AI dramatically accelerated boilerplate creation and test generation. However, strict manual verification and TDD assertions were essential to catch edge-case bugs (such as parallel file test collisions and DOM accessible role queries).

---

## Git Workflow

Development followed strict Red-Green TDD and atomic commits:

1. **Red Phase**: Write failing unit/integration tests (`test: define ...`).
2. **Green Phase**: Implement minimum working code to pass tests (`feat: implement ...`).
3. **Refactor Phase**: Clean up formatting, improve accessibility, and strengthen validation (`refactor: ...`).

---

## Future Improvements

- 🗄️ **Database Migration**: Upgrade from local JSON files to PostgreSQL or MongoDB using Prisma / Mongoose for production scalability.
- ☁️ **Cloud Image Uploads**: Integrate AWS S3 or Cloudinary for vehicle photo management.
- 💳 **Payment Processing**: Integrate Stripe API for real credit card purchase checkouts.
- 📊 **Analytics Dashboard**: Add charts for sales revenue, inventory turnover, and popular car models.
