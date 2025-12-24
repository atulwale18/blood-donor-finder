import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "donor") {
      alert("Login as Donor");
    } else if (username === "hospital") {
      alert("Login as Hospital");
    } else if (username === "admin") {
      alert("Login as Admin");
    } else {
      alert("Invalid user");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Blood Donor Finder</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        <p style={{ marginTop: "15px" }}>
          Don’t have an account?{" "}
          <span style={styles.signup} onClick={() => alert("Go to Sign Up")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

/* ===== STYLES (DO NOT MOVE) ===== */
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
    width: "320px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  signup: {
    color: "#e53935",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;
