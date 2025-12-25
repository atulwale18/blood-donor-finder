import React from "react";
import { useNavigate } from "react-router-dom";

const AdminBloodBanks = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Blood Banks</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Blood Bank Name</th>
            <th>Location</th>
            <th>Available Blood Groups</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Red Cross Blood Bank</td>
            <td>Sangli</td>
            <td>A+, O+, B+</td>
          </tr>
        </tbody>
      </table>

      <button onClick={() => navigate("/admin-dashboard")}>
        Back
      </button>
    </div>
  );
};

export default AdminBloodBanks;
