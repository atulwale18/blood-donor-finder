import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");

  const sendOtp = async () => {
    if (!identifier) {
      alert("Enter email or mobile");
      return;
    }

    await axios.post("http://localhost:5000/api/auth/forgot-password", {
      identifier
    });

    navigate("/verify-otp", { state: { identifier } });
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Forgot Password</h2>
      <input
        placeholder="Email or Mobile"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <button onClick={sendOtp}>Send OTP</button>
    </div>
  );
};

export default ForgotPassword;
