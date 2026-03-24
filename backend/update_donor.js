const db = require('./config/db.js');

const oldMobile = '1234567890';
const newMobile = '7820946531';
const namePart = 'Atul Shivaling Wale';

db.query(
  "UPDATE donors SET mobile = ? WHERE name LIKE ? OR mobile = ?",
  [newMobile, `%${namePart}%`, oldMobile],
  (err, result) => {
    if (err) {
      console.error("Error updating donor:", err);
    } else {
      console.log(`Successfully updated donor mobile to ${newMobile}. Rows affected: ${result.affectedRows}`);
    }
    process.exit(0);
  }
);
