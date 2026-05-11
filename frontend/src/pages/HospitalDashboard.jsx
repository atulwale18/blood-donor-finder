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
      .get(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/hospital/profile/${userId}`)
      .then((res) => {
        setHospital(res.data);

        return axios.get(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/bloodbank/nearby`, {
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
        `${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/emergency/hospital/${hospital.hospital_id}`
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
      .get(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/emergency/notified/${requestId}`)
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
      await axios.post(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/emergency/create`, {
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
      await axios.post(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/emergency/complete`, {
        request_id
      });

      alert("Donation completed ✅");
      fetchEmergencies();
    } catch {
      alert("Failed to complete donation");
    }
  };

  /* ================= MODERN LOADING STATE ================= */
  if (!hospital) {
    return (
      <div style={{ ...styles.page, flexDirection: 'column', gap: 20 }}>
        <div className="spinner" style={styles.spinner}></div>
        <div style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "600", letterSpacing: "1px" }}>
          Loading Hospital Portal...
        </div>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
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
          <div style={{ flex: 1 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0', fontSize: '1.4rem', color: '#1a1a1a' }}>
              {hospital.hospital_name}
              <span 
                onClick={() => navigate("/profile-update")} 
                style={{ cursor: 'pointer', fontSize: '18px', opacity: 0.7, transition: '0.2s' }}
                title="Update Profile & Settings"
                
                
              >
                ⚙️
              </span>
            </h3>
            <p style={{ margin: 0, color: '#555', fontWeight: '500' }}>📞 {hospital.mobile}</p>
          </div>
        </div>

        {/* EMERGENCY REQUEST */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>🚨 Create Emergency Request</h4>

          <div style={{ display: 'flex', gap: '10px' }}>
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

            <button style={styles.emergencyBtn} onClick={sendEmergency}
                    
                    >
              Broadcast Request
            </button>
          </div>
        </div>

        {/* 🏦 NEARBY BLOOD BANKS */}
        <div style={styles.section}>
          <h4 style={{...styles.sectionTitle, color: '#1565c0'}}>🏦 Nearby Blood Banks</h4>

          {bloodBanks.length === 0 ? (
            <div style={styles.warning}>
              ⚠️ No blood banks found within {MAX_DISTANCE_KM} km of your location.
            </div>
          ) : (
            bloodBanks.map((b, index) => {
              const isNearest = index === 0;

              return (
                <div
                  key={b.bloodbank_id}
                  style={{
                    ...styles.bloodBankCard,
                    borderLeft: isNearest
                      ? "5px solid #2e7d32"
                      : "5px solid transparent"
                  }}
                >
                  <div>
                    <b style={{ fontSize: '1.1rem', color: '#2d3748' }}>
                      {b.name}
                      {isNearest && (
                        <span style={styles.nearestBadge}>★ NEAREST</span>
                      )}
                    </b>

                    <p style={styles.muted}>
                      📍 {b.address}, {b.city}
                    </p>

                    <p style={styles.distance}>
                      📏 {b.distance_km != null ? Number(b.distance_km).toFixed(2) : (b.distance != null ? Number(b.distance).toFixed(2) : "N/A")} km away
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <a href={`tel:${b.mobile}`} style={styles.callBtn}>
                      📞 Call
                    </a>

                    <a href={`https://wa.me/91${b.mobile}`} target="_blank" rel="noreferrer" style={{...styles.callBtn, background: '#25D366', color: '#fff'}}>
                      💬 WhatsApp
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
          <h4 style={styles.sectionTitle}>📌 Live Emergency Requests</h4>

          {emergencies.length === 0 ? (
            <div style={{...styles.warning, background: '#f5f5f5', color: '#757575', textAlign: 'center'}}>
              No active emergency requests found.
            </div>
          ) : (
            emergencies.map((e) => (
              <div
                key={e.request_id}
                className="emergencyCard"
                style={{
                  ...styles.emergencyCard,
                  animation: "slideUp 0.4s ease",
                  borderLeft: e.status === "completed" ? "5px solid #2e7d32" : (e.status === "accepted" ? "5px solid #f57c00" : "5px solid #d32f2f")
                }}
              >
                <div style={styles.rowBetween}>
                  <div style={{ display: "flex", gap: 8, alignItems: 'center' }}>
                    <span style={styles.dropIcon}>🩸</span>
                    <b style={{ color: '#333' }}>Blood Group: <span style={{color: '#d32f2f', fontSize: '1.1rem'}}>{e.blood_group}</span></b>
                  </div>

                  {/* 🟢🟡🔴 STATUS BADGES */}
                  <span
                    style={{
                      ...styles.statusBadge,
                      background: 
                        e.status === "pending" ? "rgba(244, 67, 54, 0.15)" : 
                        e.status === "accepted" ? "rgba(255, 152, 0, 0.15)" : "rgba(76, 175, 80, 0.15)",
                      color: 
                        e.status === "pending" ? "#d32f2f" : 
                        e.status === "accepted" ? "#f57c00" : "#2e7d32",
                      border: 
                        e.status === "pending" ? "1px solid rgba(244, 67, 54, 0.3)" : 
                        e.status === "accepted" ? "1px solid rgba(255, 152, 0, 0.3)" : "1px solid rgba(76, 175, 80, 0.3)"
                    }}
                  >
                    {e.status === "pending" ? "🔴 PENDING" : e.status === "accepted" ? "🟡 ACCEPTED" : "🟢 COMPLETED"}
                  </span>
                </div>

                {e.status === "pending" && (
                  <>
                    <button
                      style={styles.outlineBtn}
                      onClick={() => fetchNotifiedDonors(e.request_id)}
                      
                      
                    >
                      📡 View Notified Donors Around You
                    </button>

                    {(notifiedDonors[e.request_id] || []).length === 0 && notifiedDonors[e.request_id] !== undefined && (
                      <p style={styles.muted}>No donors found in 15km range.</p>
                    )}

                    {(notifiedDonors[e.request_id] || []).map((d, i) => (
                      <div key={i} style={styles.donorCard}>
                        <p style={{ margin: '0 0 5px 0', color: '#333' }}><b>👤 {d.name}</b></p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#555', alignItems: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>📞 {d.mobile}
                            <a href={`https://wa.me/91${d.mobile}`} target="_blank" rel="noreferrer" style={{color: '#25D366', textDecoration: 'none', fontSize: '1.2rem'}} title="Message on WhatsApp">💬</a>
                          </span>
                          <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>🩸 HB: {d.hemoglobin ? `${d.hemoglobin} g/dL` : 'N/A'}</span>
                          <span style={{ color: '#1565c0', fontWeight: 'bold' }}>📍 {d.distance_km != null ? Number(d.distance_km).toFixed(2) : (d.distance != null ? Number(d.distance).toFixed(2) : 'N/A')} km</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {e.status === "accepted" && (
                  <div style={{ marginTop: '15px', padding: '15px', background: '#fff8e1', borderRadius: '12px', border: '1px solid #ffe082' }}>
                    <h5 style={{ margin: '0 0 10px 0', color: '#f57f17' }}>⚡ Fast Response Received!</h5>
                    <p style={{ margin: '5px 0', color: '#424242' }}><b>Donor:</b> {e.donor_name}</p>
                    <p style={{ margin: '5px 0', color: '#424242' }}><b>Contact:</b> {e.donor_mobile} 
                      <a href={`https://wa.me/91${e.donor_mobile}`} target="_blank" rel="noreferrer" style={{marginLeft: '10px', color: '#25D366', textDecoration: 'none', fontSize: '1.1rem'}} title="Message Donor on WhatsApp">💬 WhatsApp</a>
                    </p>

                    <button
                      style={styles.completeBtn}
                      onClick={() => completeDonation(e.request_id)}
                      
                      
                    >
                      ✅ Mark Donation as Completed
                    </button>
                  </div>
                )}
                
                {e.status === "completed" && (
                  <p style={{ marginTop: '10px', color: '#2e7d32', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    This emergency request has been successfully closed.
                  </p>
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
          Logout & Exit Dashboard
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
    /* Premium UX gradient with high-quality real-life medical/doctor photography overlay */
    background: "linear-gradient(135deg, rgba(10,25,47,0.93) 0%, rgba(23,42,69,0.88) 50%, rgba(13,71,161,0.82) 100%), url('https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2000&auto=format&fit=crop') center/cover fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid rgba(255,255,255,0.2)",
    borderTop: "6px solid #4fc3f7",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  card: {
    /* Mobile responsive max-width */
    width: "100%",
    maxWidth: "520px",
    /* Premium Glassmorphism */
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(12px)",
    padding: "35px",
    borderRadius: "24px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
    transition: "transform 0.3s ease"
  },
  title: { 
    textAlign: "center", 
    marginBottom: "30px",
    color: "#0d47a1",
    fontWeight: "800",
    fontSize: "1.8rem"
  },
  sectionTitle: {
    margin: "0 0 15px 0",
    color: "#d32f2f",
    fontSize: "1.2rem",
    borderBottom: "2px solid #eee",
    paddingBottom: "10px"
  },
  profile: { display: "flex", gap: "20px", marginBottom: "30px", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "20px" },
  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1976d2, #0d47a1)",
    color: "#fff",
    fontSize: "30px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 15px rgba(13, 71, 161, 0.3)"
  },
  section: { marginBottom: "30px" },
  select: { 
    flex: 1, 
    padding: "14px", 
    borderRadius: "12px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    background: "#f9f9f9",
    outline: "none"
  },
  emergencyBtn: {
    flex: 2,
    padding: "14px",
    background: "linear-gradient(135deg, #e53935, #c62828)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 15px rgba(211, 47, 47, 0.4)"
  },
  bloodBankCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderRadius: "14px",
    background: "#f8f9fa",
    marginBottom: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
  },
  nearestBadge: {
    marginLeft: "10px",
    fontSize: "0.75rem",
    background: "#2e7d32",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "20px",
    verticalAlign: "middle"
  },
  callBtn: {
    background: "#2e7d32",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "bold",
    textAlign: "center",
    transition: "background 0.2s ease"
  },
  mapBtn: {
    background: "#1565c0",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "bold",
    textAlign: "center",
    transition: "background 0.2s ease"
  },
  distance: {
    fontSize: "0.85rem",
    color: "#666",
    marginTop: "6px",
    fontWeight: "500"
  },
  warning: {
    color: "#b71c1c",
    background: "rgba(211, 47, 47, 0.1)",
    padding: "15px",
    borderRadius: "12px",
    fontSize: "0.95rem",
    fontWeight: "bold"
  },
  emergencyCard: {
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    background: "#fff",
    boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease"
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  },
  statusBadge: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    letterSpacing: "0.5px"
  },
  outlineBtn: {
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    background: "#f5f5f5",
    color: "#424242",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s ease"
  },
  donorCard: {
    marginTop: "12px",
    background: "#fafafa",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #eee"
  },
  completeBtn: {
    marginTop: "15px",
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #43a047, #2e7d32)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "1.05rem",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 15px rgba(46, 125, 50, 0.4)"
  },
  logout: {
    width: "100%",
    padding: "16px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "background 0.2s ease",
    marginTop: "10px"
  },
  muted: { color: "#757575", margin: "5px 0", fontSize: "0.9rem" },
  dropIcon: { fontSize: "24px" }
};

const animationCSS = `
.fadeIn { animation: fadeIn 0.5s ease-out forwards; }
.emergencyCard:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default HospitalDashboard;
