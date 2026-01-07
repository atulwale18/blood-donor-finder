import React, { useEffect, useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ================= HELPER ================= */
const getCroppedImage = async (imageSrc, cropPixels) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((r) => (image.onload = r));

  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    300,
    300
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg");
  });
};

/* ================= COMPONENT ================= */
const DonorDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [donor, setDonor] = useState(null);
  const [available, setAvailable] = useState(true);
  const [emergency, setEmergency] = useState(null);
  const [accepted, setAccepted] = useState(false);

  /* ===== PROFILE PHOTO FLOW ===== */
  const [showModal, setShowModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);

  /* ================= EMERGENCY ================= */
  const fetchEmergency = useCallback(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/api/emergency/donor/${userId}`)
      .then((res) => setEmergency(res.data || null))
      .catch(() => setEmergency(null));
  }, [userId]);

  useEffect(() => {
    if (!userId) return navigate("/");
    axios
      .get(`http://localhost:5000/api/donor/profile/${userId}`)
      .then((res) => {
        setDonor(res.data);
        fetchEmergency();
      });
  }, [userId, navigate, fetchEmergency]);

  useEffect(() => {
    const i = setInterval(fetchEmergency, 5000);
    return () => clearInterval(i);
  }, [fetchEmergency]);

  /* ================= CAMERA ================= */
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    setCameraOn(true);
    setTimeout(() => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    }, 100);
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    const v = videoRef.current;
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    canvas.getContext("2d").drawImage(v, 0, 0);
    setImageSrc(canvas.toDataURL("image/jpeg"));
    stopCamera();
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  /* ================= UPLOAD ================= */
  const saveCroppedImage = async () => {
    const blob = await getCroppedImage(imageSrc, cropPixels);
    const fd = new FormData();
    fd.append("profile_pic", blob);

    await axios.post(
      `http://localhost:5000/api/donor/upload-photo/${donor.donor_id}`,
      fd
    );

    alert("Profile photo updated");
    window.location.reload();
  };

  if (!donor) return <div style={{ color: "#fff" }}>Loading...</div>;

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
            onClick={() => setShowModal(true)}
          />
          <div>
            <h3>{donor.name}</h3>
            <p style={{ color: "#666" }}>
              {available ? "Available to donate" : "Not available"}
            </p>
          </div>
        </div>

        {/* INFO GRID */}
        <div style={styles.grid}>
          <div style={styles.box}><p>Blood Group</p><b>{donor.blood_group}</b></div>
          <div style={styles.box}><p>Mobile</p><b>{donor.mobile}</b></div>
          <div style={styles.box}><p>Gender</p><b>{donor.gender}</b></div>
          <div style={styles.box}><p>Last Donation</p><b>{donor.last_donation_date || "Not yet"}</b></div>
        </div>

        {/* AVAILABILITY */}
        <div style={styles.btnRow}>
          <button style={styles.availableBtn} onClick={() => setAvailable(true)}>✔ Available</button>
          <button style={styles.notAvailableBtn} onClick={() => setAvailable(false)}>✖ Not Available</button>
        </div>

        {/* EMERGENCY */}
        {emergency && (
          <div style={styles.emergencyCard}>
            <p><b>Blood Group:</b> {emergency.blood_group}</p>
            <p><b>Hospital:</b> {emergency.hospital_name}</p>
            <p><b>Distance:</b> {emergency.distance_km} km</p>

            {!accepted ? (
              <button
                style={styles.availableBtn}
                onClick={() => {
                  axios.post("http://localhost:5000/api/emergency/accept", {
                    request_id: emergency.request_id,
                    donor_id: donor.donor_id
                  }).then(() => setAccepted(true));
                }}
              >
                Accept
              </button>
            ) : (
              <button
                style={styles.mapBtn}
                onClick={() =>
                  window.open(`https://www.google.com/maps?q=${emergency.h_lat},${emergency.h_lon}`)
                }
              >
                📍 Open Map
              </button>
            )}
          </div>
        )}

        <button style={styles.logout} onClick={() => navigate("/")}>Logout</button>
      </div>

      {/* PROFILE PHOTO MODAL */}
      {showModal && (
        <div style={styles.modal} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {!imageSrc && (
              <>
                <button style={styles.availableBtn} onClick={startCamera}>📸 Take Photo</button>
                <input type="file" accept="image/*" onChange={(e) =>
                  setImageSrc(URL.createObjectURL(e.target.files[0]))
                } />
              </>
            )}

            {cameraOn && <video ref={videoRef} autoPlay style={{ width: "100%" }} />}
            {cameraOn && <button onClick={capturePhoto}>Capture</button>}

            {imageSrc && (
              <>
                <div style={{ position: "relative", height: 250 }}>
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, p) => setCropPixels(p)}
                  />
                </div>
                <button style={styles.availableBtn} onClick={saveCroppedImage}>
                  Save Photo
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
    background: "linear-gradient(135deg,#b71c1c,#e53935)",
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

  title: {
    textAlign: "center",
    marginBottom: 20
  },

  profile: {
    display: "flex",
    gap: 15,
    alignItems: "center",
    marginBottom: 15
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 20
  },

  box: {
    background: "#f5f5f5",
    padding: 12,
    borderRadius: 10
  },

  /* ✅ Availability buttons spacing */
  btnRow: {
    display: "flex",
    gap: 12,
    marginBottom: 20   // space before Logout
  },

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
    marginBottom: 20
  },

  mapBtn: {
    background: "#1976d2",
    color: "#fff",
    padding: 10,
    border: "none",
    borderRadius: 8,
    width: "100%"
  },

  /* ✅ Logout spacing */
  logout: {
    width: "100%",
    background: "#d32f2f",
    color: "#fff",
    padding: 10,
    border: "none",
    borderRadius: 8,
    marginTop: 10
  },

  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modalContent: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    width: 320
  }
};

export default DonorDashboard;



