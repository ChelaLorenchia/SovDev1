const mongoose = require('mongoose');
const Schema = mongoose.Schema; // ✅ Tambahkan ini

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
  tanggal: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pesanan', PesananSchema);
