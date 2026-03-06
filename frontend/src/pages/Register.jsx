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
    longitude: "",
    address: "",
    city: "",
    district: "",
    weight: "",
    hemoglobin: "",
    recent_surgery: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6)
        });
      },
      () => alert("Location permission denied")
    );
  };

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.mobile) {
      alert("Please fill required fields");
      return;
    }

    // Donor eligibility validation
    if (role === "donor") {
      if (form.age < 18 || form.age > 65) {
        alert("Age must be between 18 and 65");
        return;
      }

      if (form.weight < 50) {
        alert("Weight must be at least 50 kg to donate blood");
        return;
      }

      if (form.hemoglobin < 12.5) {
        alert("Hemoglobin must be at least 12.5 g/dL");
        return;
      }

      if (form.recent_surgery === "yes") {
        alert("You cannot donate blood due to recent surgery");
        return;
      }
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        ...form,
        role
      });

      alert("Registration successful");
      navigate("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="card3d">
        <h2 style={styles.title}>Create Account ✨</h2>

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
          placeholder={role === "hospital" ? "Hospital Name" : "Full Name"}
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

        {/* Address fields */}
        <input
          name="address"
          placeholder="Address / Village / Area"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="district"
          placeholder="District"
          onChange={handleChange}
          style={styles.input}
        />

        {/* Donor-only */}
        {role === "donor" && (
          <div className="fadeSection">
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

            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="number"
              step="0.1"
              name="hemoglobin"
              placeholder="Hemoglobin (g/dL)"
              onChange={handleChange}
              style={styles.input}
            />

            <select
              name="recent_surgery"
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Recent Surgery?</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        )}

        {/* Location (MANUAL + AUTO) */}
        <input
          type="number"
          step="any"
          name="latitude"
          placeholder="Latitude (optional)"
          value={form.latitude}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="number"
          step="any"
          name="longitude"
          placeholder="Longitude (optional)"
          value={form.longitude}
          onChange={handleChange}
          style={styles.input}
        />

        <button onClick={getLocation} style={styles.locationBtn}>
          📍 Use My Current Location (optional)
        </button>

        <button onClick={handleRegister} style={styles.registerBtn}>
          Sign Up
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>

      <style>{animationCSS}</style>
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #b31217, #e52d27)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: 380,
    padding: 30,
    background: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
    textAlign: "center"
  },
  title: {
    marginBottom: 20
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
    transition: "0.3s"
  },
  locationBtn: {
    width: "100%",
    padding: 10,
    background: "#555",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    marginBottom: 12
  },
  registerBtn: {
    width: "100%",
    padding: 12,
    background: "linear-gradient(135deg, #e53935, #b71c1c)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 15
  },
  footer: {
    marginTop: 18,
    fontSize: 14
  },
  link: {
    color: "#e53935",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

const animationCSS = `
.card3d {
  animation: fadeIn 0.8s ease-in-out;
  transform-style: preserve-3d;
}
.card3d:hover {
  transform: translateY(-6px) scale(1.02);
}
input:focus, select:focus {
  border-color: #e53935;
  box-shadow: 0 0 8px rgba(229,57,53,0.4);
}
.fadeSection {
  animation: slideDown 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default Register;