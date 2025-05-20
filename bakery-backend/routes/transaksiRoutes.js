const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const transaksiTunaiSchema = new mongoose.Schema({
  items: [{ item: String, qty: Number, price: Number }],
  metode: String,
  tanggal: { type: Date, default: Date.now },
  total: Number,
  cash: Number,
  kembali: Number
});

const TransaksiTunai = mongoose.model("transaksiTunai", transaksiTunaiSchema);

router.post("/api/transaksi-tunai", async (req, res) => {
  try {
    const transaksi = new TransaksiTunai(req.body);
    await transaksi.save();
    res.status(201).json(transaksi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/transaksi-tunai", async (req, res) => {
  try {
    const data = await TransaksiTunai.find().sort({ tanggal: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
