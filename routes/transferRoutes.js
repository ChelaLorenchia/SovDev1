const express = require("express");
const router = express.Router();
const Transfer = require("../models/Transfer");
const upload = require("../middleware/upload"); // middleware dengan multer.memoryStorage()
const cloudinary = require("../utils/cloudinary");

// POST: Simpan transfer ke MongoDB dan upload bukti ke Cloudinary
router.post("/api/transfer", upload.single("bukti"), async (req, res) => {
  try {
    let items = req.body.items;
    if (typeof items === "string") {
      items = JSON.parse(items); // Parse jika dikirim sebagai JSON string
    }
    console.log("Body:", req.body);
  console.log("File:", req.file);

    let imageUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      imageUrl = result.secure_url; // URL dari Cloudinary
    }

    const transfer = new Transfer({
      userId: req.session?.userId || null,
      kode: req.body.kode,
      items: items,
      total: req.body.total,
      status: req.body.status,
      tanggal: req.body.tanggal,
      bukti: imageUrl, // Simpan URL dari Cloudinary
    });

    await transfer.save();
    res.status(201).json({ message: "Data transfer berhasil disimpan", data: transfer });
  } catch (error) {
    console.error("Gagal menyimpan transfer:", error.message);
    res.status(500).json({ message: "Gagal menyimpan data transfer", error: error.message });
  }
});

// GET: Ambil semua transfer + nama user
router.get("/api/transfer", async (req, res) => {
  try {
    const transfers = await Transfer.find().populate("userId", "username");
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data transfer" });
  }
});

// PUT: Update status pesanan
router.put("/api/transfer/:id", async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!transfer) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json({ message: "Status diperbarui", data: transfer });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui status", error: error.message });
  }
});


module.exports = router;
