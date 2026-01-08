require("dotenv").config();

const db = require("../config/db");
const axios = require("axios");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

/* =====================
   TWILIO CLIENT
===================== */
const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/* =====================
   EMAIL CONFIG
===================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "blooddonorportal@gmail.com",
    pass: "xxcxsqxgbxifgdim"
  }
});

/* =====================
   HELPER: GET LAT/LON
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
   REGISTER
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
      message: "Hospital location is required"
    });
  }

  const userSql = `
    INSERT INTO users (email, password, role)
    VALUES (?, ?, ?)
  `;

  db.query(userSql, [email, password, role], (err, userResult) => {
    if (err) return res.status(500).json({ message: "Registration failed" });

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
        hospitalSql,
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

    res.json({ message: "User registered successfully" });
  });
};

/* =====================
   LOGIN
===================== */
exports.login = (req, res) => {
  let { email, password } = req.body;

  email = email.trim();
  password = password.trim();

  const sql = `
    SELECT user_id, role
    FROM users
    WHERE (email = ? OR mobile = ?)
      AND password = ?
  `;

  db.query(sql, [email, email, password], (err, users) => {
    if (err || users.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: "Login success",
      role: users[0].role,
      user_id: users[0].user_id
    });
  });
};

/* =====================
   FORGOT PASSWORD (TWILIO VERIFY)
===================== */
exports.forgotPassword = (req, res) => {
  const { identifier } = req.body;

  const sql = `
    SELECT u.user_id, u.email,
           d.mobile AS donor_mobile,
           h.mobile AS hospital_mobile
    FROM users u
    LEFT JOIN donors d ON d.user_id = u.user_id
    LEFT JOIN hospitals h ON h.user_id = u.user_id
    WHERE u.email = ?
       OR d.mobile = ?
       OR h.mobile = ?
  `;

  db.query(sql, [identifier, identifier, identifier], async (err, users) => {
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
          async () => {

            // EMAIL
            if (identifier.includes("@") && user.email) {
              transporter.sendMail(
                {
                  from: "Blood Donor Finder <blooddonorportal@gmail.com>",
                  to: user.email,
                  subject: "Password Reset OTP",
                  text: `Your OTP is ${otp}`
                },
                () => res.json({ message: "OTP sent to email" })
              );
            }

            // MOBILE (TWILIO VERIFY)
            else {
              try {
                await client.verify.v2
                  .services(process.env.TWILIO_VERIFY_SID)
                  .verifications.create({
                    to: `+91${identifier}`,
                    channel: "sms"
                  });

                res.json({ message: "OTP sent to mobile" });
              } catch (err) {
                console.error("Twilio error:", err.message);
                res.status(500).json({ message: "Failed to send OTP" });
              }
            }
          }
        );
      }
    );
  });
};

/* =====================
   VERIFY OTP (TWILIO VERIFY)
===================== */
exports.verifyOtp = async (req, res) => {
  let { identifier, otp } = req.body;

  try {
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: `+91${identifier}`,
        code: otp
      });

    if (check.status !== "approved") {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error("Verify error:", err.message);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/* =====================
   RESET PASSWORD
===================== */
exports.resetPassword = (req, res) => {
  const { identifier, newPassword } = req.body;

  const sql = `
    SELECT u.user_id
    FROM users u
    LEFT JOIN donors d ON d.user_id = u.user_id
    LEFT JOIN hospitals h ON h.user_id = u.user_id
    WHERE u.email = ?
       OR d.mobile = ?
       OR h.mobile = ?
  `;

  db.query(sql, [identifier, identifier, identifier], (err, users) => {
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
