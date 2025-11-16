// /server/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/authRoutes');
const pickupRoutes = require('./routes/pickupRoutes');

dotenv.config();
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/pickups', pickupRoutes); 

const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server running in development mode on port ${PORT}`));