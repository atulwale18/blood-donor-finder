import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MAX_DISTANCE_KM = 15;

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

        {/* 🏦 NEARBY BLOOD BANKS */}
        <div style={styles.section}>
          <h4>🏦 Nearby Blood Banks</h4>

          {bloodBanks.length === 0 ? (
            <p style={styles.warning}>
              No blood banks within {MAX_DISTANCE_KM} km of your location
            </p>
          ) : (
            bloodBanks.map((b, index) => {
              const isNearest = index === 0;

              return (
                <div
                  key={b.bloodbank_id}
                  style={{
                    ...styles.bloodBankCard,
                    border: isNearest
                      ? "2px solid #2e7d32"
                      : "1px solid #ddd"
                  }}
                >
                  <div>
                    <b>
                      {b.name}
                      {isNearest && (
                        <span style={styles.nearestBadge}> NEAREST</span>
                      )}
                    </b>

                    <p style={styles.muted}>
                      📍 {b.address}, {b.city}
                    </p>

                    <p style={styles.distance}>
                      📏 {(b.distance_km ?? b.distance)?.toFixed?.(2) ?? "N/A"} km away
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <a href={`tel:${b.mobile}`} style={styles.callBtn}>
                      📞 Call
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${b.latitude},${b.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.mapBtn}
                    >
                      🗺️ Map
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* EMERGENCY REQUESTS */}
        <div style={styles.section}>
          <h4>📌 Emergency Requests</h4>

          {emergencies.length === 0 ? (
            <p style={styles.muted}>No emergency requests</p>
          ) : (
            emergencies.map((e) => (
              <div
                key={e.request_id}
                className="emergencyCard"
                style={{
                  ...styles.emergencyCard,
                  animation: "slideUp 0.4s ease"
                }}
              >
                <div style={styles.rowBetween}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={styles.dropIcon}>🩸</span>
                    <b>Emergency Request</b>
                  </div>

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

                <div style={styles.bloodGroupCircle}>{e.blood_group}</div>

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
                        <p>📍 {(d.distance_km ?? d.distance)?.toFixed?.(2)} km</p>
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
    width: 480,
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
  bloodBankCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    background: "#f9f9f9",
    marginBottom: 10
  },
  nearestBadge: {
    marginLeft: 6,
    fontSize: 10,
    background: "#2e7d32",
    color: "#fff",
    padding: "2px 6px",
    borderRadius: 6
  },
  callBtn: {
    background: "#2e7d32",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 6,
    textDecoration: "none",
    fontSize: 14
  },
  mapBtn: {
    background: "#1565c0",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 6,
    textDecoration: "none",
    fontSize: 14
  },
  distance: {
    fontSize: 12,
    color: "#555",
    marginTop: 4
  },
  warning: {
    color: "#b71c1c",
    background: "#fdecea",
    padding: 10,
    borderRadius: 8,
    fontSize: 13
  },
  emergencyCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    background: "linear-gradient(145deg, #ffffff, #f4f6f8)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
    transition: "0.3s"
  },
  bloodGroupCircle: {
    width: 55,
    height: 55,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #e53935, #d32f2f)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    margin: "10px auto"
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
  },
  dropIcon: { fontSize: 20 }
};

const animationCSS = `
.fadeIn {
  animation: fadeIn 0.6s ease-in-out;
}
.emergencyCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(0,0,0,0.18);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default HospitalDashboard;
