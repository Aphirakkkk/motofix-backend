const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  phone: { type: String, default: '-' },
  bikes: [{ plate: String, model: String }],
  note:  { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);