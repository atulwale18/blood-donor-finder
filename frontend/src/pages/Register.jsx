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
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      () => alert("Location permission denied")
    );
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        mobile: form.mobile,
        age: form.age,
        gender: form.gender.toLowerCase(),
        blood_group: form.blood_group.toUpperCase(),
        last_donation_date: form.last_donation_date,
        latitude: form.latitude,
        longitude: form.longitude,

        // 🔥 IMPORTANT FIX
        role: form.role === "donor" ? "donor" : "recipient"
      });

      alert("Registration successful");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Register</h2>

        <select name="role" onChange={handleChange} style={styles.input}>
          <option value="donor">Donor</option>
          <option value="hospital">Hospital</option>
          <option value="bloodbank">Blood Bank</option>
        </select>

        <input name="name" placeholder="Full Name" onChange={handleChange} style={styles.input} />
        <input name="email" placeholder="Email" onChange={handleChange} style={styles.input} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} style={styles.input} />
        <input name="mobile" placeholder="Mobile Number" onChange={handleChange} style={styles.input} />
        <input name="age" placeholder="Age" onChange={handleChange} style={styles.input} />

        <select name="gender" onChange={handleChange} style={styles.input}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <select name="blood_group" onChange={handleChange} style={styles.input}>
          <option value="">Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <input type="date" name="last_donation_date" onChange={handleChange} style={styles.input} />

        <input placeholder="Latitude" value={form.latitude} readOnly style={styles.input} />
        <input placeholder="Longitude" value={form.longitude} readOnly style={styles.input} />

        <button onClick={getLocation} style={styles.grayBtn}>
          Get Current Location
        </button>

        <button onClick={handleSubmit} style={styles.redBtn}>
          Sign Up
        </button>

        <p style={styles.link} onClick={() => navigate("/")}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#e53935"
  },
  card: {
    background: "#fff",
    padding: 25,
    width: 360,
    borderRadius: 10
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "6px 0"
  },
  grayBtn: {
    width: "100%",
    padding: 10,
    marginTop: 6,
    background: "#555",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },
  redBtn: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    background: "#e53935",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },
  link: {
    marginTop: 12,
    color: "#e53935",
    textAlign: "center",
    cursor: "pointer"
  }
};

export default Register;
