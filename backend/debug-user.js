const db = require('./config/db');

const email = 'atulwale4@gmail.com';

db.query('SELECT * FROM users WHERE email = ?', [email], (err, users) => {
  if (err) console.error(err);
  console.log('User:', users);
  
  if (users.length > 0) {
    db.query('SELECT * FROM donors WHERE user_id = ?', [users[0].user_id], (err, donors) => {
      if (err) console.error(err);
      console.log('Donor Profile:', donors);
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
