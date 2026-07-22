# Car Dealership Inventory System

A basic full-stack Car Dealership Inventory System built with Node.js, Express, React (Vite), and JSON file storage.

## Repository Overview

- **`backend/`**: Node.js & Express API with TDD testing using Jest & Supertest.
- **`frontend/`**: React SPA powered by Vite, Axios, React Router, and Vanilla CSS3.
- **`PROMPTS.md`**: Record of prompts used during development.
- **`TEST_REPORT.md`**: Automated test execution reports.

---

## Backend API Endpoints

| Method | Endpoint | Description | Auth Required | Admin Only |
| --- | --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user (default role `user`) | No | No |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT token | No | No |
| `GET` | `/api/vehicles` | Retrieve all inventory vehicles | Yes | No |
| `GET` | `/api/vehicles/search` | Search & filter vehicles (make, model, category, min/max price) | Yes | No |
| `POST` | `/api/vehicles` | Create a new vehicle record | Yes | **Yes** |
| `PUT` | `/api/vehicles/:id` | Update an existing vehicle record | Yes | **Yes** |
| `DELETE` | `/api/vehicles/:id` | Remove a vehicle from inventory | Yes | **Yes** |
| `POST` | `/api/vehicles/:id/purchase` | Purchase 1 unit of a vehicle (decreases quantity) | Yes | No |
| `POST` | `/api/vehicles/:id/restock` | Increase vehicle stock by positive amount | Yes | **Yes** |

---

## Setup & Running Instructions

### Backend Setup
```bash
cd backend
npm install
npm run seed     # Seed initial admin user
npm run dev      # Start development server
```

### Running Backend Tests
```bash
cd backend
npm test
```
