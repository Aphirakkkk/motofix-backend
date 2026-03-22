const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// สร้าง JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register — สมัครสมาชิก
router.post('/register', async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ error: 'Username นี้ถูกใช้แล้ว' });
    }

    const user = await User.create({ name, username, password });

    res.status(201).json({
      _id:      user._id,
      name:     user.name,
      username: user.username,
      role:     user.role,
      token:    generateToken(user._id),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login — เข้าสู่ระบบ
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Username หรือ Password ไม่ถูกต้อง' });
    }

    res.json({
      _id:      user._id,
      name:     user.name,
      username: user.username,
      role:     user.role,
      token:    generateToken(user._id),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/auth/me — ดูโปรไฟล์ตัวเอง (ต้อง Login)
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;