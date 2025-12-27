import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DonorDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) return <h3 style={{ padding: 20 }}>Loading...</h3>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2>Donor Dashboard</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div style={styles.card}>
        <h3>{user.name}</h3>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Blood Group:</b> {user.blood_group}</p>
        <p><b>Gender:</b> {user.gender}</p>
        <p><b>Mobile:</b> {user.mobile}</p>
        <p>
          <b>Location:</b>{" "}
          {user.latitude ? `${user.latitude}, ${user.longitude}` : "Not set"}
        </p>
      </div>

      {/* Emergency Request Section */}
      <div style={styles.card}>
        <h3>Emergency Blood Request</h3>
        <p>
          <b>Blood Group Needed:</b> {user.blood_group}
        </p>
        <p>
          <b>Hospital:</b> City Hospital, Sangli
        </p>

        <div style={styles.btnGroup}>
          <button style={styles.acceptBtn}>Accept</button>
          <button style={styles.rejectBtn}>Reject</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: 20
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  logoutBtn: {
    background: "#444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    cursor: "pointer"
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  btnGroup: {
    display: "flex",
    gap: 10,
    marginTop: 10
  },
  acceptBtn: {
    flex: 1,
    padding: 10,
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },
  rejectBtn: {
    flex: 1,
    padding: 10,
    background: "#c62828",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  }
};

export default DonorDashboard;
