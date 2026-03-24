const db = require('./config/db');

const userSql = `INSERT INTO users (user_id, email, mobile, password, role) VALUES (14, 'atulwale4@gmail.com', '9876543210', 'Password123', 'donor')`;

const donorSql = `INSERT INTO donors (donor_id, user_id, name, age, weight, hemoglobin, recent_surgery, gender, blood_group, mobile, latitude, longitude, address, city, district) 
VALUES (14, 14, 'Atul', 25, 60, 14.5, 'no', 'Male', 'AB+', '9876543210', 16.8176, 74.6429, 'Pandharpur Road', 'Miraj', 'Sangli')`;

db.query(userSql, (err, res) => {
  if (err) {
    console.error("User insert error:", err);
  } else {
    console.log("User inserted");
    db.query(donorSql, (err2, res2) => {
      if (err2) {
        console.error("Donor insert error:", err2);
      } else {
        console.log("Donor inserted");
      }
      process.exit(0);
    });
  }
});
