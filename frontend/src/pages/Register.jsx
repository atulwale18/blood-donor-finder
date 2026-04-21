import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("donor");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    age: "",
    gender: "",
    blood_group: "",
    latitude: "",
    longitude: "",
    address: "",
    city: "",
    district: "",
    weight: "",
    hemoglobin: "",
    last_donation_date: "",
    recent_surgery: "",
    is_available: "Available"
  });

  const [warningMsg, setWarningMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isValid, setIsValid] = useState(false);

  /* ================= REAL-TIME VALIDATION ================= */
  useEffect(() => {
    let warn = "";
    let err = "";

    if (form.password && confirmPassword && form.password !== confirmPassword) {
      err = "Passwords do not match.";
    }

    if (role === "donor") {
      let medicalIssue = false;
      if (form.weight && Number(form.weight) < 50) medicalIssue = true;
      if (form.recent_surgery === "yes") medicalIssue = true;
      if (form.age && (Number(form.age) < 18 || Number(form.age) > 65)) medicalIssue = true;
      if (form.hemoglobin && Number(form.hemoglobin) < 12.5) medicalIssue = true;

      if (medicalIssue) {
        warn = "⚠️ You are currently not eligible for emergency donation. You can still register, but your status is set to 'Not Available'.";
        if (form.is_available !== "Not Available") {
          setForm((prev) => ({ ...prev, is_available: "Not Available" }));
        }
      } else {
        if (warningMsg && form.is_available === "Not Available") {
          setForm((prev) => ({ ...prev, is_available: "Available" }));
        }
      }
    }

    setWarningMsg(warn);
    setErrorMsg(err);

    // Form Validity Logic
    let valid = true;
    if (!form.name || !form.email || !form.password || !form.mobile || form.password !== confirmPassword) {
      valid = false;
    }
    if (role === "donor") {
      if (!form.age || !form.gender || !form.blood_group || !form.weight || !form.recent_surgery || !form.hemoglobin) valid = false;
    }

    setIsValid(valid);
  }, [form, confirmPassword, role, warningMsg]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getLocation = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({ ...form, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) });
        alert("Location captured successfully! 📍");
      },
      () => alert("Location permission denied. Please allow it or type manually.")
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/auth/register`, { ...form, role });
      alert("Registration successful. Please login. ✅");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div style={styles.page}>
      <div className="bannerSide">
        <div style={styles.bannerOverlay}>
          <h1 style={styles.bannerTitle}>Join the Lifesavers 🩺</h1>
          <p style={styles.bannerSub}>Sign up today to become an essential part of our emergency response network.</p>
        </div>
      </div>

      <div className="formSide">
        <div style={styles.card} className="card3d">
        <h2 style={styles.title}>Create Account ✨</h2>

        <div style={styles.roleToggle}>
          <button style={role === "donor" ? styles.roleActive : styles.roleInactive} onClick={() => setRole("donor")}>🩸 Blood Donor</button>
          <button style={role === "hospital" ? styles.roleActive : styles.roleInactive} onClick={() => setRole("hospital")}>🏥 Hospital</button>
        </div>

        <form onSubmit={handleRegister}>
          {/* SECTION 1: PERSONAL INFORMATION */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>👤 Personal Information</h4>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input name="name" placeholder="John Doe" onChange={handleChange} style={styles.input} />
              </div>

              {role === "donor" && (
                <>
                  <div style={styles.field}>
                    <label style={styles.label}>Age</label>
                    <input type="number" name="age" placeholder="Age" onChange={handleChange} style={styles.input} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Gender</label>
                    <select name="gender" onChange={handleChange} style={styles.input}>
                      <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Blood Group</label>
                    <select name="blood_group" onChange={handleChange} style={styles.input}>
                      <option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SECTION 2: CONTACT INFORMATION */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>📞 Contact Information</h4>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Mobile Number</label>
                <input type="tel" name="mobile" placeholder="Mobile Number" onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email Address</label>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} style={styles.input} />
              </div>
            </div>
          </div>

          {/* SECTION 3: MEDICAL INFORMATION (Donor Only) */}
          {role === "donor" && (
            <div style={styles.section} className="fadeSection">
              <h4 style={styles.sectionTitle}>⚕️ Medical Information</h4>
              <div style={styles.grid}>
                <div style={styles.field}>
                  <label style={styles.label}>Weight (kg)</label>
                  <input type="number" name="weight" placeholder="Enter weight in kg" onChange={handleChange} style={{...styles.input, borderColor: form.weight && form.weight < 50 ? "#d32f2f" : "#ddd"}} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Recent Surgery (Last 6 Months)?</label>
                  <select name="recent_surgery" onChange={handleChange} style={{...styles.input, borderColor: form.recent_surgery === "yes" ? "#d32f2f" : "#ddd"}}>
                    <option value="">Select</option><option value="no">No</option><option value="yes">Yes</option>
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>HB Score (g/dL)</label>
                  <input type="number" step="0.1" name="hemoglobin" placeholder="e.g. 13.5" onChange={handleChange} style={{...styles.input, borderColor: form.hemoglobin && form.hemoglobin < 12.5 ? "#d32f2f" : "#ddd"}} />
                </div>
              </div>
              
              {warningMsg && (
                <div style={styles.warningAlert}>{warningMsg}</div>
              )}
              
              <div style={styles.field}>
                <label style={styles.label}>Availability Status (Auto-assigned if not eligible)</label>
                <select name="is_available" value={form.is_available} onChange={handleChange} style={styles.input} disabled={!!warningMsg}>
                  <option value="Available">Available for Emergency</option>
                  <option value="Not Available">Not Available</option>
                  <option value="Donated Recently">Donated Recently</option>
                </select>
              </div>
            </div>
          )}

          {/* SECTION 4: LOCATION */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>📍 Location Tracking</h4>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>City</label>
                <input name="city" placeholder="City Name" onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>District</label>
                <input name="district" placeholder="District" onChange={handleChange} style={styles.input} />
              </div>
            </div>
            
            <div style={{...styles.grid, marginTop: "10px"}}>
              <div style={styles.field}>
                <label style={styles.label}>Latitude</label>
                <input type="number" step="any" name="latitude" placeholder="e.g. 19.0760" value={form.latitude} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Longitude</label>
                <input type="number" step="any" name="longitude" placeholder="e.g. 72.8777" value={form.longitude} onChange={handleChange} style={styles.input} />
              </div>
            </div>
            <button onClick={getLocation} style={styles.locationBtn}>
              🎯 Auto-Capture Current Location Instead
            </button>
          </div>

          {/* SECTION 5: ACCOUNT SECURITY */}
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>🔒 Account Security</h4>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Create Password</label>
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} style={{...styles.input, borderColor: errorMsg ? "#d32f2f" : "#ddd"}} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Confirm Password</label>
                <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} style={{...styles.input, borderColor: errorMsg ? "#d32f2f" : "#ddd"}} />
              </div>
            </div>
            {errorMsg && <p style={{color: "#d32f2f", fontSize: "0.85rem", margin: "-5px 0 10px 0", fontWeight: "bold"}}>{errorMsg}</p>}
            <p style={{fontSize: "0.85rem", color: "#1565c0", cursor: "pointer", margin: "0 0 10px 0"}} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈 Hide Passwords" : "👁️ Show Passwords"}
            </p>
          </div>

          <button type="submit" style={isValid ? styles.registerBtn : styles.disabledBtn} disabled={!isValid}>
            {isValid ? "Create Account ✅" : "Fill All Required Fields"}
          </button>
        </form>

        <p style={styles.footer}>
          Already registered?{" "}
          <span style={styles.link} onClick={() => navigate("/")}>Login to Dashboard</span>
        </p>
      </div>
      </div>
      <style>{animationCSS}</style>
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: { minHeight: "100vh", background: "#0A192F", display: "flex", alignItems: "stretch" },
  bannerOverlay: { padding: "60px", background: "linear-gradient(to top, rgba(10,25,47,0.95) 0%, rgba(10,25,47,0.1) 100%)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#fff", boxSizing: "border-box" },
  bannerTitle: { fontSize: "3.5rem", fontWeight: "800", marginBottom: "15px", textShadow: "0 2px 10px rgba(0,0,0,0.5)", lineHeight: "1.1" },
  bannerSub: { fontSize: "1.2rem", opacity: 0.9, maxWidth: "500px", lineHeight: "1.6", textShadow: "0 2px 10px rgba(0,0,0,0.5)" },
  card: { width: "100%", maxWidth: 650, padding: "40px", background: "rgba(255,255,255,0.98)", backdropFilter: "blur(15px)", borderRadius: "24px", boxShadow: "0 25px 50px rgba(0,0,0,0.4)" },
  title: { textAlign: "center", marginBottom: "30px", fontSize: "2rem", color: "#0d47a1", fontWeight: "800" },
  roleToggle: { display: "flex", gap: "10px", marginBottom: "30px", background: "#f5f5f5", padding: "6px", borderRadius: "14px" },
  roleActive: { flex: 1, padding: "12px", background: "#fff", color: "#d32f2f", border: "none", borderRadius: "10px", fontWeight: "bold", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", fontSize: "1rem" },
  roleInactive: { flex: 1, padding: "12px", background: "transparent", color: "#777", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" },
  section: { marginBottom: "25px", background: "#f8f9fa", padding: "20px", borderRadius: "16px", border: "1px solid #eee" },
  sectionTitle: { margin: "0 0 15px 0", color: "#1565c0", fontSize: "1.1rem", borderBottom: "2px solid #e3f2fd", paddingBottom: "8px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "15px" },
  field: { display: "flex", flexDirection: "column" },
  label: { fontSize: "0.85rem", fontWeight: "bold", color: "#555", marginBottom: "5px" },
  input: { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ddd", outline: "none", transition: "0.3s", fontSize: "0.95rem", background: "#fff" },
  locationBtn: { width: "100%", padding: "12px", background: "#f5f5f5", color: "#333", border: "1px solid #ddd", borderRadius: "10px", cursor: "pointer", fontWeight: "bold", transition: "0.2s" },
  warningAlert: { background: "#fff3cd", color: "#856404", padding: "12px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "15px", borderLeft: "4px solid #ffc107" },
  registerBtn: { width: "100%", padding: "16px", background: "linear-gradient(135deg, #e53935, #b71c1c)", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "1.1rem", fontWeight: "bold", boxShadow: "0 8px 20px rgba(229, 57, 53, 0.4)", transition: "0.3s" },
  disabledBtn: { width: "100%", padding: "16px", background: "#ccc", color: "#888", border: "none", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "bold", cursor: "not-allowed" },
  footer: { marginTop: "25px", textAlign: "center", fontSize: "0.95rem", color: "#555" },
  link: { color: "#1565c0", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }
};

const animationCSS = `
.bannerSide { flex: 1.2; background: url('https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2000&auto=format&fit=crop') center/cover no-repeat; display: flex; flex-direction: column; position: relative; }
.formSide { flex: 1.8; display: flex; justify-content: center; align-items: center; padding: 40px; background: linear-gradient(135deg, #0A192F, #172A45); min-height: 100vh; }
@media (max-width: 900px) { .bannerSide { display: none !important; } .formSide { padding: 20px; } }

.card3d { animation: fadeIn 0.6s ease-out; }
input:focus, select:focus { border-color: #1565c0 !important; box-shadow: 0 0 8px rgba(21, 101, 192, 0.2); }
.fadeSection { animation: slideDown 0.4s ease-out; }
button:hover { filter: brightness(1.05); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
`;

export default Register;
