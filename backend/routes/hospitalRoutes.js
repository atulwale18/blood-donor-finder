const express = require("express");
const router = express.Router();

const {
  getHospitalProfile,
  getHospitalById,
  updateHospitalProfile,
  changeHospitalPassword
} = require("../controllers/hospitalController");

/* =========================
   GET / UPDATE HOSPITAL PROFILE
========================= */
router.get("/profile/:user_id", getHospitalProfile);
router.put("/profile/:user_id", updateHospitalProfile);
router.put("/change-password/:user_id", changeHospitalPassword);

/* =========================
   GET HOSPITAL BY ID
   Optional / future use
========================= */
router.get("/:hospitalId", getHospitalById);

module.exports = router;
