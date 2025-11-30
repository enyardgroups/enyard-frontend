import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase Client SDK Configuration
 * These are public credentials - safe to expose in frontend code
 * Get these from Firebase Console: Project Settings → Your apps → Web
 */
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
	appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * Validate Firebase configuration
 */
function validateFirebaseConfig(): boolean {
	const requiredKeys: (keyof typeof firebaseConfig)[] = [
		"apiKey",
		"authDomain",
		"projectId",
		"storageBucket",
		"messagingSenderId",
		"appId",
	];

	const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

	if (missingKeys.length > 0) {
		console.warn(
			`⚠️ Missing Firebase configuration: ${missingKeys.join(", ")}. ` +
				`Please check your .env file and ensure all required Firebase credentials are set.`
		);
		return false;
	}
	return true;
}

// Validate on import
const isFirebaseConfigValid = validateFirebaseConfig();

/**
 * Initialize Firebase App safely
 */
let firebaseApp: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (isFirebaseConfigValid) {
	try {
		firebaseApp = initializeApp(firebaseConfig);
		auth = getAuth(firebaseApp);
		db = getFirestore(firebaseApp);
		console.log("Firebase initialized successfully");
	} catch (error) {
		console.error("Failed to initialize Firebase:", error);
		// App will continue to work without Firebase
	}
} else {
	console.warn("Firebase not initialized due to missing configuration");
}

export { firebaseApp, auth, db };
export default firebaseApp;
