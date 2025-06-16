const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// Simpan Payment pembayaran
router.post('/', async (req, res) => {
  try {
    const Payment = new Payment(req.body);
    await Payment.save();
    res.status(201).json({ message: 'Transaksi berhasil disimpan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menyimpan Transaksi.' });
  }
});

// GET semua transaksi pembayaran
router.get('/', async (req, res) => {
  try {
    const transaksi = await Transaksi.find().sort({ tanggal: -1 });
    res.json(transaksi);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil riwayat transaksi.' });
  }
});

module.exports = router;
