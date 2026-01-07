const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ================= ADMIN OVERVIEW ACTIVITY ================= */
router.get("/activity", (req, res) => {
  const sql = `
    SELECT 
      h.hospital_name,
      h.mobile AS hospital_mobile,
      er.blood_group,
      er.status,
      er.created_at
    FROM emergency_requests er
    JOIN hospitals h ON h.hospital_id = er.hospital_id
    WHERE er.created_at >= NOW() - INTERVAL 2 HOUR
    ORDER BY er.created_at DESC
    LIMIT 5
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to load activity" });
    }
    res.json(rows);
  });
});

/* ================= DONORS ================= */
router.get("/donors", (req, res) => {
  db.query("SELECT name, blood_group, mobile FROM donors", (err, rows) => {
    if (err) return res.status(500).json({ message: "Error loading donors" });
    res.json(rows);
  });
});

/* ================= HOSPITALS ================= */
router.get("/hospitals", (req, res) => {
  db.query(
    "SELECT hospital_id, hospital_name, mobile FROM hospitals",
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Error loading hospitals" });
      res.json(rows);
    }
  );
});

/* ================= BLOOD BANKS ================= */
router.get("/bloodbanks", (req, res) => {
  db.query(
    "SELECT bloodbank_id, name, address, mobile FROM blood_banks",
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Error loading blood banks" });
      res.json(rows);
    }
  );
});

/* ================= INVENTORY ================= */
router.get("/inventory", (req, res) => {
  const sql = `
    SELECT bb.name, bi.blood_group, bi.units_available
    FROM blood_inventory bi
    JOIN blood_banks bb ON bb.bloodbank_id = bi.bloodbank_id
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "Error loading inventory" });
    res.json(rows);
  });
});

/* ================= ACTIVE REQUESTS ================= */
router.get("/requests", (req, res) => {
  const sql = `
    SELECT 
      h.hospital_name,
      er.blood_group,
      er.status,
      er.created_at
    FROM emergency_requests er
    JOIN hospitals h ON h.hospital_id = er.hospital_id
    ORDER BY er.created_at DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: "Error loading requests" });
    res.json(rows);
  });
});

/* ================= CREATE REQUEST ================= */
router.post("/requests", (req, res) => {
  const { hospital_id, blood_group } = req.body;

  const sql = `
    INSERT INTO emergency_requests (hospital_id, blood_group, status, created_at)
    VALUES (?, ?, 'pending', NOW())
  `;

  db.query(sql, [hospital_id, blood_group], (err) => {
    if (err) return res.status(500).json({ message: "Failed to create request" });
    res.json({ message: "Request created" });
  });
});

/* ================= MONTHLY REPORTS ================= */
router.get("/reports", (req, res) => {
  db.query(
    "SELECT * FROM admin_reports ORDER BY generated_at DESC",
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Error loading reports" });
      res.json(rows);
    }
  );
});

module.exports = router;
