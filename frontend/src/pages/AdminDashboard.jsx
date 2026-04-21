import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");
  const [selectedBank, setSelectedBank] = useState(null);

  /* ================= REAL DATA STATES ================= */
  const [donors, setDonors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);

  /* ===== OVERVIEW & REPORT ===== */
  const [overview, setOverview] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState([]);

  /* ===== Create Request ===== */
  const [reqHospital, setReqHospital] = useState("");
  const [reqBlood, setReqBlood] = useState("");

  /* ===== ADD BLOOD BANK (NEW) ===== */
  const [showAddBank, setShowAddBank] = useState(false);
  const [newBank, setNewBank] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    location: "",
    city: "",
    latitude: "",
    longitude: ""
  });

  /* ================= DATE HELPERS ================= */
  const formatDateTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-IN");
  };

  const timeAgo = (date) => {
    if (!date) return "-";
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return formatDateTime(date);
  };

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/admin/donors`)
      .then(res => setDonors(res.data));

    axios.get(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/admin/hospitals`)
      .then(res => setHospitals(res.data));

    axios.get(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/admin/bloodbanks`)
      .then(res => setBloodBanks(res.data));

    axios.get(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/admin/inventory`)
      .then(res => setInventory(res.data));

    axios.get(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/admin/activity`)
      .then(res => setRequests(res.data));

    axios.get(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/emergency/admin/overview`)
      .then(res => setOverview(res.data));

    axios.get(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/emergency/admin/monthly-report`)
      .then(res => setMonthlyReport(res.data));
  }, []);

  /* ================= CREATE REQUEST ================= */
  const createRequest = () => {
    if (!reqHospital || !reqBlood) {
      alert("Please select hospital and blood group");
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/admin/requests`, {
      hospital_id: reqHospital,
      blood_group: reqBlood
    }).then(() => {
      alert("Emergency request created");
      setReqHospital("");
      setReqBlood("");
    });
  };

  /* ================= ADD BLOOD BANK ================= */
  const addBloodBank = () => {
    if (!newBank.name || !newBank.city) {
      alert("Name and City are required");
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/admin/add-bloodbank`, newBank)
      .then(() =>
        axios.get(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/admin/bloodbanks`)
      )
      .then(res => {
        setBloodBanks(res.data);
        setShowAddBank(false);
        setNewBank({
          name: "",
          mobile: "",
          email: "",
          address: "",
          location: "",
          city: "",
          latitude: "",
          longitude: ""
        });
        alert("Blood bank added successfully");
      })
      .catch(() => alert("Failed to add blood bank"));
  };

  /* ================= RENDER ================= */
  const renderSection = () => {
    switch (active) {

      case "overview":
        // Calculate dynamic stats based on loaded data
        const activeDonors = donors.filter(d => d.is_available === "Available").length;
        const totalPending = requests.filter(r => r.status === "pending").length;

        return (
          <div className="fadeIn">
            <h2 style={{...styles.title, fontSize: "2rem", marginBottom: "30px", borderBottom: "2px solid rgba(255,255,255,0.2)", paddingBottom: "10px"}}>
              👑 System Administrator
            </h2>

            {/* 1. 📊 System Overview Cards */}
            <h3 style={{color: "#fff", marginBottom: "15px", fontWeight: "300"}}>Global Statistics</h3>
            <div style={{...styles.grid, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))"}}>
              <div style={styles.glassCard} className="card3d">
                <p style={styles.statsLabel}>Total Donors</p>
                <h2 style={styles.statsValue}>{donors.length}</h2>
                <div style={{ fontSize: "0.8rem", color: "#4caf50" }}>🟢 {activeDonors} Active Now</div>
              </div>
              <div style={styles.glassCard} className="card3d">
                <p style={styles.statsLabel}>Total Hospitals</p>
                <h2 style={styles.statsValue}>{hospitals.length}</h2>
                <div style={{ fontSize: "0.8rem", color: "#4fc3f7" }}>🏥 Registered</div>
              </div>
              <div style={styles.glassCard} className="card3d">
                <p style={styles.statsLabel}>Today's Emergencies</p>
                <h2 style={styles.statsValue}>{overview?.total_emergencies || 0}</h2>
                <div style={{ fontSize: "0.8rem", color: "#ff9800" }}>⚠️ {totalPending} Pending globally</div>
              </div>
              <div style={{...styles.glassCard, background: "rgba(46, 125, 50, 0.4)"}} className="card3d">
                <p style={styles.statsLabel}>Fulfilled Requests</p>
                <h2 style={styles.statsValue}>{overview?.completed_emergencies || 0}</h2>
                <div style={{ fontSize: "0.8rem", color: "#a5d6a7" }}>✅ Successfully closed</div>
              </div>
            </div>

            {/* 7. 📋 Activity Logs (Real-time monitoring) */}
            <div style={{ marginTop: 40, ...styles.activityCard }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "15px" }}>
                <h3 style={{ margin: 0, color: "#1565c0" }}>📋 Live Activity Logs</h3>
                <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "bold" }}>⚡ Live Sync Active</span>
              </div>

              {requests.length === 0 ? (
                <p style={{ color: "#757575", textAlign: "center", padding: "20px 0" }}>No system activity recorded yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {requests.map((r, i) => (
                    <div key={i} style={styles.activityItem} className="logHover">
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p style={styles.activityHospital}>🏥 {r.hospital_name} <span style={{fontSize: "0.8rem", color: "#757575", fontWeight: "normal"}}>({r.hospital_mobile})</span></p>
                        <span style={styles.activityTime}>⏰ {timeAgo(r.created_at)}</span>
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                        <p style={styles.activityText}>
                          🚨 System generated emergency request for <b style={{color: "#d32f2f"}}>{r.blood_group}</b>
                        </p>
                        <span style={{
                          padding: "4px 10px", 
                          borderRadius: "8px", 
                          fontSize: "0.75rem", 
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          background: r.status === "pending" ? "#fff3cd" : (r.status === "accepted" ? "#ffe082" : "#e8f5e9"),
                          color: r.status === "pending" ? "#856404" : (r.status === "accepted" ? "#f57f17" : "#2e7d32")
                        }}>
                          {r.status === "pending" ? "🔴 Pending" : (r.status === "accepted" ? "🟡 Accepted" : "🟢 Completed")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "donors":
        return (
          <Table
            title="🧍 Donors"
            headers={["Name", "Blood", "Mobile", "HB Score"]}
            rows={donors.map(d => [d.name, d.blood_group, d.mobile, d.hemoglobin ? `${d.hemoglobin} g/dL` : "N/A"])}
          />
        );

      case "hospitals":
        return (
          <Table
            title="🏥 Hospitals"
            headers={["Hospital", "Mobile"]}
            rows={hospitals.map(h => [h.hospital_name, h.mobile])}
          />
        );

      case "bloodbanks":
        return (
          <>
            <h2 style={styles.title}>🏦 Blood Banks</h2>

            <button
              style={{ ...styles.primaryBtn, width: 220, marginBottom: 20 }}
              onClick={() => setShowAddBank(!showAddBank)}
            >
              {showAddBank ? "Close Form" : "➕ Add Blood Bank"}
            </button>

            {showAddBank && (
              <div style={styles.formCard} className="fadeIn">
                <h3>Add Blood Bank</h3>

                {Object.keys(newBank).map(k => (
                  <input
                    key={k}
                    style={styles.input}
                    placeholder={k}
                    value={newBank[k]}
                    onChange={e =>
                      setNewBank({ ...newBank, [k]: e.target.value })
                    }
                  />
                ))}

                <button style={styles.primaryBtn} onClick={addBloodBank}>
                  Save Blood Bank
                </button>
              </div>
            )}

            <div style={styles.grid}>
              {bloodBanks.map(b => (
                <div
                  key={b.bloodbank_id}
                  style={styles.glassCard}
                  className="card3d"
                  onClick={() => setSelectedBank(b)}
                >
                  {b.name}
                </div>
              ))}
            </div>

            {selectedBank && (
              <div style={styles.detailCard} className="fadeIn">
                <h3>{selectedBank.name}</h3>
                <p>📍 {selectedBank.address}</p>
                <p>📞 {selectedBank.mobile}</p>

                <h4>🩸 Blood Inventory</h4>
                <div style={styles.grid}>
                  {inventory
                    .filter(i => i.name === selectedBank.name)
                    .map((i, idx) => (
                      <div key={idx} style={styles.smallCard}>
                        {i.blood_group}: {i.units_available} units
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        );

      case "requests":
        return (
          <Table
            title="🩸 Active Requests"
            headers={["Hospital", "Blood", "Status"]}
            rows={requests.map(r => [
              r.hospital_name,
              r.blood_group,
              r.status
            ])}
          />
        );

      case "create":
        return (
          <div style={styles.formCard} className="fadeIn">
            <h2>🚨 Create Emergency Request</h2>

            <select
              style={styles.input}
              value={reqHospital}
              onChange={e => setReqHospital(e.target.value)}
            >
              <option value="">Select Hospital</option>
              {hospitals.map(h => (
                <option key={h.hospital_id} value={h.hospital_id}>
                  {h.hospital_name}
                </option>
              ))}
            </select>

            <select
              style={styles.input}
              value={reqBlood}
              onChange={e => setReqBlood(e.target.value)}
            >
              <option value="">Select Blood Group</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => (
                <option key={b}>{b}</option>
              ))}
            </select>

            <button style={styles.primaryBtn} onClick={createRequest}>
              Send Request
            </button>
          </div>
        );

      case "report":
        return (
          <>
            <h2 style={styles.title}>📅 Monthly Reports</h2>
            <div style={styles.grid}>
              {monthlyReport.map((r, i) => (
                <div key={i} style={styles.glassCard} className="card3d">
                  <h3>{r.month}</h3>
                  <p>Total Emergencies: {r.total_emergencies}</p>
                </div>
              ))}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.page} className="page-container">
      <div style={styles.sidebar} className="sidebar-container">
        <h2>Admin Panel</h2>

        <Menu label="Overview" onClick={() => setActive("overview")} />
        <Menu label="Donors" onClick={() => setActive("donors")} />
        <Menu label="Hospitals" onClick={() => setActive("hospitals")} />
        <Menu label="Blood Banks" onClick={() => setActive("bloodbanks")} />
        <Menu label="Active Requests" onClick={() => setActive("requests")} />
        <Menu label="Create Request" onClick={() => setActive("create")} />
        <Menu label="Monthly Report" onClick={() => setActive("report")} />

        <button
          style={styles.logout}
          className="logoutBtn"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      <div style={styles.content} className="content-container">{renderSection()}</div>
      <style>{css}</style>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const Menu = ({ label, onClick }) => (
  <button style={styles.menuBtn} className="menuBtn" onClick={onClick}>{label}</button>
);

const Table = ({ title, headers, rows }) => (
  <div className="fadeIn">
    <h2 style={styles.title}>{title}</h2>
    <div className="table-wrapper">
      <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Sr. No</th>
          {headers.map((h, i) => (
            <th key={i} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
            <td style={styles.td}>{i + 1}</td>
            {r.map((c, j) => (
              <td key={j} style={styles.td}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  </div>
);

/* ================= STYLES ================= */

const styles = {
  page:{display:"flex",minHeight:"100vh",background:"linear-gradient(135deg, rgba(10,25,47,0.95) 0%, rgba(23,42,69,0.90) 50%, rgba(13,71,161,0.85) 100%), url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop') center/cover fixed", fontFamily: "'Inter', sans-serif"},
  sidebar:{width:280,padding:"30px 20px",color:"#fff",background:"linear-gradient(180deg, rgba(13, 71, 161, 0.9), rgba(21, 101, 192, 0.9))", backdropFilter: "blur(10px)", borderRight: "1px solid rgba(255,255,255,0.1)", boxShadow: "5px 0 15px rgba(0,0,0,0.2)"},
  menuBtn:{width:"100%",padding:"14px",marginBottom:"12px",background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.05)",color:"#fff",borderRadius:"12px",cursor:"pointer",fontWeight:"bold",fontSize:"1rem",transition:"0.2s ease"},
  logout:{marginTop:"40px",width:"100%",padding:"14px",background:"linear-gradient(135deg, #d32f2f, #b71c1c)",border:"none",color:"#fff",borderRadius:"12px",fontWeight:"bold",fontSize:"1rem",cursor:"pointer",boxShadow:"0 4px 15px rgba(211,47,47,0.4)"},
  content:{flex:1,padding:"40px", overflowY: "auto", height: "100vh"},
  title:{marginBottom:"20px",color:"#fff", fontWeight: "800"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"20px"},
  glassCard:{background:"rgba(255, 255, 255, 0.1)",backdropFilter:"blur(15px)",border:"1px solid rgba(255,255,255,0.2)",padding:"25px",borderRadius:"20px",color:"#fff",boxShadow:"0 10px 30px rgba(0,0,0,0.2)"},
  statsLabel: { margin: "0 0 10px 0", fontSize: "0.95rem", opacity: 0.8, textTransform: "uppercase", letterSpacing: "1px" },
  statsValue: { margin: "0 0 10px 0", fontSize: "2.5rem", fontWeight: "900" },
  detailCard:{marginTop:20,background:"#fff",padding:20,borderRadius:16,boxShadow:"0 10px 30px rgba(0,0,0,0.1)"},
  smallCard:{background:"#e3f2fd",padding:10,borderRadius:8},
  table:{width:"100%",borderCollapse:"collapse",background:"#fff",borderRadius:"16px", overflow:"hidden"},
  formCard:{width:"100%",maxWidth:350,background:"#fff",padding:"30px",borderRadius:"20px",boxShadow:"0 15px 40px rgba(0,0,0,0.2)"},
  input:{width:"100%",padding:"12px",marginBottom:"15px", borderRadius:"10px", border:"1px solid #ddd", fontSize:"1rem", outline:"none"},
  primaryBtn:{width:"100%",padding:"14px",background:"linear-gradient(135deg, #1565c0, #0d47a1)",color:"#fff",border:"none",borderRadius:"10px",fontWeight:"bold",fontSize:"1rem",cursor:"pointer",boxShadow:"0 4px 15px rgba(21,101,192,0.4)"},
  th:{padding:"16px",background:"#f8f9fa", color:"#333", textAlign:"left", borderBottom:"2px solid #eee"},
  td:{padding:"14px 16px",borderBottom:"1px solid #eee", color:"#555"},
  trEven:{background:"#fafafa"},
  trOdd:{background:"#ffffff"},
  activityCard:{background:"#fff",padding:"30px",borderRadius:"20px",boxShadow:"0 15px 40px rgba(0,0,0,0.15)"},
  activityItem:{border:"1px solid #eee",borderRadius:"12px",padding:"16px", background:"#fafafa", transition:"0.2s ease"},
  activityHospital:{fontWeight:"bold", margin:0, color:"#1a1a1a", fontSize:"1.1rem"},
  activityText:{fontSize:"0.95rem", margin:0, color:"#424242"},
  activityTime:{fontSize:"0.85rem",color:"#757575", fontWeight:"500"}
};

const css = `
.page-container { flex-direction: row; }
@media (max-width: 768px) {
  .page-container { flex-direction: column !important; }
  .sidebar-container { width: 100% !important; padding: 15px !important; display: flex !important; flex-wrap: wrap !important; justify-content: center !important; align-items: center !important; gap: 8px !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; }
  .sidebar-container h2 { width: 100%; text-align: center; margin-bottom: 5px !important; }
  .content-container { padding: 15px !important; height: auto !important; overflow: visible !important; }
  .menuBtn, .logoutBtn { width: auto !important; margin: 0 !important; font-size: 0.8rem !important; padding: 8px 12px !important; flex-grow: 1; text-align: center; }
}
.table-wrapper { width: 100%; overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; border-radius: 16px; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-bottom: 20px; }
.fadeIn { animation:fade 0.5s ease-out; }
.card3d { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.card3d:hover { transform:translateY(-10px); box-shadow: 0 15px 35px rgba(0,0,0,0.3); }
.logHover:hover { background: #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.05); transform: translateX(5px); }
button:hover { filter: brightness(1.1); }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 10px; }
@keyframes fade{
  from{opacity:0;transform:translateY(20px);}
  to{opacity:1;transform:translateY(0);}
}
`;

export default AdminDashboard;
