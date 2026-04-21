importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBK-POf8jgafi8p0T0HLfRP0oO7uW0wm2c",
  authDomain: "blood-donor-finder-e3a2f.firebaseapp.com",
  projectId: "blood-donor-finder-e3a2f",
  storageBucket: "blood-donor-finder-e3a2f.appspot.com",
  messagingSenderId: "506184781428",
  appId: "1:506184781428:web:b0f3daeb2e83448888cb21"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload?.notification?.title || '🚨 Someone needs a blood donation near you';
  const notificationOptions = {
    body: payload?.notification?.body || 'Urgent! Blood is needed at a nearby hospital. Please help save a life.',
    icon: '/logo192.png',
    image: '/logo512.png',
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    data: {
      click_action: "/"
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});