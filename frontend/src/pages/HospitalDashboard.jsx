import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [hospital, setHospital] = useState(null);
  const [bloodBanks, setBloodBanks] = useState([]);

  // ✅ ADDED (required)
  const [bloodGroup, setBloodGroup] = useState("O+");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    // Load hospital profile
    axios
      .get(`http://localhost:5000/api/hospital/profile/${userId}`)
      .then((res) => {
        setHospital(res.data);

        // Load nearby blood banks using hospital location
        return axios.get("http://localhost:5000/api/bloodbank/nearby", {
          params: {
            latitude: res.data.latitude,
            longitude: res.data.longitude
          }
        });
      })
      .then((res) => setBloodBanks(res.data))
      .catch(() => alert("Failed to load hospital data"));
  }, [userId, navigate]);

  const sendEmergency = () => {
    alert("Emergency request sent to nearby donors 🚨");
  };

  // ✅ UPDATED (real emergency check)
  const emergencyBloodCheck = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/bloodbank/emergency",
        {
          params: {
            blood_group: encodeURIComponent(bloodGroup), // ✅ HERE
            latitude: hospital.latitude,
            longitude: hospital.longitude
          }
        }
      );

      if (res.data.length === 0) {
        alert("Required blood group is not available. Please contact nearby blood banks.");
        return;
      }

      const bank = res.data[0];

      alert(
        `Blood Available!\n\nBlood Bank: ${bank.name}\nBlood Group: ${bank.blood_group}\nUnits: ${bank.units_available}\nPhone: ${bank.mobile}`
      );
    } catch (err) {
      alert("Failed to check emergency blood availability");
    }
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
            <p style={styles.email}>Hospital Account</p>
            <p style={styles.mobile}>📞 {hospital.mobile}</p>
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

        {/* ✅ Blood group selector (minimal, no style changes) */}
        <div style={styles.section}>
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          >
            <option>O+</option>
            <option>O-</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>

          <button
            style={styles.emergencyBtn}
            onClick={emergencyBloodCheck}
          >
            Emergency Blood Check
          </button>
        </div>

        {/* ================= NEARBY BLOOD BANKS ================= */}
        <div style={styles.section}>
          <h4>🏦 Nearby Blood Banks</h4>

          {bloodBanks.length === 0 ? (
            <p style={styles.subText}>No blood banks found nearby</p>
          ) : (
            bloodBanks.map((bank) => (
              <div key={bank.bloodbank_id} style={styles.section}>
                <p><b>{bank.name}</b></p>
                <p>📍 {bank.address}, {bank.city}</p>
                <p>📞 {bank.mobile}</p>

                <button
                  style={styles.emergencyBtn}
                  onClick={() => window.location.href = `tel:${bank.mobile}`}
                >
                  Call Blood Bank
                </button>
              </div>
            ))
          )}
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
  }
};

const animationCSS = `
.fadeIn {
  animation: fadeIn 0.7s ease-in-out;
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
