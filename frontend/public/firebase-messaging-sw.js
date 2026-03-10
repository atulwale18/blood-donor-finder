importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBK-POf8jgafi8p0T0HLfRP0oO7uW0wm2c",
  authDomain: "blood-donor-finder-e3a2f.firebaseapp.com",
  projectId: "blood-donor-finder-e3a2f",
  storageBucket: "blood-donor-finder-e3a2f.firebasestorage.app",
  messagingSenderId: "506184781428",
  appId: "1:506184781428:web:85538cd26c49100e88cb21"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://cdn-icons-png.flaticon.com/512/2966/2966486.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});