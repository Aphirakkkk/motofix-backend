const router  = require('express').Router();
const Invoice = require('../models/Invoice');
const Job     = require('../models/Job');

// GET /api/invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('customer', 'name phone')
      .populate('job', 'jobId detail plate')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/invoices — สร้างจาก jobId
router.post('/', async (req, res) => {
  try {
    const job = await Job.findById(req.body.jobId).populate('customer');
    if (!job) return res.status(404).json({ error: 'ไม่พบงานซ่อม' });
    const invoice = await Invoice.create({
      job: job._id,
      customer: job.customer._id,
      amount: req.body.amount ?? job.price,
      note: req.body.note,
    });
    // อัปเดตสถานะงานเป็น done
    await Job.findByIdAndUpdate(job._id, { status: 'done' });
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/invoices/:id/pay — บันทึกชำระเงิน
router.patch('/:id/pay', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { paid: true, paidAt: new Date() },
      { new: true }
    );
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;