import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DonorDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [donor, setDonor] = useState(null);
  const [available, setAvailable] = useState(true);
  const [emergency, setEmergency] = useState(null);

  /* =========================
     FETCH EMERGENCY (FIXED)
  ========================= */
  const fetchEmergency = useCallback(() => {
    axios
      .get(`http://localhost:5000/api/emergency/donor/${userId}`)
      .then((res) => {
        if (res.data) {
          setEmergency(res.data);
        } else {
          setEmergency(null); // 🔥 IMPORTANT FIX
        }
      })
      .catch(() => {
        setEmergency(null);
      });
  }, [userId]);

  /* =========================
     LOAD DONOR PROFILE
  ========================= */
  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:5000/api/profile/donor/${userId}`)
      .then((res) => {
        setDonor(res.data);
        fetchEmergency();
      })
      .catch(() => alert("Failed to load donor data"));
  }, [userId, navigate, fetchEmergency]);

  /* =========================
     ACCEPT EMERGENCY
  ========================= */
  const handleAccept = () => {
    if (!emergency) return;

    axios
      .post("http://localhost:5000/api/emergency/accept", {
        request_id: emergency.request_id,
        donor_id: userId
      })
      .then(() => {
        alert("Emergency request accepted 🙏");
        setAvailable(false);
        setEmergency(null);
      })
      .catch(() => alert("Failed to accept request"));
  };

  /* =========================
     DECLINE EMERGENCY
  ========================= */
  const handleDecline = () => {
    if (!emergency) return;

    axios
      .post("http://localhost:5000/api/emergency/decline", {
        request_id: emergency.request_id
      })
      .then(() => {
        alert("Request declined");
        setEmergency(null);
      })
      .catch(() => alert("Failed to decline request"));
  };

  if (!donor) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fadeIn">
        <h2 style={styles.title}>🩸 Donor Dashboard</h2>

        {/* PROFILE */}
        <div style={styles.profile}>
          <div style={styles.avatar}>
            {donor.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{donor.name}</h3>
            <p style={{ color: "#666" }}>
              {donor.email || "Registered Donor"}
            </p>
          </div>
        </div>

        {/* EMERGENCY CARD */}
        {emergency && (
          <div style={styles.emergencyCard}>
            <h3 style={styles.emergencyTitle}>🚨 Emergency Blood Request</h3>
            <p><b>Blood Group:</b> {emergency.blood_group}</p>
            <p><b>Hospital:</b> {emergency.hospital_name}</p>
            <p><b>Distance:</b> {emergency.distance_km} km</p>
            <p><b>Requested:</b> {emergency.created_at}</p>

            <div style={styles.emergencyBtns}>
              <button style={styles.acceptBtn} onClick={handleAccept}>
                Accept
              </button>
              <button style={styles.declineBtn} onClick={handleDecline}>
                Decline
              </button>
            </div>
          </div>
        )}

        {/* INFO GRID */}
        <div style={styles.grid}>
          <div style={styles.box}>
            <p className="label">Blood Group</p>
            <h4>{donor.blood_group}</h4>
          </div>
          <div style={styles.box}>
            <p className="label">Mobile</p>
            <h4>{donor.mobile}</h4>
          </div>
          <div style={styles.box}>
            <p className="label">Gender</p>
            <h4>{donor.gender}</h4>
          </div>
          <div style={styles.box}>
            <p className="label">Last Donation</p>
            <h4>{donor.last_donation_date || "Not yet"}</h4>
          </div>
        </div>

        {/* AVAILABILITY */}
        <div style={styles.btnRow}>
          <button
            style={{
              ...styles.availBtn,
              background: available ? "#2e7d32" : "#ccc"
            }}
            onClick={() => setAvailable(true)}
          >
            ✔ Available to Donate
          </button>

          <button
            style={{
              ...styles.notAvailBtn,
              background: !available ? "#000" : "#ccc"
            }}
            onClick={() => setAvailable(false)}
          >
            ✖ Not Available
          </button>
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
    background: "linear-gradient(135deg, #b71c1c, #e53935)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: 380,
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
    background: "#c62828",
    color: "#fff",
    fontSize: 26,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  emergencyCard: {
    background: "#fff3f3",
    border: "1px solid #ffcdd2",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20
  },
  emergencyTitle: { color: "#c62828", marginBottom: 10 },
  emergencyBtns: { display: "flex", gap: 10, marginTop: 10 },
  acceptBtn: {
    flex: 1,
    padding: 8,
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  declineBtn: {
    flex: 1,
    padding: 8,
    background: "#b71c1c",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 20
  },
  box: { background: "#f5f5f5", padding: 12, borderRadius: 10 },
  btnRow: { display: "flex", gap: 10, marginBottom: 15 },
  availBtn: { flex: 1, padding: 10, border: "none", borderRadius: 8, color: "#fff" },
  notAvailBtn: { flex: 1, padding: 10, border: "none", borderRadius: 8, color: "#fff" },
  logout: {
    width: "100%",
    padding: 10,
    background: "#d32f2f",
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
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.label {
  font-size: 12px;
  color: #777;
}
`;

export default DonorDashboard;
