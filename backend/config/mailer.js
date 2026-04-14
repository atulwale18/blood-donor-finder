const nodemailer = require("nodemailer");

/* =====================
   EMAIL CONFIG
===================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "blooddonorportal@gmail.com",
    pass: "kltd dwfv txnd dtzz" // Using the existing app password found in authController
  }
});

module.exports = transporter;
