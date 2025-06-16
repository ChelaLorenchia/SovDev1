const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { error } = require("console");

// Tampilkan halaman login
router.get("/login", (req, res) => {
  res.redirect("login.html");
});

// Tampilkan halaman customer setelah login
router.get("/custhome", (req, res) => {
  res.status(200).json({ success: true, redirect: "Cust Home.html" });
});

// Tampilkan halaman admin (opsional)
router.get("/admin", (req, res) => {
  res.redirect("Admin Home.html");
});

// REGISTER
// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email sudah digunakan" });
    }

    const hash = await bcrypt.hash(password, 10);

    // Ini bagian penting
    const newUser = await User.create({
      username,
      email,
      password: hash,
      role: role || "customer",
    });

    req.session.userId = newUser._id;
    req.session.role = newUser.role;

    res.status(200).json({ success: true, redirect: "Cust Home.html" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan saat register" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User tidak ditemukan" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Password salah" });
    }

    req.session.userId = user._id;
    req.session.role = user.role;

    console.log(req.session);

    // Redirect info dalam JSON
    const redirectUrl =
      user.role === "admin"
        ? "Admin Home.html"
        : user.role === "kasir"
        ? "Kasir Home.html"
        : "Cust Home.html";

    res.status(200).json({ success: true, redirect: redirectUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan saat login" });
  }
});


router.get("/api/user/profile", async (req, res) => {
  try {
    console.log("SESSION:", req.session);
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findById(userId).select("username email");
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil profil user" });
  }
});

router.post("/api/user/change-password", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findById(userId);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ error: "Password lama salah" });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error:
          "Password harus minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.",
      });
    }

    console.log("Password sebelum update:", user.password);
    user.password = await bcrypt.hash(newPassword, 10);
    console.log("Password setelah hash:", user.password);
    await user.save();
    console.log("Password berhasil disimpan");

    res.json({ message: "Password berhasil diubah" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengubah password" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Gagal logout" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout berhasil" });
  });
});

module.exports = router;
