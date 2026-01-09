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
    axios.get("http://localhost:5000/api/admin/donors")
      .then(res => setDonors(res.data));

    axios.get("http://localhost:5000/api/admin/hospitals")
      .then(res => setHospitals(res.data));

    axios.get("http://localhost:5000/api/admin/bloodbanks")
      .then(res => setBloodBanks(res.data));

    axios.get("http://localhost:5000/api/admin/inventory")
      .then(res => setInventory(res.data));

    axios.get("http://localhost:5000/api/admin/activity")
      .then(res => setRequests(res.data));

    axios.get("http://localhost:5000/api/emergency/admin/overview")
      .then(res => setOverview(res.data));

    axios.get("http://localhost:5000/api/emergency/admin/monthly-report")
      .then(res => setMonthlyReport(res.data));
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

  /* ================= ADD BLOOD BANK ================= */
  const addBloodBank = () => {
    if (!newBank.name || !newBank.city) {
      alert("Name and City are required");
      return;
    }

    axios.post("http://localhost:5000/api/admin/add-bloodbank", newBank)
      .then(() =>
        axios.get("http://localhost:5000/api/admin/bloodbanks")
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
        return (
          <div className="fadeIn">
            <h2 style={styles.title}>👑 Admin Dashboard</h2>

            <div style={styles.grid}>
              <div style={styles.glassCard}>
                <h3>Total Today</h3>
                <p>{overview?.total_emergencies || 0}</p>
              </div>
              <div style={styles.glassCard}>
                <h3>Accepted</h3>
                <p>{overview?.accepted_emergencies || 0}</p>
              </div>
              <div style={styles.glassCard}>
                <h3>Completed</h3>
                <p>{overview?.completed_emergencies || 0}</p>
              </div>
            </div>

            <div style={{ marginTop: 25, ...styles.activityCard }}>
              <h3>📌 Hospital Activity</h3>

              {requests.length === 0 ? (
                <p>No emergency activity yet</p>
              ) : (
                requests.map((r, i) => (
                  <div key={i} style={styles.activityItem}>
                    <p style={styles.activityHospital}>🏥 {r.hospital_name}</p>
                    <p style={{ fontSize: 13 }}>📞 {r.hospital_mobile}</p>
                    <p style={styles.activityText}>
                      🚨 Emergency request raised for <b>{r.blood_group}</b>
                    </p>
                    <span style={styles.activityTime}>
                      ⏰ {timeAgo(r.created_at)}
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
  page:{display:"flex",minHeight:"100vh",background:"linear-gradient(135deg,#141e30,#243b55)"},
  sidebar:{width:260,padding:20,color:"#fff",background:"linear-gradient(180deg,#0d47a1,#1565c0)"},
  menuBtn:{width:"100%",padding:10,marginBottom:8,background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:8,cursor:"pointer"},
  logout:{marginTop:15,width:"100%",padding:10,background:"#d32f2f",border:"none",color:"#fff",borderRadius:8},
  content:{flex:1,padding:30},
  title:{marginBottom:15,color:"#fff"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16},
  glassCard:{background:"rgba(255,255,255,0.25)",backdropFilter:"blur(10px)",padding:20,borderRadius:16,color:"#fff"},
  detailCard:{marginTop:20,background:"#fff",padding:20,borderRadius:16},
  smallCard:{background:"#e3f2fd",padding:10,borderRadius:8},
  table:{width:"100%",borderCollapse:"collapse",background:"#fff",borderRadius:12},
  formCard:{width:320,background:"#fff",padding:20,borderRadius:16},
  input:{width:"100%",padding:10,marginBottom:10},
  primaryBtn:{width:"100%",padding:10,background:"#1565c0",color:"#fff",border:"none",borderRadius:8},
  th:{padding:"12px",background:"#f5f5f5"},
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
