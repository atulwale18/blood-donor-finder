import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [hospital, setHospital] = useState(null);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [emergencies, setEmergencies] = useState([]);
  const [nearestDonors, setNearestDonors] = useState([]); // ✅ NEW

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:5000/api/hospital/profile/${userId}`)
      .then((res) => {
        setHospital(res.data);

        return axios.get("http://localhost:5000/api/bloodbank/nearby", {
          params: {
            latitude: res.data.latitude,
            longitude: res.data.longitude
          }
        });
      })
      .then((res) => {
        setBloodBanks(res.data || []);
      })
      .catch(() => {
        alert("Failed to load hospital data");
      });
  }, [userId, navigate]);

  /* =====================
     FETCH NEAREST DONORS (KNN)
  ===================== */
  const fetchNearestDonors = (bg = bloodGroup) => {
    if (!hospital) return;

    axios
      .get("http://localhost:5000/api/donor/nearest", {
        params: {
          blood_group: bg,
          latitude: hospital.latitude,
          longitude: hospital.longitude
        }
      })
      .then((res) => setNearestDonors(res.data || []))
      .catch(() => {});
  };

  /* =====================
     FETCH EMERGENCIES
  ===================== */
  const fetchEmergencies = () => {
    if (!hospital) return;

    axios
      .get(
        `http://localhost:5000/api/emergency/hospital/${hospital.hospital_id}`
      )
      .then((res) => setEmergencies(res.data || []))
      .catch(() => {});
  };

  useEffect(() => {
    if (hospital) {
      fetchEmergencies();
      fetchNearestDonors();
    }
  }, [hospital]);

  /* =====================
     SEND EMERGENCY
  ===================== */
  const sendEmergency = async () => {
    try {
      await axios.post("http://localhost:5000/api/emergency/create", {
        hospital_id: hospital.hospital_id,
        blood_group: bloodGroup
      });

      alert("Emergency request sent to nearby donors 🚨");
      fetchEmergencies();
      fetchNearestDonors(bloodGroup); // ✅ refresh KNN donors
    } catch {
      alert("Failed to send emergency request");
    }
  };

  /* =====================
     COMPLETE DONATION
  ===================== */
  const completeDonation = async (request_id) => {
    try {
      await axios.post("http://localhost:5000/api/emergency/complete", {
        request_id
      });

      alert("Donation marked as completed ✅");
      fetchEmergencies();
    } catch {
      alert("Failed to complete donation");
    }
  };

  /* =====================
     EMERGENCY BLOOD CHECK
  ===================== */
  const emergencyBloodCheck = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/bloodbank/emergency",
        {
          params: {
            blood_group: encodeURIComponent(bloodGroup),
            latitude: hospital.latitude,
            longitude: hospital.longitude
          }
        }
      );

      if (res.data.length === 0) {
        alert("Required blood group not available");
        return;
      }

      const bank = res.data[0];
      alert(
        `Blood Available!\n\nBlood Bank: ${bank.name}\nUnits: ${bank.units_available}\nPhone: ${bank.mobile}`
      );
    } catch {
      alert("Failed to check emergency blood availability");
    }
  };

  if (!hospital) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fadeIn">
        <h2 style={styles.title}>🏥 Hospital Dashboard</h2>

        {/* PROFILE */}
        <div style={styles.profile}>
          <div style={styles.avatar}>
            {hospital.hospital_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{hospital.hospital_name}</h3>
            <p>📞 {hospital.mobile}</p>
          </div>
        </div>

        {/* EMERGENCY REQUEST */}
        <div style={styles.section}>
          <h4>🚨 Emergency Blood Request</h4>

          <select
            value={bloodGroup}
            onChange={(e) => {
              setBloodGroup(e.target.value);
              fetchNearestDonors(e.target.value); // ✅ update donors on change
            }}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          >
            <option>O+</option><option>O-</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
          </select>

          <button style={styles.emergencyBtn} onClick={sendEmergency}>
            Send Emergency Request
          </button>
        </div>

        <div style={styles.section}>
          <button style={styles.emergencyBtn} onClick={emergencyBloodCheck}>
            Emergency Blood Check
          </button>
        </div>

        {/* NEAREST DONORS (KNN) */}
        <div style={styles.section}>
          <h4>🧭 Nearest Eligible Donors (15 km)</h4>

          {nearestDonors.length === 0 ? (
            <p>No eligible donors nearby</p>
          ) : (
            nearestDonors.map((d) => (
              <div key={d.donor_id} style={styles.box}>
                <p><b>Name:</b> {d.name}</p>
                <p><b>Blood Group:</b> {d.blood_group}</p>
                <p><b>Mobile:</b> {d.mobile}</p>
                <p><b>Distance:</b> {d.distance.toFixed(2)} km</p>
              </div>
            ))
          )}
        </div>

        {/* EMERGENCY STATUS */}
        <div style={styles.section}>
          <h4>📌 Emergency Request Status</h4>

          {emergencies.length === 0 ? (
            <p>No emergency requests</p>
          ) : (
            emergencies.map((e) => (
              <div key={e.request_id} style={styles.box}>
                <p><b>Blood Group:</b> {e.blood_group}</p>
                <p><b>Status:</b> {e.status}</p>

                {e.status === "accepted" && (
                  <>
                    <p><b>Donor:</b> {e.donor_name}</p>
                    <p><b>Mobile:</b> {e.donor_mobile}</p>
                    <p><b>City:</b> {e.donor_city}</p>

                    <button
                      style={styles.completeBtn}
                      onClick={() => completeDonation(e.request_id)}
                    >
                      Mark Donation Completed
                    </button>
                  </>
                )}

                {e.status === "pending" && (
                  <p style={{ color: "#777" }}>Waiting for donor…</p>
                )}
              </div>
            ))
          )}
        </div>

        <button
          style={styles.logout}
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      <style>{animationCSS}</style>
    </div>
  );
};

/* ===== STYLES & ANIMATION (UNCHANGED) ===== */
// ⬇️ everything below remains exactly the same

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0d47a1, #1976d2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: 420,
    background: "#fff",
    padding: 25,
    borderRadius: 16
  },
  title: { textAlign: "center", marginBottom: 20 },
  profile: { display: "flex", gap: 15, marginBottom: 20 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "#1565c0",
    color: "#fff",
    fontSize: 26,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  section: { marginBottom: 20 },
  emergencyBtn: {
    width: "100%",
    padding: 12,
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: 8
  },
  box: {
    border: "1px solid #ddd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  completeBtn: {
    marginTop: 10,
    width: "100%",
    padding: 10,
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: 6
  },
  logout: {
    width: "100%",
    padding: 10,
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: 8
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff"
  }
};

const animationCSS = `
.fadeIn {
  animation: fadeIn 0.7s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default HospitalDashboard;
