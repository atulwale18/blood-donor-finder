const db = require('../config/db');

exports.findDonors = (req, res) => {
  const { latitude, longitude, blood_group, radius } = req.body;

  const sql = `
    SELECT user_id, name, blood_group, mobile,
    (6371 * acos(
      cos(radians(?)) * cos(radians(latitude)) *
      cos(radians(longitude) - radians(?)) +
      sin(radians(?)) * sin(radians(latitude))
    )) AS distance
    FROM users
    WHERE role = 'donor'
      AND blood_group = ?
      AND is_available = TRUE
      AND last_donation_date <= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
    HAVING distance <= ?
    ORDER BY distance ASC
  `;

  db.query(
    sql,
    [latitude, longitude, latitude, blood_group, radius],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        total_donors: results.length,
        donors: results
      });
    }
  );
};
