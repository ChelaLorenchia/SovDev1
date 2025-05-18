const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Tampilkan halaman login
router.get('/login', (req, res) => {
  // res.sendFile(path.join(__dirname, '../../login.html'));
  res.redirect('SovDev1/login.html');
});

// Tampilkan halaman customer setelah login
router.get('/custhome', (req, res) => {
  res.sendFile(path.join(__dirname, '../../Cust Home.html'));
});

// Tampilkan halaman admin (opsional)
router.get('/admin', (req, res) => {
  res.send('../../Admin Home.html');
});

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email sudah digunakan');
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Simpan user
    await User.create({
      username,
      email,
      password: hash,
      role: role || 'customer',
    });

    // Redirect ke login
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan saat register');
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User tidak ditemukan');

    // Cek password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send('Password salah');

    // Simpan session
    req.session.userId = user._id;
    req.session.role = user.role;

    // Redirect sesuai role
    if (user.role === 'admin') {
      return res.redirect('/admin');
    } else {
      return res.redirect('../../Cust Home.html');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan saat login');
  }
});

module.exports = router;
