# Quickstart: Run AgriConnect Locally

Need the UI running fast? Follow these lean steps to boot both the API and the Vite frontend.

## 1) Prerequisites
- Node.js 18+ and npm
- PostgreSQL (local) **or** a Supabase connection string

## 2) Backend (API)
1. `cd backend`
2. `npm install`
3. Copy env template: `cp .env.example .env`
4. Set database details in `.env`:
   - Use `DATABASE_URL` for Supabase/hosted Postgres **or**
   - Uncomment `DB_HOST`/`DB_PORT`/`DB_NAME`/`DB_USER`/`DB_PASSWORD` for local Postgres
   - Keep `PORT=5000` unless you need a different port
5. (Local DB) Create & migrate: `npm run migrate`
6. Optional demo data: `npm run seed`
7. Start API: `npm run dev`
   - API will default to `http://localhost:5000/api`

## 3) Frontend (Vite React)
1. In a new shell: `cd frontend`
2. `npm install`
3. Copy env template: `cp .env.example .env`
4. Update `.env`:
   - `VITE_API_URL=http://localhost:5000/api`
   - `VITE_UPLOAD_URL=http://localhost:5000/uploads` (optional; defaults to API-derived)
   - Add Supabase keys if you want live pricing
5. Start the dev server: `npm run dev`
   - Vite prints the local URL (typically `http://localhost:5173`)

## 4) Log in with seeded accounts
If you ran `npm run seed`, you can log in with:
- Admin — Phone: `26712345678`, Password: `admin123`
- Farmer — Phone: `26776543210`, Password: `farmer123`
- Buyer — Phone: `26774567890`, Password: `buyer123`

## 5) Troubleshooting fast
- CORS issues? Confirm `FRONTEND_URL` in `backend/.env` matches the Vite URL (use `http://localhost:5173`).
- Migrations failing? Ensure the database exists (`createdb agriconnect` for local Postgres).
- API not reachable? Make sure backend and frontend ports in both `.env` files match the commands above.
