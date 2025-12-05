import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { isAuthenticated, isLoading, token, checkAuth } = useAuthStore();
	const [isChecking, setIsChecking] = useState(true);
	const [hasChecked, setHasChecked] = useState(false);

	useEffect(() => {
		const verifyAuth = async () => {
			// Always check auth if we have a token in localStorage
			const storedToken = localStorage.getItem("auth_token");
			const storedUser = localStorage.getItem("auth_user");
			
			// If we have both token and user, we're optimistically authenticated
			// But still verify with server
			if (storedToken && storedUser) {
				setIsChecking(true);
				try {
					await checkAuth();
				} catch (error) {
					console.error("Auth verification failed:", error);
					// On error, keep optimistic auth if we have stored credentials
				}
			} else if (!storedToken) {
				// No token, mark as checked immediately
				setIsChecking(false);
			} else {
				// Have token but no user, try to verify
				setIsChecking(true);
				try {
					await checkAuth();
				} catch (error) {
					console.error("Auth verification failed:", error);
				}
			}
			setHasChecked(true);
			setIsChecking(false);
		};
		verifyAuth();
	}, [checkAuth]);

	// Show loading state while checking authentication
	if (isChecking || (isLoading && !hasChecked)) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	// Only redirect if not authenticated after check is complete
	// If we have stored credentials, give them a chance to verify
	if (!isAuthenticated && hasChecked) {
		return <Navigate to="/auth/login" replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
