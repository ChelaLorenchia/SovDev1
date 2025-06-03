const express = require('express');
const router = express.Router();
const Pesanan = require('../models/Pesanan');

// POST: Simpan pesanan
router.post('/', async (req, res) => {
  try {
    console.log('SESSION:', req.session);

    // Cek jika belum ada userId, isi dari session
    if (!req.body.userId && req.session?.userId) {
      req.body.userId = req.session.userId.toString(); // 💥 PENTING: ubah ke string
    }

    console.log('REQUEST BODY YANG DIKIRIM:', req.body); // ✅ Debug penting

    const pesanan = new Pesanan(req.body);
    await pesanan.save();

    res.status(201).json({ message: "Pesanan berhasil disimpan." });
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "Gagal menyimpan pesanan." });
  }
});



// GET: Ambil pesanan berdasarkan kode
router.get('/:kode', async (req, res) => {
  try {
    const pesanan = await Pesanan.findOne({ kode: req.params.kode });
    if (!pesanan) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan." });
    }
    res.json(pesanan);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil pesanan." });
  }
});

module.exports = router;
