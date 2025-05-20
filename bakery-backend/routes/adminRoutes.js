const express = require('express');
const router = express.Router();
const User = require('../models/User'); // pakai User.js
const bcrypt = require('bcryptjs');

// Ambil data profil admin
router.get('/profile', async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.json({
      username: admin.username,
      email: admin.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ubah password admin
router.post('/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const passwordMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Password lama salah' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();

    res.json({ message: 'Password berhasil diubah' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout (simulasi)
router.post('/logout', (req, res) => {
  // Kalau pakai session/JWT, hapus tokennya di sini
  res.json({ message: 'Logout berhasil' });
});

module.exports = router;
