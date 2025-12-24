const db = require('../config/db');

exports.createEmergencyRequest = (req, res) => {
  const {
    recipient_id,
    blood_group,
    latitude,
    longitude,
    radius
  } = req.body;

  const sql = `
    INSERT INTO emergency_requests
    (recipient_id, blood_group, latitude, longitude, radius)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [recipient_id, blood_group, latitude, longitude, radius],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: 'Emergency blood request created',
        request_id: result.insertId
      });
    }
  );
};

exports.getActiveRequests = (req, res) => {
  const sql = `
    SELECT er.request_id, er.blood_group, er.created_at,
           u.name AS recipient_name, u.mobile
    FROM emergency_requests er
    JOIN users u ON er.recipient_id = u.user_id
    WHERE er.status = 'active'
    ORDER BY er.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ requests: results });
  });
};

/* =====================================================
   🔴 ADD THIS FUNCTION BELOW (DO NOT REMOVE ABOVE CODE)
   ===================================================== */

exports.matchEmergencyDonors = (req, res) => {
  const emergencyId = req.params.id;

  // 1️⃣ Get emergency details
  const emergencySql = `
    SELECT blood_group, latitude, longitude, radius
    FROM emergency_requests
    WHERE request_id = ? AND status = 'active'
  `;

  db.query(emergencySql, [emergencyId], (err, emergencyResult) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (emergencyResult.length === 0) {
      return res.status(404).json({ message: 'Emergency request not found' });
    }

    const { blood_group, latitude, longitude, radius } = emergencyResult[0];

    // 2️⃣ Find nearby eligible donors
    const donorSql = `
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
      donorSql,
      [latitude, longitude, latitude, blood_group, radius],
      (err, donors) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json({
          emergency_id: emergencyId,
          total_donors: donors.length,
          donors: donors
        });
      }
    );
  });
};
