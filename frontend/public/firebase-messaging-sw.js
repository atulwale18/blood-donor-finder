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

// Handle notification click to open the app
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click Received.', event.notification.data);
  
  event.notification.close();
  
  // You can pass the specific URL inside payload data, or default to the homepage.
  const targetUrl = event.notification.data?.click_action || '/donor/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // If not open, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});