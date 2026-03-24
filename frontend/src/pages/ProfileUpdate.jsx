import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role");

  const [form, setForm] = useState({
    name: "", // mapped to hospital_name for hospitals
    email: "",
    mobile: "",
    age: "",
    address: "",
    city: "",
    district: "",
    latitude: "",
    longitude: "",
    is_available: 1
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (!userId || !role) {
      navigate("/");
      return;
    }

    const endpoint = role === "donor" ? `donor/profile` : `hospital/profile`;
    axios
      .get(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/${endpoint}/${userId}`)
      .then((res) => {
        const data = res.data;
        setForm({
          name: role === "donor" ? data.name : data.hospital_name,
          email: data.email || "",
          mobile: data.mobile || "",
          age: data.age || "",
          address: data.address || "",
          city: data.city || "",
          district: data.district || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
          is_available: data.is_available !== undefined ? data.is_available : 1
        });
      })
      .catch((err) => console.log("Failed to fetch profile", err));
  }, [userId, role, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6)
        });
      },
      () => alert("Location permission denied")
    );
  };

  const handleUpdateProfile = async () => {
    const endpoint = role === "donor" ? `donor/profile` : `hospital/profile`;
    const payload = {
      ...form,
      hospital_name: role === "hospital" ? form.name : undefined
    };

    try {
      await axios.put(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/${endpoint}/${userId}`, payload);
      alert("Profile updated successfully!");
      if (role === "donor") navigate("/donor-dashboard");
      else navigate("/hospital-dashboard");
    } catch (err) {
      alert("Failed to update profile");
      console.error(err);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    const endpoint = role === "donor" ? `donor/change-password` : `hospital/change-password`;

    try {
      await axios.put(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/${endpoint}/${userId}`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      alert("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="card3d">
        <h2 style={styles.title}>Update Profile ⚙️</h2>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>👤 Personal / Contact Details</div>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>{role === "donor" ? "Full Name" : "Hospital Name"}</label>
              <input name="name" value={form.name} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input name="email" value={form.email} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Mobile Number</label>
              <input name="mobile" value={form.mobile} onChange={handleChange} style={styles.input} />
            </div>
            {role === "donor" && (
              <div style={styles.field}>
                <label style={styles.label}>Age</label>
                <input name="age" value={form.age} onChange={handleChange} style={styles.input} />
              </div>
            )}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>📍 Address & Location</div>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Address / Area</label>
              <input name="address" value={form.address} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>City</label>
              <input name="city" value={form.city} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>District</label>
              <input name="district" value={form.district} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <div style={{...styles.grid, marginTop: "15px"}}>
            <div style={styles.field}>
              <label style={styles.label}>Latitude</label>
              <input type="number" step="any" name="latitude" value={form.latitude} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Longitude</label>
              <input type="number" step="any" name="longitude" value={form.longitude} onChange={handleChange} style={styles.input} />
            </div>
          </div>
          <button onClick={getLocation} style={styles.locationBtn}>
            🎯 Auto-Capture Current Location
          </button>
        </div>

        {role === "donor" && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>🩸 Emergency Availability Status</div>
            <select name="is_available" value={form.is_available} onChange={handleChange} style={{...styles.input, fontWeight: "bold", color: form.is_available === "Available" ? "#2e7d32" : "#d32f2f"}}>
              <option value="Available">🟢 Available (Ready to donate)</option>
              <option value="Not Available">🔴 Not Available currently</option>
              <option value="Donated Recently">🟡 Donated Recently</option>
              <option value="Temporarily Inactive">⚪ Temporarily Inactive</option>
            </select>
          </div>
        )}

        <button onClick={handleUpdateProfile} style={styles.updateBtn}>
          ✓ Save Profile Changes
        </button>

        <hr style={styles.hr} />

        <div style={styles.section}>
          <div style={styles.sectionTitle}>🔒 Change Password</div>
          <div style={styles.grid}>
            <div style={styles.field}>
               <label style={styles.label}>Current Password</label>
               <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} style={styles.input} />
            </div>
            <div style={styles.field}>
               <label style={styles.label}>New Password</label>
               <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} style={styles.input} />
            </div>
            <div style={styles.field}>
               <label style={styles.label}>Confirm New Password</label>
               <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} style={styles.input} />
            </div>
          </div>
          <button onClick={handleUpdatePassword} style={styles.passwordBtn}>
            Update Password
          </button>
        </div>
        
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ⬅ Back to Dashboard
        </button>
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
    padding: "40px 20px" 
  },
  card: { 
    width: "100%", 
    maxWidth: 650, 
    padding: "40px", 
    background: "rgba(255,255,255,0.98)", 
    backdropFilter: "blur(15px)", 
    borderRadius: "24px", 
    boxShadow: "0 25px 50px rgba(0,0,0,0.4)" 
  },
  title: { 
    textAlign: "center", 
    marginBottom: "30px", 
    fontSize: "2rem", 
    color: "#0d47a1", 
    fontWeight: "800" 
  },
  section: { 
    marginBottom: "25px", 
    background: "#f8f9fa", 
    padding: "20px", 
    borderRadius: "16px", 
    border: "1px solid #eee" 
  },
  sectionTitle: { 
    margin: "0 0 15px 0", 
    color: "#1565c0", 
    fontSize: "1.1rem", 
    borderBottom: "2px solid #e3f2fd", 
    paddingBottom: "8px",
    fontWeight: "bold"
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
    gap: "15px" 
  },
  field: { 
    display: "flex", 
    flexDirection: "column" 
  },
  label: { 
    fontSize: "0.85rem", 
    fontWeight: "bold", 
    color: "#555", 
    marginBottom: "5px" 
  },
  input: { 
    width: "100%", 
    padding: "12px", 
    borderRadius: "10px", 
    border: "1px solid #ddd", 
    outline: "none", 
    transition: "0.3s", 
    fontSize: "0.95rem", 
    background: "#fff",
    boxSizing: "border-box"
  },
  locationBtn: { 
    width: "100%", 
    padding: "12px", 
    background: "#f5f5f5", 
    color: "#333", 
    border: "1px solid #ddd", 
    borderRadius: "10px", 
    cursor: "pointer", 
    fontWeight: "bold", 
    transition: "0.2s",
    marginTop: "15px"
  },
  updateBtn: { 
    width: "100%", 
    padding: "16px", 
    background: "linear-gradient(135deg, #10b981, #059669)", 
    color: "#fff", 
    border: "none", 
    borderRadius: "12px", 
    cursor: "pointer", 
    fontSize: "1.1rem", 
    fontWeight: "bold", 
    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)", 
    transition: "0.3s" 
  },
  passwordBtn: { 
    width: "100%", 
    padding: "14px", 
    background: "linear-gradient(135deg, #ef4444, #dc2626)", 
    color: "#fff", 
    border: "none", 
    borderRadius: "10px", 
    cursor: "pointer", 
    fontWeight: "bold", 
    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
    marginTop: "15px",
    transition: "0.3s"
  },
  backBtn: { 
    width: "100%", 
    padding: "14px", 
    background: "transparent", 
    color: "#555", 
    border: "1px solid #ddd", 
    borderRadius: "12px", 
    cursor: "pointer", 
    fontWeight: "600", 
    marginTop: "15px", 
    transition: "all 0.2s" 
  },
  hr: { 
    border: "0", 
    borderTop: "1px dashed #ccc", 
    margin: "30px 0" 
  }
};

const animationCSS = `
.card3d { animation: fadeIn 0.6s ease-out; }
input:focus, select:focus { border-color: #1565c0 !important; box-shadow: 0 0 8px rgba(21, 101, 192, 0.2); }
button:hover { filter: brightness(1.05); transform: translateY(-2px); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

export default ProfileUpdate;
