import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ GUARD (UNCHANGED)
  useEffect(() => {
    if (!state?.identifier) {
      alert("Session expired. Please try again.");
      navigate("/forgot-password");
    }
  }, [state, navigate]);

  const reset = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Enter all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          identifier: state.identifier,
          newPassword
        }
      );

      alert("Password updated successfully");
      navigate("/login");
    } catch (err) {
      alert(
        err?.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-slide">
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.subtitle}>
          Create a new strong password for your account
        </p>

        <input
          style={styles.input}
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          style={{
            ...styles.button,
            backgroundColor: loading ? "#999" : "#e53935"
          }}
          type="button"
          onClick={reset}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
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

export default ResetPassword;

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
