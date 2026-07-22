# Prompts Log

## Initial Prompt - Project Setup & Architecture

```text
Create the planned project structure in the current empty folder.

Root structure:

car-dealership-inventory/
backend/
frontend/
README.md
PROMPTS.md
TEST_REPORT.md
.gitignore

Backend structure:

backend/
src/
app.js
server.js
config/
controllers/
middleware/
repositories/
routes/
services/
utils/
validations/
data/
users.json
vehicles.json
tests/
unit/
integration/
package.json
.env.example

Requirements:

Initialize the backend package.json.
Install Express, cors, dotenv, jsonwebtoken, bcryptjs and uuid.
Install Jest, Supertest and nodemon as development dependencies.
Configure Jest for JavaScript.
Add npm scripts:
dev
start
test
Create only placeholder files and configuration.
Do not implement business functionality yet.
Add sample vehicle data to vehicles.json.
Keep users.json as an empty array.
Add node_modules, .env, coverage and frontend build folders to .gitignore.
Add the exact prompt from this message to PROMPTS.md.

After creating the files:

Run npm install inside backend.
Run npm test and verify the test command works even if no tests exist.
Show me the files created.
Show the exact Git Bash commands I should use for the first commit.
The commit message must include:

chore: initialize project structure

Created the frontend and backend folder structure and configured the Node.js testing environment with AI assistance.

Co-authored-by: AI Assistant ai-assistant@users.noreply.github.co
https://github.com/JEEL18993/car-delaership-project
this is my github repo
```

## Prompt 2 - JSON Repository Layer (TDD)

```text
https://github.com/JEEL18993/car-delaership-project
this is my repo
Implement the JSON file repository layer using strict TDD.

First create failing tests for reusable JSON repository functions.

Required functions:

readJsonFile(filePath)
writeJsonFile(filePath, data)
findById(filePath, id)
createRecord(filePath, record)
updateRecord(filePath, id, updates)
deleteRecord(filePath, id)

Requirements:

Tests must be written before implementation.
Use temporary JSON files during tests.
Do not modify the real users.json or vehicles.json during tests.
Handle missing files and invalid JSON gracefully.
Writing must preserve valid formatted JSON.
Return useful errors.
Avoid duplicated file-reading logic.
Use async/await.
After tests fail, implement the minimum code.
Run tests again.
Refactor only after tests pass.
Add meaningful comments only where necessary.
Add this prompt to PROMPTS.md.

At the end show:

Initial failing test output.
Final passing test output.
Coverage output.
Exact Git Bash commit command using:

test: add JSON repository tests

Defined expected JSON persistence behaviour before implementing the repository layer with AI assistance.

Co-authored-by: AI Assistant ai-assistant@users.noreply.github.com

Then show a second commit command using:

feat: implement JSON repository layer

Implemented reusable JSON file persistence functions and refactored them after tests passed.

Co-authored-by: AI Assistant ai-assistant@users.noreply.github.com
```

## Prompt 3 - Authentication Implementation (TDD)

```text
mplement authentication using TDD.

Start by writing failing integration tests for:

POST /api/auth/register

Successfully registers a new user.
Rejects missing name.
Rejects invalid email.
Rejects password shorter than 6 characters.
Rejects duplicate email.
Hashes the password before saving.
Never returns the password in the response.
New users receive the role "user".

POST /api/auth/login

Successfully logs in with correct credentials.
Returns a JWT token.
Rejects unknown email.
Rejects incorrect password.
Rejects missing fields.

Implementation requirements:

Use bcryptjs.
Use jsonwebtoken.
Read JWT_SECRET from environment variables.
Store users in backend/data/users.json.
Use UUID for user IDs.
Separate route, controller, service, validation and repository logic.
Create a centralized error-handling middleware.
Return consistent JSON responses.
Use appropriate HTTP status codes.
Create .env.example with PORT and JWT_SECRET.
Do not implement vehicles yet.
Reset test data before each test.
Append this prompt to PROMPTS.md.

Run:

npm test
npm run test

At the end show two separate Git Bash commits following Red-Green development:

Commit 1:

test: define authentication behaviour

Added failing registration and login tests before implementing authentication with AI assistance.

Co-authored-by: AI Assistant ai-assistant@users.noreply.github.com

Commit 2:

feat: implement JWT authentication

Implemented registration, login, password hashing, validation and JWT generation after authentication tests passed.

Co-authored-by: AI Assistant ai-assistant@users.noreply.github.com
https://github.com/JEEL18993/car-delaership-project
```

## Prompt 4 - Authorization Middleware (TDD)

```text
Implement authorization middleware using TDD.

First write failing tests for:

authenticateToken middleware:

Allows a request with a valid JWT.
Rejects a request without a token.
Rejects an invalid token.
Rejects an expired token.
Adds decoded user information to req.user.

requireAdmin middleware:

Allows users whose role is admin.
Rejects normal users with HTTP 403.
Rejects unauthenticated requests.

Requirements:

Authorization header format must be:
Bearer TOKEN
Keep authentication and role authorization in separate middleware functions.
Do not duplicate JWT verification.
Return safe error messages.
Do not expose JWT secrets or stack traces.
Append this prompt to PROMPTS.md.

Run all tests and show the result.

Create separate Red and Green commits:

test: define authorization middleware behaviour

Created failing tests for JWT protection and admin role authorization with AI assistance.

Co-authored-by: AI Assistant ai-assistant@users.noreply.github.com

feat: add authentication and admin middleware

```

## Prompt 5 - Vehicle CRUD & Search APIs (TDD)

```text
Implement the vehicle CRUD and search APIs using strict TDD.

Vehicle model fields:

id
make
model
category
price
quantity

Validation:

make is required
model is required
category is required
price must be a number greater than zero
quantity must be a non-negative integer

Write failing tests first for:

GET /api/vehicles

Returns all vehicles for an authenticated user.
Rejects unauthenticated requests.

GET /api/vehicles/search

Searches by make.
Searches by model.
Searches by category.
Filters by minPrice.
Filters by maxPrice.
Combines multiple filters.
Search must be case-insensitive.
Returns an empty array when nothing matches.

POST /api/vehicles

Admin can create a vehicle.
Normal user receives HTTP 403.
Rejects invalid fields.
Generates a unique UUID.

PUT /api/vehicles/:id

Admin can update a vehicle.
Normal user receives HTTP 403.
Returns HTTP 404 for an unknown vehicle.
Validates updated fields.

DELETE /api/vehicles/:id

Admin can delete a vehicle.
Normal user receives HTTP 403.
Returns HTTP 404 for an unknown vehicle.

Requirements:

Store vehicles in backend/data/vehicles.json.
Separate routes, controllers, services, repositories and validation.
Keep filtering logic inside a vehicle service.
Do not place business logic in routes.
Use consistent response formats.
Protect all vehicle routes.
Append this prompt to PROMPTS.md.
Run the full test suite and coverage.

Create two commits:

test: define vehicle management behaviour

Added failing tests for vehicle listing, searching, creation, updating and deletion with AI assistance.

Co-authored-by: AI Assistant ai-assistant@users.noreply.github.com

feat: implement vehicle management APIs

Implemented protected vehicle CRUD and search endpoints after the vehicle tests passed.

Co-authored-by: AI Assistant ai-assistant@users.noreply.github.com
https://github.com/JEEL18993/car-delaership-project
```

## Prompt 6 - Vehicle Purchase & Restock (TDD)

```text
Implement vehicle purchase and restock functionality using TDD.

First write failing tests for:

POST /api/vehicles/:id/purchase

Authenticated users can purchase one vehicle.
Purchase decreases quantity by one.
Quantity never becomes negative.
Returns HTTP 400 when quantity is zero.
Returns HTTP 404 for an unknown vehicle.
Unauthenticated users are rejected.
Normal users and admins can purchase.

POST /api/vehicles/:id/restock

Admin can increase vehicle quantity.
Request body accepts a positive integer amount.
Rejects zero, negative, decimal or missing amount.
Normal users receive HTTP 403.
Returns HTTP 404 for an unknown vehicle.

Requirements:

Put inventory calculations in an inventory service.
Do not place inventory logic directly inside the controller.
Reuse the vehicle repository.
Prevent race-prone duplicate file operations as much as possible for this small JSON-file project.
Return the updated vehicle.
Append this prompt to PROMPTS.md.
Run all tests and coverage.

Create two commits:

test: define inventory operation behaviour

Added failing tests for vehicle purchase and admin restocking with AI assistance.

Co-authored-by: AI Assistant ai-assistant@users.noreply.github.com

feat: implement purchase and restock operations

Implemented stock validation, vehicle purchasing and admin restocking after tests passed.

Co-authored-by: AI Assistant ai-assistant@users.noreply.github.com
```

## Prompt 7 - Admin Seeding & Backend Verification

```text
Add a simple admin-seeding script.

Requirements:

Create backend/scripts/seedAdmin.js.
Read ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD from environment variables.
Hash the password.
Create an admin user only when that email does not already exist.
Never hardcode a real password.
Add the following npm script:
"seed": "node scripts/seedAdmin.js"
Update .env.example with:
ADMIN_NAME
ADMIN_EMAIL
ADMIN_PASSWORD
Add tests for the admin creation service where practical.
Do not expose passwords in logs.
Append this prompt to PROMPTS.md.

Then verify:

Registration
Login
Admin login
Vehicle CRUD
Search
Purchase
Restock
Invalid token
Forbidden admin operation

Generate a short backend API table for README.md.

Run all backend tests and ensure they pass.

Show the commit command:

feat: add admin seeding and backend verification

Added a safe admin seeding workflow and verified the complete backend API with AI assistance.
```

## Prompt 8 - React Frontend Foundation

```text
Create the frontend using React with JavaScript and Vite.

Rules:

Do not use TypeScript.
Do not use Tailwind.
Do not use Bootstrap.
Do not use Material UI.
Use plain responsive CSS.
Use React Router.
Use Axios.
Keep the design clean and basic.
Do not overengineer state management.
Use Context API only for authentication.

Pages:

Home / vehicle dashboard
Login
Register
Admin dashboard
Not Found

Components:

Navbar
VehicleCard
VehicleList
SearchFilters
LoadingSpinner
EmptyState
ProtectedRoute
AdminRoute
VehicleForm
ConfirmDialog

Frontend functionality:

Register user.
Login user.
Save JWT and user details in localStorage.
Automatically attach JWT through an Axios interceptor.
Logout user.
Display all vehicles.
Search by make, model and category.
Filter by minimum and maximum price.
Purchase a vehicle.
Disable Purchase when quantity is zero.
Immediately update quantity after purchase.
Show success and error messages.
Admin can add, edit, delete and restock vehicles.
Ask for confirmation before deleting.
Redirect unauthorized users.
Responsive desktop and mobile layout.

Environment:

Create frontend/.env.example with:
VITE_API_URL=http://localhost:5000/api

Testing:

Configure Vitest and React Testing Library.
Do not implement all tests yet.
Add one simple App rendering test to confirm setup.

Also:

Append this prompt to PROMPTS.md.
Run npm install.
Run npm test.
Run npm run build.
Fix all build errors.

Show the commit command:

feat: create React frontend foundation
Created the React application, routing, authentication context and responsive CSS foundation with AI assistance.
```







