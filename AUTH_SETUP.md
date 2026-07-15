# Swapnapurti Associates — Authentication & Real-Time Backend

This adds a full Node.js/Express + MongoDB + Socket.io backend with role-based
login for **Customer**, **Engineer**, **Admin**, and **CEO** (hidden) accounts,
plus matching themed login/signup pages and per-role dashboards on the frontend.

## 1. Backend setup (`/server`)

```bash
cd server
cp .env.example .env
# edit .env: set MONGODB_URI, JWT_SECRET, CEO_ACCESS_CODE, STAFF_ACCESS_CODE
npm install
npm run seed     # creates sample users for every role + sample projects
npm run dev      # starts the API + Socket.io server on PORT (default 5000)
```

### MongoDB
- Local: `mongodb://127.0.0.1:27017/swapnapurti`
- Atlas: paste your connection string into `MONGODB_URI`.
- All data (users, projects, messages, notifications) lives in this one database.

### Seeded accounts (password for all: `Password@123`)
| Role     | Email                          | Notes |
|----------|---------------------------------|-------|
| Customer | customer@example.com            | Regular customer login |
| Engineer | engineer@swapnapurti.com         | Structural engineer |
| Engineer | sneha.engineer@swapnapurti.com   | MEP engineer |
| Admin    | admin@swapnapurti.com            | Operations admin |
| CEO      | ceo@swapnapurti.com              | **Hidden** login, see below |

## 2. Frontend setup

```bash
cd artifacts/construction-site
npm install
# optional: set VITE_API_URL if backend isn't on http://localhost:5000
npm run dev
```

## 3. How login works

- **`/login`** — public page with Customer / Engineer / Admin tabs. Engineers
  and Admins who sign up need a `STAFF_ACCESS_CODE`.
- **`/signup`** — same role tabs; choose a role and (for Engineer/Admin) enter
  the staff access code from `.env`.
- **`/portal-x9`** — hidden CEO-only login. Not linked anywhere in the UI
  (there's only a tiny shield icon under the login card). Requires email,
  password, **and** the `CEO_ACCESS_CODE` from `.env`. CEO accounts cannot be
  created via signup — they must be inserted directly (e.g. via the seed
  script or MongoDB).

After login, users are redirected to their role dashboard:
- `/dashboard/customer`
- `/dashboard/engineer`
- `/dashboard/admin`
- `/dashboard/ceo`

## 4. Real-time features

Socket.io powers:
- Live project progress updates (engineer updates → customer/admin/CEO see it instantly)
- Real-time notifications bell
- Online/offline presence shown to Admin & CEO
- Chat message delivery (`/api/messages`)

## 5. Security notes

- Passwords hashed with bcrypt.
- JWT stored in an httpOnly cookie.
- CEO login is intentionally isolated from the normal `/api/auth/login` route
  and requires a secret access code in addition to credentials.
- Change `JWT_SECRET`, `CEO_ACCESS_CODE`, and `STAFF_ACCESS_CODE` before deploying.
