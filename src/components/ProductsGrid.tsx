import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Shield,
  ArrowRight,
  Star,
  Zap,
  Users,
  TrendingUp,
  MonitorCog,
  GitGraph,
  Terminal,
  BookOpen,
} from "lucide-react";
import BusinessForm from "./BusinessForm";
import { useNavigate } from "react-router-dom";
import EnhancedCTA from "./EnhancedCTA";

const ProductsGrid = () => {
	const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const navigate = useNavigate();

	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		observerRef.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = parseInt(
							entry.target.getAttribute("data-index") || "0"
						);
						setVisibleItems((prev) => new Set([...prev, index]));
					}
				});
			},
			{ threshold: 0.1 }
		);

		const elements = document.querySelectorAll("[data-index]");
		elements.forEach((el) => observerRef.current?.observe(el));

		return () => observerRef.current?.disconnect();
	}, []);

	const products = [
		{
			name: "TimeX",
			description:
				"Revolutionary attendance management that thinks like you do. Automatically detect patterns, predict trends, and eliminate time theft with intelligent biometric technology that adapts to your workplace.",
			icon: Clock,
			features: [
				"Smart Biometric Recognition",
				"Predictive Analytics",
				"Automated Scheduling",
				"Fraud Prevention",
			],
			stats: { users: "50k+", accuracy: "99.9%", saved: "40%" },
			color: "from-blue-500 to-cyan-500",
			accentColor: "blue-500",
			gradient: "from-blue-500/20 via-cyan-500/20 to-blue-600/20",
			badge: "AI-Powered",
			href: "/products/timex",
		},
		{
			name: "XSafety",
			description:
				"Advanced safety management system for airlines with AI-enabled features. Monitor incidents, hazards, conduct comprehensive auditing, and implement corrective actions with intelligent systems that ensure aviation safety compliance.",
			icon: Shield,
			features: [
				"Incident Monitoring & Analysis",
				"Hazard Identification",
				"AI-Powered Auditing",
				"Corrective Action Management",
			],
			stats: { airlines: "50+", incidents: "0", compliance: "100%" },
			color: "from-purple-500 to-violet-500",
			accentColor: "purple-500",
			gradient: "from-purple-500/20 via-violet-500/20 to-purple-600/20",
			badge: "Aviation Safety",
			href: "/products/xsafety",
		},
		{
			name: "WorkX365",
			description:
				"Simplified workforce management and productivity tracking. Streamline your team's operations with intelligent scheduling, time tracking, and performance analytics that help you make data-driven decisions.",
			icon: MonitorCog,
			features: [
				"Workforce Management",
				"Productivity Tracking",
				"Intelligent Scheduling",
				"Performance Analytics",
			],
			stats: { teams: "10k+", efficiency: "65%", growth: "150%" },
			color: "from-indigo-500 to-blue-500",
			accentColor: "indigo-500",
			gradient: "from-indigo-500/20 via-blue-500/20 to-indigo-600/20",
			badge: "Productivity",
			href: "/products/workx365",
		},
		{
			name: "GitX",
			description:
				"Seamless GitHub-to-server deployment without CI/CD. Deploy your code directly from GitHub to your servers with zero configuration. Simplify your deployment workflow and focus on building great software.",
			icon: GitGraph,
			features: [
				"Direct GitHub Integration",
				"Zero Configuration Deployment",
				"Automated Workflows",
				"Server Management",
			],
			stats: { deployments: "100k+", speed: "90%", uptime: "99.9%" },
			color: "from-green-500 to-emerald-500",
			accentColor: "green-500",
			gradient: "from-green-500/20 via-emerald-500/20 to-green-600/20",
			badge: "DevOps",
			href: "/products/gitx",
		},
		{
			name: "PenquinX",
			description:
				"A comprehensive platform for cybersecurity enthusiasts to learn about various tools and multi-vulnerability exploitation in a single, interactive environment. Master cybersecurity skills through hands-on labs and real-world scenarios.",
			icon: Terminal,
			features: [
				"Interactive Labs",
				"Vulnerability Databases",
				"Tool Integrations",
				"Guided Learning Paths",
			],
			stats: { tools: "100+", labs: "50+", users: "25k+" },
			color: "from-gray-500 to-slate-600",
			accentColor: "gray-500",
			gradient: "from-gray-500/20 via-slate-500/20 to-gray-600/20",
			badge: "Cybersecurity",
			href: "/products/penquinx",
		},
		{
			name: "NexorX",
			description:
				"Empowering rural communities with advanced technical skills and real-world applications. Learn cutting-edge technologies, industry trends, and practical skills that bridge the gap between traditional education and modern workforce demands.",
			icon: BookOpen,
			features: [
				"Advanced Technical Training",
				"Real-World Applications",
				"Industry Trend Analysis",
				"Rural Community Focus",
			],
			stats: { courses: "Coming Soon", skills: "50+", impact: "Rural" },
			color: "from-orange-500 to-amber-500",
			accentColor: "orange-500",
			gradient: "from-orange-500/20 via-amber-500/20 to-orange-600/20",
			badge: "Coming Soon",
			href: "#",
		},
	];

	return (
		<section className="py-32 relative overflow-hidden">
			{/* Enhanced Background */}
			<div className="absolute inset-0">
				{/* Gradient Mesh Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />

				{/* Floating Geometric Shapes */}
				<div className="absolute top-20 left-20 w-32 h-32 opacity-[0.08] animate-pulse">
					<div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-xl" />
				</div>
				<div
					className="absolute top-40 right-32 w-24 h-24 opacity-[0.06] animate-pulse"
					style={{ animationDelay: "2s" }}>
					<div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl" />
				</div>
				<div
					className="absolute bottom-40 left-32 w-28 h-28 opacity-[0.05] animate-pulse"
					style={{ animationDelay: "4s" }}>
					<div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-xl" />
				</div>

				{/* Subtle Grid Pattern */}
				<div
					className="absolute inset-0 opacity-[0.02]"
					style={{
						backgroundImage: `
              linear-gradient(90deg, #000 1px, transparent 1px),
              linear-gradient(0deg, #000 1px, transparent 1px)
            `,
						backgroundSize: "60px 60px",
					}}
				/>
			</div>

			<div className="max-w-7xl mx-auto px-6 relative z-10">
				{/* Enhanced Section Header */}
				<div className="text-center mb-20">
					<div
						className={`scroll-reveal ${
							visibleItems.has(-1) ? "revealed" : ""
						}`}
						data-index="-1">
						{/* Animated Badge */}
						<div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full px-6 py-3 mb-6 border border-blue-200/50">
							<Star className="w-5 h-5 text-blue-600" />
							<span className="font-semibold">Innovation Hub</span>
						</div>

						<h2 className="text-5xl md:text-6xl font-bold mb-6 text-black">
							Solutions That
							<span className="block text-black"> Redefine Possibility</span>
						</h2>
						<p className="text-xl text-black max-w-4xl mx-auto leading-relaxed">
							Six revolutionary platforms that don't just solve problems—they
							anticipate them. Each solution learns, adapts, and evolves to
							become more valuable every day.
						</p>
					</div>
				</div>

				{/* Enhanced Products Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
					{products.map((product, index) => {
						const IconComponent = product.icon;
						return (
							<Card
								key={product.name}
								className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 flex flex-col h-full ${
									visibleItems.has(index)
										? "scroll-reveal revealed"
										: "scroll-reveal"
								}`}
								data-index={index}
								style={{
									background: `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)`,
									backdropFilter: "blur(20px)",
								}}>
								{/* Background Gradient Overlay */}
								<div
									className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
								/>

								{/* Badge */}
								<div className="absolute top-4 right-4 z-10">
									<div
										className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${product.color} shadow-lg`}>
										{product.badge}
									</div>
								</div>

								{/* Card Content */}
								<CardHeader className="relative z-10 pb-4">
									<div className="flex items-start justify-between mb-4">
										<div
											className={`p-4 rounded-2xl bg-gradient-to-br ${product.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
											<IconComponent className="w-8 h-8 text-black group-hover:scale-110 transition-transform duration-300" />
										</div>
									</div>

									<CardTitle className="text-2xl font-bold mb-3 text-black group-hover:text-black transition-colors">
										{product.name}
									</CardTitle>

									<CardDescription className="text-black leading-relaxed text-base">
										{product.description}
									</CardDescription>
								</CardHeader>

								<CardContent className="relative z-10 space-y-6 flex flex-col flex-grow">
									{/* Features */}
									<div className="space-y-3">
										<h4 className="font-semibold text-black text-sm uppercase tracking-wide">
											Key Features
										</h4>
										<div className="grid grid-cols-1 gap-2">
											{product.features.map((feature, featureIndex) => (
												<div
													key={featureIndex}
													className="flex items-center space-x-3">
													<div
														className={`w-2 h-2 rounded-full bg-gradient-to-r ${product.color} flex-shrink-0`}
													/>
													<span className="text-sm text-black">{feature}</span>
												</div>
											))}
										</div>
									</div>

									{/* Statistics */}
									{product.stats && (
										<div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
											{Object.entries(product.stats).map(
												([key, value], statIndex) => (
													<div key={statIndex} className="text-center">
														<div className="text-lg font-bold text-black mb-1">
															{value}
														</div>
														<div className="text-xs text-black uppercase tracking-wide">
															{key}
														</div>
													</div>
												)
											)}
										</div>
									)}

									{/* Action Button - Pushed to bottom */}
									<div className="mt-auto pt-4">
										<Button
											className="w-full bg-black hover:bg-gray-800 text-white hover:shadow-lg group/btn transition-all duration-300"
											size="lg"
											onClick={() => navigate(product.href)}>
											<span className="flex items-center">
												Explore {product.name}
												<ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
											</span>
										</Button>
									</div>
								</CardContent>

								{/* Hover Effects */}
								<div
									className={`absolute inset-0 rounded-xl bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
								/>
							</Card>
						);
					})}
				</div>

				{/* Enhanced Bottom CTA */}
				<EnhancedCTA
					visible={visibleItems.has(99)}
					onStartTrial={() => setIsDialogOpen(true)}
					onBookDemo={() => console.log("Book Demo Clicked")}
				/>

				<BusinessForm isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
			</div>
		</section>
	);
};

export default ProductsGrid;

  // <div
  //         className={`text-center ${visibleItems.has(99) ? "scroll-reveal revealed" : "scroll-reveal"}`}
  //         data-index="99"
  //       >
  //         <div className="relative overflow-hidden rounded-3xl p-12 max-w-4xl mx-auto">
  //           {/* Background with Glass Effect */}
  //           <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl" />
  //           <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20" />

  //           {/* Content */}
  //           <div className="relative z-10">
  //             <div className="flex items-center justify-center mb-6">
  //               <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
  //                 <TrendingUp className="h-8 w-8 text-white" />
  //               </div>
  //             </div>

  //             <h3 className="text-3xl md:text-4xl font-bold mb-4 text-black">
  //               Ready to Redefine Your Future?
  //             </h3>

  //             <p className="text-black mb-8 text-lg max-w-2xl mx-auto">
  //               Join forward-thinking ventures already transforming their
  //               operations with our intelligent ecosystem. Experience the power
  //               of AI-driven innovation.
  //             </p>

  //             <div className="flex flex-col sm:flex-row gap-4 justify-center">
  //               <Button
  //                 size="lg"
  //                 className="group px-8 py-4 bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
  //                 onClick={() => setIsDialogOpen(true)}
  //               >
  //                 <Zap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
  //                 Start Free Trial
  //               </Button>

  //               <Button
  //                 variant="outline"
  //                 size="lg"
  //                 className="px-8 py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300"
  //               >
  //                 <Users className="mr-2 h-5 w-5" />
  //                 Book Live Demo
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>