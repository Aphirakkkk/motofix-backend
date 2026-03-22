const router  = require('express').Router();
const Job     = require('../models/Job');
const Customer = require('../models/Customer');

// GET /api/jobs — ดูทั้งหมด (กรองได้ด้วย ?status=waiting)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const jobs = await Job.find(filter)
      .populate('customer', 'name phone')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('customer');
    if (!job) return res.status(404).json({ error: 'ไม่พบงานซ่อม' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/jobs — สร้างงานซ่อมใหม่
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, plate, model, detail, price, status } = req.body;

    // หาหรือสร้างลูกค้า
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = await Customer.create({ name: customerName, phone,
        bikes: [{ plate: plate?.toUpperCase(), model }]
      });
    }

    const job = await Job.create({ customer: customer._id, plate, model, detail, price, status });
    const populated = await job.populate('customer', 'name phone');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/jobs/:id — อัปเดตสถานะ หรือข้อมูล
router.patch('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('customer', 'name phone');
    if (!job) return res.status(404).json({ error: 'ไม่พบงานซ่อม' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;