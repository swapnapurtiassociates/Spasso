# Swapnapurti Associates — Authentication & Real-Time Backend

The site uses a Node.js/Express + MongoDB + Socket.io backend. Public account
creation is for customers; sign-in offers Customer and Admin access. The admin
identity is configured on the server and is not created through the website.

## 1. Backend setup (`/server`)

```bash
cd server
# Copy .env.example to .env and set MONGODB_URI, JWT_SECRET, ADMIN_EMAIL,
# and a unique strong ADMIN_PASSWORD. Keep credentials server-side.
npm install
npm run admin:setup # creates or updates only the configured admin account
npm run dev      # starts the API + Socket.io server on PORT (default 5000)
```

### MongoDB
- Local: `mongodb://127.0.0.1:27017/swapnapurti`
- Atlas: paste your connection string into `MONGODB_URI`.
- All data (users, projects, messages, notifications) lives in this one database.

### Optional demo seed

`npm run seed` clears existing users, projects, and enquiries before creating
demo data. It requires `ADMIN_EMAIL` and `ADMIN_PASSWORD`; do not run it on a
database containing real data.

Public signup creates customer accounts only. The configured admin can create
projects and upload JPEG, PNG, WebP, or AVIF views (up to 4 MB each). Images
are stored in MongoDB GridFS, so they persist across server restarts and do not
depend on local disk or a third-party image account.

### Demo accounts (customer and engineers use `Password#123`)
| Role     | Email                          | Notes |
|----------|---------------------------------|-------|
| Customer | customer@example.com            | Regular customer login |
| Engineer | engineer@swapnapurti.com         | Structural engineer |
| Engineer | sneha.engineer@swapnapurti.com   | MEP engineer |
| CEO      | ceo@swapnapurti.com              | **Hidden** login, see below |

## 2. Frontend setup

```bash
cd artifacts/construction-site
npm install
# Set VITE_GOOGLE_CLIENT_ID to the Google OAuth Web client ID.
# Set the same client ID as GOOGLE_CLIENT_ID in the server environment.
# optional: set VITE_API_URL if backend isn't on http://localhost:5000
npm run dev
```

Customer login supports Google Identity Services. Create a Web OAuth client in
Google Cloud Console, add your site's origins under Authorized JavaScript
origins, then configure its client ID as `VITE_GOOGLE_CLIENT_ID` in the
frontend environment and `GOOGLE_CLIENT_ID` in the backend environment. The
backend validates Google ID tokens and only allows verified customer accounts;
Google sign-in cannot access admin accounts.

## 2a. Deploying to Vercel

Import the repository into Vercel with the repository root as the project root.
The included `vercel.json` builds the Vite frontend and routes `/api/*` to the
serverless Express function in `/api/index.js`.

Set these Vercel environment variables for Production (and Preview if needed):

- `MONGODB_URI`
- `JWT_SECRET`
- `CEO_ACCESS_CODE`
- `STAFF_ACCESS_CODE`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `GOOGLE_CLIENT_ID` (Web OAuth client ID; enables customer Google sign-in)
- `ADMIN_FIRST_NAME` (optional)
- `ADMIN_LAST_NAME` (optional)
- `CLIENT_ORIGIN` (your Vercel URL, for example `https://your-site.vercel.app`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_SECURE` if email is required

Leave `VITE_API_URL` unset when the API is deployed with this project; the
frontend will use the same Vercel origin automatically. Socket.IO does not run
inside Vercel serverless functions, so real-time messaging/presence requires a
separate persistent Node.js deployment. REST authentication, projects, and
enquiries continue to work on Vercel.

## 3. How login works

- **`/login`** — public page with Customer and Admin tabs.
- **`/signup`** — customer accounts only. Admin registration is disabled; one
  administrator is provisioned with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- **`/portal-x9`** — hidden CEO-only login. Not linked anywhere in the UI.
  Requires email,
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
Set admin credentials as server-only variables; never use a demo password for
the administrator.
