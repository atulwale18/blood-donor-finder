const db = require('./config/db');
const fs = require('fs');

db.query("SELECT * FROM hospitals WHERE hospital_name LIKE '%civil%'", (err, h) => {
  if (err || !h.length) return console.log("Hospital not found");
  
  const hospital = h[0];
  const blood_group = "B+";
  const MAX_DONORS = 5;

  const knnSql = `
    SELECT
      d.donor_id,
      d.blood_group,
      d.age,
      d.weight,
      d.hemoglobin,
      d.recent_surgery,
      d.last_donation_date,
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
      AND d.age BETWEEN 18 AND 65
      AND (d.weight >= 50 OR d.weight IS NULL)
      AND (d.hemoglobin >= 12.5 OR d.hemoglobin IS NULL)
      AND (d.recent_surgery = 'no' OR d.recent_surgery IS NULL)
      AND (
        d.last_donation_date IS NULL
        OR DATEDIFF(CURDATE(), d.last_donation_date) >= 90
      )
    ORDER BY distance ASC
    LIMIT ?
  `;

  db.query(knnSql, [hospital.hospital_id, blood_group, MAX_DONORS], (err, donors) => {
    db.query("SELECT donor_id, blood_group, age, weight, hemoglobin, recent_surgery, last_donation_date, latitude, longitude FROM donors WHERE blood_group = 'B+'", (err, allBPlus) => {
       const out = { Matches: donors, AllUnfiltered: allBPlus };
       fs.writeFileSync('out.json', JSON.stringify(out, null, 2), 'utf8');
       process.exit(0);
    });
  });
});
