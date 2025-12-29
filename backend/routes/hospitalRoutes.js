const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/hospital/user/:userId", (req, res) => {
  const sql = "SELECT * FROM hospitals WHERE user_id = ?";
  db.query(sql, [req.params.userId], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.json(result[0]);
  });
});

module.exports = router;
