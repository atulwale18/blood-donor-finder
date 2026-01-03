const db = require("../config/db");

/* =========================
   DISTANCE CALCULATION
========================= */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/* =========================
   CREATE EMERGENCY (Hospital)
========================= */
exports.createEmergency = (req, res) => {
  const { hospital_id, blood_group } = req.body;

  if (!hospital_id || !blood_group) {
    return res.status(400).json({ message: "Missing data" });
  }

  // 10 minutes expiry for donor
  const expireAt = new Date(Date.now() + 10 * 60 * 1000);

  const sql = `
    INSERT INTO emergency_requests 
    (hospital_id, blood_group, status, donor_visible, hospital_visible, donor_expire_at, created_at)
    VALUES (?, ?, 'pending', 1, 1, ?, NOW())
  `;

  db.query(sql, [hospital_id, blood_group, expireAt], (err) => {
    if (err) {
      console.error("Emergency create error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    res.status(201).json({ message: "Emergency created" });
  });
};

/* =========================
   GET EMERGENCY FOR DONOR
========================= */
exports.getEmergencyForDonor = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT 
      er.request_id,
      er.blood_group,
      er.created_at,
      h.hospital_name,
      h.latitude AS h_lat,
      h.longitude AS h_lon,
      d.latitude AS d_lat,
      d.longitude AS d_lon
    FROM emergency_requests er
    JOIN hospitals h ON h.hospital_id = er.hospital_id
    JOIN donors d ON d.user_id = ?
    WHERE er.blood_group = d.blood_group
      AND er.status = 'pending'
      AND er.donor_visible = 1
      AND er.donor_expire_at > NOW()
    ORDER BY er.created_at DESC
    LIMIT 1
  `;

  db.query(sql, [userId], (err, result) => {
    if (err || result.length === 0) {
      return res.json(null);
    }

    const row = result[0];

    const distance = calculateDistance(
      row.d_lat,
      row.d_lon,
      row.h_lat,
      row.h_lon
    );

    res.json({
      request_id: row.request_id,
      blood_group: row.blood_group,
      hospital_name: row.hospital_name,
      created_at: row.created_at,
      distance_km: distance
    });
  });
};

/* =========================
   GET EMERGENCY FOR HOSPITAL
========================= */
exports.getEmergencyForHospital = (req, res) => {
  const hospitalId = req.params.hospitalId;

  const sql = `
    SELECT 
      er.request_id,
      er.blood_group,
      er.status,
      er.created_at,
      d.name AS donor_name,
      d.mobile AS donor_mobile,
      d.city AS donor_city
    FROM emergency_requests er
    LEFT JOIN donors d 
      ON d.donor_id = er.accepted_donor_id
    WHERE er.hospital_id = ?
      AND er.hospital_visible = 1
    ORDER BY er.created_at DESC
  `;

  db.query(sql, [hospitalId], (err, result) => {
    if (err) {
      console.error("Hospital emergency fetch error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    res.json(result);
  });
};

/* =========================
   ACCEPT EMERGENCY (Donor)
========================= */
exports.acceptEmergency = (req, res) => {
  const { request_id, donor_id } = req.body;

  if (!request_id || !donor_id) {
    return res.status(400).json({ message: "Missing data" });
  }

  const sql = `
    UPDATE emergency_requests
    SET status = 'accepted',
        accepted_donor_id = ?
    WHERE request_id = ?
      AND status = 'pending'
  `;

  db.query(sql, [donor_id, request_id], (err, result) => {
    if (err || result.affectedRows === 0) {
      return res.status(400).json({
        message: "Request already accepted or invalid"
      });
    }

    // After 1 minute hide from donor only
    setTimeout(() => {
      db.query(
        "UPDATE emergency_requests SET donor_visible = 0 WHERE request_id = ?",
        [request_id]
      );
    }, 60000);

    res.json({ message: "Emergency accepted" });
  });
};

/* =========================
   DECLINE EMERGENCY
========================= */
exports.declineEmergency = (req, res) => {
  const { request_id } = req.body;

  if (!request_id) {
    return res.status(400).json({ message: "Request ID required" });
  }

  const sql = `
    UPDATE emergency_requests
    SET status = 'declined'
    WHERE request_id = ?
      AND status = 'pending'
  `;

  db.query(sql, [request_id], (err, result) => {
    if (err || result.affectedRows === 0) {
      return res.status(400).json({ message: "Request already handled" });
    }

    // After 1 minute hide from BOTH donor & hospital
    setTimeout(() => {
      db.query(
        `
        UPDATE emergency_requests
        SET donor_visible = 0,
            hospital_visible = 0
        WHERE request_id = ?
        `,
        [request_id]
      );
    }, 60000);

    res.json({ message: "Request declined successfully" });
  });
};
