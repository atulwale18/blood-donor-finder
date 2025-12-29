const db = require("../config/db");   // ✅ ADD THIS

exports.getHospitalById = (req, res) => {
  const hospitalId = req.params.id;

  const sql = "SELECT * FROM hospitals WHERE hospital_id = ?";

  db.query(sql, [hospitalId], (err, result) => {
    if (err) {
      console.log("Hospital by ID error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.status(200).json(result[0]);
  });
};
