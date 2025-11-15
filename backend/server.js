const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Karju API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      shifts: '/api/shifts',
      applications: '/api/applications',
      dashboard: '/api/dashboard',
      profile: '/api/profile',
      ratings: '/api/ratings',
      notifications: '/api/notifications'
    },
    admin: {
      webInterface: '/admin',
      api: '/api/admin'
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/shifts', require('./routes/shifts'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/notifications', require('./routes/notifications'));

// Admin routes (developer-only database viewer)
app.use('/api/admin', require('./routes/admin'));

// Serve admin HTML page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Karju API is running' });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path,
    method: req.method,
    availableEndpoints: {
      health: '/api/health',
      auth: '/api/auth',
      shifts: '/api/shifts',
      applications: '/api/applications',
      dashboard: '/api/dashboard',
      profile: '/api/profile',
      ratings: '/api/ratings',
      notifications: '/api/notifications'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Karju API server running on port ${PORT}`);
});



