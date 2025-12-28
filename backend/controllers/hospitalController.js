const db = require("../config/db");

exports.getHospitalById = (req, res) => {
  const hospitalId = req.params.id;

  const sql = `
    SELECT hospital_id, hospital_name, email, mobile
    FROM hospitals
    WHERE hospital_id = ?
  `;

  db.query(sql, [hospitalId], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.json(result[0]);
  });
};
