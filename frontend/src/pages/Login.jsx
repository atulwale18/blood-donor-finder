import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email,
        password: password
      });

      // ✅ SAVE LOGGED-IN USER INFO
      localStorage.setItem("user_id", res.data.user.user_id);
      localStorage.setItem("role", res.data.user.role);

      const role = res.data.user.role;

      if (role === "donor") navigate("/donor");
      else navigate("/hospital");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.btn}>
          Login
        </button>

        {/* ✅ SIGN UP OPTION */}
        <p
          style={styles.signupText}
          onClick={() => navigate("/register")}
        >
          Don’t have an account? <span style={styles.signupLink}>Sign up</span>
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
    width: 320,
    padding: 20,
    background: "#fff",
    borderRadius: 8
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "6px 0"
  },
  btn: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    background: "#e53935",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },
  signupText: {
    marginTop: 12,
    textAlign: "center",
    cursor: "pointer"
  },
  signupLink: {
    color: "#e53935",
    fontWeight: "bold"
  }
};

export default Login;
