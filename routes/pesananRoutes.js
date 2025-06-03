const express = require('express');
const router = express.Router();
const Pesanan = require('../models/Pesanan');
const User = require('../models/User');

// POST: Simpan pesanan
router.post('/', async (req, res) => {
  try {
    console.log('SESSION:', req.session);

    // Cek jika belum ada userId, isi dari session
    if (!req.body.userId && req.session?.userId) {
      req.body.userId = req.session.userId.toString();
    }

    console.log('REQUEST BODY YANG DIKIRIM:', req.body); 

    const pesanan = new Pesanan(req.body);
    await pesanan.save();

    res.status(201).json({ message: "Pesanan berhasil disimpan." });
  } catch (error) {
    console.warn(error);
    res.status(500).json({ message: "Gagal menyimpan pesanan." });
  }
});

// Ambil semua pesanan yang belum dibayar
router.get('/belum-dibayar', async (req, res) => {
  try {
    const pesanan = await Pesanan.find({ status: 'belum dibayar' }).sort({ tanggal: -1 });
    res.json(pesanan);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data pesanan.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const filter = req.query.sudahDibayar === 'true'
      ? { status: 'sudah dibayar' }
      : {};

    const pesanan = await Pesanan.find(filter)
  .populate('userId', 'username') // ✅ penting
  .sort({ tanggal: -1 });

    res.json(pesanan);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data pesanan.' });
  }
});

// Detail satu pesanan
router.get('/:kode', async (req, res) => {
  try {
    const pesanan = await Pesanan.findOne({ kode: req.params.kode }).populate('userId', 'username');
    if (!pesanan) return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
    res.json(pesanan);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil pesanan.' });
  }
});

// Tandai sebagai sudah dibayar
router.patch('/:id', async (req, res) => {
  try {
    const { cash, kembalian } = req.body;

    await Pesanan.findByIdAndUpdate(req.params.id, {
      status: 'sudah dibayar',
      cash,
      kembalian
    });

    res.json({ message: 'Status pesanan diperbarui.' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal update pesanan.' });
  }
});


module.exports = router;
