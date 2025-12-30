const db = require("../config/db");

/* =========================
   GET NEARBY BLOOD BANKS
========================= */
exports.getNearbyBloodBanks = (req, res) => {
  const { latitude, longitude } = req.query;

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
    HAVING distance <= 25
    ORDER BY distance ASC
  `;

  db.query(
    sql,
    [latitude, longitude, latitude],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      return res.json(results);
    }
  );
};
