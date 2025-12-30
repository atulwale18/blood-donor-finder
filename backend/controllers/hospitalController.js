const db = require("../config/db");

/* =========================
   GET HOSPITAL PROFILE
   Used after login
========================= */
exports.getHospitalProfile = (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT *
    FROM hospitals
    WHERE user_id = ?
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Hospital data not found" });
    }

    return res.json(result[0]);
  });
};

/* =========================
   GET HOSPITAL BY ID
   (optional – for future use)
========================= */
exports.getHospitalById = (req, res) => {
  const { hospitalId } = req.params;

  const sql = `
    SELECT hospital_id, hospital_name, mobile
    FROM hospitals
    WHERE hospital_id = ?
  `;

  db.query(sql, [hospitalId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "DB error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    return res.json(result[0]);
  });
};
