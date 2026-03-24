const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/* ================= EXISTING ROUTES (UNCHANGED) ================= */
router.post("/register", authController.register);
router.post("/login", authController.login);

/* ================= STEP 3: FORGOT PASSWORD FLOW ================= */

/* Request OTP (email or mobile) */
router.post("/forgot-password", authController.forgotPassword);

/* Verify OTP */
router.post("/verify-otp", authController.verifyOtp);

/* Reset password */
router.post("/reset-password", authController.resetPassword);

module.exports = router;
