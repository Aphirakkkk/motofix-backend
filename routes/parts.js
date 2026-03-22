const router = require('express').Router();
const Part   = require('../models/Part');

// GET /api/parts
router.get('/', async (req, res) => {
  try {
    const parts = await Part.find().sort({ qty: 1 });
    res.json(parts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/parts/low-stock — อะไหล่ใกล้หมด
router.get('/low-stock', async (req, res) => {
  try {
    const parts = await Part.find({ $expr: { $lt: ['$qty', '$minQty'] } });
    res.json(parts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/parts
router.post('/', async (req, res) => {
  try {
    const part = await Part.create(req.body);
    res.status(201).json(part);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/parts/:id — แก้ไข หรือเติมสต็อก
router.patch('/:id', async (req, res) => {
  try {
    const part = await Part.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(part);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/parts/:id/restock — เติมสต็อก +qty
router.patch('/:id/restock', async (req, res) => {
  try {
    const { qty } = req.body;
    const part = await Part.findByIdAndUpdate(
      req.params.id,
      { $inc: { qty: Number(qty) } },
      { new: true }
    );
    res.json(part);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/parts/:id
router.delete('/:id', async (req, res) => {
  try {
    await Part.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;