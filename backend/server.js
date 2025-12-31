const express = require("express");
const cors = require("cors");

const app = express();
const emergencyRoutes = require("./routes/emergencyRoutes");

app.use(express.json());
app.use("/api/emergency", emergencyRoutes);


app.use(cors());
app.use(express.json());

// ROUTES
const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const bloodBankRoutes = require("./routes/bloodBankRoutes");



app.use("/api/auth", authRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api", require("./routes/hospitalRoutes"));
app.use("/api", require("./routes/emergencyRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/bloodbank", bloodBankRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});


