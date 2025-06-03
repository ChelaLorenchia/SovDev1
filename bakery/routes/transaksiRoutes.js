const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Menu = require("../models/Menu");

const transaksiTunaiSchema = new mongoose.Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
    item: String,
    qty: Number,
    price: Number
  }],
  metode: String,
  tanggal: { type: Date, default: Date.now },
  total: Number,
  cash: Number,
  kembali: Number
});

const TransaksiTunai = mongoose.model("transaksiTunai", transaksiTunaiSchema);

router.post("/api/transaksi-tunai", async (req, res) => {
  try {
    // Simpan transaksi terlebih dahulu
    const transaksi = new TransaksiTunai(req.body);
    await transaksi.save();

    // Kurangi stok produk satu per satu
    for (const item of req.body.items) {
      const produk = await Menu.findById(item.productId);
      if (!produk) throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan`);
      if (produk.stock < item.qty) throw new Error(`Stok tidak cukup untuk ${produk.name}`);
      produk.stock -= item.qty;
      await produk.save();
    }

    res.status(201).json(transaksi);
  } catch (err) {
    console.error("Transaksi gagal:", err.message);
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
