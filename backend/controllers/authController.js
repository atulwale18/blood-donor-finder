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

  // 1️⃣ Insert into users table
  const userSql = `
    INSERT INTO users (email, password, role)
    VALUES (?, ?, ?)
  `;

  db.query(userSql, [email, password, role], (err, userResult) => {
    if (err) {
      console.error("USER INSERT ERROR:", err);
      return res.status(500).json({ message: "Registration failed" });
    }

    const user_id = userResult.insertId;

    // 2️⃣ Role-specific insert
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
          if (err) {
            console.error("DONOR INSERT ERROR:", err);
            return res.status(500).json({ message: "Registration failed" });
          }

          res.json({ message: "Donor registered successfully" });
        }
      );
    }

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
          if (err) {
            console.error("HOSPITAL INSERT ERROR:", err);
            return res.status(500).json({ message: "Registration failed" });
          }

          res.json({ message: "Hospital registered successfully" });
        }
      );
    }

    else if (role === "bloodbank") {
      const bankSql = `
        INSERT INTO blood_banks
        (name, mobile, latitude, longitude)
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        bankSql,
        [name, mobile, latitude, longitude],
        (err) => {
          if (err) {
            console.error("BLOOD BANK INSERT ERROR:", err);
            return res.status(500).json({ message: "Registration failed" });
          }

          res.json({ message: "Blood bank added successfully" });
        }
      );
    }
  });
};

/* =====================
   LOGIN
===================== */
exports.login = (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase().trim();

  const sql = `
    SELECT user_id, role
    FROM users
    WHERE email = ? AND password = ?
  `;

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error("LOGIN ERROR:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: result[0]
    });
  });
};
