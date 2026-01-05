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
