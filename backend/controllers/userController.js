const db = require("../config/db");

exports.getUserById = (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT 
      user_id,
      name,
      email,
      role,
      age,
      gender,
      blood_group,
      mobile,
      last_donation_date,
      latitude,
      longitude
    FROM users
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.sqlMessage });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result[0]);
  });
};
