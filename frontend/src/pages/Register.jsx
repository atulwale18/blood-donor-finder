import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "donor",
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    blood_group: "",
    mobile: "",
    health_status: "",
    last_donation_date: "",
    latitude: "",
    longitude: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registration successful");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Register</h2>

        <select name="role" onChange={handleChange}>
          <option value="donor">Donor</option>
          <option value="hospital">Hospital</option>
          <option value="bloodbank">Blood Bank</option>
        </select>

        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <input name="mobile" placeholder="Mobile" onChange={handleChange} />
        <input name="age" placeholder="Age" onChange={handleChange} />

        <select name="gender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <select name="blood_group" onChange={handleChange}>
          <option value="">Blood Group</option>
          <option>A+</option><option>A-</option>
          <option>B+</option><option>B-</option>
          <option>AB+</option><option>AB-</option>
          <option>O+</option><option>O-</option>
        </select>

        <input name="health_status" placeholder="Health Status" onChange={handleChange} />
        <input name="last_donation_date" type="date" onChange={handleChange} />
        <input name="latitude" placeholder="Latitude" onChange={handleChange} />
        <input name="longitude" placeholder="Longitude" onChange={handleChange} />

        <button onClick={handleSubmit} style={styles.button}>Sign Up</button>

        <p onClick={() => navigate("/")} style={styles.link}>Already have account? Login</p>
      </div>
    </div>
  );
};

const styles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#e53935" },
  card: { background: "#fff", padding: 20, width: 350, borderRadius: 10 },
  button: { width: "100%", padding: 10, marginTop: 10, background: "#e53935", color: "#fff", border: "none" },
  link: { color: "#e53935", marginTop: 10, cursor: "pointer", textAlign: "center" }
};

export default Register;
