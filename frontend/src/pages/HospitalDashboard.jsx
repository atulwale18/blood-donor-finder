import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [hospital, setHospital] = useState(null);
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [emergencies, setEmergencies] = useState([]);
  const [notifiedDonors, setNotifiedDonors] = useState({});
  const [bloodBanks, setBloodBanks] = useState([]);

  /* =====================
     LOAD HOSPITAL PROFILE
  ===================== */
  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:5000/api/hospital/profile/${userId}`)
      .then((res) => {
        setHospital(res.data);

        // 🔴 KEEP BLOOD BANK LOGIC (as you asked)
        return axios.get("http://localhost:5000/api/bloodbank/nearby", {
          params: {
            latitude: res.data.latitude,
            longitude: res.data.longitude
          }
        });
      })
      .then((res) => setBloodBanks(res.data || []))
      .catch(() => alert("Failed to load hospital data"));
  }, [userId, navigate]);

  /* =====================
     FETCH EMERGENCIES
  ===================== */
  const fetchEmergencies = useCallback(() => {
    if (!hospital) return;

    axios
      .get(
        `http://localhost:5000/api/emergency/hospital/${hospital.hospital_id}`
      )
      .then((res) => setEmergencies(res.data || []))
      .catch(() => {});
  }, [hospital]);

  useEffect(() => {
    if (hospital) fetchEmergencies();
  }, [hospital, fetchEmergencies]);

  /* =====================
     FETCH NOTIFIED DONORS
  ===================== */
  const fetchNotifiedDonors = (requestId) => {
    axios
      .get(`http://localhost:5000/api/emergency/notified/${requestId}`)
      .then((res) =>
        setNotifiedDonors((prev) => ({
          ...prev,
          [requestId]: res.data || []
        }))
      )
      .catch(() => {});
  };

  /* =====================
     SEND EMERGENCY
  ===================== */
  const sendEmergency = async () => {
    try {
      await axios.post("http://localhost:5000/api/emergency/create", {
        hospital_id: hospital.hospital_id,
        blood_group: bloodGroup
      });

      alert("Emergency request sent 🚨");
      fetchEmergencies();
    } catch {
      alert("Failed to send emergency request");
    }
  };

  /* =====================
     COMPLETE DONATION
  ===================== */
  const completeDonation = async (request_id) => {
    try {
      await axios.post("http://localhost:5000/api/emergency/complete", {
        request_id
      });

      alert("Donation completed ✅");
      fetchEmergencies();
    } catch {
      alert("Failed to complete donation");
    }
  };

  if (!hospital) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fadeIn">
        <h2 style={styles.title}>🏥 Hospital Dashboard</h2>

        {/* PROFILE */}
        <div style={styles.profile}>
          <div style={styles.avatar}>
            {hospital.hospital_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{hospital.hospital_name}</h3>
            <p>📞 {hospital.mobile}</p>
          </div>
        </div>

        {/* EMERGENCY REQUEST */}
        <div style={styles.section}>
          <h4>🚨 Emergency Blood Request</h4>

          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            style={styles.select}
          >
            <option>O+</option><option>O-</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
          </select>

          <button style={styles.emergencyBtn} onClick={sendEmergency}>
            Send Emergency Request
          </button>
        </div>

        {/* NEARBY BLOOD BANKS (RESTORED) */}
        <div style={styles.section}>
          <h4>🏦 Nearby Blood Banks</h4>

          {bloodBanks.length === 0 ? (
            <p style={styles.muted}>No blood banks nearby</p>
          ) : (
            bloodBanks.map((b) => (
              <div key={b.bloodbank_id} style={styles.box}>
                <p><b>{b.name}</b></p>
                <p>📍 {b.address}, {b.city}</p>
                <p>📞 {b.mobile}</p>
              </div>
            ))
          )}
        </div>

        {/* EMERGENCY STATUS */}
        <div style={styles.section}>
          <h4>📌 Emergency Requests</h4>

          {emergencies.length === 0 ? (
            <p style={styles.muted}>No emergency requests</p>
          ) : (
            emergencies.map((e) => (
              <div key={e.request_id} style={styles.emergencyCard}>
                <div style={styles.rowBetween}>
                  <p><b>Blood Group:</b> {e.blood_group}</p>
                  <span
                    style={{
                      ...styles.statusBadge,
                      background:
                        e.status === "pending" ? "#fff3cd" : "#e8f5e9",
                      color:
                        e.status === "pending" ? "#856404" : "#2e7d32"
                    }}
                  >
                    {e.status}
                  </span>
                </div>

                {e.status === "pending" && (
                  <>
                    <button
                      style={styles.outlineBtn}
                      onClick={() => fetchNotifiedDonors(e.request_id)}
                    >
                      View Notified Donors
                    </button>

                    {(notifiedDonors[e.request_id] || []).length === 0 && (
                      <p style={styles.muted}>No donors notified yet</p>
                    )}

                    {(notifiedDonors[e.request_id] || []).map((d, i) => (
                      <div key={i} style={styles.donorCard}>
                        <p><b>👤 {d.name}</b></p>
                        <p>📞 {d.mobile}</p>
                        <p>📍 {d.distance_km} km</p>
                      </div>
                    ))}
                  </>
                )}

                {e.status === "accepted" && (
                  <>
                    <p><b>Donor:</b> {e.donor_name}</p>
                    <p><b>Mobile:</b> {e.donor_mobile}</p>

                    <button
                      style={styles.completeBtn}
                      onClick={() => completeDonation(e.request_id)}
                    >
                      Mark Donation Completed
                    </button>
                  </>
                )}
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
    width: 440,
    background: "#fff",
    padding: 25,
    borderRadius: 18,
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)"
  },
  title: { textAlign: "center", marginBottom: 20 },
  profile: { display: "flex", gap: 15, marginBottom: 20 },
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
  section: { marginBottom: 22 },
  select: { width: "100%", padding: 10, marginBottom: 10 },
  emergencyBtn: {
    width: "100%",
    padding: 12,
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: 8
  },
  emergencyCard: {
    border: "1px solid #e0e0e0",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 12,
    textTransform: "capitalize"
  },
  outlineBtn: {
    marginTop: 10,
    width: "100%",
    padding: 8,
    background: "#f5f5f5",
    border: "1px solid #ccc",
    borderRadius: 6
  },
  donorCard: {
    marginTop: 8,
    background: "#f9f9f9",
    padding: 10,
    borderRadius: 8
  },
  box: {
    border: "1px solid #ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8
  },
  completeBtn: {
    marginTop: 10,
    width: "100%",
    padding: 10,
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: 6
  },
  logout: {
    width: "100%",
    padding: 10,
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 8
  },
  muted: { color: "#777" },
  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff"
  }
};

const animationCSS = `
.fadeIn {
  animation: fadeIn 0.6s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default HospitalDashboard;
