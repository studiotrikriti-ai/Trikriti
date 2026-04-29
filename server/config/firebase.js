const admin = require("firebase-admin");

let initialized = false;

const initFirebase = () => {
  if (initialized) return;

  // Check if serviceAccountKey.json exists (for local dev)
  try {
    const serviceAccount = require("../config/serviceAccountKey.json");
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } catch {
    // Use env vars (for production)
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    } else {
      console.warn(
        "⚠️  Firebase Admin not configured. Admin auth will not work. Add serviceAccountKey.json or env vars."
      );
      return;
    }
  }

  initialized = true;
  console.log("✅ Firebase Admin initialized");
};

initFirebase();

module.exports = admin;
