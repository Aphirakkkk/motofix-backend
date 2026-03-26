const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId:    { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  plate:    { type: String, required: true, uppercase: true, trim: true },
  model:    { type: String, default: '-' },
  detail:   { type: String, required: true },
  status:   { type: String, enum: ['waiting', 'progress', 'done'], default: 'waiting' },
  price:    { type: Number, default: 0 },
  parts:    [{ partId: mongoose.Schema.Types.ObjectId, name: String, qty: Number, price: Number }],
  note:     { type: String, default: '' },
}, { timestamps: true });

// Auto-generate jobId เช่น J-0001
// Mongoose 7+ async pre-hooks ไม่รับ next เป็น parameter — ใช้ async/await แล้ว return ได้เลย
jobSchema.pre('save', async function() {
  if (!this.jobId) {
    const count = await mongoose.model('Job').countDocuments();
    this.jobId = 'J-' + String(count + 1).padStart(4, '0');
  }
});

module.exports = mongoose.model('Job', jobSchema);
