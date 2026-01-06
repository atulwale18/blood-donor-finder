import React, {
  useEffect,
  useState,
  useCallback,
  useRef
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DonorDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [donor, setDonor] = useState(null);
  const [available, setAvailable] = useState(true);
  const [emergency, setEmergency] = useState(null);
  const [accepted, setAccepted] = useState(false);

  /* ===== PROFILE PHOTO STATES ===== */
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);

  /* =========================
     FETCH EMERGENCY
  ========================= */
  const fetchEmergency = useCallback(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/emergency/donor/${userId}`)
      .then((res) => {
        setEmergency(res.data || null);
        setAccepted(false);
      })
      .catch(() => setEmergency(null));
  }, [userId]);

  /* =========================
     LOAD DONOR PROFILE
  ========================= */
  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:5000/api/donor/profile/${userId}`)
      .then((res) => {
        setDonor(res.data);
        fetchEmergency();
      })
      .catch(() => alert("Failed to load donor data"));
  }, [userId, navigate, fetchEmergency]);

  /* =========================
     POLLING
  ========================= */
  useEffect(() => {
    const interval = setInterval(fetchEmergency, 5000);
    return () => clearInterval(interval);
  }, [fetchEmergency]);

  /* =========================
     CAMERA FUNCTIONS
  ========================= */
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    videoRef.current.srcObject = stream;
    setCameraOn(true);
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      uploadPhoto(new File([blob], "selfie.jpg", { type: "image/jpeg" }));
      stopCamera();
    });
  };

  const uploadPhoto = async (file) => {
    const fd = new FormData();
    fd.append("profile_pic", file);

    await axios.post(
      `http://localhost:5000/api/donor/upload-photo/${donor.donor_id}`,
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("Profile photo updated");
    window.location.reload();
  };

  /* =========================
     MAP
  ========================= */
  const openMap = () => {
    if (!emergency?.h_lat || !emergency?.h_lon) return;
    window.open(
      `https://www.google.com/maps?q=${emergency.h_lat},${emergency.h_lon}`,
      "_blank"
    );
  };

  if (!donor) {
    return <div style={styles.loading}>Loading...</div>;
  }

  const profileImg = donor.profile_pic
    ? `http://localhost:5000/${donor.profile_pic}`
    : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🩸 Donor Dashboard</h2>

        {/* PROFILE */}
        <div style={styles.profile}>
          <img
            src={profileImg}
            alt="profile"
            style={styles.avatar}
            onClick={() => setShowPhotoModal(true)}
          />
          <div>
            <h3>{donor.name}</h3>
            <p style={{ color: "#666" }}>
              {available ? "Available to donate" : "Not available"}
            </p>
          </div>
        </div>

        {/* INFO GRID (OLD DASHBOARD STYLE) */}
        <div style={styles.grid}>
          <div style={styles.box}><p>Blood Group</p><b>{donor.blood_group}</b></div>
          <div style={styles.box}><p>Mobile</p><b>{donor.mobile}</b></div>
          <div style={styles.box}><p>Gender</p><b>{donor.gender}</b></div>
          <div style={styles.box}>
            <p>Last Donation</p>
            <b>{donor.last_donation_date || "Not yet"}</b>
          </div>
        </div>

        {/* AVAILABILITY */}
        <div style={styles.btnRow}>
          <button style={styles.availableBtn} onClick={() => setAvailable(true)}>
            ✔ Available to Donate
          </button>
          <button style={styles.notAvailableBtn} onClick={() => setAvailable(false)}>
            ✖ Not Available
          </button>
        </div>

        {/* EMERGENCY */}
        {emergency && (
          <div style={styles.emergencyCard}>
            <h3>🚨 Emergency Blood Request</h3>
            <p><b>Blood Group:</b> {emergency.blood_group}</p>
            <p><b>Hospital:</b> {emergency.hospital_name}</p>
            <p><b>Distance:</b> {emergency.distance_km} km</p>

            {!accepted ? (
              <button style={styles.availableBtn}>Accept</button>
            ) : (
              <button style={styles.mapBtn} onClick={openMap}>
                📍 Open Hospital Location
              </button>
            )}
          </div>
        )}

        <button
          style={styles.logout}
          onClick={() => {
            stopCamera();
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      {/* PROFILE PHOTO MODAL */}
      {showPhotoModal && (
        <div style={styles.modal} onClick={() => setShowPhotoModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={profileImg} alt="preview" style={styles.previewImg} />

            <button style={styles.availableBtn} onClick={startCamera}>
              📸 Take Selfie
            </button>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadPhoto(e.target.files[0])}
              style={{ marginTop: 10 }}
            />

            {cameraOn && (
              <>
                <video ref={videoRef} autoPlay style={{ width: "100%", marginTop: 10 }} />
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <button style={styles.availableBtn} onClick={capturePhoto}>
                  Capture Photo
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #b71c1c, #e53935)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: 420,
    background: "#fff",
    padding: 25,
    borderRadius: 16,
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)"
  },
  title: { textAlign: "center", marginBottom: 20 },
  profile: { display: "flex", gap: 15, alignItems: "center", marginBottom: 15 },
  avatar: { width: 60, height: 60, borderRadius: "50%", cursor: "pointer" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 15
  },
  box: { background: "#f5f5f5", padding: 12, borderRadius: 10 },
  btnRow: { display: "flex", gap: 10, marginBottom: 15 },
  availableBtn: {
    flex: 1,
    background: "#2e7d32",
    color: "#fff",
    padding: 10,
    border: "none",
    borderRadius: 8
  },
  notAvailableBtn: {
    flex: 1,
    background: "#000",
    color: "#fff",
    padding: 10,
    border: "none",
    borderRadius: 8
  },
  emergencyCard: {
    background: "#fff3f3",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15
  },
  mapBtn: {
    background: "#1976d2",
    color: "#fff",
    padding: 10,
    border: "none",
    borderRadius: 8,
    width: "100%"
  },
  logout: {
    width: "100%",
    background: "#d32f2f",
    color: "#fff",
    padding: 10,
    border: "none",
    borderRadius: 8
  },
  loading: { color: "#fff" },

  /* MODAL */
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modalContent: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    width: 300,
    textAlign: "center"
  },
  previewImg: {
    width: "100%",
    borderRadius: 10,
    marginBottom: 10
  }
};

export default DonorDashboard;
