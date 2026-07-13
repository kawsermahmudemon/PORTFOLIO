// Firebase Configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, db, storage, auth;

try {
  // Check if Firebase is loaded
  if (typeof firebase !== 'undefined') {
    app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    storage = firebase.storage();
    auth = firebase.auth();
    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase SDK not loaded.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Export for other scripts
window.db = db;
window.storage = storage;
window.auth = auth;
