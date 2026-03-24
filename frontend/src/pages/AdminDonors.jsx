import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDonors = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Donors</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Blood Group</th>
            <th>Gender</th>
            <th>Mobile</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Atul Wale</td>
            <td>atul@gmail.com</td>
            <td>AB+</td>
            <td>Male</td>
            <td>7820946531</td>
          </tr>
        </tbody>
      </table>

      <button onClick={() => navigate("/admin-dashboard")}>
        Back
      </button>
    </div>
  );
};

export default AdminDonors;
