import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const hospitalId = localStorage.getItem("user_id");

  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hospitalId) {
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:5000/api/hospital/${hospitalId}`)
      .then((res) => {
        setHospital(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load hospital data");
        setLoading(false);
      });
  }, [hospitalId, navigate]);

  const sendEmergency = async () => {
    try {
      await axios.post("http://localhost:5000/api/emergency/create", {
        hospital_id: hospitalId,
        blood_group: "AB+"
      });
      alert("Emergency request sent");
    } catch {
      alert("Failed to send emergency request");
    }
  };

  if (loading) return <h2 style={{ color: "white" }}>Loading...</h2>;
  if (!hospital) return <h2 style={{ color: "white" }}>No data found</h2>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>🏥 Hospital Dashboard</h2>

        <div style={styles.profile}>
          <div style={styles.avatar}>
            {hospital.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{hospital.hospital_name}</h3>
            <p>{hospital.email}</p>
            <p>📞 {hospital.mobile}</p>
          </div>
        </div>

        <button style={styles.emergencyBtn} onClick={sendEmergency}>
          🚨 Send Emergency Blood Request
        </button>

        <button
          style={styles.logoutBtn}
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1565c0, #0d47a1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: 420,
    background: "#fff",
    padding: 25,
    borderRadius: 12
  },
  profile: {
    display: "flex",
    gap: 15,
    marginBottom: 20,
    alignItems: "center"
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "#1565c0",
    color: "#fff",
    fontSize: 28,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  emergencyBtn: {
    width: "100%",
    padding: 12,
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    marginBottom: 10
  },
  logoutBtn: {
    width: "100%",
    padding: 10,
    background: "#424242",
    color: "#fff",
    border: "none",
    borderRadius: 6
  }
};

export default HospitalDashboard;
