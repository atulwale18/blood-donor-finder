const axios = require('axios');
const db = require('./config/db');
const fs = require('fs');

(async () => {
  try {
    const url = 'https://nominatim.openstreetmap.org/search?q=Civil+Hospital,+Miraj,+Maharashtra,+India&format=json&limit=1';
    const res = await axios.get(url, { headers: { 'User-Agent': 'blood-donor-finder-bot' } });
    
    if (res.data && res.data.length > 0) {
      const lat = parseFloat(res.data[0].lat);
      const lon = parseFloat(res.data[0].lon);

      const radius = 10;
      
      const sql = `
        SELECT 
          d.name, 
          d.blood_group, 
          d.mobile, 
          d.address,
          d.city,
          (6371 * acos(
            cos(radians(?)) * cos(radians(d.latitude)) * 
            cos(radians(d.longitude) - radians(?)) + 
            sin(radians(?)) * sin(radians(d.latitude))
          )) AS distance
        FROM donors d
        WHERE d.latitude IS NOT NULL AND d.longitude IS NOT NULL
        HAVING distance <= ?
        ORDER BY distance ASC
      `;
      
      db.query(sql, [lat, lon, lat, radius], (err, results) => {
        if (err) {
          console.error('DB Error:', err);
        } else {
          fs.writeFileSync('miraj-results.json', JSON.stringify({
            coords: { lat, lon },
            total: results.length,
            donors: results.map(r => ({
               name: r.name,
               blood_group: r.blood_group,
               mobile: r.mobile,
               city: r.city,
               distance: parseFloat(r.distance.toFixed(2))
            }))
          }, null, 2));
          console.log('Results written to miraj-results.json');
        }
        db.end();
      });
    } else {
      console.log('Coordinates not found for Civil Hospital Miraj');
      db.end();
    }
  } catch (err) {
    console.error('Error:', err.message);
    db.end();
  }
})();
