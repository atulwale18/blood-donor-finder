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

    // ===== DONOR REGISTER =====
    if (role === "donor") {
      const donorSql = `
        INSERT INTO donors
        (user_id, name, age, gender, blood_group, mobile, last_donation_date, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      return db.query(
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
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Registration failed" });
          }

          return res.json({ message: "Donor registered successfully" });
        }
      );
    }

    // ===== HOSPITAL REGISTER =====
    if (role === "hospital") {
      const hospitalSql = `
        INSERT INTO hospitals
        (user_id, hospital_name, mobile, latitude, longitude)
        VALUES (?, ?, ?, ?, ?)
      `;

      return db.query(
        hospitalSql,
        [user_id, name, mobile, latitude, longitude],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Registration failed" });
          }

          return res.json({ message: "Hospital registered successfully" });
        }
      );
    }

    // ===== ADMIN REGISTER (optional) =====
    return res.json({ message: "User registered successfully" });
  });
};

/* =====================
   LOGIN (FINAL & CORRECT)
===================== */
exports.login = (req, res) => {
  let { email, password } = req.body;

  email = email.toLowerCase().trim();
  password = password.trim();

  const userSql = `
    SELECT user_id, role
    FROM users
    WHERE email = ? AND password = ?
  `;

  db.query(userSql, [email, password], (err, users) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // ===== DONOR LOGIN =====
    if (user.role === "donor") {
      const donorSql = `SELECT donor_id FROM donors WHERE user_id = ?`;

      return db.query(donorSql, [user.user_id], (err, donors) => {
        if (err || donors.length === 0) {
          return res.status(404).json({ message: "Donor not found" });
        }

        return res.json({
          message: "Login success",
          role: "donor",
          user_id: user.user_id,
          donor_id: donors[0].donor_id
        });
      });
    }

    // ===== HOSPITAL LOGIN =====
    if (user.role === "hospital") {
      const hospitalSql = `SELECT hospital_id FROM hospitals WHERE user_id = ?`;

      return db.query(hospitalSql, [user.user_id], (err, hospitals) => {
        if (err || hospitals.length === 0) {
          return res.status(404).json({ message: "Hospital not found" });
        }

        return res.json({
          message: "Login success",
          role: "hospital",
          user_id: user.user_id,
          hospital_id: hospitals[0].hospital_id
        });
      });
    }

    // ===== ADMIN LOGIN =====
    if (user.role === "admin") {
      return res.json({
        message: "Login success",
        role: "admin",
        user_id: user.user_id
      });
    }
  });
};
