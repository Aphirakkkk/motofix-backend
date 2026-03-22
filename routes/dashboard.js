const router  = require('express').Router();
const Job     = require('../models/Job');
const Part    = require('../models/Part');
const Invoice = require('../models/Invoice');

// GET /api/dashboard/stats — สถิติรวมสำหรับ Dashboard
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayJobs, pendingJobs, lowParts, monthlyInvoices] = await Promise.all([
      Job.countDocuments({ createdAt: { $gte: today } }),
      Job.countDocuments({ status: { $in: ['waiting', 'progress'] } }),
      Part.countDocuments({ $expr: { $lt: ['$qty', '$minQty'] } }),
      Invoice.find({
        createdAt: {
          $gte: new Date(today.getFullYear(), today.getMonth(), 1)
        },
        paid: true
      }),
    ]);

    const monthlyRevenue = monthlyInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    res.json({ todayJobs, pendingJobs, lowParts, monthlyRevenue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/revenue-week — รายได้ 7 วันย้อนหลัง
router.get('/revenue-week', async (req, res) => {
  try {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() - i);
      const next = new Date(d); next.setDate(d.getDate() + 1);
      const invoices = await Invoice.find({ createdAt: { $gte: d, $lt: next }, paid: true });
      const amount = invoices.reduce((s, inv) => s + inv.amount, 0);
      days.push({
        day: d.toLocaleDateString('th-TH', { weekday: 'short' }),
        date: d.toISOString().slice(0, 10),
        amount,
      });
    }
    res.json(days);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;