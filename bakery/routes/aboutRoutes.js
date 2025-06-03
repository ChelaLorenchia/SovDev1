const express = require("express");
const router = express.Router();
const About = require("../models/About");

// GET current opening hours
router.get("/", async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update opening hours
router.put("/", async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = new About({ openingHours: req.body.openingHours });
    } else {
      about.openingHours = req.body.openingHours;
    }

    await about.save();
    res.json({ message: "Jam operasional berhasil diperbarui." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
