const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // Ini harus sama dengan nama model User kamu
  },
  kode: String,
  total: String,
  items: Array,
  status: { type: String, default: "belum diambil" },
  tanggal: String,
  bukti: String,
}, { timestamps: true });

module.exports = mongoose.model("Transfer", transferSchema);
