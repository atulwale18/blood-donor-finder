import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ GUARD: identifier must exist (UNCHANGED)
  useEffect(() => {
    if (!state?.identifier) {
      alert("Session expired. Please try again.");
      navigate("/forgot-password");
    }
  }, [state, navigate]);

  const verify = async () => {
    if (!otp.trim()) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        identifier: state.identifier,
        otp: otp.trim()
      });

      navigate("/reset-password", {
        state: { identifier: state.identifier }
      });
    } catch (err) {
      alert(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-slide">
        <h2 style={styles.title}>Verify OTP</h2>
        <p style={styles.subtitle}>
          Enter the 6-digit OTP sent to your mobile or email
        </p>

        <input
          style={styles.input}
          placeholder="Enter OTP"
          value={otp}
          maxLength={6}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, ""))
          }
        />

        <button
          style={{
            ...styles.button,
            backgroundColor: loading ? "#999" : "#e53935"
          }}
          onClick={verify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
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

export default VerifyOtp;

/* =====================
   STYLES
===================== */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #b71c1c, #e53935)",
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
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginBottom: "18px",
    fontSize: "18px",
    textAlign: "center",
    letterSpacing: "6px",
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
