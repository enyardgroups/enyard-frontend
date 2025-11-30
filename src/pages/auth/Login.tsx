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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { SeoMeta } from "@/components/SeoMeta";
import { PAGE_PATHS } from "@/seo/routeMeta";
import useApiRequest from "@/hooks/useApiRequest";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Recaptcha from "@/components/Recaptcha";

const Login = () => {
	const [loginType, setLoginType] = useState<"password" | "passwordless">("password");
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [phone, setPhone] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
	const { setUser, setToken } = useAuthStore();
	const { post } = useApiRequest();
	const navigate = useNavigate();
	const { toast } = useToast();

	const handlePasswordLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const response = await post("/auth/login", { email, password });
			if (response.success && response.data.token) {
				setToken(response.data.token);
				setUser(response.data.user);
				toast({
					title: "Login Successful",
					description: "Welcome back!",
				});
				navigate("/");
			}
		} catch (error: any) {
			console.error(error);
			toast({
				title: "Login Failed",
				description: error.message || "An unexpected error occurred.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handlePasswordlessLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			// Request OTP
			await post("/sms/login/request-otp", { phone, recaptchaToken });
			toast({
				title: "OTP Sent",
				description: "Please check your phone for the verification code.",
			});
			localStorage.setItem("phone", phone);
			navigate("/auth/otp-verification");
		} catch (error: any) {
			console.error(error);
			toast({
				title: "Failed to Send OTP",
				description: error.message || "An unexpected error occurred.",
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
											to="/auth/register"
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
										<Input
											id="client-phone"
											type="tel"
											placeholder="+1234567890"
											className="glass"
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
											required
										/>
									</div>
									<div className="text-sm text-muted-foreground">
										We'll send you a verification code via SMS
									</div>
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
