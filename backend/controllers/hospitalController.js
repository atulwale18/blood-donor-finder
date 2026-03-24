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

/* =========================
   UPDATE HOSPITAL PROFILE
========================= */
exports.updateHospitalProfile = (req, res) => {
  const { user_id } = req.params;
  const { hospital_name, mobile, email, address, city, district, latitude, longitude } = req.body;

  // Update users table
  const userSql = `UPDATE users SET email = ?, mobile = ? WHERE user_id = ?`;
  db.query(userSql, [email, mobile, user_id], (err) => {
    if (err) return res.status(500).json({ message: "Failed to update user context" });

    // Update hospitals table
    const hospitalSql = `
      UPDATE hospitals 
      SET hospital_name = ?, mobile = ?, email = ?, address = ?, city = ?, district = ?, latitude = ?, longitude = ?
      WHERE user_id = ?
    `;

    db.query(
      hospitalSql,
      [hospital_name, mobile, email, address, city, district, latitude, longitude, user_id],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Failed to update hospital profile" });
        return res.json({ message: "Profile updated successfully" });
      }
    );
  });
};

/* =========================
   CHANGE HOSPITAL PASSWORD
========================= */
exports.changeHospitalPassword = (req, res) => {
  const { user_id } = req.params;
  const { currentPassword, newPassword } = req.body;

  db.query(`SELECT password FROM users WHERE user_id = ?`, [user_id], (err, users) => {
    if (err || users.length === 0) return res.status(404).json({ message: "User not found" });

    if (users[0].password !== currentPassword) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    db.query(`UPDATE users SET password = ? WHERE user_id = ?`, [newPassword, user_id], (err) => {
      if (err) return res.status(500).json({ message: "Failed to change password" });
      return res.json({ message: "Password updated successfully" });
    });
  });
};
