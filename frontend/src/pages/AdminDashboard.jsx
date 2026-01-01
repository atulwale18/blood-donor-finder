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
  const [reports, setReports] = useState([]);

  /* ===== Create Request ===== */
  const [reqHospital, setReqHospital] = useState("");
  const [reqBlood, setReqBlood] = useState("");

  /* ================= LOAD REAL DATA ================= */
  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/donors").then(res => setDonors(res.data));
    axios.get("http://localhost:5000/api/admin/hospitals").then(res => setHospitals(res.data));
    axios.get("http://localhost:5000/api/admin/bloodbanks").then(res => setBloodBanks(res.data));
    axios.get("http://localhost:5000/api/admin/inventory").then(res => setInventory(res.data));
    axios.get("http://localhost:5000/api/admin/requests").then(res => setRequests(res.data));
    axios.get("http://localhost:5000/api/admin/reports").then(res => setReports(res.data));
  }, []);

  /* ================= CREATE REQUEST ================= */
  const createRequest = () => {
    if (!reqHospital || !reqBlood) {
      alert("Please select hospital and blood group");
      return;
    }

    axios.post("http://localhost:5000/api/admin/requests", {
      hospital_id: reqHospital,
      blood_group: reqBlood
    }).then(() => {
      alert("Emergency request created");
      setReqHospital("");
      setReqBlood("");
    });
  };

  /* ================= RENDER CONTENT ================= */
  const renderSection = () => {
    switch (active) {

      case "overview":
        return (
          <div className="fadeIn">
            <h2 style={styles.title}>👑 Admin Dashboard</h2>
            <p style={{ color: "#fff", marginBottom: 20 }}>
              Central control panel for blood management system.
            </p>

            <div style={styles.activityCard}>
              <h3>📌 Hospital Activity</h3>

              {requests.length === 0 ? (
                <p>No recent activity</p>
              ) : (
                requests.slice(0, 5).map((r, i) => (
                  <div key={i} style={styles.activityItem}>
                    <p style={styles.activityHospital}>
                      🏥 {r.hospital_name}
                    </p>

                    <p style={styles.activityText}>
                      {r.status === "pending" && "🚨 Emergency request raised for "}
                      {r.status === "accepted" && "🩸 Request accepted for "}
                      {r.status === "completed" && "✔ Request completed for "}
                      <b>{r.blood_group}</b>
                    </p>

                    <span style={styles.activityTime}>
                      ⏰ {new Date(r.created_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "donors":
        return (
          <Table
            title="🧍 Donors"
            headers={["Name", "Blood", "Mobile"]}
            rows={donors.map(d => [d.name, d.blood_group, d.mobile])}
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
              {reports.map(r => (
                <div key={r.report_id} style={styles.glassCard} className="card3d">
                  <h3>{r.report_month}</h3>
                  <p>Total Requests: {r.total_requests}</p>
                  <p>Pending: {r.pending_requests}</p>
                  <p>Completed: {r.completed_requests}</p>
                  <p>Blood Units: {r.total_blood_units}</p>
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
    <div style={styles.page}>
      <div style={styles.sidebar}>
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
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      <div style={styles.content}>{renderSection()}</div>
      <style>{css}</style>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const Menu = ({ label, onClick }) => (
  <button style={styles.menuBtn} onClick={onClick}>{label}</button>
);

const Table = ({ title, headers, rows }) => (
  <div className="fadeIn">
    <h2 style={styles.title}>{title}</h2>
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
);

/* ================= STYLES ================= */

const styles = {
  page:{display:"flex",minHeight:"100vh",
    background:"linear-gradient(135deg,#141e30,#243b55)"},
  sidebar:{width:260,padding:20,color:"#fff",
    background:"linear-gradient(180deg,#0d47a1,#1565c0)"},
  menuBtn:{width:"100%",padding:10,marginBottom:8,
    background:"rgba(255,255,255,0.15)",border:"none",
    color:"#fff",borderRadius:8,cursor:"pointer"},
  logout:{marginTop:15,width:"100%",padding:10,
    background:"#d32f2f",border:"none",color:"#fff",borderRadius:8},
  content:{flex:1,padding:30},
  title:{marginBottom:15,color:"#fff"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16},
  glassCard:{background:"rgba(255,255,255,0.25)",backdropFilter:"blur(10px)",
    padding:20,borderRadius:16,color:"#fff",cursor:"pointer",
    boxShadow:"0 15px 35px rgba(0,0,0,0.3)"},
  detailCard:{marginTop:20,background:"#fff",padding:20,borderRadius:16},
  smallCard:{background:"#e3f2fd",padding:10,borderRadius:8},
  table:{width:"100%",borderCollapse:"collapse",background:"#fff",borderRadius:12},
  formCard:{width:320,background:"#fff",padding:20,borderRadius:16},
  input:{width:"100%",padding:10,marginBottom:10},
  primaryBtn:{width:"100%",padding:10,background:"#1565c0",
    color:"#fff",border:"none",borderRadius:8},

  th:{padding:"12px",background:"#f5f5f5",fontWeight:"bold"},
  td:{padding:"10px",borderBottom:"1px solid #eee"},
  trEven:{background:"#fafafa"},
  trOdd:{background:"#ffffff"},

  activityCard:{background:"#fff",padding:20,borderRadius:16},
  activityItem:{borderBottom:"1px solid #eee",padding:"10px 0"},
  activityHospital:{fontWeight:"bold"},
  activityText:{fontSize:14},
  activityTime:{fontSize:12,color:"#777"}
};

const css = `
.fadeIn{animation:fade 0.5s ease;}
.card3d{transition:0.4s;}
.card3d:hover{transform:translateY(-8px) scale(1.03);}
@keyframes fade{
  from{opacity:0;transform:translateY(20px);}
  to{opacity:1;transform:translateY(0);}
}
`;

export default AdminDashboard;
