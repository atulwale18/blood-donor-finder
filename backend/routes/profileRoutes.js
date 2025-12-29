const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* =====================
   GET HOSPITAL BY USER_ID
===================== */
router.get("/hospital/:userId", (req, res) => {
  const sql = "SELECT * FROM hospitals WHERE user_id = ?";

  db.query(sql, [req.params.userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.json(result[0]);
  });
});

/* =====================
   GET DONOR BY USER_ID
===================== */
router.get("/donor/:userId", (req, res) => {
  const sql = "SELECT * FROM donors WHERE user_id = ?";

  db.query(sql, [req.params.userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Donor not found" });
    }
    res.json(result[0]);
  });
});

module.exports = router;
