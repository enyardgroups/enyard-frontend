import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SeoMeta } from "@/components/SeoMeta";
import { PAGE_PATHS } from "@/seo/routeMeta";
import useApiRequest from "@/hooks/useApiRequest";
import { useAuthStore } from "@/store/authStore";
import Recaptcha from "@/components/Recaptcha";

const Register = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

	const navigate = useNavigate();
	const { post } = useApiRequest();
	const { setUser, setToken } = useAuthStore();
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		
		// Validation
		if (password !== confirmPassword) {
			toast({
				variant: "destructive",
				title: "Validation Error",
				description: "Passwords don't match",
			});
			setIsLoading(false);
			return;
		}

		if (password.length < 6) {
			toast({
				variant: "destructive",
				title: "Validation Error",
				description: "Password must be at least 6 characters",
			});
			setIsLoading(false);
			return;
		}

		// Re-execute reCAPTCHA to get a fresh token
		let freshToken = recaptchaToken;
		const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
		
		if (siteKey && window.grecaptcha && window.grecaptcha.ready) {
			try {
				await window.grecaptcha.ready();
				freshToken = await window.grecaptcha.execute(siteKey, { action: 'register' });
				console.log('reCAPTCHA token generated:', freshToken ? 'Success' : 'Failed');
				if (freshToken) {
					setRecaptchaToken(freshToken);
				}
			} catch (error) {
				console.error('reCAPTCHA execution error:', error);
				// Continue with existing token if re-execution fails
			}
		}

		// Only require token if site key is configured
		if (siteKey && !freshToken) {
			toast({
				variant: "destructive",
				title: "reCAPTCHA Error",
				description: "Please wait for reCAPTCHA to load and try again",
			});
			setIsLoading(false);
			return;
		}

		try {
			// Register with backend
			const response = await post("/auth/register", {
				name,
				email,
				password,
				confirmPassword,
				recaptchaToken: freshToken,
			});

			if (response && response.success) {
				toast({
					title: "Registration Successful",
					description: "Please check your email to verify your account.",
				});
				// Navigate to email verification page
				navigate("/auth/verify-email", { state: { email } });
			}
		} catch (err: any) {
			console.error('Registration error details:', err);
			const errorMessage = err.response?.data?.message || 
			                     err.message || 
			                     err.error || 
			                     "An error occurred during registration";
			toast({
				variant: "destructive",
				title: "Registration Failed",
				description: errorMessage,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<SeoMeta path={PAGE_PATHS.REGISTER} />
			<TabsContent value="/auth/register">
				<Card className="glass border-0 shadow-enyard">
					<CardHeader>
						<CardTitle>Register</CardTitle>
						<CardDescription>Create a new client account</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* First Name */}
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									type="text"
									placeholder="Name"
									className="glass"
									value={name}
									onChange={(e) => {
										const value = e.target.value;
										setName(value);
									}}
									required
								/>
							</div>
							{/* Email */}
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="your@company.com"
									className="glass"
									value={email}
									onChange={(e) => {
										const value = e.target.value;
										setEmail(value);
									}}
									required
								/>
							</div>
							{/* Password */}
							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									className="glass"
									value={password}
									onChange={(e) => {
										const value = e.target.value;
										setPassword(value);
									}}
									required
								/>
							</div>
							{/* Password */}
							<div className="space-y-2">
								<Label htmlFor="confirmpassword">Confirm Password</Label>
								<Input
									id="Confirmpassword"
									type="password"
									className="glass"
									value={confirmPassword}
									onChange={(e) => {
										const value = e.target.value;
										setConfirmPassword(value);
									}}
									required
								/>
							</div>

							<Recaptcha
								version="v3"
								action="register"
								onVerify={(token) => setRecaptchaToken(token)}
								onError={(error) => {
									toast({
										variant: "destructive",
										title: "reCAPTCHA Error",
										description: error,
									});
								}}
							/>

							<Button className="w-full" type="submit" disabled={isLoading || !recaptchaToken}>
								{isLoading ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									"Verify Email"
								)}
							</Button>
						</form>

						<div className="mt-4 text-center text-sm">
							Already have an account?{" "}
							<Link to="/auth/login" className="underline">
								Sign in
							</Link>
						</div>
					</CardContent>
				</Card>
			</TabsContent>
		</>
	);
};

export default Register;
