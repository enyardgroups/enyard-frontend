import { SeoMeta } from "@/components/SeoMeta";
import { Button } from "@/components/ui/button";
import { PAGE_PATHS } from "@/seo/routeMeta";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useApiRequest from "@/hooks/useApiRequest";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const VerifyEmail = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { get } = useApiRequest();
	const { toast } = useToast();
	const [isVerifying, setIsVerifying] = useState(false);
	const [isVerified, setIsVerified] = useState(false);
	const [hasToken, setHasToken] = useState(false);
	const [emailFromState, setEmailFromState] = useState<string | null>(null);
	const [fromRegistration, setFromRegistration] = useState(false);
	const [verificationAttempted, setVerificationAttempted] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const token = searchParams.get("token");
		
		// Prevent re-verification if already verified or already attempted
		if (isVerified || verificationAttempted) {
			return;
		}
		
		if (token) {
			setHasToken(true);
			setIsVerifying(true);
			setVerificationAttempted(true);
			verifyEmail(token);
		} else {
			// No token - check if coming from registration
			const state = location.state as { email?: string; fromRegistration?: boolean } | null;
			if (state?.email) {
				setEmailFromState(state.email);
				setFromRegistration(state.fromRegistration || false);
				// Coming from registration - show "Check your mail" message
				setIsVerifying(false);
			} else {
				// No token and not from registration - show message to check email
				setHasToken(false);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams, location]);

	const verifyEmail = async (token: string) => {
		setIsVerifying(true);
		try {
			// The get function returns: { success: true, data: { token, userId, email, emailVerified } }
			const response = await get(`/auth/verify-email?token=${token}`);
			
			// Extract data from response (response.data contains the actual data)
			const data = response?.data || response;
			
			// Store token for phone verification step
			if (data && data.token) {
				localStorage.setItem("auth_token", data.token);
			}
			
			setIsVerified(true);
			setIsVerifying(false);
			
			// Remove token from URL to prevent re-verification
			const newSearchParams = new URLSearchParams(searchParams);
			newSearchParams.delete("token");
			navigate({ search: newSearchParams.toString() }, { replace: true });
			
			toast({
				title: "Email Verified",
				description: "Your email has been verified successfully! Redirecting to phone verification...",
			});
			
			// Navigate to phone verification after a short delay
			setTimeout(() => {
				navigate("/auth/verify-phone", { replace: true });
			}, 2000);
		} catch (error: any) {
			setIsVerified(false);
			setIsVerifying(false);
			// Only show error if it's not an "already verified" or "already used" case
			if (error.message?.includes("already verified") || 
			    error.message?.includes("Already verified") ||
			    error.message?.includes("already used")) {
				// Email already verified - proceed to phone verification
				setIsVerified(true);
				setIsVerifying(false);
				
				// Remove token from URL
				const newSearchParams = new URLSearchParams(searchParams);
				newSearchParams.delete("token");
				navigate({ search: newSearchParams.toString() }, { replace: true });
				
				toast({
					title: "Email Already Verified",
					description: "Your email was already verified. Redirecting to phone verification...",
				});
				setTimeout(() => {
					navigate("/auth/verify-phone", { replace: true });
				}, 2000);
			} else {
				toast({
					variant: "destructive",
					title: "Verification Failed",
					description: error.message || "Invalid or expired verification token",
				});
			}
		}
	};

	return (
		<>
			<SeoMeta path={PAGE_PATHS.VerifyEmail} />

			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
			</div>

			<div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
				<div className="relative z-10 w-full max-w-md">
					<div className="text-center mb-8 gap-4 flex flex-col items-center">
						<img
							src="/lovable-uploads/98fab40e-4f49-42c5-bf83-50cb4020d1a4.png"
							alt="ENYARD"
							className="h-8 w-auto mx-auto mb-4"
						/>
						<h1 className="text-2xl font-bold">Verify Email</h1>
						{isVerifying ? (
							<>
								<div className="flex flex-col items-center gap-4">
									<Loader2 className="h-8 w-8 animate-spin text-primary" />
									<p className="text-lg font-semibold text-primary">
										Verifying your email...
									</p>
									<p className="text-muted-foreground text-sm">
										Please wait while we verify your email address
									</p>
								</div>
							</>
						) : isVerified ? (
							<>
								<div className="flex flex-col items-center gap-4">
									<div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
										<svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<p className="text-green-600 font-semibold text-lg">
										Email verified successfully!
									</p>
									<p className="text-muted-foreground">
										Redirecting to phone verification...
									</p>
								</div>
							</>
						) : hasToken ? (
							<>
								<p className="text-muted-foreground">
									Processing verification...
								</p>
							</>
						) : emailFromState || fromRegistration ? (
							<>
								<div className="flex flex-col items-center gap-4">
									<div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
										<svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
									</div>
									<p className="text-lg font-semibold">
										Check your mail to verify your email
									</p>
									<p className="text-muted-foreground">
										We've sent a verification link to <strong>{emailFromState || "your email address"}</strong>.
									</p>
									<p className="text-muted-foreground text-sm">
										Please click the "Verify Email" button in the email to continue.
									</p>
									<p className="text-sm text-muted-foreground mt-2">
										If you didn't receive the email, check your spam folder.
									</p>
									<div className="mt-4 p-4 bg-muted/50 rounded-lg">
										<p className="text-xs text-muted-foreground">
											💡 The verification link will expire in 24 hours.
										</p>
									</div>
								</div>
							</>
						) : (
							<>
								<div className="flex flex-col items-center gap-4">
									<div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
										<svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
									</div>
									<p className="text-lg font-semibold">
										Check your email
									</p>
									<p className="text-muted-foreground">
										We've sent a verification link to your email address.
									</p>
									<p className="text-muted-foreground text-sm">
										Please click the "Verify Email" button in the email to continue.
									</p>
									<p className="text-sm text-muted-foreground mt-2">
										If you didn't receive the email, check your spam folder.
									</p>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default VerifyEmail;
