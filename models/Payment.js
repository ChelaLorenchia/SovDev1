const { Schema, model } = require('mongoose');

const PaymentSchema = new Schema({
  kode: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number,
      qty: Number
    }
  ],
  total: Number,
  cash: Number,
  kembalian: Number,
  tanggal: { type: Date, default: Date.now }
});

module.exports = model('Payment', PaymentSchema);
