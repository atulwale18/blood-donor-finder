const express = require("express");
const router = express.Router();
const emergencyController = require("../controllers/emergencyController");

router.post("/create", emergencyController.createEmergencyRequest);

module.exports = router;
