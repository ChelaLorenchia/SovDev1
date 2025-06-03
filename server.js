const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const corsOptions = {
  origin: "http://localhost:5503", // pastikan ini persis sama dengan client
  credentials: true,
};


app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(
  session({
    secret: "rahasia-bakery",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax'
    }
  })
);

// Serve static files (HTML, CSS, JS frontend)
app.use(express.static(path.join(__dirname, "public")));

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Routing
const menuRoutes = require("./routes/menuRoutes");
app.use("/api/menus", menuRoutes);

const aboutRoutes = require("./routes/aboutRoutes");
app.use("/api/about", aboutRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const transaksiRoutes = require("./routes/transaksiRoutes");
app.use(transaksiRoutes);

const pesananRoutes = require('./routes/pesananRoutes');
app.use('/api/pemesanan', pesananRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
