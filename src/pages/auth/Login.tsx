import { useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

declare global {
	interface Window {
		grecaptcha: {
			ready: (callback: () => void) => Promise<void>;
			execute: (siteKey: string, options: { action: string }) => Promise<string>;
		};
	}
}
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { SeoMeta } from "@/components/SeoMeta";
import { PAGE_PATHS } from "@/seo/routeMeta";
import useApiRequest from "@/hooks/useApiRequest";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Recaptcha from "@/components/Recaptcha";
import { trackAuth, trackFormSubmit } from "@/utils/analytics";
import { getDeviceId, getDeviceInfo } from "@/utils/deviceFingerprint";

const Login = () => {
	const [loginType, setLoginType] = useState<"password" | "passwordless">("password");
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [countryCode, setCountryCode] = useState("+91");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
	const recaptchaRef = useRef<HTMLDivElement>(null);
	const { setUser, setToken } = useAuthStore();
	const { post } = useApiRequest();
	const navigate = useNavigate();
	const { toast } = useToast();
	const [searchParams] = useSearchParams();

	const handlePasswordLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			// Get device ID and info (silently)
			const deviceId = getDeviceId();
			const deviceInfo = getDeviceInfo();
			
			// The post function returns the full result object
			// Backend returns: { success: true, data: { user: {...}, token: '...' } }
			// post returns: { success: true, data: { user: {...}, token: '...' } }
			const response = await post("/auth/login", { 
				email, 
				password,
				deviceId,
				deviceInfo,
			});
			// Extract data from response
			const loginData = response && response.data ? response.data : response;
			if (loginData && loginData.token) {
				const { token, user } = loginData;
				// Store token and user in localStorage for persistence
				localStorage.setItem("auth_token", token);
				localStorage.setItem("auth_user", JSON.stringify(user));
				// Set token and user which will set authenticated state
				setToken(token);
				setUser(user);
				// Explicitly set authenticated state
				useAuthStore.setState({
					isAuthenticated: true,
					token: token,
					user: user,
					isLoading: false
				});
				// Track successful login
				trackAuth("login", "password", true);
				trackFormSubmit("login", "/auth/login", true, { email });
				toast({
					title: "Login Successful",
					description: "Welcome back!",
				});
				// Check for redirect parameter
				const redirect = searchParams.get("redirect") || "/";
				navigate(redirect);
			} else {
				throw new Error("Invalid response from server");
			}
		} catch (error: any) {
			// Track failed login
			trackAuth("login", "password", false);
			trackFormSubmit("login", "/auth/login", false, { email, error: error.message });
			console.error("Login error:", error);
			
			// Better error messages
			let errorMessage = error.message || "An unexpected error occurred.";
			if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
				errorMessage = "Cannot connect to server. Please ensure the backend server is running on port 3011.";
			} else if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			}
			
			toast({
				title: "Login Failed",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handlePasswordlessLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Validate phone number (should be 10 digits)
		const sanitizedPhone = phoneNumber.replace(/\D/g, "");
		if (sanitizedPhone.length !== 10) {
			toast({
				title: "Invalid Phone Number",
				description: "Please enter a valid 10-digit phone number",
				variant: "destructive",
			});
			return;
		}

		// Combine country code and phone number
		const fullPhoneNumber = `${countryCode}${sanitizedPhone}`;
		
		// Re-execute reCAPTCHA to get a fresh token
		let currentToken = recaptchaToken;
		if (recaptchaRef.current && (recaptchaRef.current as any).executeRecaptcha) {
			try {
				// Try to get a fresh token
				const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
				if (siteKey && window.grecaptcha) {
					await window.grecaptcha.ready();
					currentToken = await window.grecaptcha.execute(siteKey, { action: 'passwordless_login' });
					setRecaptchaToken(currentToken);
				}
			} catch (recaptchaError) {
				console.warn("Failed to re-execute reCAPTCHA, using existing token:", recaptchaError);
			}
		}

		// Check if reCAPTCHA token is available
		if (!currentToken) {
			toast({
				title: "reCAPTCHA Required",
				description: "Please wait for reCAPTCHA to load, then try again.",
				variant: "destructive",
			});
			return;
		}
		
		setIsLoading(true);
		try {
			console.log("Sending OTP request:", { phone: fullPhoneNumber, hasRecaptchaToken: !!currentToken });
			
			// Request OTP
			const response = await post("/sms/login/request-otp", { phone: fullPhoneNumber, recaptchaToken: currentToken });
			
			console.log("OTP request response:", response);
			
			// Track OTP request
			trackAuth("login", "passwordless", true);
			trackFormSubmit("passwordless_login", "/auth/login", true, { phone: fullPhoneNumber });
			toast({
				title: "OTP Sent",
				description: "Please check your phone for the verification code.",
			});
			localStorage.setItem("phone", fullPhoneNumber);
			// Pass redirect parameter to OTP verification
			const redirect = searchParams.get("redirect");
			const otpPath = redirect ? `/auth/otp-verification?redirect=${encodeURIComponent(redirect)}` : "/auth/otp-verification";
			navigate(otpPath);
		} catch (error: any) {
			// Track failed OTP request
			trackAuth("login", "passwordless", false);
			trackFormSubmit("passwordless_login", "/auth/login", false, { phone: fullPhoneNumber, error: error.message });
			console.error("OTP request error:", error);
			console.error("Error response:", error.response?.data);
			
			// Provide more specific error messages
			let errorMessage = "An unexpected error occurred.";
			if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			} else if (error.message) {
				errorMessage = error.message;
			}
			
			toast({
				title: "Failed to Send OTP",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<SeoMeta path={PAGE_PATHS.LOGIN} />
			<TabsContent value="/auth/login">
				<Card className="glass border-0 shadow-enyard">
					<CardHeader>
						<CardTitle>Client Login</CardTitle>
						<CardDescription>
							Access your products and subscription status
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs value={loginType} onValueChange={(v) => setLoginType(v as "password" | "passwordless")} className="w-full">
							<TabsList className="grid w-full grid-cols-2 mb-4">
								<TabsTrigger value="password">Password Login</TabsTrigger>
								<TabsTrigger value="passwordless">Passwordless Login</TabsTrigger>
							</TabsList>

							{loginType === "password" ? (
								<form onSubmit={handlePasswordLogin} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="client-email">Email</Label>
										<Input
											id="client-email"
											type="email"
											placeholder="your@company.com"
											className="glass"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="client-password">Password</Label>
										<div className="relative">
											<Input
												id="client-password"
												type={showPassword ? "text" : "password"}
												placeholder="Enter your password"
												className="glass pr-10"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												required
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-0 top-0 h-full px-3"
												onClick={() => setShowPassword(!showPassword)}>
												{showPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>
									<div className="flex items-center justify-between">
										<Link
											to="/forgot-password"
											className="text-sm text-primary hover:underline">
											Forgot password?
										</Link>
										<Link
											to={searchParams.get("redirect") ? `/auth/register?redirect=${encodeURIComponent(searchParams.get("redirect")!)}` : "/auth/register"}
											className="text-sm text-primary hover:underline">
											Sign up
										</Link>
									</div>
									<Button className="w-full" type="submit" disabled={isLoading}>
										{isLoading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											"Sign In"
										)}
									</Button>
								</form>
							) : (
								<form onSubmit={handlePasswordlessLogin} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="client-phone">Phone Number</Label>
										<div className="flex gap-2">
											<select
												value={countryCode}
												onChange={(e) => setCountryCode(e.target.value)}
												className="glass border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
												<option value="+1">🇺🇸 +1</option>
												<option value="+44">🇬🇧 +44</option>
												<option value="+61">🇦🇺 +61</option>
												<option value="+91">🇮🇳 +91</option>
												<option value="+971">🇦🇪 +971</option>
												<option value="+81">🇯🇵 +81</option>
												<option value="+49">🇩🇪 +49</option>
												<option value="+33">🇫🇷 +33</option>
												<option value="+86">🇨🇳 +86</option>
												<option value="+7">🇷🇺 +7</option>
											</select>
											<Input
												id="client-phone"
												type="tel"
												placeholder="9876543210"
												className="glass flex-1"
												value={phoneNumber}
												onChange={(e) => {
													const value = e.target.value;
													// Accept only digits
													if (/^\d*$/.test(value)) {
														setPhoneNumber(value);
													}
												}}
												maxLength={10}
												required
											/>
										</div>
										<p className="text-xs text-muted-foreground">
											Enter 10-digit phone number without country code
										</p>
									</div>
									<div className="text-sm text-muted-foreground">
										We'll send you a verification code via SMS
									</div>
									<div ref={recaptchaRef}>
										<Recaptcha
											version="v3"
											action="passwordless_login"
											onVerify={(token) => setRecaptchaToken(token)}
											onError={(error) => {
												toast({
													variant: "destructive",
													title: "reCAPTCHA Error",
													description: error,
												});
											}}
										/>
									</div>
									<Button className="w-full" type="submit" disabled={isLoading || !recaptchaToken}>
										{isLoading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											"Send OTP"
										)}
									</Button>
								</form>
							)}
						</Tabs>
					</CardContent>
				</Card>
			</TabsContent>
		</>
	);
};

export default Login;
