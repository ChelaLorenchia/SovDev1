const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// Session setup (SEBELUM routing)
app.use(session({
  secret: 'rahasia-bakery',
  resave: false,
  saveUninitialized: false
}));

// Serve static files (HTML, CSS, JS frontend)
app.use(express.static(path.join(__dirname)));

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Routing
const menuRoutes = require('./routes/menuRoutes');
app.use('/api/menus', menuRoutes);

const aboutRoutes = require('./routes/aboutRoutes');
app.use('/api/about', aboutRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
