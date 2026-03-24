const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin (assuming a serviceAccountKey.json exists in backend/config)
// We will try taking advantage of application default credentials, or look for the key
try {
  let serviceAccount;
  try {
     serviceAccount = require('./config/serviceAccountKey.json');
  } catch(e) {
     console.log("No serviceAccountKey.json found. Trying to initialize without it...");
  }
  
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    admin.initializeApp(); // relies on environment variable GOOGLE_APPLICATION_CREDENTIALS
  }

  const token = "fM3ygr3pqGAKXpeGqd7Z_y:APA91bETNp-qAITVeX4zKWhxJkdy_okWqF6qwAVwWU3CflFhqHbhpW63DbS5J1nM-uRcxqa3rGJfVI4yneMi6cxa-CwDfFMM4xAQ0YxFSfIn0xsd_gtQrpY";

  const message = {
    notification: {
      title: 'Blood Emergency Test',
      body: 'This is a test notification from the backend script!'
    },
    token: token
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent message:', response);
      process.exit(0);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      process.exit(1);
    });

} catch (error) {
  console.log("Failed to run test script: ", error.message);
  process.exit(1);
}
