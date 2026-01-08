import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!identifier) {
      alert("Enter email or mobile");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        identifier
      });

      navigate("/verify-otp", { state: { identifier } });
    } catch (err) {
      alert("User not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-slide">
        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.subtitle}>
          Enter your registered email or mobile number
        </p>

        <input
          style={styles.input}
          placeholder="Email or Mobile"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <button
          style={{
            ...styles.button,
            backgroundColor: loading ? "#999" : "#e53935"
          }}
          onClick={sendOtp}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>

      {/* Animation */}
      <style>
        {`
          .fade-slide {
            animation: fadeSlide 0.6s ease;
          }

          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ForgotPassword;

/* =====================
   STYLES
===================== */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e53935, #b71c1c)",
    fontFamily: "Segoe UI, sans-serif"
  },
  card: {
    width: "360px",
    background: "#fff",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
    textAlign: "center"
  },
  title: {
    marginBottom: "10px",
    color: "#b71c1c"
  },
  subtitle: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    fontSize: "15px",
    outline: "none"
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s"
  }
};
