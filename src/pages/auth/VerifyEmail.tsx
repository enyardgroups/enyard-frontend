import { SeoMeta } from "@/components/SeoMeta";
import { Button } from "@/components/ui/button";
import { PAGE_PATHS } from "@/seo/routeMeta";
import { useNavigate, useSearchParams } from "react-router-dom";
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

	useEffect(() => {
		const token = searchParams.get("token");
		
		if (token) {
			verifyEmail(token);
		}
	}, [searchParams]);

	const verifyEmail = async (token: string) => {
		setIsVerifying(true);
		try {
			const response = await get(`/auth/verify-email?token=${token}`);
			if (response.success) {
				// Store token for phone verification step
				if (response.data.token) {
					localStorage.setItem("auth_token", response.data.token);
				}
				setIsVerified(true);
				toast({
					title: "Email Verified",
					description: "Your email has been verified successfully!",
				});
				// Navigate to phone verification after a short delay
				setTimeout(() => {
					navigate("/auth/verify-phone");
				}, 2000);
			}
		} catch (error: any) {
			toast({
				variant: "destructive",
				title: "Verification Failed",
				description: error.message || "Invalid or expired verification token",
			});
		} finally {
			setIsVerifying(false);
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
								<p className="text-muted-foreground">
									Verifying your email...
								</p>
								<Button disabled>
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
									Verifying...
								</Button>
							</>
						) : isVerified ? (
							<>
								<p className="text-green-600 font-semibold">
									Email verified successfully!
								</p>
								<p className="text-muted-foreground">
									Redirecting to phone verification...
								</p>
							</>
						) : (
							<>
								<p className="text-muted-foreground">
									Please check your inbox and click the verification link.
								</p>
								<p className="text-sm text-muted-foreground mt-2">
									If you didn't receive the email, check your spam folder.
								</p>
							</>
						)}
					</div>

					<div className="mt-6 text-center">
						<p className="text-xs text-muted-foreground">
							If you didn’t receive the email, check your spam folder.
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default VerifyEmail;
