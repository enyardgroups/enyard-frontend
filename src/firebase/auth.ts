import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	sendPasswordResetEmail,
	confirmPasswordReset,
	updateProfile,
	User,
	AuthError,
	sendEmailVerification,
} from "firebase/auth";
import { auth } from "./config";

/**
 * Firebase Auth Service
 * Handles all authentication operations using Firebase Web SDK
 */

/**
 * Sign up a new user with email and password
 * @param email User email address
 * @param password User password (must be 6+ characters)
 * @returns Firebase User object
 */
export async function signUpWithEmail(
	email: string,
	password: string
): Promise<User> {
	if (!auth) {
		throw new Error("Firebase is not initialized. Please check your configuration.");
	}
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		return userCredential.user;
	} catch (error) {
		throw handleFirebaseAuthError(error);
	}
}

export async function sendVerificationEmail(): Promise<void> {
	if (!auth) {
		throw new Error("Firebase is not initialized. Please check your configuration.");
	}
	if (!auth.currentUser) {
		throw new Error("No authenticated user found");
	}

	return await sendEmailVerification(auth.currentUser);
}
export async function isUserEmailVerified(): Promise<boolean> {
	if (!auth) {
		return false;
	}
	const currentUser = auth.currentUser;

	if (!currentUser) return false;

	// Refresh user to get updated emailVerified status
	await currentUser.reload();

	return currentUser.emailVerified === true;
}
/**
 * Sign in an existing user with email and password
 * @param email User email address
 * @param password User password
 * @returns Firebase User object
 */
export async function signInWithEmail(
	email: string,
	password: string
): Promise<User> {
	if (!auth) {
		throw new Error("Firebase is not initialized. Please check your configuration.");
	}
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		return userCredential.user;
	} catch (error) {
		throw handleFirebaseAuthError(error);
	}
}

/**
 * Sign out the current user
 */
export async function signOutUser(): Promise<void> {
	if (!auth) {
		return;
	}
	try {
		await signOut(auth);
	} catch (error) {
		throw handleFirebaseAuthError(error);
	}
}

/**
 * Send password reset email
 * @param email User email address
 */
export async function sendPasswordReset(email: string): Promise<void> {
	if (!auth) {
		throw new Error("Firebase is not initialized. Please check your configuration.");
	}
	try {
		await sendPasswordResetEmail(auth, email);
	} catch (error) {
		throw handleFirebaseAuthError(error);
	}
}

/**
 * Reset password with code
 * @param code Password reset code from email
 * @param newPassword New password
 */
export async function resetPassword(
	code: string,
	newPassword: string
): Promise<void> {
	if (!auth) {
		throw new Error("Firebase is not initialized. Please check your configuration.");
	}
	try {
		await confirmPasswordReset(auth, code, newPassword);
	} catch (error) {
		throw handleFirebaseAuthError(error);
	}
}

/**
 * Update user profile
 * @param updates Profile updates (displayName, photoURL)
 */
export async function updateUserProfile(updates: {
	displayName?: string | null;
	photoURL?: string | null;
}): Promise<void> {
	if (!auth) {
		throw new Error("Firebase is not initialized. Please check your configuration.");
	}
	try {
		const user = auth.currentUser;
		if (!user) {
			throw new Error("No user is currently signed in");
		}
		await updateProfile(user, updates);
	} catch (error) {
		throw handleFirebaseAuthError(error);
	}
}

/**
 * Get ID token for backend API calls
 * @returns Firebase ID token
 */
export async function getIdToken(): Promise<string> {
	if (!auth) {
		throw new Error("Firebase is not initialized. Please check your configuration.");
	}
	try {
		const user = auth.currentUser;
		if (!user) {
			throw new Error("No user is currently signed in");
		}
		return await user.getIdToken(true); // force refresh
	} catch (error) {
		throw handleFirebaseAuthError(error);
	}
}

/**
 * Get current authenticated user
 * @returns Firebase User object or null
 */
export function getCurrentUser(): User | null {
	if (!auth) {
		return null;
	}
	return auth.currentUser;
}

/**
 * Subscribe to auth state changes
 * @param callback Function called with user object when auth state changes
 * @returns Unsubscribe function
 */
export function onAuthStateChange(
	callback: (user: User | null) => void
): () => void {
	if (!auth) {
		// Return a no-op unsubscribe function if auth is not initialized
		return () => {};
	}
	return auth.onAuthStateChanged(callback);
}

/**
 * Handle Firebase Auth errors and return user-friendly messages
 */
function handleFirebaseAuthError(error: unknown): Error {
	if (!(error instanceof Error)) {
		return new Error("An unknown error occurred");
	}

	const firebaseError = error as AuthError;

	const errorMessages: { [key: string]: string } = {
		"auth/user-not-found": "Email not found. Please check and try again.",
		"auth/wrong-password": "Incorrect password. Please try again.",
		"auth/email-already-in-use": "Email is already registered.",
		"auth/weak-password": "Password must be at least 6 characters.",
		"auth/invalid-email": "Invalid email address.",
		"auth/operation-not-allowed": "This operation is not allowed.",
		"auth/too-many-requests":
			"Too many login attempts. Please try again later.",
		"auth/account-exists-with-different-credential":
			"Account exists with different credentials.",
		"auth/invalid-credential": "Invalid credentials. Please try again.",
		"auth/user-disabled": "This user account has been disabled.",
		"auth/popup-closed-by-user": "Sign in was cancelled.",
		"auth/network-request-failed":
			"Network error. Please check your connection.",
	};

	const message =
		errorMessages[firebaseError.code] ||
		firebaseError.message ||
		"Authentication failed";

	return new Error(message);
}
