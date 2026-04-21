import React, { useEffect, useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* 🔔 FIREBASE IMPORTS */
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";

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

  const [showModal, setShowModal] = useState(false);
  const [notificationPopup, setNotificationPopup] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);

  /* 🔔 FIREBASE NOTIFICATION */
  const requestNotificationPermission = async (donorId) => {
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
      console.log("Notifications or service workers are not supported in this browser.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission !== "granted") {
        console.log("Notification permission not granted:", permission);
        return;
      }

      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      await navigator.serviceWorker.ready;

      const token = await getToken(messaging, {
        vapidKey: "BJQnI17kiJf8Z5jojFBD-tCuyDbSXppBbNc6D8rMpCjeCLM552mpFhXZzCP63t4UhDG5N4KBlhQh4aMvfyGTWGs",
        serviceWorkerRegistration: registration
      });

      console.log("FCM TOKEN:", token);

      if (token) {
        await axios.post(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/donor/save-token`, {
          donor_id: donorId,
          token: token
        });
      }
    } catch (error) {
      console.log("Notification error:", error);
    }
  };

  /* ================= EMERGENCY ================= */
  const fetchEmergency = useCallback(() => {
    if (!userId) return;

    axios
      .get(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/emergency/donor/${userId}`)
      .then((res) => setEmergency(res.data || null))
      .catch(() => setEmergency(null));
  }, [userId]);

  useEffect(() => {
    if (!userId) return navigate("/");

    axios
      .get(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/donor/profile/${userId}`)
      .then((res) => {
        setDonor(res.data);

        /* request firebase token */
        requestNotificationPermission(res.data.donor_id);

        fetchEmergency();
      });

    // Handle foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground Message received: ", payload);
      setNotificationPopup({
        title: payload.notification?.title || "Blood Request Alert",
        body: payload.notification?.body || "A donor request is nearby. Open the dashboard for details.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      window.setTimeout(() => {
        setNotificationPopup(null);
      }, 8000);
    });

    return () => unsubscribe();
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
      `${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/donor/upload-photo/${donor.donor_id}`,
      fd
    );

    alert("Profile photo updated");
    window.location.reload();
  };

  /* ================= MODERN LOADING STATE ================= */
  if (!donor) return (
    <div style={{ ...styles.page, flexDirection: 'column', gap: 20 }}>
      <div className="spinner" style={styles.spinner}></div>
      <div style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "600", letterSpacing: "1px" }}>
        Loading Donor Profile...
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  const profileImg = donor.profile_pic
    ? `${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/${donor.profile_pic}`
    : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <div style={styles.page}>
      {notificationPopup && (
        <div style={styles.notificationOverlay} onClick={() => setNotificationPopup(null)}>
          <div style={styles.notificationCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.notificationTop}>
              <div style={styles.notificationIcon}>
                <span style={styles.notificationBadge}>1</span>
                🔔
              </div>
              <div style={styles.notificationTitleGroup}>
                <div style={styles.notificationLabel}>New Notification</div>
                <div style={styles.notificationTime}>{notificationPopup.timestamp}</div>
              </div>
              <button style={styles.notificationClose} onClick={() => setNotificationPopup(null)}>
                ×
              </button>
            </div>
            <h3 style={styles.notificationHeadline}>{notificationPopup.title}</h3>
            <p style={styles.notificationMessage}>{notificationPopup.body}</p>
            <button
              style={styles.notificationAction}
              onClick={() => {
                setNotificationPopup(null);
              }}
            >
              View Details →
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL FOR PROFILE PIC ================= */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Update Profile Photo</h3>
            {!imageSrc ? (
              <div style={{ textAlign: "center" }}>
                {!cameraOn ? (
                  <>
                    <button style={styles.cameraBtn} onClick={startCamera}>
                      📸 Open Camera
                    </button>
                    <div style={{ margin: "15px 0" }}>OR</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setImageSrc(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ padding: "10px", width: "100%" }}
                    />
                  </>
                ) : (
                  <div>
                    <video ref={videoRef} autoPlay playsInline style={{ width: "100%", borderRadius: "10px" }} />
                    <button style={{ ...styles.cameraBtn, background: "#d32f2f", marginTop: "10px" }} onClick={capturePhoto}>
                      Capture
                    </button>
                    <button style={{ ...styles.notAvailableBtn, width: "100%", marginTop: "10px" }} onClick={stopCamera}>
                      Cancel Camera
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.cropperContainer}>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, croppedPixels) => setCropPixels(croppedPixels)}
                />
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {imageSrc && (
                <button style={{...styles.availableBtn, flex: 1}} onClick={saveCroppedImage}>
                  Save Photo
                </button>
              )}
              <button
                style={{...styles.notAvailableBtn, flex: 1, border: "1px solid #ccc"}}
                onClick={() => {
                  setShowModal(false);
                  setImageSrc(null);
                  if (cameraOn) stopCamera();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div style={styles.card}>
        <h2 style={styles.title}>🩸 Donor Dashboard</h2>

        <div style={styles.profile}>
          <img
            src={profileImg}
            alt="profile"
            style={styles.avatar}
            onClick={() => setShowModal(true)}
            title="Update Profile Picture"
          />
          <div style={{ flex: 1 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0', fontSize: '1.4rem', color: '#1a1a1a' }}>
              {donor.name}
              <span 
                onClick={() => navigate("/profile-update")} 
                style={{ cursor: 'pointer', fontSize: '18px', opacity: 0.7, transition: '0.2s' }}
                title="Update Profile & Settings"
                onMouseOver={(e) => e.target.style.opacity = 1}
                onMouseOut={(e) => e.target.style.opacity = 0.7}
              >
                ⚙️
              </span>
            </h3>
            {/* 🚥 STATUS INDICATOR IMPROVEMENT */}
            <div style={{ 
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              background: donor.is_available === "Available" ? "rgba(46, 125, 50, 0.15)" : 
                          donor.is_available === "Not Available" ? "rgba(245, 124, 0, 0.15)" : 
                          donor.is_available === "Donated Recently" ? "rgba(251, 192, 45, 0.2)" : "rgba(117, 117, 117, 0.15)",
              color: donor.is_available === "Available" ? "#2e7d32" : 
                     donor.is_available === "Not Available" ? "#e65100" : 
                     donor.is_available === "Donated Recently" ? "#f57f17" : "#424242",
            }}>
              ● {donor.is_available || "Available"}
            </div>

            {notificationPermission !== "granted" && (
              <div style={styles.notificationStatus}>
                Notifications are currently <strong>{notificationPermission}</strong>.
                <button
                  style={styles.notificationEnableBtn}
                  onClick={() => requestNotificationPermission(donor.donor_id)}
                >
                  Enable Notifications
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.box}><p style={styles.boxLabel}>Blood Group</p><b style={styles.boxValue}>{donor.blood_group}</b></div>
          <div style={styles.box}><p style={styles.boxLabel}>Mobile</p><b style={styles.boxValue}>{donor.mobile}</b></div>
          <div style={styles.box}><p style={styles.boxLabel}>Gender</p><b style={styles.boxValue}>{donor.gender}</b></div>
          <div style={styles.box}><p style={styles.boxLabel}>Last Donation</p><b style={{...styles.boxValue, fontSize: '0.9rem'}}>{donor.last_donation_date || "Not yet"}</b></div>
        </div>

        {emergency && (
          <div style={styles.emergencyCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, color: '#d32f2f', fontSize: '1.2rem' }}>🚨 URGENT REQUEST</h4>
              {/* STATUS INDICATOR (PENDING/FULFILLED) */}
              <span style={{ 
                background: emergency.status === 'accepted' ? '#e0e0e0' : '#ffe082', 
                color: emergency.status === 'accepted' ? '#616161' : '#f57f17',
                padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' 
              }}>
                {emergency.status === 'accepted' ? "FULFILLED" : "PENDING"}
              </span>
            </div>
            
            <p style={{ margin: '5px 0' }}><b style={{ color: '#555' }}>Blood Group:</b> <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>{emergency.blood_group}</span></p>
            <p style={{ margin: '5px 0' }}><b style={{ color: '#555' }}>Hospital:</b> {emergency.hospital_name}</p>
            <p style={{ margin: '5px 0' }}><b style={{ color: '#555' }}>Distance:</b> {emergency.distance_km} km away</p>

            <div style={{ marginTop: '15px' }}>
              {emergency.status === 'accepted' && emergency.accepted_donor_id !== donor.donor_id ? (
                <div style={{...styles.notAvailableBtn, width: '100%', background: '#f5f5f5', color: '#757575', textAlign: 'center', pointerEvents: 'none', border: '1px solid #e0e0e0'}}>
                  ⚠ Already accepted by another donor
                </div>
              ) : (!accepted && emergency.status !== 'accepted' ? (
                <button
                  style={{...styles.availableBtn, width: '100%', fontSize: '1.1rem'}}
                  onClick={() => {
                    axios.post(`${process.env.REACT_APP_API_URL || "https://blood-donor-backend.onrender.com"}/api/emergency/accept`, {
                      request_id: emergency.request_id,
                      donor_id: donor.donor_id
                    }).then(() => {
                      setAccepted(true);
                      fetchEmergency();
                    }).catch(() => {
                      alert("This request has already been accepted.");
                      fetchEmergency();
                    });
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  Confirm & Accept Request
                </button>
              ) : (
                <button
                  style={{...styles.mapBtn, width: '100%', fontSize: '1.1rem'}}
                  onClick={() =>
                    window.open(`https://www.google.com/maps?q=${emergency.h_lat},${emergency.h_lon}`)
                  }
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  📍 Open Live Map
                </button>
              ))}
            </div>
          </div>
        )}

        <button 
          style={styles.logout} 
          onClick={() => navigate("/")}
          onMouseOver={(e) => e.target.style.background = '#b71c1c'}
          onMouseOut={(e) => e.target.style.background = '#d32f2f'}
        >
          Logout
        </button>
      </div>
    </div>
  );
};


/* ================= STYLES ================= */

const styles = {

  page:{
    minHeight:"100vh",
    /* UI UX Enhancement: Real-life image with vibrant premium dark gradient overlay */
    background:"linear-gradient(to right, rgba(26,26,46,0.92), rgba(183,28,28,0.85)), url('https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2000&auto=format&fit=crop') center/cover fixed",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    /* Mobile Responsiveness Padding */
    padding: "20px"
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255,255,255,0.3)",
    borderTop: "5px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },

  card:{
    /* Mobile Responsiveness: Uses percentage widths instead of hard pixels */
    width:"100%",
    maxWidth:"450px",
    /* Premium UI UX: Glassmorphism effect */
    background:"rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    padding:"30px",
    borderRadius:"24px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease"
  },

  title:{
    textAlign:"center",
    marginBottom:"25px",
    color: "#b71c1c",
    fontWeight: "800",
    fontSize: "1.8rem"
  },

  profile:{
    display:"flex",
    gap:"20px",
    alignItems:"center",
    marginBottom:"25px",
    paddingBottom: "20px",
    borderBottom: "1px solid #eee"
  },

  avatar:{
    width:"75px",
    height:"75px",
    borderRadius:"50%",
    cursor:"pointer",
    objectFit: "cover",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    border: "3px solid #fff"
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", /* Fully Responsive Grid */
    gap:"15px",
    marginBottom:"25px"
  },

  box:{
    background:"#f8f9fa",
    padding:"15px",
    borderRadius:"16px",
    border: "1px solid #edf2f7",
    boxShadow: "0 2px 5px rgba(0,0,0,0.02)"
  },

  boxLabel: {
    margin: "0 0 5px 0",
    color: "#718096",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  boxValue: {
    fontSize: "1.1rem",
    color: "#2d3748"
  },

  availableBtn:{
    background:"linear-gradient(135deg, #43a047, #2e7d32)",
    color:"#fff",
    padding:"14px",
    border:"none",
    borderRadius:"12px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 15px rgba(46, 125, 50, 0.3)"
  },

  notAvailableBtn:{
    padding:"14px",
    borderRadius:"12px",
    fontWeight: "bold",
  },

  emergencyCard:{
    background:"#fff",
    padding:"20px",
    borderRadius:"16px",
    marginBottom:"25px",
    borderLeft: "5px solid #d32f2f", /* Aesthetic emphasis line */
    boxShadow: "0 10px 20px rgba(211, 47, 47, 0.08)"
  },

  mapBtn:{
    background:"linear-gradient(135deg, #1e88e5, #1565c0)",
    color:"#fff",
    padding:"14px",
    border:"none",
    borderRadius:"12px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)"
  },

  logout:{
    width:"100%",
    background:"#d32f2f",
    color:"#fff",
    padding:"14px",
    border:"none",
    borderRadius:"12px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "background 0.2s ease"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modalContent: {
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    width: "400px",
    maxWidth: "90%",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
  },
  cameraBtn: {
    background: "#1565c0",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    width: "100%",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem"
  },
  cropperContainer: {
    position: "relative",
    width: "100%",
    height: "300px",
    background: "#333",
    borderRadius: "10px",
    overflow: "hidden"
  },

  notificationStatus: {
    marginTop: "14px",
    padding: "12px 16px",
    background: "#fff4e5",
    border: "1px solid #ffcc80",
    borderRadius: "14px",
    color: "#6b4f00",
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px"
  },

  notificationEnableBtn: {
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: "700"
  },

  notificationOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1100,
    padding: "20px"
  },
  notificationCard: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
    textAlign: "center",
    position: "relative"
  },
  notificationTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "18px"
  },
  notificationIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #fdd835, #fb8c00)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
    position: "relative"
  },
  notificationBadge: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "#d32f2f",
    color: "#fff",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: "700"
  },
  notificationTitleGroup: {
    textAlign: "left",
    flex: 1
  },
  notificationLabel: {
    fontSize: "0.85rem",
    fontWeight: "700",
    letterSpacing: "0.08em",
    color: "#757575",
    textTransform: "uppercase"
  },
  notificationTime: {
    fontSize: "0.85rem",
    color: "#9e9e9e",
    marginTop: "4px"
  },
  notificationClose: {
    background: "transparent",
    border: "none",
    fontSize: "1.6rem",
    lineHeight: "1",
    cursor: "pointer",
    color: "#757575"
  },
  notificationHeadline: {
    margin: "0 0 10px",
    fontSize: "1.4rem",
    color: "#1f2937"
  },
  notificationMessage: {
    margin: "0 0 24px",
    fontSize: "1rem",
    lineHeight: "1.6",
    color: "#4b5563"
  },
  notificationAction: {
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "14px 22px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "1rem"
  }
};

export default DonorDashboard;
