const express = require("express");
const router = express.Router();

const {
  getHospitalProfile,
  getHospitalById
} = require("../controllers/hospitalController");

/* =========================
   GET HOSPITAL PROFILE
   Used after login
========================= */
router.get("/profile/:user_id", getHospitalProfile);

/* =========================
   GET HOSPITAL BY ID
   Optional / future use
========================= */
router.get("/:hospitalId", getHospitalById);

module.exports = router;
