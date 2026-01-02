const express = require("express");
const router = express.Router();
const emergencyController = require("../controllers/emergencyController");

/* =========================
   CREATE EMERGENCY (Hospital)
========================= */
router.post("/create", emergencyController.createEmergency);

/* =========================
   GET EMERGENCY FOR DONOR
========================= */
router.get("/donor/:userId", emergencyController.getEmergencyForDonor);

/* =========================
   ACCEPT / DECLINE EMERGENCY
========================= */
router.post("/accept", emergencyController.acceptEmergency);
router.post("/decline", emergencyController.declineEmergency);

module.exports = router;
