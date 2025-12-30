import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ================= STATIC BLOOD BANK DATA (UI ONLY) ================= */

const nearbyBloodBanks = [
  {
    name: "Civil Blood Bank – Sangli",
    contact: "0233-2323456",
    blood: {
      "A+": 12, "A-": 4, "B+": 8, "B-": 3,
      "AB+": 6, "AB-": 2, "O+": 15, "O-": 5
    }
  },
  {
    name: "Red Cross Blood Bank – Sangli",
    contact: "0233-2345678",
    blood: {
      "A+": 10, "A-": 3, "B+": 6, "B-": 2,
      "AB+": 4, "AB-": 1, "O+": 12, "O-": 4
    }
  }
];

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [hospital, setHospital] = useState(null);
  const [requests, setRequests] = useState([
    { blood_group: "AB+", status: "Waiting for donor response" },
    { blood_group: "O-", status: "Donor Accepted" }
  ]);

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:5000/api/profile/hospital/${userId}`)
      .then((res) => setHospital(res.data))
      .catch(() => alert("Failed to load hospital data"));
  }, [userId, navigate]);

  const sendEmergency = () => {
    alert("Emergency request sent to nearby donors 🚨");
  };

  if (!hospital) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fadeIn">
        {/* Title */}
        <h2 style={styles.title}>🏥 Hospital Dashboard</h2>

        {/* Profile */}
        <div style={styles.profile}>
          <div style={styles.avatar}>
            {hospital.hospital_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{hospital.hospital_name}</h3>
            <p style={styles.email}>{hospital.email || "Hospital Account"}</p>
            <p style={styles.mobile}>📞 {hospital.mobile}</p>
          </div>
        </div>

        {/* ================= Nearby Blood Banks ================= */}
        <div style={styles.section}>
          <h4>🏦 Nearby Blood Banks</h4>

          <div style={styles.bankGrid}>
            {nearbyBloodBanks.map((bank, index) => (
              <div key={index} style={styles.bankCard} className="bankHover">
                <h5>{bank.name}</h5>

                <div style={styles.bloodGrid}>
                  {Object.entries(bank.blood).map(([group, units]) => (
                    <span key={group} style={styles.bloodTag}>
                      {group}: {units}
                    </span>
                  ))}
                </div>

                <button
                  style={styles.contactBtn}
                  onClick={() => alert(`Call ${bank.contact}`)}
                >
                  📞 Contact Blood Bank
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Section */}
        <div style={styles.section}>
          <h4>🚨 Emergency Blood Request</h4>
          <p style={styles.subText}>
            Send emergency blood request to nearby donors.
          </p>

          <button style={styles.emergencyBtn} onClick={sendEmergency}>
            Send Emergency Request
          </button>
        </div>

        {/* Request Status */}
        <div style={styles.section}>
          <h4>📋 Request Status</h4>

          {requests.map((req, index) => (
            <div key={index} style={styles.statusCard}>
              <p><b>Blood Group:</b> {req.blood_group}</p>
              <p>
                <b>Status:</b>{" "}
                {req.status === "Donor Accepted" ? (
                  <span style={{ color: "green" }}>✔ {req.status}</span>
                ) : (
                  <span style={{ color: "#ff9800" }}>{req.status}</span>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Logout */}
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

      {/* Animation */}
      <style>{animationCSS}</style>
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0d47a1, #1976d2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: 420,
    background: "#fff",
    padding: 25,
    borderRadius: 16,
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)"
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  profile: {
    display: "flex",
    gap: 15,
    alignItems: "center",
    marginBottom: 20
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "#1565c0",
    color: "#fff",
    fontSize: 26,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  email: {
    color: "#555",
    fontSize: 14
  },
  mobile: {
    fontSize: 14
  },
  section: {
    marginBottom: 20
  },
  subText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10
  },
  emergencyBtn: {
    width: "100%",
    padding: 12,
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
  },
  statusCard: {
    background: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },
  logout: {
    width: "100%",
    padding: 10,
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    color: "#fff"
  },

  /* ===== Blood Bank Styles ===== */
  bankGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 15
  },
  bankCard: {
    background: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
  },
  bloodGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    margin: "10px 0"
  },
  bloodTag: {
    background: "#e53935",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 12
  },
  contactBtn: {
    marginTop: 10,
    padding: "8px 12px",
    background: "#1565c0",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  }
};

/* ================= ANIMATION ================= */

const animationCSS = `
.fadeIn {
  animation: fadeIn 0.7s ease-in-out;
}
.bankHover {
  transition: transform 0.3s, box-shadow 0.3s;
}
.bankHover:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.25);
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export default HospitalDashboard;
