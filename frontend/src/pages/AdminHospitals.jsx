import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHospitals = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Hospitals</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Hospital Name</th>
            <th>Email</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>City Care Hospital</td>
            <td>citycare@hospital.com</td>
            <td>Sangli</td>
          </tr>
        </tbody>
      </table>

      <button onClick={() => navigate("/admin-dashboard")}>
        Back
      </button>
    </div>
  );
};

export default AdminHospitals;
