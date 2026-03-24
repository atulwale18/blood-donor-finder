const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend/src/pages');
if (fs.existsSync(dir)) {
  fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.jsx')) return;
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace all variations of hardcoded localtunnel URLs with dynamic env var + fallback
    const regex = /['"`]https:\/\/atul-bdf-backend\.loca\.lt(\/api\/?[^'"`]*)['"`]/g;
    if (regex.test(content)) {
      content = content.replace(regex, '`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}$1`');
      fs.writeFileSync(filePath, content);
      console.log(`Updated API URLs in ${file}`);
    }
  });
}

const serverFile = path.join(__dirname, 'backend/server.js');
if (fs.existsSync(serverFile)) {
  let content = fs.readFileSync(serverFile, 'utf8');
  if (content.includes('app.listen(5000')) {
    content = content.replace(/app\.listen\(5000/g, 'app.listen(process.env.PORT || 5000');
    fs.writeFileSync(serverFile, content);
    console.log('Fixed backend server port configuration.');
  }
}

console.log('Deployment preparation complete.');
