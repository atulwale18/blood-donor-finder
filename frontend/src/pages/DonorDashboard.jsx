import React from "react";
import { useNavigate } from "react-router-dom";

const DonorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Donor Dashboard</h2>
        <button style={styles.logout} onClick={() => navigate("/")}>
          Logout
        </button>
      </div>

      <div style={styles.card}>
        <h3>Profile Details</h3>

        <p><strong>Name:</strong> Atul Shivaling Wale</p>
        <p><strong>Email:</strong> atulwale4@gmail.com</p>
        <p><strong>Mobile:</strong> 7820946531</p>
        <p><strong>Gender:</strong> Male</p>
        <p><strong>Age:</strong> 22</p>

        <div style={styles.bloodGroup}>
          Blood Group: <strong>AB+</strong>
        </div>

        <p><strong>Last Donation:</strong> Not Available</p>
        <p><strong>Location:</strong> 16.2613 , 73.7126</p>
      </div>

      <div style={styles.statusCard}>
        <h3>Donation Status</h3>
        <p style={{ color: "green", fontWeight: "bold" }}>
          Available for Donation
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  header: {
    backgroundColor: "#e53935",
    color: "#fff",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "8px",
  },
  logout: {
    backgroundColor: "#fff",
    color: "#e53935",
    border: "none",
    padding: "8px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    marginTop: "20px",
    borderRadius: "8px",
  },
  bloodGroup: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#e53935",
    color: "#fff",
    width: "fit-content",
    borderRadius: "5px",
    fontWeight: "bold",
  },
  statusCard: {
    backgroundColor: "#fff",
    padding: "20px",
    marginTop: "20px",
    borderRadius: "8px",
  },
};

export default DonorDashboard;
