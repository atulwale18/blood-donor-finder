const https = require('https');

https.get('https://ai-powered-blood-donor-finder.vercel.app/hospital-dashboard', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(\/static\/js\/main\.[a-z0-9]+\.js)"/);
    if (match) {
      const jsUrl = 'https://ai-powered-blood-donor-finder.vercel.app' + match[1];
      https.get(jsUrl, (res2) => {
        let jsData = '';
        res2.on('data', chunk => jsData += chunk);
        res2.on('end', () => {
          if (jsData.includes('blood_group')) {
            console.log("YES blood_group");
          } else {
            console.log("NO blood_group");
          }
        });
      });
    } else {
        console.log("Could not find main.js");
    }
  });
});
