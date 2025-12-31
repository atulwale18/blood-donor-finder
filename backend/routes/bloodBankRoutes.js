const express = require("express");
const router = express.Router();
const db = require("../config/db");

/*
  =====================================================
  GET nearby blood banks (used in Hospital Dashboard)
  /api/bloodbank/nearby?latitude=16.85&longitude=74.58
  =====================================================
*/
router.get("/nearby", (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({
      message: "Latitude and longitude are required"
    });
  }

  const sql = `
    SELECT
      bloodbank_id,
      name,
      location,
      city,
      address,
      mobile,
      latitude,
      longitude
    FROM blood_banks
    ORDER BY
      SQRT(
        POW(latitude - ?, 2) +
        POW(longitude - ?, 2)
      ) ASC
    LIMIT 10
  `;

  db.query(sql, [latitude, longitude], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Failed to fetch nearby blood banks"
      });
    }

    return res.json(results);
  });
});

/*
  =====================================================
  GET emergency blood availability
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
      bi.last_updated
    FROM blood_banks bb
    JOIN blood_inventory bi
      ON bb.bloodbank_id = bi.bloodbank_id
    WHERE bi.blood_group = ?
      AND bi.units_available > 0
    ORDER BY
      SQRT(
        POW(bb.latitude - ?, 2) +
        POW(bb.longitude - ?, 2)
      ) ASC
    LIMIT 10
  `;

  db.query(
    sql,
    [blood_group, latitude, longitude],
    (err, results) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Failed to check blood availability" });
      }

      return res.json(results);
    }
  );
});

module.exports = router;
