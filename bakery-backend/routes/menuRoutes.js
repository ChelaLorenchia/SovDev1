const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const upload = require("../middleware/upload");
const cloudinary = require("../utils/cloudinary");

// POST dengan upload foto
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Pastikan file tersedia
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload ke Cloudinary
    cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error });
        }

        // Buat menu baru setelah file berhasil diupload ke Cloudinary
        const menu = new Menu({
          name: req.body.name,
          price: req.body.price,
          category: req.body.category,
          stock: req.body.stock,
          description: req.body.description,
          image: result.secure_url, // Simpan URL gambar dari Cloudinary
        });

        await menu.save(); // Simpan menu ke database
        console.log("Produk berhasil disimpan:", menu);
        res.status(201).json(menu); // Kembalikan respons dengan menu yang telah ditambahkan
      }
    ).end(req.file.buffer); // Kirim buffer file yang diupload ke Cloudinary
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// routes/menuRoutes.js
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
