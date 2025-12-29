const db = require("../config/db");

exports.createEmergency = (req, res) => {
  const { hospital_id, blood_group } = req.body;

  if (!hospital_id || !blood_group) {
    return res.status(400).json({ message: "Missing data" });
  }

  const sql = `
    INSERT INTO emergency_requests (hospital_id, blood_group)
    VALUES (?, ?)
  `;

  db.query(sql, [hospital_id, blood_group], (err, result) => {
    if (err) {
      console.log("Emergency create error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    res.status(201).json({ message: "Emergency created" });
  });
};
