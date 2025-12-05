import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/services";
import { PAGE_PATHS } from "@/seo/routeMeta";
import { SeoMeta } from "@/components/SeoMeta";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import useApiRequest from "@/hooks/useApiRequest";
import {
	Shield,
	Lock,
	Code,
	Brain,
	Zap,
	Target,
	Rocket,
	CheckCircle2,
	Loader2,
	ArrowRight,
	Sparkles,
	Network,
	Key,
	Eye,
	Globe,
	Heart,
} from "lucide-react";
import penquinLogo from "@/assets/brands/PenquinX-Photoroom.png";
import secureWorldzLogo from "@/assets/brands/Secure Worldz.png";

const Penquin = () => {
	const { toast } = useToast();
	const navigate = useNavigate();
	const { isAuthenticated, user } = useAuthStore();
	const { post, get } = useApiRequest();
	
	// Check if user has verified phone number
	const hasVerifiedPhone = isAuthenticated && user && (user as any).phone_verified === true;
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		countryCode: "+91",
		mobile: "",
		profession: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);
	const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false);
	const [contributeFormData, setContributeFormData] = useState({
		name: "",
		email: "",
		mobile: "",
		amount: "",
	});
	const [isContributeLoading, setIsContributeLoading] = useState(false);
	const [isContributeSubmitted, setIsContributeSubmitted] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Launch date: December 10, 2025 at 6:30 PM
	const launchDate = new Date("2025-12-10T18:30:00").getTime();

	useEffect(() => {
		const timer = setInterval(() => {
			const now = new Date().getTime();
			const distance = launchDate - now;

			if (distance > 0) {
				setTimeLeft({
					days: Math.floor(distance / (1000 * 60 * 60 * 24)),
					hours: Math.floor(
						(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
					),
					minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
					seconds: Math.floor((distance % (1000 * 60)) / 1000),
				});
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [launchDate]);

	// Animated background particles
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const particles: Array<{
			x: number;
			y: number;
			vx: number;
			vy: number;
			size: number;
		}> = [];

		for (let i = 0; i < 100; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				vx: (Math.random() - 0.5) * 0.5,
				vy: (Math.random() - 0.5) * 0.5,
				size: Math.random() * 2 + 1,
			});
		}

		const animate = () => {
			ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			particles.forEach((particle) => {
				particle.x += particle.vx;
				particle.y += particle.vy;

				if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
				if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

				ctx.beginPath();
				ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
				ctx.fillStyle = "rgba(59, 130, 246, 0.5)";
				ctx.fill();
			});

			// Connect nearby particles
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < 150) {
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - distance / 150)})`;
						ctx.lineWidth = 0.5;
						ctx.stroke();
					}
				}
			}

			requestAnimationFrame(animate);
		};

		animate();

		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleProfessionChange = (value: string) => {
		setFormData({
			...formData,
			profession: value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Validate mobile number (should be 10 digits)
		const sanitizedMobile = formData.mobile.replace(/\D/g, "");
		if (sanitizedMobile.length !== 10) {
			toast({
				title: "Invalid Mobile Number",
				description: "Please enter a valid 10-digit mobile number",
				variant: "destructive",
			});
			return;
		}

		// Combine country code and mobile number
		const fullPhoneNumber = `${formData.countryCode}${sanitizedMobile}`;
		
		// Check if user is authenticated
		if (!isAuthenticated) {
			// Store form data in localStorage to restore after login
			localStorage.setItem('penquinx_waiting_list_form', JSON.stringify(formData));
			setShowLoginPrompt(true);
			return;
		}

		setIsLoading(true);
		try {
			// Use the new authenticated endpoint
			const response = await post("/penquinx/waiting-list", {
				name: formData.name,
				email: formData.email,
				phone: fullPhoneNumber,
				profession: formData.profession,
			});

			// Check if already on list
			if (response && response.data) {
				setIsSubmitted(true);
				setIsDialogOpen(false);
				toast({
					title: "🎉 You're on the list!",
					description: "We'll notify you when PenquinX launches. Check your email and SMS!",
				});
				setFormData({ name: "", email: "", countryCode: "+91", mobile: "", profession: "" });
				// Clear stored form data
				localStorage.removeItem('penquinx_waiting_list_form');
			}
		} catch (error: any) {
			console.error("Failed to submit notification:", error);
			
			// Handle 401 - user not authenticated (shouldn't happen but just in case)
			if (error.response?.status === 401) {
				localStorage.setItem('penquinx_waiting_list_form', JSON.stringify(formData));
				setShowLoginPrompt(true);
				return;
			}
			
			toast({
				title: "Submission Failed",
				description: error.response?.data?.message || error.message || "An unexpected error occurred.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Function to fetch user details from API
	const fetchUserDetails = async () => {
		if (!isAuthenticated) return null;
		
		try {
			const response = await get("/auth/me");
			if (response && response.data) {
				return response.data;
			}
			return null;
		} catch (error: any) {
			console.error("Failed to fetch user details:", error);
			return null;
		}
	};

	// Restore form data after login and auto-submit
	useEffect(() => {
		if (isAuthenticated) {
			const storedForm = localStorage.getItem('penquinx_waiting_list_form');
			if (storedForm) {
				try {
					const parsedForm = JSON.parse(storedForm);
					setFormData(parsedForm);
					// Open dialog and auto-submit
					setIsDialogOpen(true);
					// Auto-submit after a short delay to ensure state is updated
					setTimeout(async () => {
						try {
							// Combine country code and mobile number before submitting
							const sanitizedMobile = parsedForm.mobile?.replace(/\D/g, "") || "";
							const fullPhoneNumber = `${parsedForm.countryCode || "+91"}${sanitizedMobile}`;
							
							const response = await post("/penquinx/waiting-list", {
								...parsedForm,
								phone: fullPhoneNumber,
							});
							if (response && response.data) {
								setIsSubmitted(true);
								toast({
									title: "🎉 You're on the list!",
									description: "We'll notify you when PenquinX launches. Check your email and SMS!",
								});
								setFormData({ name: "", email: "", countryCode: "+91", mobile: "", profession: "" });
								localStorage.removeItem('penquinx_waiting_list_form');
							}
						} catch (error: any) {
							console.error("Auto-submit failed:", error);
							toast({
								title: "Submission Failed",
								description: error.response?.data?.message || error.message || "An unexpected error occurred.",
								variant: "destructive",
							});
						}
					}, 500);
				} catch (e) {
					console.error('Failed to parse stored form data:', e);
				}
			}
		}
	}, [isAuthenticated, post, toast]);

	const handleContributeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setContributeFormData({
			...contributeFormData,
			[e.target.name]: e.target.value,
		});
	};

	const handleContributeSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsContributeLoading(true);
		try {
			// TODO: Add API endpoint for contribution submission
			// await contributeService.submitContribution(contributeFormData);
			
			// Simulate API call for now
			await new Promise((resolve) => setTimeout(resolve, 1500));
			
			setIsContributeSubmitted(true);
			toast({
				title: "🎉 Thank you for your contribution!",
				description: "We'll contact you shortly to proceed with your contribution.",
			});
			setContributeFormData({ name: "", email: "", mobile: "", amount: "" });
		} catch (error: any) {
			console.error("Failed to submit contribution:", error);
			toast({
				title: "Submission Failed",
				description: error.message || "An unexpected error occurred.",
				variant: "destructive",
			});
		} finally {
			setIsContributeLoading(false);
		}
	};

	const features = [
		{
			icon: Shield,
			title: "Vulnerability Labs",
			description: "Hands-on exploitation labs from beginner to advanced",
			color: "from-blue-500 to-cyan-500",
		},
		{
			icon: Code,
			title: "Tool Mastery",
			description: "Learn industry-standard cybersecurity tools",
			color: "from-purple-500 to-pink-500",
		},
		{
			icon: Brain,
			title: "AI-Powered Learning",
			description: "Personalized learning paths with AI guidance",
			color: "from-green-500 to-emerald-500",
		},
		{
			icon: Target,
			title: "CTF Challenges",
			description: "Real-world scenarios and capture the flag",
			color: "from-orange-500 to-red-500",
		},
		{
			icon: Network,
			title: "Threat Intelligence",
			description: "Stay updated with latest threats and defenses",
			color: "from-indigo-500 to-blue-500",
		},
		{
			icon: Key,
			title: "Professional Path",
			description: "From beginner to cybersecurity professional",
			color: "from-yellow-500 to-orange-500",
		},
	];

	return (
		<>
			<SeoMeta path={PAGE_PATHS.PENQUINX} />
			<style>{`
				.penquinx-page nav {
					background: transparent !important;
					backdrop-filter: none !important;
					border-color: rgba(255, 255, 255, 0.1) !important;
				}
				.penquinx-page nav a,
				.penquinx-page nav button,
				.penquinx-page nav span {
					color: white !important;
				}
				.penquinx-page nav .text-muted-foreground {
					color: rgba(255, 255, 255, 0.8) !important;
				}
				.penquinx-page nav .text-primary,
				.penquinx-page nav a:hover {
					color: rgb(34, 211, 238) !important;
				}
				.penquinx-page nav img {
					filter: brightness(0) invert(1) !important;
				}
				.penquinx-page nav .bg-background {
					background: transparent !important;
				}
			`}</style>
			<div className="min-h-screen flex flex-col bg-black text-white overflow-hidden penquinx-page">
				<Navigation />
				<main className="flex-grow relative">
					{/* Animated Background */}
					<canvas
						ref={canvasRef}
						className="fixed inset-0 z-0 pointer-events-none"
					/>

					{/* Hero Section */}
					<section className="relative min-h-screen flex items-center justify-center px-4 py-20 z-10">
						<div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-80" />
						<div className="relative z-10 container mx-auto max-w-7xl">
							<div className="text-center mb-12">
								{/* Logos */}
								<div className="flex items-center justify-center gap-8 mb-0 flex-wrap">
									<div className="flex items-center gap-3">
										<img
											src={penquinLogo}
											alt="PenquinX"
											className="h-32 md:h-40 lg:h-48 object-contain"
										/>
									</div>
									<div className="h-16 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
									<div className="flex items-center gap-3">
										<span className="text-sm text-gray-400 font-mono">
											by
										</span>
										<img
											src="/lovable-uploads/98fab40e-4f49-42c5-bf83-50cb4020d1a4.png"
											alt="ENYARD"
											className="h-8 md:h-10 w-auto brightness-0 invert"
										/>
									</div>
								</div>

								{/* Badge */}
								<div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full mb-6 backdrop-blur-sm">
									<Sparkles className="w-4 h-4 text-cyan-400" />
									<span className="text-sm font-mono text-cyan-300">
										LAUNCHING SOON
									</span>
								</div>

								{/* Main Heading */}
								<h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
									<span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
										PenquinX
									</span>
									<br />
									<span className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-300">
										Cybersecurity Learning Platform
					</span>
								</h1>

								<p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
									Master cybersecurity from{" "}
									<span className="text-cyan-400 font-semibold">beginner</span> to{" "}
									<span className="text-blue-400 font-semibold">professional</span>{" "}
									with AI-powered learning, hands-on labs, and real-world challenges.
								</p>

								{/* Countdown Timer */}
								<div className="mb-12">
									<div className="inline-flex items-center gap-2 md:gap-4 p-6 md:p-8 bg-gradient-to-br from-gray-900/80 to-black/80 border border-cyan-500/20 rounded-2xl backdrop-blur-xl shadow-2xl">
										{[
											{ label: "Days", value: timeLeft.days },
											{ label: "Hours", value: timeLeft.hours },
											{ label: "Minutes", value: timeLeft.minutes },
											{ label: "Seconds", value: timeLeft.seconds },
										].map((item, index) => (
											<div key={item.label} className="flex items-center gap-2 md:gap-4">
												<div className="text-center">
													<div className="text-3xl md:text-5xl font-mono font-bold bg-gradient-to-b from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
														{String(item.value).padStart(2, "0")}
													</div>
													<div className="text-xs md:text-sm text-gray-400 font-mono uppercase tracking-wider">
														{item.label}
													</div>
												</div>
												{index < 3 && (
													<div className="text-cyan-500/50 text-xl md:text-2xl font-mono">
														:
													</div>
												)}
											</div>
										))}
									</div>
									<p className="mt-4 text-sm text-gray-500 font-mono">
										Launch Date: December 10, 2025 @ 6:30 PM
									</p>
								</div>

								{/* Join Waiting List Button */}
								<div className="max-w-md mx-auto mb-12">
									<Button
										onClick={() => setIsDialogOpen(true)}
										className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-6 text-lg shadow-lg shadow-cyan-500/50 transition-all duration-300">
										<Rocket className="mr-2 h-5 w-5" />
										Join Waiting List
									</Button>
								</div>
							</div>
						</div>
					</section>

					{/* Features Section */}
					<section className="relative py-20 md:py-32 px-4 z-10">
						<div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
						<div className="relative z-10 container mx-auto max-w-7xl">
							<div className="text-center mb-16">
								<h2 className="text-4xl md:text-6xl font-black mb-6">
									<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
										Platform Features
									</span>
								</h2>
								<p className="text-lg text-gray-400 max-w-2xl mx-auto">
									Everything you need to master cybersecurity, from fundamentals to
									advanced techniques
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{features.map((feature, index) => {
									const Icon = feature.icon;
									return (
										<div
											key={index}
											className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-1">
											<div
												className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}
											/>
											<div className="relative z-10">
												<div
													className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
													<Icon className="w-6 h-6 text-white" />
												</div>
												<h3 className="text-xl font-bold mb-2 text-white">
													{feature.title}
												</h3>
												<p className="text-gray-400 text-sm leading-relaxed">
													{feature.description}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</section>

					{/* Partner Section */}
					<section className="relative py-16 px-4 z-10 border-t border-gray-800">
						<div className="absolute inset-0 bg-gradient-to-b from-black to-gray-950" />
						<div className="relative z-10 container mx-auto max-w-7xl">
							<div className="text-center mb-8">
								<p className="text-sm text-gray-500 font-mono mb-8">
									In Partnership With
								</p>
								<div className="flex items-center justify-center gap-8 flex-wrap">
									<img
										src={secureWorldzLogo}
										alt="Secure Worldz"
										className="h-24 md:h-32 lg:h-40 object-contain opacity-90 hover:opacity-100 transition-opacity"
									/>
								</div>
							</div>
						</div>
					</section>

					{/* CTA - Contribute Section */}
					<section className="relative py-20 md:py-32 px-4 z-10 border-t border-gray-800">
						<div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950" />
						<div className="relative z-10 container mx-auto max-w-4xl">
							<div className="text-center">
								<div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full mb-6 backdrop-blur-sm">
									<Heart className="w-4 h-4 text-cyan-400" />
									<span className="text-sm font-mono text-cyan-300">
										SUPPORT THE PROJECT
									</span>
								</div>
								
								<h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
									<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
										Contribute to Develop
									</span>
									<br />
									<span className="text-white">PenquinX</span>
								</h2>

								<p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
									Help us build the future of cybersecurity education. Your contribution 
									supports the development of cutting-edge learning tools, vulnerability labs, 
									and AI-powered features that will empower the next generation of security professionals.
								</p>

								<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
									<div className="text-center sm:text-left">
										<div className="text-3xl font-bold text-cyan-400 mb-1">100%</div>
										<div className="text-sm text-gray-400">Transparent</div>
									</div>
									<div className="h-12 w-px bg-gray-700 hidden sm:block" />
									<div className="text-center sm:text-left">
										<div className="text-3xl font-bold text-blue-400 mb-1">Open Source</div>
										<div className="text-sm text-gray-400">Community Driven</div>
									</div>
									<div className="h-12 w-px bg-gray-700 hidden sm:block" />
									<div className="text-center sm:text-left">
										<div className="text-3xl font-bold text-green-400 mb-1">Impact</div>
										<div className="text-sm text-gray-400">Real Results</div>
									</div>
								</div>

								<Button
									onClick={() => setIsContributeDialogOpen(true)}
									size="lg"
									className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold px-8 py-6 text-lg shadow-lg shadow-cyan-500/50 transition-all duration-300">
									<Heart className="mr-2 h-5 w-5" />
									Contribute Now
								</Button>
							</div>
						</div>
					</section>
				</main>
				{/* Footer - using default styling from Footer component */}
				<div className="relative z-10">
					<Footer />
				</div>

				{/* Contribute Dialog */}
				<Dialog 
					open={isContributeDialogOpen} 
					onOpenChange={(open) => {
						setIsContributeDialogOpen(open);
						if (!open) {
							// Reset form when dialog closes
							setIsContributeSubmitted(false);
							setContributeFormData({ name: "", email: "", mobile: "", amount: "" });
						}
					}}>
					<DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
						<DialogHeader>
							<DialogTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
								Contribute to PenquinX
							</DialogTitle>
						</DialogHeader>

						{!isContributeSubmitted ? (
							<form onSubmit={handleContributeSubmit} className="space-y-4">
								<div>
									<Label
										htmlFor="contribute-name"
										className="text-sm text-gray-300 mb-2 block font-mono">
										Name
									</Label>
									<Input
										id="contribute-name"
										name="name"
										type="text"
										required
										value={contributeFormData.name}
										onChange={handleContributeInputChange}
										className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
										placeholder="Enter your name"
									/>
								</div>
								<div>
									<Label
										htmlFor="contribute-email"
										className="text-sm text-gray-300 mb-2 block font-mono">
										Email
									</Label>
									<Input
										id="contribute-email"
										name="email"
										type="email"
										required
										value={contributeFormData.email}
										onChange={handleContributeInputChange}
										className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
										placeholder="your@email.com"
									/>
								</div>
								<div>
									<Label
										htmlFor="contribute-mobile"
										className="text-sm text-gray-300 mb-2 block font-mono">
										Mobile Number
									</Label>
									<Input
										id="contribute-mobile"
										name="mobile"
										type="tel"
										required
										value={contributeFormData.mobile}
										onChange={handleContributeInputChange}
										className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
										placeholder="+1234567890"
									/>
								</div>
								<div>
									<Label
										htmlFor="contribute-amount"
										className="text-sm text-gray-300 mb-2 block font-mono">
										Contribution Amount ($)
									</Label>
									<Input
										id="contribute-amount"
										name="amount"
										type="number"
										min="1"
										step="0.01"
										required
										value={contributeFormData.amount}
										onChange={handleContributeInputChange}
										className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
										placeholder="Enter amount"
									/>
								</div>
								<div className="pt-2">
									<Button
										type="submit"
										disabled={isContributeLoading}
										className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white">
										{isContributeLoading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Submitting...
											</>
										) : (
											<>
												<Heart className="mr-2 h-4 w-4" />
												Submit Contribution
											</>
										)}
									</Button>
								</div>
							</form>
						) : (
							<div className="text-center py-4">
								<CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
								<h3 className="text-2xl font-bold text-green-400 mb-2">
									Thank you for your contribution!
								</h3>
								<p className="text-gray-300">
									We'll contact you shortly to proceed with your contribution.
								</p>
							</div>
						)}
					</DialogContent>
				</Dialog>

				{/* Waiting List Dialog */}
				<Dialog 
					open={isDialogOpen} 
					onOpenChange={async (open) => {
						setIsDialogOpen(open);
						if (open && isAuthenticated) {
							// Fetch user details from API and pre-fill form
							const userDetails = await fetchUserDetails();
							if (userDetails) {
								const userName = userDetails.name || 
									(userDetails.firstName ? `${userDetails.firstName}${userDetails.lastName ? ` ${userDetails.lastName}` : ''}` : '');
								
								// Parse phone number to extract country code and mobile
								// Only pre-fill phone if it's verified
								let countryCode = "+91";
								let mobile = "";
								if (userDetails.phone && (userDetails as any).phone_verified === true) {
									// Try to extract country code (common formats: +91XXXXXXXXXX, +1XXXXXXXXXX, etc.)
									const phoneMatch = userDetails.phone.match(/^(\+\d{1,3})(\d+)$/);
									if (phoneMatch) {
										countryCode = phoneMatch[1];
										mobile = phoneMatch[2];
									} else {
										// If no country code, assume it's just the number
										mobile = userDetails.phone.replace(/\D/g, "");
										if (mobile.length > 10) {
											// Try to extract country code from longer numbers
											if (mobile.startsWith("91") && mobile.length === 12) {
												countryCode = "+91";
												mobile = mobile.substring(2);
											} else if (mobile.startsWith("1") && mobile.length === 11) {
												countryCode = "+1";
												mobile = mobile.substring(1);
											}
										}
									}
								}
								
								setFormData({
									name: userName || "",
									email: userDetails.email || "",
									countryCode: countryCode,
									mobile: mobile,
									profession: formData.profession || "", // Keep profession if already selected
								});
							}
						}
						if (!open) {
							// Reset form when dialog closes (unless we have stored form data)
							const storedForm = localStorage.getItem('penquinx_waiting_list_form');
							if (!storedForm) {
								setIsSubmitted(false);
								setFormData({ name: "", email: "", countryCode: "+91", mobile: "", profession: "" });
							}
						}
					}}>
					<DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
						<DialogHeader>
							<DialogTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
								Join the Waiting List
							</DialogTitle>
						</DialogHeader>

						{!isSubmitted ? (
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<Label
										htmlFor="name"
										className="text-sm text-gray-300 mb-2 block font-mono">
										Name
									</Label>
									<Input
										id="name"
										name="name"
										type="text"
										required
										value={formData.name}
										onChange={handleInputChange}
										className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
										placeholder="Enter your name"
									/>
								</div>
								<div>
									<Label
										htmlFor="email"
										className="text-sm text-gray-300 mb-2 block font-mono">
										Email
									</Label>
									<Input
										id="email"
										name="email"
										type="email"
										required
										value={formData.email}
										onChange={handleInputChange}
										className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
										placeholder="your@email.com"
									/>
								</div>
								<div>
									<Label
										htmlFor="mobile"
										className="text-sm text-gray-300 mb-2 block font-mono">
										Mobile Number
									</Label>
									<div className="flex gap-2">
										<select
											value={formData.countryCode}
											onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
											className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 text-sm focus:border-cyan-500 focus:ring-cyan-500 focus:outline-none">
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
											id="mobile"
											name="mobile"
											type="tel"
											required
											value={formData.mobile}
											onChange={(e) => {
												const value = e.target.value;
												// Accept only digits
												if (/^\d*$/.test(value)) {
													setFormData({ ...formData, mobile: value });
												}
											}}
											maxLength={10}
											className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500 flex-1"
											placeholder="9876543210"
										/>
									</div>
									<p className="text-xs text-gray-400 mt-1">
										Enter 10-digit mobile number without country code
									</p>
								</div>
								<div>
									<Label
										htmlFor="profession"
										className="text-sm text-gray-300 mb-2 block font-mono">
										Profession
									</Label>
									<Select
										value={formData.profession}
										onValueChange={handleProfessionChange}
										required>
										<SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-cyan-500 focus:ring-cyan-500">
											<SelectValue placeholder="Select your profession" />
										</SelectTrigger>
										<SelectContent className="bg-gray-800 border-gray-600 text-white">
											<SelectItem value="student" className="focus:bg-gray-700">
												Student
											</SelectItem>
											<SelectItem value="lecturer" className="focus:bg-gray-700">
												Lecturer
											</SelectItem>
											<SelectItem value="cyber-professional" className="focus:bg-gray-700">
												Cyber Professional
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="pt-2">
									<Button
										type="submit"
										disabled={isLoading}
										className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white">
										{isLoading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Submitting...
											</>
										) : (
											<>
												<Rocket className="mr-2 h-4 w-4" />
												Submit
											</>
										)}
									</Button>
								</div>
							</form>
						) : (
							<div className="text-center py-4">
								<CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
								<h3 className="text-2xl font-bold text-green-400 mb-2">
									You're on the list!
								</h3>
								<p className="text-gray-300">
									We'll notify you when PenquinX launches.
								</p>
							</div>
						)}
					</DialogContent>
				</Dialog>

				{/* Login Prompt Dialog */}
				<Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
					<DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
						<DialogHeader>
							<DialogTitle className="text-2xl font-bold text-cyan-400">
								Login Required
							</DialogTitle>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<p className="text-gray-300">
								To join the PenquinX waiting list, please login or register with ENYARD first.
							</p>
							<p className="text-sm text-gray-400">
								Don't worry, your form data has been saved and will be automatically submitted after you login!
							</p>
							<div className="flex gap-3 pt-4">
								<Button
									variant="outline"
									onClick={() => {
										setShowLoginPrompt(false);
										setIsDialogOpen(false);
									}}
									className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500">
									Cancel
								</Button>
								<Button
									onClick={() => {
										setShowLoginPrompt(false);
										setIsDialogOpen(false);
										navigate("/auth/login?redirect=/products/penquinx");
									}}
									className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white">
									Login / Register
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
};

export default Penquin;
