# Car Dealership Inventory System

A basic full-stack Car Dealership Inventory System built with Node.js, Express, React (Vite), and lightweight local JSON file persistence. Developed with strict Test-Driven Development (TDD) principles and clean architecture separation.

---

## Project Overview

The **Car Dealership Inventory System** is a student web application designed to demonstrate full-stack software development best practices. It enables users to browse, search, filter, and purchase vehicles, while granting administrators complete control over inventory management, vehicle creation, stock updates, restocking, and deletions.

---

## Features

- 👤 **User Registration & Authentication**: Secure sign-up and sign-in using `bcryptjs` password hashing and JWT token issuance.
- 🔑 **Role-Based Access Control**: Distinguishes between regular users (`user`) and administrators (`admin`).
- 🚘 **Vehicle Catalog**: Responsive grid displaying vehicle details, high-res photos, INR pricing (`formatPrice` in Lakh/Crore), and real-time inventory counts.
- 🔍 **Live Search & Multi-field Filtering**: Search by make, model, category, fuel type, transmission, city location, featured vehicles, and price bounds.
- 🛒 **Vehicle Purchase Workflow**: Authenticated users can purchase vehicles in real time. Automatically decreases stock quantity and disables purchase when out of stock (`quantity = 0`).
- 📦 **Admin Inventory Management**: Add new vehicles, update specifications, restock inventory units, and delete vehicles with confirmation dialogs.
- 🖼️ **Image Fallback System**: Handles missing or broken image URLs with a local placeholder fallback (`/images/car-placeholder.jpg`).
- 🛡️ **Protected Routes & Error Boundaries**: React Router route guards, global React Error Boundary, and Axios request/response interceptors to handle token expiry gracefully.

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

## Data Model & Image Disclaimer

### Vehicle Data Fields
- `id` (string): Unique vehicle identifier
- `make` (string): Brand manufacturer (e.g. Maruti Suzuki, Hyundai, Tata, Mahindra)
- `model` (string): Model name (e.g. Creta, Swift, Nexon)
- `year` (number): Year of manufacture
- `category` (string): Body style (Hatchback, Sedan, SUV, Compact SUV, MUV, Electric)
- `fuelType` (string): Petrol, Diesel, Hybrid, Electric
- `transmission` (string): Manual, Automatic
- `price` (number): Price stored as full numeric INR value (e.g. `1350000`)
- `quantity` (number): Inventory stock count
- `mileage` (string): Fuel economy rating (e.g. `17.4 km/l` or `465 km/charge`)
- `engine` (string): Engine displacement (e.g. `1497 cc`)
- `seatingCapacity` (number): Passenger seating count (e.g. `5` or `7`)
- `color` (string): Exterior color shade
- `location` (string): Showroom city (e.g. Ahmedabad, Mumbai, Delhi)
- `image` (string): Primary photo URL
- `images` (array): Gallery photo URLs
- `shortDescription` (string): Concise 12-25 word summary
- `description` (string): Detailed 40-80 word overview
- `features` (array): Equipment list pills
- `featured` (boolean): Promoted listing flag
- `condition` (string): `New` or `Used`

> [!NOTE]
> **Image Disclaimer**:
> Vehicle images are used for educational demonstration purposes and may not represent the exact model or variant.

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
│   │   ├── seedAdmin.js
│   │   └── seedVehicles.js
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── data/
│   │   │   ├── users.json
│   │   │   ├── vehicles.json
│   │   │   └── vehicles.backup.json
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
    ├── public/
    │   └── images/
    │       └── car-placeholder.jpg
    └── src/
        ├── api/
        │   ├── axios.js
        │   ├── authApi.js
        │   ├── vehicleApi.js
        │   └── healthApi.js
        ├── utils/
        │   └── formatters.js
        ├── context/
        │   ├── AuthContext.jsx
        │   └── ToastContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── HeroSearch.jsx
        │   ├── PopularBrands.jsx
        │   ├── WhyChooseUs.jsx
        │   ├── StatsSection.jsx
        │   ├── SkeletonCard.jsx
        │   ├── ErrorBoundary.jsx
        │   ├── VehicleCard.jsx
        │   ├── VehicleList.jsx
        │   ├── VehicleForm.jsx
        │   ├── ConfirmDialog.jsx
        │   └── RestockModal.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── BrowseCars.jsx
        │   ├── VehicleDetails.jsx
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
| `GET` | `/api/vehicles/search` | Search & filter vehicles by make, model, price, fuel, transmission, location | Yes | User / Admin |
| `POST` | `/api/vehicles` | Add a new vehicle to inventory | Yes | **Admin Only** |
| `PUT` | `/api/vehicles/:id` | Update an existing vehicle record | Yes | **Admin Only** |
| `DELETE` | `/api/vehicles/:id` | Remove a vehicle from inventory | Yes | **Admin Only** |
| `POST` | `/api/vehicles/:id/purchase` | Purchase 1 unit of a vehicle | Yes | User / Admin |
| `POST` | `/api/vehicles/:id/restock` | Restock vehicle inventory quantity | Yes | **Admin Only** |

---

## Seeding Demo Data

### 1. Seed Default Admin User
```bash
cd backend
npm run seed:admin
```

### 2. Seed Realistic Vehicle Dataset (28 Indian Cars)
```bash
cd backend
npm run seed:vehicles
```
*Creates automatic backup `vehicles.backup.json` before writing 28 realistic demo vehicles.*

---

## Running Tests & Coverage

### Backend Tests (Jest + Supertest)
```bash
cd backend
npm test
npm run test:coverage
```

### Frontend Tests (Vitest + RTL)
```bash
cd frontend
npm test
npm run build
```

---

## Screenshots

> [!NOTE]
> Screenshot files (`docs/screenshots/login.png`, `docs/screenshots/vehicles.png`, `docs/screenshots/admin.png`) are referenced below.

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

---

## My AI Usage

An AI coding assistant (**Google Antigravity**) was used during the development of this project:

1. **Role of AI**: AI assisted in architectural planning, boilerplate code generation, TDD test case generation, CSS layout design, error debugging, and documentation formatting.
2. **Manual Oversight & Review**: Every piece of AI-generated code, component, and validation function was **manually reviewed, edited, and verified** for correctness.
3. **Automated Verification**: AI-generated logic was rigorously validated using automated unit and integration tests (57 backend tests + 15 frontend tests).
4. **Git Commit Co-Authoring**: Commit messages include co-author trailers (`Co-authored-by: AI Assistant <ai-assistant@users.noreply.github.com>`) for transparent attribution.
5. **Prompt History**: The complete sequence of prompts used during development is recorded in [`PROMPTS.md`](./PROMPTS.md).
