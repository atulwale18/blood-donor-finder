require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");


const app = express();

/* =====================
   MIDDLEWARE
===================== */
app.use(helmet()); // Sets secure HTTP headers (XSS, Content Security Policy, etc.)
app.use(cors());
app.use(express.json());

// DDoS Protection & Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/", limiter); // Apply to all API routes

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
app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});
