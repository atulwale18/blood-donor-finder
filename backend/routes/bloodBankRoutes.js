const express = require("express");
const router = express.Router();
const db = require("../config/db");

/*
  =====================================================
  GET nearby blood banks (Hospital Dashboard)
  KNN + 15 KM emergency-safe range
  /api/bloodbank/nearby?latitude=16.85&longitude=74.58
  =====================================================
*/
router.get("/nearby", (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({
      message: "Hospital location (latitude & longitude) is required"
    });
  }

  const MAX_DISTANCE = 15; // km
  const K = 5; // top 5 nearest blood banks

  const sql = `
    SELECT
      bloodbank_id,
      name,
      location,
      city,
      address,
      mobile,
      latitude,
      longitude,
      (
        6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(latitude))
        )
      ) AS distance
    FROM blood_banks
    WHERE latitude IS NOT NULL
      AND longitude IS NOT NULL
    HAVING distance <= ?
    ORDER BY distance ASC
    LIMIT ?
  `;

  db.query(
    sql,
    [latitude, longitude, latitude, MAX_DISTANCE, K],
    (err, results) => {
      if (err) {
        console.error("Nearby blood bank error:", err);
        return res.status(500).json({
          message: "Failed to fetch nearby blood banks"
        });
      }

      return res.json(results);
    }
  );
});

/*
  =====================================================
  GET emergency blood availability
  KNN + 15 KM + blood group filter
  /api/bloodbank/emergency?blood_group=O+&latitude=16.85&longitude=74.58
  =====================================================
*/
router.get("/emergency", (req, res) => {
  const { blood_group, latitude, longitude } = req.query;

  if (!blood_group || !latitude || !longitude) {
    return res.status(400).json({
      message: "blood_group, latitude and longitude are required"
    });
  }

  const MAX_DISTANCE = 15; // km
  const K = 5; // top 5 nearest blood banks

  const sql = `
    SELECT
      bb.bloodbank_id,
      bb.name,
      bb.location,
      bb.city,
      bb.address,
      bb.mobile,
      bi.blood_group,
      bi.units_available,
      bi.last_updated,
      (
        6371 * acos(
          cos(radians(?)) * cos(radians(bb.latitude)) *
          cos(radians(bb.longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(bb.latitude))
        )
      ) AS distance
    FROM blood_banks bb
    JOIN blood_inventory bi
      ON bb.bloodbank_id = bi.bloodbank_id
    WHERE bi.blood_group = ?
      AND bi.units_available > 0
      AND bb.latitude IS NOT NULL
      AND bb.longitude IS NOT NULL
    HAVING distance <= ?
    ORDER BY distance ASC
    LIMIT ?
  `;

  db.query(
    sql,
    [latitude, longitude, latitude, blood_group, MAX_DISTANCE, K],
    (err, results) => {
      if (err) {
        console.error("Emergency blood availability error:", err);
        return res.status(500).json({
          message: "Failed to check blood availability"
        });
      }

      return res.json(results);
    }
  );
});

module.exports = router;
