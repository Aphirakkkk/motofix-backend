const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  category: { type: String, default: 'อื่นๆ' },
  qty:      { type: Number, default: 0 },
  minQty:   { type: Number, default: 5 },
  unit:     { type: String, default: 'ชิ้น' },
  price:    { type: Number, default: 0 },
  imageUrl: { type: String, default: '' },
}, { timestamps: true });

// Virtual — สถานะอะไหล่
partSchema.virtual('status').get(function() {
  if (this.qty === 0)              return 'critical';
  if (this.qty < this.minQty)      return 'warning';
  return 'ok';
});
partSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Part', partSchema);
