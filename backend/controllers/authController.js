const db = require('../config/db');

exports.registerUser = (req, res) => {
  const {
    name,
    age,
    gender,
    blood_group,
    mobile,
    role,
    health_status,
    last_donation_date,
    latitude,
    longitude
  } = req.body;

  const sql = `
    INSERT INTO users
    (name, age, gender, blood_group, mobile, role, health_status, last_donation_date, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      age,
      gender,
      blood_group,
      mobile,
      role,
      health_status,
      last_donation_date,
      latitude,
      longitude
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'User registered successfully' });
    }
  );
};
