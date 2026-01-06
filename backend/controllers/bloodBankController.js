const db = require("../config/db");

/* =========================
   GET NEAREST BLOOD BANKS
   KNN + 15 KM EMERGENCY RANGE
========================= */
exports.getNearbyBloodBanks = (req, res) => {
  let { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({
      message: "Hospital location is required to find nearby blood banks"
    });
  }

  latitude = Number(latitude);
  longitude = Number(longitude);

  const K = 5;              // Top 5 nearest
  const MAX_DISTANCE = 15;  // 15 km radius

  const sql = `
    SELECT
      bloodbank_id,
      name,
      address,
      city,
      mobile,
      latitude,
      longitude,
      (
        6371 * acos(
          LEAST(
            1,
            GREATEST(
              -1,
              cos(radians(?)) *
              cos(radians(CAST(latitude AS DECIMAL(10,6)))) *
              cos(
                radians(CAST(longitude AS DECIMAL(10,6))) - radians(?)
              ) +
              sin(radians(?)) *
              sin(radians(CAST(latitude AS DECIMAL(10,6))))
            )
          )
        )
      ) AS distance_km
    FROM blood_banks
    WHERE latitude IS NOT NULL
      AND longitude IS NOT NULL
    HAVING distance_km <= ?
    ORDER BY distance_km ASC
    LIMIT ?
  `;

  db.query(
    sql,
    [latitude, longitude, latitude, MAX_DISTANCE, K],
    (err, results) => {
      if (err) {
        console.error("Blood bank KNN error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      return res.json(results);
    }
  );
};
