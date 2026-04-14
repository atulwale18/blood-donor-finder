const https = require('https');

https.get('https://ai-powered-blood-donor-finder.vercel.app/hospital-dashboard', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("HTML length:", data.length);
    const match = data.match(/src="(\/static\/js\/main\.[a-z0-9]+\.js)"/);
    if (match) {
      console.log("Found JS:", match[1]);
      const jsUrl = 'https://ai-powered-blood-donor-finder.vercel.app' + match[1];
      https.get(jsUrl, (res2) => {
        let jsData = '';
        res2.on('data', chunk => jsData += chunk);
        res2.on('end', () => {
          console.log("JS Length:", jsData.length);
          if (jsData.includes('toFixed?.(2)')) {
            console.log("OLD CODE FOUND on Vercel!");
          } 
          if (jsData.includes('!= null ? Number')) {
            console.log("NEW CODE FOUND on Vercel!");
          }
        });
      });
    } else {
      console.log("NO match found in HTML for main.js");
    }
  });
});
