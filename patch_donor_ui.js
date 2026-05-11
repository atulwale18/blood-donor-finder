const fs = require('fs');
let content = fs.readFileSync('frontend/src/pages/DonorDashboard.jsx', 'utf8');

// The minimal clean UI updates
content = content.replace(
  /background:\s*"linear-gradient.*?fixed",/s,
  `background: "#F4F7FE", fontFamily: "'Inter', 'Roboto', sans-serif",`
);

content = content.replace(
  /background:\s*"rgba\\(255, 255, 255, 0\.95\\)".*?boxShadow:\s*"0 25px 50px rgba\\(0,0,0,0\.3\\)"/s,
  `background: "#FFFFFF",
    backdropFilter: "blur(12px)",
    padding: "35px",
    borderRadius: "24px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
    border: "1px solid rgba(0,0,0,0.02)"`
);

content = content.replace(
  /background:\s*"linear-gradient\\(135deg, #1976d2, #0d47a1\\)".*?boxShadow:\s*"0 4px 15px rgba\\(13, 71, 161, 0\.3\\)"/s,
  `background: "#2563EB",
    color: "#fff",
    fontSize: "30px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.2)"`
);

content = content.replace(
  /background:\s*"rgba\\(255, 255, 255, 0\.5\\)".*?boxShadow:\s*"0 4px 15px rgba\\(0,0,0,0\.05\\)"/s,
  `background: "#F9FAFB",
    padding: "15px",
    borderRadius: "16px",
    textAlign: "center",
    border: "1px solid #F3F4F6",
    transition: "0.2s"`
);

content = content.replace(
  /background:\s*"linear-gradient\\(135deg, #43a047, #2e7d32\\)".*?boxShadow:\s*"0 4px 15px rgba\\(46, 125, 50, 0\.4\\)"/s,
  `background: "#10B981",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontWeight: "bold",
    fontSize: "1.05rem",
    cursor: "pointer",
    transition: "all 0.2s ease"`
);

content = content.replace(
  /background:\s*"#111",\s*color:\s*"#fff",\s*border:\s*"none",\s*borderRadius:\s*"14px",\s*fontWeight:\s*"bold",\s*fontSize:\s*"1\.1rem",\s*cursor:\s*"pointer",\s*transition:\s*"background 0\.2s ease",/s,
  `background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",`
);

// update title color
content = content.replace(
  /color:\s*"#0d47a1"/g,
  `color: "#111827"`
);

fs.writeFileSync('frontend/src/pages/DonorDashboard.jsx', content);
console.log("Donor UI updated");
