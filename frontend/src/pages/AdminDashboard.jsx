import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
        <button onClick={() => navigate("/admin-donors")}>
          View Donors
        </button>

        <button onClick={() => navigate("/admin-hospitals")}>
          View Hospitals
        </button>

        <button onClick={() => navigate("/admin-bloodbanks")}>
          View Blood Banks
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <p>Total Donors: 120</p>
      <p>Total Hospitals: 15</p>
      <p>Total Blood Banks: 8</p>
      <p>Active Emergency Requests: 3</p>

      <button style={{ marginTop: "20px" }} onClick={() => navigate("/")}>
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
