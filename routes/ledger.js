const router = require('express').Router();
const Ledger = require('../models/Ledger');

// GET /api/ledger?year=2025&month=2  (month is 0-indexed)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.year && req.query.month !== undefined) {
      const y = parseInt(req.query.year);
      const m = parseInt(req.query.month); // 0-indexed
      // Build date range string
      const start = `${y}-${String(m + 1).padStart(2, '0')}-01`;
      const endDate = new Date(y, m + 1, 0); // last day of month
      const end = `${y}-${String(m + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
      filter.date = { $gte: start, $lte: end };
    }
    const entries = await Ledger.find(filter).sort({ date: 1, createdAt: 1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ledger/all — get all entries (for export)
router.get('/all', async (req, res) => {
  try {
    const entries = await Ledger.find().sort({ date: 1, createdAt: 1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ledger — create entry
router.post('/', async (req, res) => {
  try {
    const { item, amount, payType, date, note } = req.body;
    if (!item || !amount || !date) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ (item, amount, date)' });
    }
    const entry = await Ledger.create({ item, amount, payType: payType || 'cash', date, note: note || '' });
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/ledger/:id
router.delete('/:id', async (req, res) => {
  try {
    await Ledger.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
