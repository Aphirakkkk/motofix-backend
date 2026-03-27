const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

// โหลด .env เฉพาะตอน development เท่านั้น
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { protect } = require('./middleware/authMiddleware');
const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── Public Routes (ไม่ต้อง Login) ──
app.use('/api/auth', require('./routes/auth'));

// ── Protected Routes (ต้อง Login) ──
app.use('/api/jobs',      protect, require('./routes/jobs'));
app.use('/api/customers', protect, require('./routes/customers'));
app.use('/api/parts',     protect, require('./routes/parts'));
app.use('/api/invoices',  protect, require('./routes/invoices'));
app.use('/api/dashboard', protect, require('./routes/dashboard'));
app.use('/api/ledger',    protect, require('./routes/ledger'));

// ── Health check ──
app.get('/', (req, res) => {
  res.json({ message: '🏍️ MotoFix API is running!' });
});

// ── Connect MongoDB → Start server ──
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });
