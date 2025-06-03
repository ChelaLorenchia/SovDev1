const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  openingHours: {
    type: Map,
    of: [String], 
  }
});

module.exports = mongoose.model('About', aboutSchema);
