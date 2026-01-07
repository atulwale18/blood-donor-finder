const db = require("../config/db");
const axios = require("axios");
const nodemailer = require("nodemailer");

/* =====================
   EMAIL CONFIG (REAL)
===================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "blooddonorportal@gmail.com",
    pass: "xxcxsqxgbxifgdim"
  }
});



/* =====================
   HELPER: GET LAT/LON FROM ADDRESS / CITY
===================== */
const getLatLngFromCity = async (address, city, district) => {
  try {
    const query = address
      ? `${address}, ${city}, ${district}, Maharashtra, India`
      : `${city}, ${district}, Maharashtra, India`;

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=1`;

    const res = await axios.get(url, {
      headers: { "User-Agent": "blood-donor-finder" }
    });

    if (res.data && res.data.length > 0) {
      return {
        latitude: parseFloat(res.data[0].lat),
        longitude: parseFloat(res.data[0].lon)
      };
    }
  } catch (err) {
    console.error("Geocoding failed:", err.message);
  }

  return { latitude: null, longitude: null };
};

/* =====================
   REGISTER (UNCHANGED)
===================== */
exports.register = async (req, res) => {
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
    longitude,
    address,
    city,
    district
  } = req.body;

  email = email.toLowerCase().trim();

  if ((!latitude || !longitude) && (address || city)) {
    const loc = await getLatLngFromCity(address, city, district);
    latitude = loc.latitude;
    longitude = loc.longitude;
  }

  if (role === "hospital" && (!latitude || !longitude)) {
    return res.status(400).json({
      message: "Hospital location is required to find nearby blood banks"
    });
  }

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

    if (role === "donor") {
      const donorSql = `
        INSERT INTO donors
        (user_id, name, age, gender, blood_group, mobile, last_donation_date,
         latitude, longitude, address, city, district)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          latitude || null,
          longitude || null,
          address || null,
          city || null,
          district || null
        ],
        () => res.json({ message: "Donor registered successfully" })
      );
    }

    if (role === "hospital") {
      const hospitalSql = `
        INSERT INTO hospitals
        (user_id, hospital_name, mobile, latitude, longitude, address, city, district)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      return db.query(
        [
          user_id,
          name,
          mobile,
          latitude,
          longitude,
          address || null,
          city || null,
          district || null
        ],
        () => res.json({ message: "Hospital registered successfully" })
      );
    }

    return res.json({ message: "User registered successfully" });
  });
};

/* =====================
   LOGIN (EMAIL OR MOBILE)
===================== */
exports.login = (req, res) => {
  let { email, password } = req.body;

  email = email.trim();
  password = password.trim();

  const userSql = `
    SELECT user_id, role
    FROM users
    WHERE (email = ? OR mobile = ?)
      AND password = ?
  `;

  db.query(userSql, [email, email, password], (err, users) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    if (user.role === "donor") {
      return db.query(
        `SELECT donor_id FROM donors WHERE user_id = ?`,
        [user.user_id],
        (err, donors) => {
          if (err || donors.length === 0) {
            return res.status(404).json({ message: "Donor not found" });
          }

          return res.json({
            message: "Login success",
            role: "donor",
            user_id: user.user_id,
            donor_id: donors[0].donor_id
          });
        }
      );
    }

    if (user.role === "hospital") {
      return db.query(
        `SELECT hospital_id FROM hospitals WHERE user_id = ?`,
        [user.user_id],
        (err, hospitals) => {
          if (err || hospitals.length === 0) {
            return res.status(404).json({ message: "Hospital not found" });
          }

          return res.json({
            message: "Login success",
            role: "hospital",
            user_id: user.user_id,
            hospital_id: hospitals[0].hospital_id
          });
        }
      );
    }

    if (user.role === "admin") {
      return res.json({
        message: "Login success",
        role: "admin",
        user_id: user.user_id
      });
    }
  });
};

/* =====================
   FORGOT PASSWORD (REAL EMAIL OTP)
===================== */
exports.forgotPassword = (req, res) => {
  const { identifier } = req.body;

  const sql = `
    SELECT user_id, email, mobile
    FROM users
    WHERE email = ? OR mobile = ?
  `;

  db.query(sql, [identifier, identifier], (err, users) => {
    if (err || users.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = users[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    db.query(
      `DELETE FROM password_resets WHERE user_id = ?`,
      [user.user_id],
      () => {
        db.query(
          `INSERT INTO password_resets (user_id, otp, expires_at)
           VALUES (?, ?, ?)`,
          [user.user_id, otp, expires],
          () => {
            if (user.email) {
              transporter.sendMail(
                {
                  from: "Blood Donor Finder <YOUR_GMAIL@gmail.com>",
                  to: user.email,
                  subject: "Password Reset OTP",
                  text: `Your OTP for password reset is ${otp}. It is valid for 5 minutes.`
                },
                (err) => {
                  if (err) {
                    console.error("Email error:", err);
                    return res.status(500).json({ message: "Failed to send OTP email" });
                  }

                  return res.json({ message: "OTP sent to email" });
                }
              );
            } else {
              return res.status(400).json({
                message: "No email found for this user"
              });
            }
          }
        );
      }
    );
  });
};

/* =====================
   VERIFY OTP (UNCHANGED)
===================== */
exports.verifyOtp = (req, res) => {
  const { identifier, otp } = req.body;

  const sql = `
    SELECT u.user_id
    FROM users u
    JOIN password_resets pr ON pr.user_id = u.user_id
    WHERE (u.email = ? OR u.mobile = ?)
      AND TRIM(pr.otp) = TRIM(?)
      AND pr.expires_at > NOW()
  `;

  db.query(sql, [identifier, identifier, otp], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified" });
  });
};


/* =====================
   RESET PASSWORD (UNCHANGED)
===================== */
exports.resetPassword = (req, res) => {
  const { identifier, newPassword } = req.body;

  const sql = `
    SELECT user_id
    FROM users
    WHERE email = ? OR mobile = ?
  `;

  db.query(sql, [identifier, identifier], (err, users) => {
    if (err || users.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user_id = users[0].user_id;

    db.query(
      `UPDATE users SET password = ? WHERE user_id = ?`,
      [newPassword, user_id],
      () => {
        db.query(
          `DELETE FROM password_resets WHERE user_id = ?`,
          [user_id],
          () => res.json({ message: "Password reset successful" })
        );
      }
    );
  });
};
