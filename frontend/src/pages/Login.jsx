import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: email.trim(),
        password: password.trim()
      });

      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") {
         navigate("/admin-dashboard");
      } else if (res.data.role === "hospital") {
                navigate("/hospital-dashboard");
      } else {
              navigate("/donor-dashboard");
      }

    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="card3d">
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Login to continue</p>

        <input
          type="email"
          placeholder="Email address"
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

        <button style={styles.btn} onClick={handleLogin}>
          Login
        </button>

        <p style={styles.footerText}>
          Don’t have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>

      {/* Animation CSS */}
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
    padding: "35px 30px",
    background: "rgba(255,255,255,0.95)",
    borderRadius: 18,
    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
    textAlign: "center"
  },
  title: {
    marginBottom: 5,
    fontSize: 26
  },
  subtitle: {
    color: "#777",
    marginBottom: 25
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 14,
    outline: "none",
    transition: "0.3s"
  },
  btn: {
    width: "100%",
    padding: 12,
    background: "linear-gradient(135deg, #e53935, #b71c1c)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    cursor: "pointer",
    transition: "0.3s"
  },
  footerText: {
    marginTop: 18,
    fontSize: 14
  },
  link: {
    color: "#e53935",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

/* ================= 3D & ANIMATION ================= */

const animationCSS = `
.card3d {
  animation: fadeIn 0.8s ease-in-out;
  transform-style: preserve-3d;
}

.card3d:hover {
  transform: translateY(-6px) scale(1.02);
}

input:focus {
  border-color: #e53935;
  box-shadow: 0 0 8px rgba(229,57,53,0.4);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(229,57,53,0.5);
}

button:active {
  transform: scale(0.98);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export default Login;
