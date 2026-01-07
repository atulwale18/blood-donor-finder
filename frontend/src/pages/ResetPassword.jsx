import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [password, setPassword] = useState("");

  const reset = async () => {
    await axios.post("http://localhost:5000/api/auth/reset-password", {
      identifier: state.identifier,
      newPassword: password
    });

    alert("Password updated");
    navigate("/");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={reset}>Update Password</button>
    </div>
  );
};

export default ResetPassword;
