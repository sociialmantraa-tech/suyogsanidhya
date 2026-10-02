# Quick Start & Portal Credentials

## 🔑 Admin Portal Access
- **Admin URL:** [http://localhost:5174/login](http://localhost:5174/login) (or `/admin/login` in production)
- **Username / Email:** `admin` (or `admin@abhayharpale.com`)
- **Password:** `AdminPassword123!`

---

## 🌐 Public Website Access
- **Frontend URL:** [http://localhost:5173/](http://localhost:5173/)
- **Branding:** Abhay Harpale | Relationship & Intimacy Guidance

---

## 🚀 How to Run Locally

Run any of the following commands from the root project folder:

```bash
# Start Public Frontend (Runs on port 5173)
npm run dev

# Start Admin Dashboard (Runs on port 5174)
npm run dev:admin

# Build Both Production Bundles (dist/ and admin_dist/)
npm run build
```

---

## 📁 Key File References
- **Admin Login Logic & Fallback:** `admin/src/pages/Login.jsx`
- **Admin Dashboard:** `admin/src/pages/Dashboard.jsx`
- **Favicons & Branding Assets:** `admin/public/`, `frontend/public/`
- **Database Schema & Starter Seeds:** `database/schema.sql`, `database/seed.sql`
- **Backend Configuration:** `backend/config/env.php`
