const db = require("../config/db");

/* =========================
   GET NEAREST BLOOD BANKS
   KNN + 15 KM EMERGENCY RANGE
========================= */
exports.getNearbyBloodBanks = (req, res) => {
  const { latitude, longitude } = req.query;

  // Safety check
  if (!latitude || !longitude) {
    return res.status(400).json({
      message: "Hospital location is required to find nearby blood banks"
    });
  }

  const K = 5; // Top 5 nearest blood banks
  const MAX_DISTANCE = 15; // 15 KM emergency radius

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
        console.error("Blood bank KNN error:", err);
        return res.status(500).json({ message: "Server error" });
      }

      return res.json(results);
    }
  );
};
