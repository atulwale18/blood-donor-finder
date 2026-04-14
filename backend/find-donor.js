const db = require('./config/db');

db.query('SELECT user_id, email, mobile FROM donors LIMIT 1', (err, rows) => {
  if (err) throw err;
  console.log(rows);
  process.exit(0);
});
