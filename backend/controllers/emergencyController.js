const db = require("../config/db");

/* =========================
   DISTANCE CALCULATION
========================= */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/* =========================
   CREATE EMERGENCY
========================= */
exports.createEmergency = (req, res) => {
  const { hospital_id, blood_group } = req.body;

  if (!hospital_id || !blood_group) {
    return res.status(400).json({ message: "Missing data" });
  }

  const sql = `
    INSERT INTO emergency_requests (hospital_id, blood_group, status, created_at)
    VALUES (?, ?, 'pending', NOW())
  `;

  db.query(sql, [hospital_id, blood_group], (err) => {
    if (err) {
      console.log("Emergency create error:", err);
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
      h.hospital_name AS hospital_name,
      h.latitude AS h_lat,
      h.longitude AS h_lon,
      d.latitude AS d_lat,
      d.longitude AS d_lon
    FROM emergency_requests er
    JOIN hospitals h ON h.hospital_id = er.hospital_id
    JOIN donors d ON d.user_id = ?
    WHERE er.blood_group = d.blood_group
      AND er.status = 'pending'
    ORDER BY er.created_at DESC
    LIMIT 1
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Emergency fetch error:", err);
      return res.json(null);
    }

    if (result.length === 0) {
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
   ACCEPT EMERGENCY
========================= */
exports.acceptEmergency = (req, res) => {
  const { request_id } = req.body;

  if (!request_id) {
    return res.status(400).json({ message: "Missing request id" });
  }

  const sql = `
    UPDATE emergency_requests
    SET status = 'accepted'
    WHERE request_id = ?
  `;

  db.query(sql, [request_id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "DB error" });
    }

    res.json({ message: "Emergency accepted" });
  });
};

/* =========================
   DECLINE EMERGENCY
========================= */
exports.declineEmergency = (req, res) => {
  const { request_id } = req.body;

  if (!request_id) {
    return res.status(400).json({ message: "Missing request id" });
  }

  const sql = `
    UPDATE emergency_requests
    SET status = 'declined'
    WHERE request_id = ?
  `;

  db.query(sql, [request_id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "DB error" });
    }

    res.json({ message: "Emergency declined" });
  });
};
