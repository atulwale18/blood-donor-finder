import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [hospital, setHospital] = useState(null);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [bloodGroup, setBloodGroup] = useState("O+");

  // ✅ NEW: emergency list
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    let hospitalLoaded = false;

    axios
      .get(`http://localhost:5000/api/hospital/profile/${userId}`)
      .then((res) => {
        hospitalLoaded = true;
        setHospital(res.data);

        return axios.get("http://localhost:5000/api/bloodbank/nearby", {
          params: {
            latitude: res.data.latitude,
            longitude: res.data.longitude
          }
        });
      })
      .then((res) => {
        setBloodBanks(res.data || []);
      })
      .catch(() => {
        if (!hospitalLoaded) {
          alert("Failed to load hospital data");
        } else {
          setBloodBanks([]);
        }
      });
  }, [userId, navigate]);

  // ✅ NEW: fetch emergency status for hospital
  useEffect(() => {
    if (!hospital) return;

    axios
      .get(
        `http://localhost:5000/api/emergency/hospital/${hospital.hospital_id}`
      )
      .then((res) => setEmergencies(res.data || []))
      .catch(() => {});
  }, [hospital]);

  /* =====================
     SEND EMERGENCY REQUEST
  ===================== */
  const sendEmergency = async () => {
    try {
      await axios.post("http://localhost:5000/api/emergency/create", {
        hospital_id: hospital.hospital_id,
        blood_group: bloodGroup
      });

      alert("Emergency request sent to nearby donors 🚨");
    } catch {
      alert("Failed to send emergency request");
    }
  };

  /* =====================
     EMERGENCY BLOOD CHECK
  ===================== */
  const emergencyBloodCheck = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/bloodbank/emergency",
        {
          params: {
            blood_group: encodeURIComponent(bloodGroup),
            latitude: hospital.latitude,
            longitude: hospital.longitude
          }
        }
      );

      if (res.data.length === 0) {
        alert(
          "Required blood group is not available. Please contact nearby blood banks."
        );
        return;
      }

      const bank = res.data[0];

      alert(
        `Blood Available!\n\nBlood Bank: ${bank.name}\nBlood Group: ${bank.blood_group}\nUnits: ${bank.units_available}\nPhone: ${bank.mobile}`
      );
    } catch {
      alert("Failed to check emergency blood availability");
    }
  };

  if (!hospital) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fadeIn">
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

          <button style={styles.emergencyBtn} onClick={sendEmergency}>
            Send Emergency Request
          </button>
        </div>

        {/* Emergency Blood Check */}
        <div style={styles.section}>
          <button style={styles.emergencyBtn} onClick={emergencyBloodCheck}>
            Emergency Blood Check
          </button>
        </div>

        {/* ✅ Emergency Status */}
        <div style={styles.section}>
          <h4>📌 Emergency Request Status</h4>

          {emergencies.length === 0 ? (
            <p style={styles.subText}>No emergency requests yet</p>
          ) : (
            emergencies.map((e) => (
              <div
                key={e.request_id}
                style={{
                  border: "1px solid #ddd",
                  padding: 10,
                  borderRadius: 8,
                  marginBottom: 10
                }}
              >
                <p><b>Blood Group:</b> {e.blood_group}</p>
                <p><b>Status:</b> {e.status}</p>

                {e.status === "accepted" && (
                  <>
                    <p><b>Donor Name:</b> {e.donor_name}</p>
                    <p><b>Mobile:</b> {e.donor_mobile}</p>
                    <p><b>City:</b> {e.donor_city}</p>
                  </>
                )}

                {e.status === "pending" && (
                  <p style={{ color: "#777" }}>
                    Waiting for donor response…
                  </p>
                )}

                {e.status === "declined" && (
                  <p style={{ color: "red" }}>
                    Request declined
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Nearby Blood Banks */}
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
                  onClick={() =>
                    (window.location.href = `tel:${bank.mobile}`)
                  }
                >
                  Call Blood Bank
                </button>
              </div>
            ))
          )}
        </div>

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
  title: { textAlign: "center", marginBottom: 20 },
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
  email: { color: "#555", fontSize: 14 },
  mobile: { fontSize: 14 },
  section: { marginBottom: 20 },
  subText: { fontSize: 13, color: "#666", marginBottom: 10 },
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
