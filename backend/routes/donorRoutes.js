const express = require("express");
const router = express.Router();

const {
  getDonorProfile,
  findDonors,
  getNearestDonors,
  uploadProfilePhoto,
  updateDonorProfile,
  changeDonorPassword
} = require("../controllers/donorController");

const uploadDonorPhoto = require("../middleware/donorUpload"); // ✅ ADD THIS

/* =========================
   GET / UPDATE DONOR PROFILE
========================= */
router.get("/profile/:user_id", getDonorProfile);
router.put("/profile/:user_id", updateDonorProfile);
router.put("/change-password/:user_id", changeDonorPassword);

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

/* =========================
   UPLOAD DONOR PROFILE PHOTO
   Supports:
   - Live camera selfie
   - Gallery upload
   POST /api/donor/upload-photo/:donorId
========================= */
router.post(
  "/upload-photo/:donorId",
  uploadDonorPhoto.single("profile_pic"),
  uploadProfilePhoto
);

/* =========================
   SAVE FCM TOKEN
   Used for Push Notifications
========================= */
router.post("/save-token", require("../controllers/donorController").saveToken);

module.exports = router;
