const db = require("../config/db");
const axios = require("axios");

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

  // Auto-resolve ONLY if GPS not provided
  if ((!latitude || !longitude) && (address || city)) {
    const loc = await getLatLngFromCity(address, city, district);
    latitude = loc.latitude;
    longitude = loc.longitude;
  }

  // 🔴 HARD VALIDATION FOR HOSPITAL
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

    /* ===== DONOR REGISTER ===== */
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
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Registration failed" });
          }

          return res.json({ message: "Donor registered successfully" });
        }
      );
    }

    /* ===== HOSPITAL REGISTER ===== */
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
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Registration failed" });
          }

          return res.json({ message: "Hospital registered successfully" });
        }
      );
    }

    return res.json({ message: "User registered successfully" });
  });
};

/* =====================
   LOGIN (UNCHANGED)
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
