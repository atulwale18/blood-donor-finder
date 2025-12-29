const db = require("../config/db");

/* =====================
   REGISTER
===================== */
exports.register = (req, res) => {
  let {
    role,
    email,
    password,
    name,
    mobile,
    age,
    gender,
    blood_group,
    last_donation_date,
    latitude,
    longitude
  } = req.body;

  email = email.toLowerCase().trim();

  const userSql = `
    INSERT INTO users (email, password, role)
    VALUES (?, ?, ?)
  `;

  db.query(userSql, [email, password, role], (err, userResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Registration failed" });
    }

    const user_id = userResult.insertId;

    // DONOR
    if (role === "donor") {
      const donorSql = `
        INSERT INTO donors
        (user_id, name, age, gender, blood_group, mobile, last_donation_date, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        donorSql,
        [
          user_id,
          name,
          age,
          gender,
          blood_group,
          mobile,
          last_donation_date || null,
          latitude,
          longitude
        ],
        (err) => {
          if (err) return res.status(500).json({ message: "Registration failed" });
          res.json({ message: "Donor registered successfully" });
        }
      );
    }

    // HOSPITAL
    else if (role === "hospital") {
      const hospitalSql = `
        INSERT INTO hospitals
        (user_id, hospital_name, mobile, latitude, longitude)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        hospitalSql,
        [user_id, name, mobile, latitude, longitude],
        (err) => {
          if (err) return res.status(500).json({ message: "Registration failed" });
          res.json({ message: "Hospital registered successfully" });
        }
      );
    }
  });
};

/* =====================
   LOGIN (STABLE)
===================== */
exports.login = (req, res) => {
  let { email, password } = req.body;

  email = email.toLowerCase().trim();
  password = password.trim();

  const sql = `
    SELECT user_id, role
    FROM users
    WHERE email = ? AND password = ?
  `;

  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login success",
      user_id: result[0].user_id,
      role: result[0].role
    });
  });
};
