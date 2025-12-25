const db = require("../config/db");

exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT user_id, name, role
    FROM users
    WHERE email = ? AND password = ?
  `;

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: result[0],
    });
  });
};

exports.register = (req, res) => {
  const {
    name,
    email,
    password,
    role,
    age,
    gender,
    blood_group,
    mobile,
    health_status,
    last_donation_date,
    latitude,
    longitude
  } = req.body;

  const sql = `
    INSERT INTO users
    (name, email, password, role, age, gender, blood_group, mobile, health_status, last_donation_date, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      email,
      password,
      role,
      age,
      gender,
      blood_group,
      mobile,
      health_status,
      last_donation_date,
      latitude,
      longitude
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ message: "Registration successful" });
    }
  );
};
