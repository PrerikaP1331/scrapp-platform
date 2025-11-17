# Scrapp Platform - Setup & Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### System Requirements

- **Node.js**: v14.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v6.0.0 or higher (comes with Node.js)
- **Git**: v2.20.0 or higher ([Download](https://git-scm.com/))
- **MongoDB**: Access to MongoDB Atlas cluster (provided in `.env`)

### Verify Installations

```powershell
node --version
npm --version
git --version
```

---

## Installation Steps

### Step 1: Clone the Repository

```powershell
git clone https://github.com/PrerikaP1331/scrapp-platform.git
cd scrapp-platform
```

### Step 2: Switch to the Correct Branch

```powershell
# For development work
git checkout develop-dashboard

# Or your assigned dashboard branch
git checkout person1/community-dashboard
```

### Step 3: Install Backend Dependencies

```powershell
cd server
npm install
```

### Step 4: Install Frontend Dependencies

```powershell
cd ../client
npm install
```

---

## Required Modules

### Backend Dependencies (Server)

| Package        | Version | Purpose                         |
| -------------- | ------- | ------------------------------- |
| `express`      | ^4.x    | Web framework for Node.js       |
| `mongoose`     | ^8.19.4 | MongoDB object modeling         |
| `dotenv`       | ^17.2.3 | Environment variable management |
| `cors`         | ^2.x    | Cross-Origin Resource Sharing   |
| `bcryptjs`     | ^2.x    | Password hashing and security   |
| `jsonwebtoken` | ^9.x    | JWT authentication tokens       |

### Frontend Dependencies (Client)

| Package                       | Version  | Purpose                  |
| ----------------------------- | -------- | ------------------------ |
| `react`                       | ^19.2.0  | UI library               |
| `react-dom`                   | ^19.2.0  | React DOM rendering      |
| `react-router-dom`            | ^7.9.6   | Client-side routing      |
| `react-scripts`               | 5.0.1    | Create React App scripts |
| `axios`                       | ^1.13.2  | HTTP client              |
| `@mantine/core`               | ^8.3.8   | UI component library     |
| `@mantine/hooks`              | ^8.3.8   | Mantine hooks            |
| `@mantine/form`               | ^8.3.8   | Form management          |
| `@mantine/dates`              | ^8.3.8   | Date picker component    |
| `@mantine/notifications`      | ^8.3.8   | Notification system      |
| `@tabler/icons-react`         | ^3.35.0  | Icon library             |
| `recharts`                    | ^2.14.0  | Charts and graphs        |
| `dayjs`                       | ^1.11.19 | Date utility library     |
| `@testing-library/react`      | ^16.3.0  | Testing utilities        |
| `@testing-library/jest-dom`   | ^6.9.1   | Testing library matchers |
| `@testing-library/user-event` | ^13.5.0  | User interaction testing |
| `@testing-library/dom`        | ^10.4.1  | DOM testing utilities    |
| `web-vitals`                  | ^2.1.4   | Performance metrics      |

---

## Environment Configuration

### Backend (.env file location: `server/.env`)

```dotenv
MONGO_URI=mongodb+srv://scrapp-admin:5kMNwFDKQcZ4a5Vi@scrappcluster.oidkett.mongodb.net/?appName=ScrappCluster
JWT_SECRET=a_very_long_and_secret_random_string_12345
PORT=5001
```

**Note:** Contact the team lead for MongoDB credentials if you need a separate cluster instance.

---

## Complete Installation Checklist

```powershell
# ✅ Clone repository
git clone https://github.com/PrerikaP1331/scrapp-platform.git
cd scrapp-platform

# ✅ Checkout your branch
git checkout develop-dashboard
git pull origin develop-dashboard

# ✅ Install backend dependencies
cd server
npm install

# ✅ Create .env file (copy from team lead)
# Edit .env with MongoDB credentials

# ✅ Verify backend installation
npm start  # Should start on port 5001

# ✅ In new terminal, install frontend dependencies
cd ../client
npm install

# ✅ Start frontend development server
npm start  # Should start on port 3000 or 3001

# ✅ Database seeding (optional, if starting fresh)
cd ../server
node seedDatabase.js
```

---

## Quick Start Guide

### Terminal 1 - Backend Server

```powershell
cd e:\scrapp\scrapp-platform\server
npm start
# Output: Server running in development mode on port 5001
```

### Terminal 2 - Frontend Dev Server

```powershell
cd e:\scrapp\scrapp-platform\client
npm start
# Output: Compiled successfully! http://localhost:3000
```

### Terminal 3 - Optional: Database Seeding

```powershell
cd e:\scrapp\scrapp-platform\server
node seedDatabase.js
```

---

## Available NPM Scripts

### Backend (server/)

```powershell
npm start              # Start the Node.js server
npm test              # Run tests (not yet configured)
```

### Frontend (client/)

```powershell
npm start              # Start React dev server
npm build             # Build for production
npm test              # Run test suite
npm eject             # Eject from Create React App (⚠️ irreversible)
```

---

## Troubleshooting

### Issue: "Cannot find module 'express'"

**Solution:**

```powershell
cd server
npm install express
```

### Issue: "MongoDB connection failed"

**Solution:**

- Verify `MONGO_URI` in `.env` file is correct
- Check MongoDB Atlas cluster status
- Ensure your IP is whitelisted in MongoDB Atlas

### Issue: "Port 5001/3000 already in use"

**Solution:**

```powershell
# Change port in .env or kill existing process
# Or use alternative port:
PORT=5002 npm start  # for backend
BROWSER=none PORT=3002 npm start  # for frontend
```

### Issue: "npm ERR! code ERESOLVE"

**Solution:**

```powershell
npm install --legacy-peer-deps
```

### Issue: React compilation errors

**Solution:**

```powershell
cd client
rm -r node_modules package-lock.json
npm install
npm start
```

---

## Git Workflow Reminder

### Setting Up Your Dashboard Branch

```powershell
# 1. Get latest code
git checkout develop-dashboard
git pull origin develop-dashboard

# 2. Create your feature branch (replace "person1" with your name)
git checkout -b person1/community-dashboard

# 3. Push your branch
git push origin person1/community-dashboard
```

### During Development

```powershell
# 1. Make changes
# 2. Commit regularly
git add .
git commit -m "feat: description of changes"

# 3. Push to your branch
git push origin person1/community-dashboard

# 4. Repeat as needed
```

---

## Database Initialization

### First-Time Setup (Populate with Sample Data)

```powershell
cd server
node seedDatabase.js
```

This will create:

- 40 sample users (different roles)
- 10 communities
- 10 recycler profiles
- 10 organizations
- 10 pickups
- 10 coupons
- 10 announcements
- 10 community posts

**Total: 110 records** - Perfect for testing all features!

---

## Project Structure

```
scrapp-platform/
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                    # API service calls
│   │   ├── components/             # Reusable components
│   │   ├── context/                # React context (Auth)
│   │   ├── layouts/                # Layout components
│   │   ├── pages/                  # Page components
│   │   │   ├── CommunityDashboard/
│   │   │   ├── RecyclerDashboard/
│   │   │   ├── OrganizationDashboard/
│   │   │   └── Dashboard/          # Individual Dashboard
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                          # Node.js Backend
│   ├── config/                     # Database config
│   ├── controllers/                # Request handlers
│   ├── middleware/                 # Auth middleware
│   ├── models/                     # MongoDB schemas
│   ├── routes/                     # API routes
│   ├── server.js                   # Express app
│   ├── seedDatabase.js             # Database seeding
│   ├── .env                        # Environment variables
│   └── package.json
│
├── COLLABORATION.md                # Team collaboration guide
├── README.md
└── .gitignore
```

---

## Support & Communication

- **Issues?** Check the troubleshooting section above
- **Merge Conflicts?** See COLLABORATION.md for conflict resolution
- **Questions?** Contact the team lead or check existing documentation

---

## Summary of Commands

```powershell
# Complete fresh setup
git clone https://github.com/PrerikaP1331/scrapp-platform.git
cd scrapp-platform
git checkout develop-dashboard

# Backend
cd server
npm install
# Create .env file here
npm start

# Frontend (new terminal)
cd client
npm install
npm start

# Seed database (new terminal, if needed)
cd server
node seedDatabase.js
```

---

**Happy coding! 🚀**
