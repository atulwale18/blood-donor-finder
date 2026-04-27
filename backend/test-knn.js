const mysql = require('mysql2');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'atulwale_18',
  database: 'blood_donor_db'
});

const hospital_id = 10;
const blood_group = 'AB+';

const knnSql = `
  SELECT
    d.donor_id,
    d.name,
    d.fcm_token,
    d.mobile,
    u.email,
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
  JOIN users u ON u.user_id = d.user_id
  JOIN hospitals h ON h.hospital_id = ?
  WHERE d.blood_group = ?
    AND d.latitude IS NOT NULL
    AND d.longitude IS NOT NULL
    AND d.is_available = 'Available'
    AND d.age BETWEEN 18 AND 65
    AND (d.weight >= 50 OR d.weight IS NULL)
    AND (d.hemoglobin >= 12.5 OR d.hemoglobin IS NULL)
    AND (d.recent_surgery = 'no' OR d.recent_surgery IS NULL)
    AND (
      d.last_donation_date IS NULL
      OR DATEDIFF(CURDATE(), d.last_donation_date) >= 90
    )
`;

conn.query(knnSql, [hospital_id, blood_group], (err, rows) => {
  console.log(err || rows);
  process.exit();
});
