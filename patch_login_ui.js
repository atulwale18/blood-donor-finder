const fs = require('fs');

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Change formSide background to clean minimal color
  content = content.replace(
    /background: linear-gradient\(135deg, #0A192F, #172A45\);/g,
    `background: "#F4F7FE";`
  );

  // Change Card shadow
  content = content.replace(
    /boxShadow: "0 25px 50px rgba\(0,0,0,0.4\)"/g,
    `boxShadow: "0 10px 40px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.02)"`
  );

  // Change red button to clean red
  content = content.replace(
    /background: "linear-gradient\(135deg, #e53935, #b71c1c\)"/g,
    `background: "#DC2626"`
  );

  // Change button shadow
  content = content.replace(
    /boxShadow: "0 6px 15px rgba\(229,57,53,0.3\)"/g,
    `boxShadow: "0 4px 12px rgba(220, 38, 38, 0.2)"`
  );

  fs.writeFileSync(filePath, content);
}

patchFile('frontend/src/pages/Login.jsx');
patchFile('frontend/src/pages/Register.jsx');

console.log("Login and Register UI updated!");
