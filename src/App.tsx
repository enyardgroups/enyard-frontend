import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import About from "./pages/About";
import Career from "./pages/Career";
import Blog from "./pages/Blog";
import Documentation from "./pages/Documentation";
import Downloads from "./pages/Downloads";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import TimeX from "./pages/TimeX";
import CoreX from "./pages/CoreX";
import XSafety from "./pages/XSafety";
import MedzorX from "./pages/MedzorX";
import FleetX from "./pages/FleetX";
import Penquin from "./pages/Penquin";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import AuthLayout from "./pages/auth/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DocX from "./pages/DocX";
import WorkX365 from "./pages/WorkX365";
import GitX from "./pages/GitX";
import VerifyEmail from "./pages/auth/VerifyEmail";
import PhoneNumber from "./pages/auth/PhoneNumber";
import OtpVerification from "./pages/auth/OtpVerification";
import GoogleAnalytics from "./components/GoogleAnalytics";
import PageTracking from "./components/PageTracking";

const queryClient = new QueryClient();

const App = () => {
	const { checkAuth } = useAuthStore();

	useEffect(() => {
		// Check authentication in background without blocking app load
		// This allows UI to render immediately while auth check happens
		const storedToken = localStorage.getItem("auth_token");
		if (storedToken) {
			// Check auth in background, don't await
			checkAuth().catch((error) => {
				console.error("Failed to check authentication:", error);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<GoogleAnalytics />
				<Toaster />
				<Sonner />
				<BrowserRouter>
					<PageTracking />
					<ScrollToTop />
					<Routes>
						<Route path="/" element={<Index />} />
						<Route element={<AuthLayout />}>
							<Route path="auth/login" element={<Login />} />
							<Route path="auth/register" element={<Register />} />
						</Route>
						<Route path="auth/verify-email" element={<VerifyEmail />} />
						<Route path="auth/verify-phone" element={<PhoneNumber />} />
						<Route path="auth/otp-verification" element={<OtpVerification />} />

						<Route
							path="/admin"
							element={
								<ProtectedRoute>
									<AdminDashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<ClientDashboard />
								</ProtectedRoute>
							}
						/>

						{/* Company Routes */}
						<Route path="/about" element={<About />} />
						<Route path="/career" element={<Career />} />

						{/* Product Routes */}
						<Route path="/products/timex" element={<TimeX />} />
						<Route path="/products/corex" element={<CoreX />} />
						<Route path="/products/fleetx" element={<FleetX />} />
						<Route path="/products/xsafety" element={<XSafety />} />
						<Route path="/products/medzorx" element={<MedzorX />} />
						<Route path="/products/penquinx" element={<Penquin />} />
						<Route path="/products/docx" element={<DocX />} />
						<Route path="/products/workx365" element={<WorkX365 />} />
						<Route path="/products/gitx" element={<GitX />} />

						{/* Resource Routes */}
						<Route path="/blog" element={<Blog />} />
						<Route path="/documentation" element={<Documentation />} />
						<Route path="/downloads" element={<Downloads />} />

						{/* Other Routes */}
						<Route path="/contact" element={<Contact />} />
						<Route path="/privacy" element={<Privacy />} />
						<Route path="/terms" element={<Terms />} />
						<Route path="/security" element={<Security />} />

						{/* Catch-all route */}
						<Route path="*" element={<NotFound />} />
					</Routes>
				</BrowserRouter>
			</TooltipProvider>
		</QueryClientProvider>
	);
};

export default App;
