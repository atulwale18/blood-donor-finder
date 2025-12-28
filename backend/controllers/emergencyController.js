const db = require("../config/db");

exports.createEmergencyRequest = (req, res) => {
  const { hospital_id, blood_group } = req.body;

  // validation
  if (!hospital_id || !blood_group) {
    return res.status(400).json({
      message: "hospital_id and blood_group are required"
    });
  }

  const sql = `
    INSERT INTO emergency_requests (hospital_id, blood_group, status)
    VALUES (?, ?, 'pending')
  `;

  db.query(sql, [hospital_id, blood_group], (err, result) => {
    if (err) {
      console.error("Emergency insert error:", err);
      return res.status(500).json({
        error: err.sqlMessage
      });
    }

    res.json({
      message: "Emergency request created successfully",
      request_id: result.insertId
    });
  });
};
