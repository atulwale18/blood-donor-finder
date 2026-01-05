const express = require("express");
const router = express.Router();

const {
  getDonorProfile,
  findDonors,
  getNearestDonors
} = require("../controllers/donorController");

/* =========================
   GET DONOR PROFILE
   Used after login
========================= */
router.get("/profile/:user_id", getDonorProfile);

/* =========================
   FIND DONORS
   Used by hospital search (existing logic)
========================= */
router.post("/find", findDonors);

/* =========================
   GET NEAREST DONORS (KNN)
   Emergency use by hospital
   /api/donor/nearest?blood_group=O+&latitude=16.85&longitude=74.58
========================= */
router.get("/nearest", getNearestDonors);

module.exports = router;
