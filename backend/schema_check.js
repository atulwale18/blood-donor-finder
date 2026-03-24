const db = require('./config/db.js');
const fs = require('fs');

db.query('DESCRIBE donors', (err, donors) => {
  db.query('DESCRIBE emergency_requests', (err, requests) => {
    fs.writeFileSync('schema_output.json', JSON.stringify({donors, requests}, null, 2));
    process.exit(0);
  });
});
