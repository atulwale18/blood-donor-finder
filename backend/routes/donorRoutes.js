const express = require("express");
const router = express.Router();

const {
  getDonorProfile,
  findDonors
} = require("../controllers/donorController");

/* =========================
   GET DONOR PROFILE
   Used after login
========================= */
router.get("/profile/:user_id", getDonorProfile);

/* =========================
   FIND DONORS
   Used by hospital search
========================= */
router.post("/find", findDonors);

module.exports = router;
