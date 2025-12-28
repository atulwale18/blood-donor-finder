const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT d.*, u.email
    FROM donors d
    JOIN users u ON d.user_id = u.user_id
    WHERE d.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ message: "Donor not found" });

    res.json(result[0]);
  });
});

module.exports = router;
