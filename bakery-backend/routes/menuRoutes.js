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
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, async (error, result) => {
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
      })
      .end(req.file.buffer); // Kirim buffer file yang diupload ke Cloudinary
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/menus/:id
// routes/menuRoutes.js
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }

    res.status(200).json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    console.error("Gagal menghapus produk:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// routes/menuRoutes.js
// router.get("/", async (req, res) => {
//   try {
//     const menus = await Menu.find();
//     res.json(menus);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.get("/top6", async (req, res) => {
  try {
    const menus = await Menu.find().limit(6);
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET satu produk
router.get("/:id", async (req, res) => {
  try {
    const product = await Menu.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update produk
// PUT update produk
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      category: req.body.category,
    };

    if (req.file) {
      // Upload gambar ke Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.file.buffer);
      });

      updateData.image = result.secure_url; // Menyimpan URL gambar baru
    }

    // Update produk dengan data baru
    const updated = await Menu.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(updated); // Kembalikan produk yang sudah diperbarui
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.put("/:id", upload.single("image"), async (req, res) => {
//   try {
//     const updateData = {
//       name: req.body.name,
//       price: req.body.price,
//       stock: req.body.stock,
//       description: req.body.description,
//       category: req.body.category,
//     };

//     if (req.file) {
//       const result = await cloudinary.uploader.upload_stream(
//         { resource_type: "image" },
//         async (error, result) => {
//           if (error) return res.status(500).json({ error });
//           updateData.image = result.secure_url;
//           const updated = await Menu.findByIdAndUpdate(req.params.id, updateData, { new: true });
//           res.json(updated);
//         }
//       ).end(req.file.buffer);
//     } else {
//       const updated = await Menu.findByIdAndUpdate(req.params.id, updateData, { new: true });
//       res.json(updated);
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;
