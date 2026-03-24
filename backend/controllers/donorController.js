const db = require("../config/db");

/* =========================
   GET DONOR PROFILE
   Used after login
========================= */
exports.getDonorProfile = (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT *
    FROM donors
    WHERE user_id = ?
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Donor data not found" });
    }

    return res.json(result[0]);
  });
};

/* =========================
   UPDATE DONOR PROFILE
========================= */
exports.updateDonorProfile = (req, res) => {
  const { user_id } = req.params;
  const { name, mobile, email, age, address, city, district, latitude, longitude, is_available } = req.body;

  // Update users table for email and mobile
  const userSql = `UPDATE users SET email = ?, mobile = ? WHERE user_id = ?`;
  db.query(userSql, [email, mobile, user_id], (err) => {
    if (err) return res.status(500).json({ message: "Failed to update user context" });

    // Update donors table
    const donorSql = `
      UPDATE donors 
      SET name = ?, mobile = ?, email = ?, age = ?, address = ?, city = ?, district = ?, latitude = ?, longitude = ?, is_available = ?
      WHERE user_id = ?
    `;

    db.query(
      donorSql,
      [name, mobile, email, age, address, city, district, latitude, longitude, is_available || 'Available', user_id],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Failed to update donor profile" });
        return res.json({ message: "Profile updated successfully" });
      }
    );
  });
};

/* =========================
   CHANGE DONOR PASSWORD
========================= */
exports.changeDonorPassword = (req, res) => {
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

/* =========================
   FIND DONORS (SEARCH)
   Used by hospital (manual radius)
========================= */
exports.findDonors = (req, res) => {
  const { latitude, longitude, blood_group, radius } = req.body;

  if (!latitude || !longitude || !blood_group || !radius) {
    return res.status(400).json({
      message: "latitude, longitude, blood_group and radius are required"
    });
  }

  const sql = `
    SELECT 
      d.user_id,
      d.name,
      d.blood_group,
      d.mobile,
      d.latitude,
      d.longitude,
      d.last_donation_date,
      (
        6371 * acos(
          cos(radians(?)) * cos(radians(d.latitude)) *
          cos(radians(d.longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(d.latitude))
        )
      ) AS distance
    FROM donors d
    WHERE d.blood_group = ?
      AND d.latitude IS NOT NULL
      AND d.longitude IS NOT NULL
      AND d.is_available = 'Available'
      AND (
        d.last_donation_date IS NULL 
        OR d.last_donation_date <= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
      )
    HAVING distance <= ?
    ORDER BY distance ASC
  `;

  db.query(
    sql,
    [latitude, longitude, latitude, blood_group, radius],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      return res.json({
        total_donors: results.length,
        donors: results
      });
    }
  );
};

/* =========================
   GET NEAREST DONORS (KNN)
   Emergency use by hospital
   15 KM + Top 5 nearest
========================= */
exports.getNearestDonors = (req, res) => {
  const { blood_group, latitude, longitude } = req.query;

  if (!blood_group || !latitude || !longitude) {
    return res.status(400).json({
      message: "blood_group, latitude and longitude are required"
    });
  }

  const MAX_DISTANCE = 15; // km
  const K = 5; // top 5 nearest donors

  const sql = `
    SELECT 
      d.donor_id,
      d.name,
      d.age,
      d.gender,
      d.blood_group,
      d.mobile,
      d.last_donation_date,
      d.latitude,
      d.longitude,
      (
        6371 * acos(
          cos(radians(?)) * cos(radians(d.latitude)) *
          cos(radians(d.longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(d.latitude))
        )
      ) AS distance
    FROM donors d
    WHERE d.blood_group = ?
      AND d.latitude IS NOT NULL
      AND d.longitude IS NOT NULL
      AND d.is_available = 'Available'
      AND (
        d.last_donation_date IS NULL
        OR d.last_donation_date <= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
      )
    HAVING distance <= ?
    ORDER BY distance ASC
    LIMIT ?
  `;

  db.query(
    sql,
    [latitude, longitude, latitude, blood_group, MAX_DISTANCE, K],
    (err, results) => {
      if (err) {
        console.error("Nearest donor KNN error:", err);
        return res.status(500).json({
          message: "Failed to fetch nearest donors"
        });
      }

      return res.json(results);
    }
  );
};

/* =========================
   UPLOAD DONOR PROFILE PHOTO
   Supports:
   - Live camera selfie
   - Gallery upload
========================= */
exports.uploadProfilePhoto = (req, res) => {
  const { donorId } = req.params;

  if (!req.file) {
    return res.status(400).json({
      message: "No image uploaded"
    });
  }

  // ✅ FIX: store public relative path
  const imagePath = `uploads/donors/${req.file.filename}`;

  const sql = `
    UPDATE donors
    SET profile_pic = ?
    WHERE donor_id = ?
  `;

  db.query(sql, [imagePath, donorId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to update profile photo"
      });
    }

    return res.json({
      message: "Profile photo updated successfully",
      profile_pic: imagePath
    });
  });
};

/* =========================
   SAVE FCM TOKEN
   Used for Push Notifications
========================= */
exports.saveToken = (req, res) => {
  const { donor_id, token } = req.body;

  if (!donor_id || !token) {
    return res.status(400).json({ message: "donor_id and token are required" });
  }

  const sql = `
    UPDATE donors
    SET fcm_token = ?
    WHERE donor_id = ?
  `;

  db.query(sql, [token, donor_id], (err) => {
    if (err) {
      console.error("Save token error:", err);
      return res.status(500).json({ message: "Failed to save push token" });
    }

    return res.json({ message: "Push token saved successfully" });
  });
};
