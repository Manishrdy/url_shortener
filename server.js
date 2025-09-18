// server.js
require('dotenv').config(); // load env first

const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');
const urlRoutes = require('./routes/urls');

const app = express();

// Global middleware
app.use(express.json());

// tiny logger to see incoming requests (helpful during dev)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} -> ${req.method} ${req.url}`);
  next();
});

// Add routes (mount protected routes later)
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);

// health check (unprotected)
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// ===== Add redirect route (public) =====
const { redirectByShortId } = require('./controllers/redirectController');
// this must be after /api routes, so it won't catch requests like /api/...
app.get('/:key', redirectByShortId);

// 404 fallback (must come after real routes)
app.use((req, res, next) => {
  res.status(404);
  next(new Error('Not Found'));
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB(); // connect to Mongo before listening
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
