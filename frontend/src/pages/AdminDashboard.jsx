import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");
  const [selectedBank, setSelectedBank] = useState(null);

  /* ================= STATIC UI DATA ================= */

  const donors = [
    { name: "Atul Wale", blood: "A+", city: "Sangli", mobile: "7820946531" },
    { name: "Rohit Patil", blood: "O+", city: "Miraj", mobile: "9876543210" },
    { name: "Amit Jadhav", blood: "B+", city: "Sangli", mobile: "9123456789" }
  ];

  const hospitals = [
    { name: "Civil Hospital", city: "Sangli", mobile: "0233-2321111" },
    { name: "City Hospital", city: "Miraj", mobile: "0233-2212345" }
  ];

  const bloodBanks = [
    {
      name: "Civil Blood Bank – Sangli",
      location: "Civil Hospital Campus, Sangli",
      contact: "0233-2323456",
      type: "Government",
      blood: {
        "A+": 12, "A-": 4, "B+": 8, "B-": 3,
        "AB+": 6, "AB-": 2, "O+": 15, "O-": 5
      }
    },
    {
      name: "Red Cross Blood Bank – Sangli",
      location: "Market Yard Road, Sangli",
      contact: "0233-2345678",
      type: "Private",
      blood: {
        "A+": 10, "A-": 3, "B+": 6, "B-": 2,
        "AB+": 4, "AB-": 1, "O+": 12, "O-": 4
      }
    }
  ];

  const totalBloodUnits = {
    "A+": 120, "A-": 30, "B+": 95, "B-": 25,
    "AB+": 40, "AB-": 18, "O+": 160, "O-": 50
  };

  /* ===== NEW: Hospital Activity (Monitoring) ===== */

  const hospitalActivities = [
    {
      hospital: "City Hospital",
      action: "Checked nearby blood banks for AB+",
      time: "10 mins ago",
      type: "info"
    },
    {
      hospital: "Civil Hospital",
      action: "Emergency blood request raised for O-",
      time: "25 mins ago",
      type: "alert"
    },
    {
      hospital: "City Hospital",
      action: "Donor accepted request for B+",
      time: "1 hour ago",
      type: "success"
    }
  ];

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

            {/* ===== Hospital Activity ===== */}
            <div style={styles.activityCard}>
              <h3>📌 Hospital Activity</h3>

              {hospitalActivities.map((item, index) => (
                <div key={index} style={styles.activityItem}>
                  <p style={styles.activityHospital}>🏥 {item.hospital}</p>
                  <p style={styles.activityText}>
                    {item.type === "alert" && "🚨 "}
                    {item.type === "success" && "✔ "}
                    {item.type === "info" && "🩸 "}
                    {item.action}
                  </p>
                  <span style={styles.activityTime}>⏰ {item.time}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "donors":
        return <Table title="🧍 Donors"
          headers={["Name","Blood","City","Mobile"]}
          rows={donors.map(d=>[d.name,d.blood,d.city,d.mobile])} />;

      case "hospitals":
        return <Table title="🏥 Hospitals"
          headers={["Hospital","City","Mobile"]}
          rows={hospitals.map(h=>[h.name,h.city,h.mobile])} />;

      case "bloodbanks":
        return (
          <>
            <h2 style={styles.title}>🏦 Blood Banks (Sangli)</h2>
            <div style={styles.grid}>
              {bloodBanks.map((b,i)=>(
                <div key={i} style={styles.glassCard}
                  className="card3d"
                  onClick={()=>setSelectedBank(b)}>
                  {b.name}
                </div>
              ))}
            </div>

            {selectedBank && (
              <div style={styles.detailCard} className="fadeIn">
                <h3>{selectedBank.name}</h3>
                <p>📍 {selectedBank.location}</p>
                <p>📞 {selectedBank.contact}</p>
                <p>🏥 {selectedBank.type}</p>

                <h4>🩸 Available Blood</h4>
                <div style={styles.grid}>
                  {Object.entries(selectedBank.blood).map(([g,u])=>(
                    <div key={g} style={styles.smallCard}>{g}: {u} units</div>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      case "requests":
        return <Table title="🩸 Active Requests"
          headers={["Hospital","Blood","Status"]}
          rows={[
            ["Civil Hospital","AB+","Waiting"],
            ["City Hospital","O-","Accepted"]
          ]} />;

      case "create":
        return (
          <div style={styles.formCard} className="fadeIn">
            <h2>🚨 Create Emergency Request</h2>
            <select style={styles.input}>
              <option>Select Blood Group</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b=>(
                <option key={b}>{b}</option>
              ))}
            </select>
            <button style={styles.primaryBtn}>Send Request</button>
          </div>
        );

      case "units":
        return (
          <>
            <h2 style={styles.title}>📊 Total Blood Units</h2>
            <div style={styles.grid}>
              {Object.entries(totalBloodUnits).map(([g,u])=>(
                <div key={g} style={styles.glassCard} className="card3d">
                  <h3>{g}</h3>
                  <p>{u} Units</p>
                </div>
              ))}
            </div>
          </>
        );

      case "report":
        return (
          <>
            <h2 style={styles.title}>📅 Monthly Report</h2>
            <div style={styles.grid}>
              <StatCard label="New Donors" value="24" />
              <StatCard label="Blood Requests" value="18" />
              <StatCard label="Units Used" value="42" />
              <StatCard label="Active Hospitals" value="6" />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2>Admin Panel</h2>

        <Menu label="Overview" onClick={()=>setActive("overview")} />
        <Menu label="Donors" onClick={()=>setActive("donors")} />
        <Menu label="Hospitals" onClick={()=>setActive("hospitals")} />
        <Menu label="Blood Banks" onClick={()=>setActive("bloodbanks")} />
        <Menu label="Active Requests" onClick={()=>setActive("requests")} />
        <Menu label="Create Request" onClick={()=>setActive("create")} />
        <Menu label="Blood Units" onClick={()=>setActive("units")} />
        <Menu label="Monthly Report" onClick={()=>setActive("report")} />

        <button style={styles.logout}
          onClick={()=>{localStorage.clear();navigate("/");}}>
          Logout
        </button>
      </div>

      {/* Content */}
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
      <thead><tr>{headers.map((h,i)=><th key={i}>{h}</th>)}</tr></thead>
      <tbody>
        {rows.map((r,i)=>(
          <tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StatCard = ({ label, value }) => (
  <div style={styles.glassCard} className="card3d">
    <h2>{value}</h2>
    <p>{label}</p>
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
  content:{flex:1,padding:30,color:"#000"},
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

  /* ===== Activity Styles ===== */
  activityCard:{
    background:"#fff",
    padding:20,
    borderRadius:16,
    boxShadow:"0 10px 25px rgba(0,0,0,0.15)"
  },
  activityItem:{
    borderBottom:"1px solid #eee",
    padding:"10px 0"
  },
  activityHospital:{
    fontWeight:"bold"
  },
  activityText:{
    fontSize:14
  },
  activityTime:{
    fontSize:12,
    color:"#777"
  }
};

/* ================= ANIMATION ================= */

const css = `
.fadeIn{animation:fade 0.5s ease;}
.card3d{transition:0.4s;transform-style:preserve-3d;}
.card3d:hover{transform:translateY(-10px) scale(1.05);}
@keyframes fade{
  from{opacity:0;transform:translateY(20px);}
  to{opacity:1;transform:translateY(0);}
}
table th,table td{padding:12px;border-bottom:1px solid #eee;}
table th{background:#f5f5f5;}
`;

export default AdminDashboard;
