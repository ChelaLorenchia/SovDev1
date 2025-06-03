const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' }
});

module.exports = mongoose.model('User', userSchema);
