const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, unique: true },
  job:       { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  customer:  { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount:    { type: Number, required: true },
  paid:      { type: Boolean, default: false },
  paidAt:    { type: Date },
  note:      { type: String, default: '' },
}, { timestamps: true });

// Auto-generate invoiceNo
invoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNo) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNo = 'INV-' + String(count + 1).padStart(4, '0');
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);