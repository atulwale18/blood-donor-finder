import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:5000/api/donor/${userId}`)
      .then((res) => {
        setDonor(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId, navigate]);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  if (!donor) {
    return <h2 style={{ textAlign: "center" }}>No data found</h2>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🩸 Donor Dashboard</h2>

        <div style={styles.profileRow}>
          <div style={styles.avatar}>
            {donor.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{donor.name}</h3>
            <p style={{ color: "#555" }}>{donor.email}</p>
          </div>
        </div>

        <div style={styles.infoGrid}>
          <Info label="Blood Group" value={donor.blood_group} />
          <Info label="Mobile" value={donor.mobile} />
          <Info label="Gender" value={donor.gender} />
          <Info
            label="Last Donation"
            value={
              donor.last_donation_date
                ? donor.last_donation_date.split("T")[0]
                : "Not yet"
            }
          />
        </div>

        <div style={styles.actions}>
          <button style={styles.acceptBtn}>✔ Available to Donate</button>
          <button style={styles.rejectBtn}>✖ Not Available</button>
        </div>

        <button
          style={styles.logoutBtn}
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div style={styles.infoBox}>
    <p style={styles.infoLabel}>{label}</p>
    <p style={styles.infoValue}>{value}</p>
  </div>
);

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e53935, #b71c1c)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: 420,
    background: "#fff",
    padding: 25,
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
  },
  heading: {
    textAlign: "center",
    marginBottom: 20
  },
  profileRow: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginBottom: 20
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "#e53935",
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 20
  },
  infoBox: {
    background: "#f5f5f5",
    padding: 10,
    borderRadius: 8
  },
  infoLabel: {
    fontSize: 12,
    color: "#777"
  },
  infoValue: {
    fontWeight: "bold"
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15
  },
  acceptBtn: {
    flex: 1,
    marginRight: 5,
    padding: 10,
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  rejectBtn: {
    flex: 1,
    marginLeft: 5,
    padding: 10,
    background: "#616161",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  logoutBtn: {
    width: "100%",
    padding: 10,
    background: "#e53935",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  }
};

export default DonorDashboard;
