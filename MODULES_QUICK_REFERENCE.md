# Quick Reference - Modules & Setup

## Minimum Required Modules

### Backend (Run in `server/` directory)

```bash
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
```

### Frontend (Run in `client/` directory)

```bash
npm install
# or if you encounter peer dependency issues:
npm install --legacy-peer-deps
```

---

## Backend Dependencies Summary

```json
{
  "dependencies": {
    "express": "^4.x",
    "mongoose": "^8.19.4",
    "dotenv": "^17.2.3",
    "cors": "^2.x",
    "bcryptjs": "^2.x",
    "jsonwebtoken": "^9.x"
  }
}
```

---

## Frontend Dependencies Summary

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.9.6",
    "react-scripts": "5.0.1",
    "axios": "^1.13.2",
    "@mantine/core": "^8.3.8",
    "@mantine/hooks": "^8.3.8",
    "@mantine/form": "^8.3.8",
    "@mantine/dates": "^8.3.8",
    "@mantine/notifications": "^8.3.8",
    "@tabler/icons-react": "^3.35.0",
    "recharts": "^2.14.0",
    "dayjs": "^1.11.19",
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/user-event": "^13.5.0",
    "@testing-library/dom": "^10.4.1",
    "web-vitals": "^2.1.4"
  }
}
```

---

## Installation Command Shortcuts

### Complete Setup (Copy-Paste)

```powershell
git clone https://github.com/PrerikaP1331/scrapp-platform.git
cd scrapp-platform
git checkout develop-dashboard

cd server
npm install
# Create/copy .env file here
cd ../client
npm install
cd ..
```

### Start All Services (3 terminals)

**Terminal 1:**

```powershell
cd server && npm start
```

**Terminal 2:**

```powershell
cd client && npm start
```

**Terminal 3 (Optional - Database):**

```powershell
cd server && node seedDatabase.js
```

---

## Module Purposes at a Glance

| Module          | What It Does                 |
| --------------- | ---------------------------- |
| `express`       | Web server framework         |
| `mongoose`      | MongoDB connection & schemas |
| `dotenv`        | Load environment variables   |
| `cors`          | Allow cross-origin requests  |
| `bcryptjs`      | Hash passwords securely      |
| `jsonwebtoken`  | Create/verify login tokens   |
| `react`         | UI library                   |
| `axios`         | Make HTTP requests           |
| `@mantine/core` | Pre-built UI components      |
| `recharts`      | Create charts/graphs         |
| `dayjs`         | Handle dates easily          |

---

## Common Issues & Fixes

| Problem                  | Solution                            |
| ------------------------ | ----------------------------------- |
| `npm ERR! code ERESOLVE` | `npm install --legacy-peer-deps`    |
| Port already in use      | Kill process or use different PORT  |
| MongoDB connection fails | Check `.env` credentials            |
| Module not found         | Run `npm install <module-name>`     |
| React won't compile      | Delete `node_modules` and reinstall |

---

## What Gets Created After Setup

✅ 110 sample database records (users, communities, pickups, etc.)
✅ Backend API running on http://localhost:5001
✅ Frontend React app running on http://localhost:3000
✅ All user roles ready to test (individual, community_admin, recycler, org_admin)

---

**For detailed setup guide, see: `SETUP_AND_INSTALLATION.md`**
