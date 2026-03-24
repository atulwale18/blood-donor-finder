const db = require('./config/db');
db.query('SELECT * FROM donors WHERE user_id = 14', (err, res) => {
  console.log(err || res);
  db.query('SELECT * FROM donors WHERE name = "Atul"', (err2, res2) => {
    console.log(err2 || res2);
    db.query('SELECT * FROM users WHERE email = "atulwale4@gmail.com"', (err3, res3) => {
        console.log(err3 || res3);
        process.exit(0);
    });
  });
});
