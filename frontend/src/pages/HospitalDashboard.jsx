import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HospitalDashboard = () => {
  const navigate = useNavigate();

  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("");
  const [status, setStatus] = useState("");

  const handleEmergencyRequest = () => {
    setStatus("Emergency request sent to nearby donors");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Hospital Dashboard</h2>
        <button style={styles.logout} onClick={() => navigate("/")}>
          Logout
        </button>
      </div>

      <div style={styles.card}>
        <h3>Hospital Details</h3>
        <p><strong>Hospital Name:</strong> City Care Hospital</p>
        <p><strong>Email:</strong> citycare@hospital.com</p>
        <p><strong>Location:</strong> Sangli, Maharashtra</p>
      </div>

      <div style={styles.card}>
        <h3>Emergency Blood Request</h3>

        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <input
          style={styles.input}
          placeholder="Required Units"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
        />

        <button style={styles.emergencyBtn} onClick={handleEmergencyRequest}>
          Raise Emergency Request
        </button>

        {status && (
          <p style={{ marginTop: "15px", color: "green", fontWeight: "bold" }}>
            {status}
          </p>
        )}
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
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
  },
  emergencyBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold",
  },
};

export default HospitalDashboard;
