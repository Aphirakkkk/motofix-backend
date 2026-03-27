const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  item:    { type: String, required: true, trim: true },
  amount:  { type: Number, required: true, min: 0 },
  payType: { type: String, enum: ['cash', 'transfer'], default: 'cash' },
  date:    { type: String, required: true },  // 'YYYY-MM-DD'
  note:    { type: String, default: '' },
  shop:    { type: String, default: 'aonang' },
}, { timestamps: true });

module.exports = mongoose.model('Ledger', ledgerSchema);
