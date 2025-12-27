import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("donor");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    age: "",
    gender: "",
    blood_group: "",
    last_donation_date: "",
    latitude: "",
    longitude: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm({
        ...form,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });
    });
  };

  // ✅ THIS WAS MISSING AND BROKEN
  const handleRegister = async () => {
    try {
      const finalRole = role === "donor" ? "donor" : "recipient";

      await axios.post("http://localhost:5000/api/auth/register", {
        ...form,
        role: finalRole
      });

      alert("Registration successful");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Register</h2>

        {/* Role */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.input}
        >
          <option value="donor">Donor</option>
          <option value="hospital">Hospital</option>
        </select>

        {/* Common fields */}
        <input
          name="name"
          placeholder={role === "hospital" ? "Hospital Name" : "Name"}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="mobile"
          placeholder="Mobile Number"
          onChange={handleChange}
          style={styles.input}
        />

        {/* Donor-only fields */}
        {role === "donor" && (
          <>
            <input
              name="age"
              placeholder="Age"
              onChange={handleChange}
              style={styles.input}
            />

            <select
              name="gender"
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <select
              name="blood_group"
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Blood Group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>

            <input
              type="date"
              name="last_donation_date"
              onChange={handleChange}
              style={styles.input}
            />
          </>
        )}

        {/* Location */}
        <input
          name="latitude"
          placeholder="Latitude"
          value={form.latitude}
          readOnly
          style={styles.input}
        />

        <input
          name="longitude"
          placeholder="Longitude"
          value={form.longitude}
          readOnly
          style={styles.input}
        />

        <button onClick={getLocation} style={styles.grayBtn}>
          Get Current Location
        </button>

        <button onClick={handleRegister} style={styles.btn}>
          Sign Up
        </button>

        <p style={{ marginTop: 10 }}>
          Already have an account?{" "}
          <span
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#e53935"
  },
  card: {
    width: 360,
    background: "#fff",
    padding: 20,
    borderRadius: 8
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 8
  },
  btn: {
    width: "100%",
    padding: 10,
    background: "#e53935",
    color: "#fff",
    border: "none"
  },
  grayBtn: {
    width: "100%",
    padding: 8,
    background: "#555",
    color: "#fff",
    border: "none",
    marginBottom: 10
  }
};

export default Register;
