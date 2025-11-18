// /server/server.js (Corrected and Verified)
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const pickupRoutes = require('./routes/pickupRoutes');
const communityRoutes = require('./routes/communityRoutes');
const organisationRoutes = require('./routes/organisationRoutes');
const recyclerRoutes = require('./routes/recyclerRoutes');
const recyclerDashboardRoutes = require('./routes/recyclerDashboardRoutes');
const userRoutes = require('./routes/userRoutes');
const impactRoutes = require('./routes/impactRoutes');
const migrationRoutes = require('./routes/migrationRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/organisations', organisationRoutes);
app.use('/api/recyclers', recyclerRoutes);
app.use('/api/recycler', recyclerDashboardRoutes);
app.use('/api/user', userRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/migration', migrationRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server running in development mode on port ${PORT}`));