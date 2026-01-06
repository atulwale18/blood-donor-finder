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
   GET EMERGENCY FOR HOSPITAL
========================= */
router.get(
  "/hospital/:hospitalId",
  emergencyController.getEmergencyForHospital
);

/* =========================
   GET KNN NOTIFIED DONORS (Hospital)
========================= */
router.get(
  "/notified/:requestId",
  emergencyController.getNotifiedDonorsForHospital
);

/* =========================
   ACCEPT / DECLINE / COMPLETE
========================= */
router.post("/accept", emergencyController.acceptEmergency);
router.post("/decline", emergencyController.declineEmergency);
router.post("/complete", emergencyController.completeEmergency);

module.exports = router;
