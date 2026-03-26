const router   = require('express').Router();
const Customer = require('../models/Customer');
const Job      = require('../models/Job');

// GET /api/customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/customers/:id — พร้อมประวัติงานซ่อม
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'ไม่พบลูกค้า' });
    const jobs = await Job.find({ customer: req.params.id }).sort({ createdAt: -1 });
    res.json({ ...customer.toJSON(), jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/customers
router.post('/', async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/customers/:id
router.patch('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ error: 'ไม่พบลูกค้า' });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/customers/:id
router.delete('/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
