import { SeoMeta } from "@/components/SeoMeta";
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
import { toast } from "@/components/ui/use-toast";
import useApiRequest from "@/hooks/useApiRequest";
import { PAGE_PATHS } from "@/seo/routeMeta";
import { Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const OtpVerification = () => {
	const navigate = useNavigate();
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [isLoading, setIsLoading] = useState(false);
	const { post } = useApiRequest();

	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	// Handle input per box
	const handleChange = (index: number, value: string) => {
		if (!/^[0-9]?$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		// Auto-focus to next input
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	// Move back on Backspace
	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === "Backspace" && otp[index] === "" && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const phone = localStorage.getItem("phone");

		const fullOtp = otp.join("");
		if (fullOtp.length !== 6) {
			toast({
				title: "Invalid OTP",
				description: "Please enter complete 6-digit OTP.",
				variant: "destructive",
			});
			return;
		}

		if (!phone) {
			toast({
				title: "Error",
				description: "Phone number not found. Please try again.",
				variant: "destructive",
			});
			navigate("/auth/login");
			return;
		}

		setIsLoading(true);
		try {
			// Check if this is for registration (has auth token) or login
			const token = localStorage.getItem("auth_token");
			let response;

			if (token) {
				// Registration flow - verify phone after email verification
				response = await post(
					"/sms/verify-otp",
					{ phone, otp: fullOtp },
					{ headers: { Authorization: `Bearer ${token}` } }
				);
			} else {
				// Login flow - passwordless login
				response = await post("/auth/passwordless/verify-otp", {
					phone,
					otp: fullOtp,
				});
			}

			if (response.success) {
				// If token is returned, store it and set user
				if (response.data.token) {
					localStorage.setItem("auth_token", response.data.token);
					const { useAuthStore } = await import("@/store/authStore");
					const { setUser, setToken } = useAuthStore.getState();
					setToken(response.data.token);
					setUser(response.data.user);
				}

				toast({
					title: "Verification Successful",
					description: response.message || "You have been logged in.",
				});
				localStorage.removeItem("phone");
				navigate("/");
			}
		} catch (err: any) {
			toast({
				title: "Invalid OTP",
				description: err.message || "Please try again",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<SeoMeta path={PAGE_PATHS.OTP_VERIFICATION} />
			<div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
				<div className="w-full max-w-md">
					<div className="text-center mb-8 flex flex-col items-center">
						<img
							src="/lovable-uploads/98fab40e-4f49-42c5-bf83-50cb4020d1a4.png"
							alt="ENYARD"
							className="h-8 w-auto mx-auto mb-4"
						/>

						<Card className="glass border-0 shadow-enyard">
							<CardHeader>
								<CardTitle>OTP Verification</CardTitle>
								<CardDescription>
									Enter the 6-digit code sent to your phone
								</CardDescription>
							</CardHeader>

							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="space-y-2">
										<Label>OTP Code</Label>

										<div className="flex justify-between gap-2">
											{otp.map((digit, index) => (
												<Input
													key={index}
													maxLength={1}
													type="text"
													className="w-12 h-12 text-center text-lg glass"
													value={digit}
													ref={(el) => (inputRefs.current[index] = el)}
													onChange={(e) => handleChange(index, e.target.value)}
													onKeyDown={(e) => handleKeyDown(index, e)}
												/>
											))}
										</div>
									</div>

									<Button type="submit" className="w-full" disabled={isLoading}>
										{isLoading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											"Verify OTP"
										)}
									</Button>
								</form>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
};

export default OtpVerification;
