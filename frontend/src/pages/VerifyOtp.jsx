import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [otp, setOtp] = useState("");

  // ✅ GUARD: identifier must exist
  useEffect(() => {
    if (!state?.identifier) {
      alert("Session expired. Please try again.");
      navigate("/forgot-password");
    }
  }, [state, navigate]);

  const verify = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        identifier: state.identifier,
        otp: otp.trim() // ✅ IMPORTANT
      });

      navigate("/reset-password", {
        state: { identifier: state.identifier }
      });
    } catch (err) {
      alert("Invalid or expired OTP");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Verify OTP</h2>

      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={verify}>Verify</button>
    </div>
  );
};

export default VerifyOtp;
