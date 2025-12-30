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
   FIND DONORS (SEARCH)
   Used by hospital
========================= */
exports.findDonors = (req, res) => {
  const { latitude, longitude, blood_group, radius } = req.body;

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
      AND (d.last_donation_date IS NULL 
           OR d.last_donation_date <= DATE_SUB(CURDATE(), INTERVAL 90 DAY))
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
