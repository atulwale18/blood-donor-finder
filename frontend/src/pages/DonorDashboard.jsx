import React, { useEffect, useState } from "react";
import axios from "axios";

const DonorDashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setError("User not logged in");
      return;
    }

    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load user data");
      });
  }, []);

  if (error) {
    return <h3 style={{ padding: 20 }}>{error}</h3>;
  }

  if (!user) {
    return <h3 style={{ padding: 20 }}>Loading profile...</h3>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user.name}</h2>

      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>
      <p><b>Blood Group:</b> {user.blood_group}</p>
      <p><b>Gender:</b> {user.gender}</p>
      <p><b>Mobile:</b> {user.mobile}</p>
      <p><b>Age:</b> {user.age}</p>
      <p><b>Last Donation:</b> {user.last_donation_date}</p>
      <p><b>Location:</b> {user.latitude}, {user.longitude}</p>
    </div>
  );
};

export default DonorDashboard;
