import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ===== CAPTCHA STATE ===== */
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  /* ===== UX STATES ===== */
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* ===== SECURITY: LOGIN ATTEMPTS ===== */
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  const startLockout = (seconds) => {
    setIsLocked(true);
    setLockoutTimeLeft(seconds);

    const intervalId = setInterval(() => {
      setLockoutTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsLocked(false);
          setLoginAttempts(0);
          setErrorMsg("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (isLocked || loginAttempts >= 5) {
      setErrorMsg(`🚫 Too many failed attempts. Please wait ${lockoutTimeLeft || 30} seconds.`);
      if (!isLocked) {
        startLockout(30);
      }
      return;
    }

    if (!email || !password) {
      setErrorMsg("⚠️ Please enter both Email/Mobile and Password.");
      return;
    }

    if (captcha.toLowerCase() !== captchaInput.trim().toLowerCase()) {
      setErrorMsg(`❌ Incorrect CAPTCHA (Expected: ${captcha}, Typed: ${captchaInput}). Please check and try again.`);
      generateCaptcha();
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/auth/login`, {
        email: email.trim(),
        password: password.trim()
      }, { timeout: 10000 }); // 10 second timeout

      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("role", res.data.role);

      setLoginAttempts(0); // reset on success

      if (res.data.role === "admin") navigate("/admin-dashboard");
      else if (res.data.role === "hospital") navigate("/hospital-dashboard");
      else navigate("/donor-dashboard");

    } catch (err) {
      const nextAttempts = loginAttempts + 1;
      setLoginAttempts(nextAttempts);

      let serverMessage = "Invalid credentials";
      if (err.response && err.response.data && err.response.data.message) {
        serverMessage = err.response.data.message;
      } else if (err.code === 'ECONNABORTED') {
        serverMessage = "Request timed out. Please try again.";
      } else if (!err.response) {
        serverMessage = "Network error. Check your connection.";
      }

      if (nextAttempts >= 5) {
        setErrorMsg(`🚫 Too many failed attempts. Locked for 30 seconds.`);
        startLockout(30);
      } else {
        setErrorMsg(`❌ ${serverMessage}. (${5 - nextAttempts} attempts left)`);
      }

      generateCaptcha();
      setIsLoading(false);
    }

  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="card3d">
        
        {/* IMPROVED HEADER */}
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <h4 style={styles.appName}>Blood Donor Finder System</h4>
        <p style={{...styles.subtitle, marginBottom: '25px'}}>Please login to continue</p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          {/* EMAIL INPUT */}
          <div style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Email or Mobile Number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* PASSWORD INPUT with SHOW/HIDE */}
          <div style={{...styles.inputContainer, position: "relative"}}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{...styles.input, paddingRight: "40px"}}
            />
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* CAPTCHA UI - CLEAN ROW */}
          <div style={{ background: "#f8f9fa", padding: "12px", borderRadius: "12px", border: "1px solid #eee" }}>
            <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "bold", color: "#555", textAlign: "left" }}>
              Security Verification
            </p>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={styles.captchaBox}>
                <span style={{ letterSpacing: "6px", fontFamily: "monospace" }}>{captcha}</span>
              </div>
              <button
                type="button"
                onClick={generateCaptcha}
                style={styles.refreshBtn}
                title="Refresh CAPTCHA"
              >
                🔄
              </button>
            </div>
            
            <input
              placeholder="Enter the code above"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              style={{...styles.input, marginBottom: 0}}
            />
          </div>

          {/* EXPLICIT ERROR MESSAGE */}
          {errorMsg && (
            <div style={styles.errorBox} className="shake">
              {errorMsg}
            </div>
          )}

          {/* LOADING STATE ON BUTTON */}
          <button 
            type="submit" 
            style={isLoading || isLocked ? styles.btnLoading : styles.btn} 
            disabled={isLoading || isLocked}
          >
            {isLoading ? "Logging in..." : isLocked ? `Locked (${lockoutTimeLeft || 30}s)` : "Login to Dashboard →"}
          </button>
        </form>

        {/* IMPROVED LINKS AREA */}
        <div style={styles.linksArea}>
          <div 
            style={styles.forgotLink} 
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </div>
          
          <div style={styles.registerLink} onClick={() => navigate("/register")}>
            Don't have an account? <b>Register Now</b>
          </div>
        </div>
      </div>

      <style>{animationCSS}</style>
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0A192F, #172A45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px 30px",
    background: "rgba(255,255,255,0.98)",
    borderRadius: "24px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
    textAlign: "center"
  },
  title: { margin: "0 0 5px 0", fontSize: "1.8rem", color: "#1a1a1a" },
  appName: { margin: "0 0 5px 0", color: "#d32f2f", fontSize: "1.1rem", fontWeight: "bold" },
  subtitle: { color: "#777", fontSize: "0.95rem" },
  
  inputContainer: { width: "100%", margin: 0 },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    outline: "none",
    transition: "0.2s ease",
    background: "#fff",
    boxSizing: "border-box"
  },
  eyeIcon: {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "1.2rem",
    opacity: 0.7,
    transition: "0.2s"
  },
  
  captchaBox: {
    flex: 1,
    padding: "12px",
    background: "#e3f2fd",
    borderRadius: "10px",
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#1565c0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px dashed #90caf9",
    userSelect: "none"
  },
  refreshBtn: {
    background: "#1565c0",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "0 15px",
    cursor: "pointer",
    fontSize: "1.2rem",
    transition: "0.2s"
  },
  
  errorBox: {
    background: "#fdecea",
    color: "#d32f2f",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    borderLeft: "4px solid #d32f2f"
  },
  
  btn: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #e53935, #b71c1c)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.05rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 15px rgba(229,57,53,0.3)",
    marginTop: "5px"
  },
  btnLoading: {
    width: "100%",
    padding: "16px",
    background: "#9e9e9e",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.05rem",
    fontWeight: "bold",
    cursor: "not-allowed",
    marginTop: "5px"
  },
  
  linksArea: {
    marginTop: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  forgotLink: {
    color: "#555",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "0.2s",
    padding: "5px"
  },
  registerLink: {
    background: "#f5f5f5",
    padding: "15px",
    borderRadius: "12px",
    color: "#1a1a1a",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "0.2s"
  }
};

/* ================= ANIMATION ================= */

const animationCSS = `
.card3d {
  animation: fadeIn 0.8s ease-out;
}
input:focus {
  border-color: #1565c0 !important;
  box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.15);
}
.eyeIcon:hover { opacity: 1 !important; transform: translateY(-50%) scale(1.1) !important; }
button[type="button"]:hover { filter: brightness(1.1); transform: rotate(15deg); }
button[type="submit"]:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(229,57,53,0.4) !important; }
.registerLink:hover { background: #e3f2fd !important; color: #1565c0 !important; transform: translateY(-2px); }
.forgotLink:hover { color: #d32f2f !important; text-decoration: underline; }

.shake { animation: shake 0.4s ease-in-out; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
}
`;

export default Login;
