const express = require("express");
const cors = require("cors");
const path = require("path");


const app = express();

/* =====================
   MIDDLEWARE
===================== */
app.use(cors());
app.use(express.json());

/* =====================
   ROUTES IMPORT
===================== */
const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const bloodBankRoutes = require("./routes/bloodBankRoutes");
const adminRoutes = require("./routes/adminRoutes");
const profileRoutes = require("./routes/profileRoutes");

/* =====================
   ROUTES USE
===================== */
app.use("/api/auth", authRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/bloodbank", bloodBankRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =====================
   SERVER
===================== */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
