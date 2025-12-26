const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const donorRoutes = require("./routes/donorRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");

const app = express(); // ✅ app MUST be created first

app.use(cors());
app.use(express.json());

// ✅ ROUTES (AFTER app is created)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/emergency", emergencyRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
