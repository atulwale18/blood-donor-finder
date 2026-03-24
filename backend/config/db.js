const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "atulwale_18",
  database: process.env.DB_NAME || "blood_donor_db"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("MySQL connected");
  }
});

module.exports = db;
