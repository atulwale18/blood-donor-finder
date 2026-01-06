const db = require("../config/db");

const MAX_DISTANCE = 15;   // km
const MAX_DONORS = 5;

/* =========================
   CREATE EMERGENCY (Hospital)
   + KNN donor selection
========================= */
exports.createEmergency = (req, res) => {
  const { hospital_id, blood_group } = req.body;

  if (!hospital_id || !blood_group) {
    return res.status(400).json({ message: "Missing data" });
  }

  const expireAt = new Date(Date.now() + 10 * 60 * 1000);

  const insertEmergencySql = `
    INSERT INTO emergency_requests
    (hospital_id, blood_group, status, donor_visible, hospital_visible, donor_expire_at, created_at)
    VALUES (?, ?, 'pending', 1, 1, ?, NOW())
  `;

  db.query(insertEmergencySql, [hospital_id, blood_group, expireAt], (err, result) => {
    if (err) {
      console.error("Emergency create error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    const requestId = result.insertId;

    /* ---- KNN donor selection ---- */
    const knnSql = `
      SELECT
        d.donor_id,
        (
          6371 * acos(
            cos(radians(h.latitude)) *
            cos(radians(d.latitude)) *
            cos(radians(d.longitude) - radians(h.longitude)) +
            sin(radians(h.latitude)) *
            sin(radians(d.latitude))
          )
        ) AS distance
      FROM donors d
      JOIN hospitals h ON h.hospital_id = ?
      WHERE d.blood_group = ?
        AND d.latitude IS NOT NULL
        AND d.longitude IS NOT NULL
      ORDER BY distance ASC
      LIMIT ?
    `;

    db.query(knnSql, [hospital_id, blood_group, MAX_DONORS], (err, donors) => {
      if (err) {
        console.error("KNN donor error:", err);
        return res.status(500).json({ message: "KNN error" });
      }

      donors.forEach((d) => {
        if (d.distance <= MAX_DISTANCE) {
          db.query(
            `
            INSERT INTO emergency_notified_donors
            (request_id, donor_id, distance_km, notified_at)
            VALUES (?, ?, ?, NOW())
            `,
            [requestId, d.donor_id, Number(d.distance.toFixed(2))]
          );
        }
      });

      res.status(201).json({
        message: "Emergency created & donors notified"
      });
    });
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
      (
        6371 * acos(
          cos(radians(d.latitude)) *
          cos(radians(h.latitude)) *
          cos(radians(h.longitude) - radians(d.longitude)) +
          sin(radians(d.latitude)) *
          sin(radians(h.latitude))
        )
      ) AS distance
    FROM emergency_requests er
    JOIN hospitals h ON h.hospital_id = er.hospital_id
    JOIN donors d ON d.user_id = ?
    WHERE er.blood_group = d.blood_group
      AND er.status = 'pending'
      AND er.donor_visible = 1
      AND er.donor_expire_at > NOW()
    ORDER BY distance ASC
    LIMIT 1
  `;

  db.query(sql, [userId], (err, result) => {
    if (err || result.length === 0) {
      return res.json(null);
    }

    const row = result[0];
    if (row.distance > MAX_DISTANCE) return res.json(null);

    res.json({
      request_id: row.request_id,
      blood_group: row.blood_group,
      hospital_name: row.hospital_name,
      created_at: row.created_at,
      distance_km: Number(row.distance.toFixed(2)),
      h_lat: row.h_lat,
      h_lon: row.h_lon
    });
  });
};

/* =========================
   GET EMERGENCY FOR HOSPITAL ✅ FIXED
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
   GET NOTIFIED DONORS (Hospital)
========================= */
exports.getNotifiedDonorsForHospital = (req, res) => {
  const requestId = req.params.requestId;

  const sql = `
    SELECT
      d.name,
      d.mobile,
      endn.distance_km
    FROM emergency_notified_donors endn
    JOIN donors d ON d.donor_id = endn.donor_id
    WHERE endn.request_id = ?
    ORDER BY endn.distance_km ASC
  `;

  db.query(sql, [requestId], (err, result) => {
    if (err) {
      console.error("Notified donor fetch error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    res.json(result);
  });
};

/* =========================
   ACCEPT EMERGENCY
========================= */
exports.acceptEmergency = (req, res) => {
  const { request_id, donor_id } = req.body;

  if (!request_id || !donor_id) {
    return res.status(400).json({ message: "Missing data" });
  }

  db.query(
    `
    UPDATE emergency_requests
    SET status = 'accepted',
        accepted_donor_id = ?
    WHERE request_id = ?
      AND status = 'pending'
    `,
    [donor_id, request_id],
    (err, result) => {
      if (err || result.affectedRows === 0) {
        return res.status(400).json({ message: "Invalid accept" });
      }
      res.json({ message: "Accepted" });
    }
  );
};

/* =========================
   DECLINE EMERGENCY
========================= */
exports.declineEmergency = (req, res) => {
  const { request_id } = req.body;

  if (!request_id) {
    return res.status(400).json({ message: "Request ID required" });
  }

  db.query(
    `
    UPDATE emergency_requests
    SET status = 'declined',
        donor_visible = 0,
        hospital_visible = 0
    WHERE request_id = ?
    `,
    [request_id],
    () => res.json({ message: "Declined" })
  );
};

/* =========================
   COMPLETE DONATION
========================= */
exports.completeEmergency = (req, res) => {
  const { request_id } = req.body;

  if (!request_id) {
    return res.status(400).json({ message: "Request ID required" });
  }

  db.query(
    `
    UPDATE emergency_requests
    SET status = 'completed',
        donor_visible = 0,
        hospital_visible = 0,
        completed_at = NOW()
    WHERE request_id = ?
    `,
    [request_id],
    () => res.json({ message: "Completed" })
  );
};

console.log("EXPORTS:", Object.keys(module.exports));
