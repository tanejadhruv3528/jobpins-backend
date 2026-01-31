const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const jobsRoutes = require('./routes/jobs.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);

module.exports = app;
