const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PesananSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  kode: { type: String, required: true, unique: true },
  items: [
    {
      name: String,
      price: Number,
      qty: Number,
      image: String
    }
  ],
  total: { type: Number, required: true },
  metode: { type: String, required: true },
  status: { type: String, default: 'belum dibayar' },
  tanggal: { type: Date, default: Date.now },
  cash: { type: Number, default: 0 },
  kembalian: { type: Number, default: 0 },
});

module.exports = mongoose.model('Pesanan', PesananSchema);
