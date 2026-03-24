const db = require('./config/db.js');

const sql1 = "CREATE INDEX idx_blood_group ON donors(blood_group);";
const sql2 = "CREATE INDEX idx_availability ON donors(is_available);";
const sql3 = "CREATE INDEX idx_location ON donors(latitude, longitude);";

db.query(sql1, (err, res) => {
  if (err) console.log("Index 1 exists or error:", err.message);
  else console.log("Added idx_blood_group");

  db.query(sql2, (err, res) => {
    if (err) console.log("Index 2 exists or error:", err.message);
    else console.log("Added idx_availability");

    db.query(sql3, (err, res) => {
      if (err) console.log("Index 3 exists or error:", err.message);
      else console.log("Added idx_location");
      
      console.log("Performance Optimization (Indexing) Complete!");
      process.exit(0);
    });
  });
});
