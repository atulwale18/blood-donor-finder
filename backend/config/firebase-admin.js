const admin = require("firebase-admin");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    let raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    // Sometimes Render escapes standard string JSON keys differently.
    serviceAccount = JSON.parse(raw);
  } catch (err) {
    console.error("❌ CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT from Render Environment Variables.", err.message);
  }
} else {
  try {
    serviceAccount = require("./firebase-service-key.json");
  } catch (err) {
    console.error("❌ Firebase service key file not found locally.");
  }
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firebase Admin Initialized successfully");
} else {
  console.log("⚠️ Firebase Admin NOT initialized. Push notifications will fail silently.");
}

module.exports = admin;