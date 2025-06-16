const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: { type: String, enum: ["manis", "asin"] },
  stock: Number,
  description: String,
  image: String,
});

module.exports = mongoose.model("Menu", menuSchema);
