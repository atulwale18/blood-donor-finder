import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("donor");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleRegister = () => {
    alert("Registration successful (API will be added later)");
    navigate("/");
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      () => alert("Unable to fetch location")
    );
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
          <option value="bloodbank">Blood Bank</option>
        </select>

        {/* Common Fields */}
        <input style={styles.input} placeholder="Name" />
        <input style={styles.input} placeholder="Email ID" />
        <input style={styles.input} placeholder="Mobile Number" />
        <input style={styles.input} placeholder="Password" />

        {/* Donor Fields */}
        {role === "donor" && (
          <>
            <input style={styles.input} placeholder="Age" />

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={styles.input}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              style={styles.input}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <input style={styles.input} placeholder="Last Donation Date" />

            <input
              style={styles.input}
              placeholder="Latitude"
              value={latitude}
              readOnly
            />
            <input
              style={styles.input}
              placeholder="Longitude"
              value={longitude}
              readOnly
            />

            <button type="button" style={styles.locationBtn} onClick={getLocation}>
              Get Current Location
            </button>
          </>
        )}

        {/* Hospital Fields */}
        {role === "hospital" && (
          <>
            <input style={styles.input} placeholder="Hospital Name" />
            <input style={styles.input} placeholder="Hospital Location" />
          </>
        )}

        {/* Blood Bank Fields */}
        {role === "bloodbank" && (
          <>
            <input style={styles.input} placeholder="Blood Bank Name" />
            <input style={styles.input} placeholder="Blood Bank Location" />
          </>
        )}

        <button style={styles.button} onClick={handleRegister}>
          Sign Up
        </button>

        <p style={{ marginTop: "15px" }}>
          Already have an account?{" "}
          <span style={styles.login} onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

/* ===== STYLES ===== */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e53935",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "360px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
  locationBtn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#555",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginBottom: "10px",
  },
  login: {
    color: "#e53935",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Register;
