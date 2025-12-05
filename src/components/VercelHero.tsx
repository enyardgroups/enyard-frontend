import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, ChevronDown } from "lucide-react";
import BusinessForm from "./BusinessForm";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const VercelHero = () => {
	const heroRef = useRef<HTMLElement>(null);
	const [isVisible, setIsVisible] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), 100);
		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			<section
				ref={heroRef}
				className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 home-hero-padding">
				{/* Innovative Multi-layered Creative Background */}
				<div className="absolute inset-0">
					{/* Pure white base */}
					<div className="absolute inset-0 bg-white" />

					{/* Subtle geometric grid pattern */}
					<div
						className="absolute inset-0 opacity-[0.03]"
						style={{
							backgroundImage: `
                linear-gradient(90deg, #000 1px, transparent 1px),
                linear-gradient(0deg, #000 1px, transparent 1px)
              `,
							backgroundSize: "60px 60px",
						}}
					/>

					{/* Floating geometric shapes */}
					<div
						className="absolute top-20 left-20 w-32 h-32 opacity-[0.08] animate-pulse"
						style={{
							background:
								"linear-gradient(45deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)",
							borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
							animationDuration: "8s",
							filter: "blur(1px)",
						}}
					/>
					<div
						className="absolute top-40 right-32 w-24 h-24 opacity-[0.06] animate-pulse"
						style={{
							background:
								"linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)",
							borderRadius: "50%",
							animationDuration: "6s",
							animationDelay: "2s",
							filter: "blur(1px)",
						}}
					/>
					<div
						className="absolute bottom-40 left-32 w-28 h-28 opacity-[0.05] animate-pulse"
						style={{
							background:
								"linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)",
							borderRadius: "70% 30% 30% 70% / 60% 40% 60% 40%",
							animationDuration: "7s",
							animationDelay: "1s",
							filter: "blur(1px)",
						}}
					/>
					<div
						className="absolute top-60 right-20 w-20 h-20 opacity-[0.04] animate-pulse"
						style={{
							background:
								"linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)",
							borderRadius: "50%",
							animationDuration: "5s",
							animationDelay: "3s",
							filter: "blur(1px)",
						}}
					/>

					{/* Dynamic gradient overlay */}
					<div
						className="absolute inset-0 opacity-[0.02]"
						style={{
							background: `
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
              `,
							filter: "blur(40px)",
						}}
					/>

					{/* Animated mesh gradient */}
					<div
						className="absolute inset-0 opacity-[0.03]"
						style={{
							background: `
                linear-gradient(45deg,
                  rgba(102, 126, 234, 0.1) 0%,
                  rgba(118, 75, 162, 0.1) 25%,
                  rgba(240, 147, 251, 0.1) 50%,
                  rgba(245, 87, 108, 0.1) 75%,
                  rgba(79, 172, 254, 0.1) 100%
                )
              `,
							backgroundSize: "400% 400%",
							animation: "gradientShift 15s ease infinite",
						}}
					/>

					{/* Geometric accent */}
					<div
						className="absolute bottom-0 left-0 right-0 h-32 opacity-[0.02]"
						style={{
							background: `
                linear-gradient(45deg,
                  rgba(102, 126, 234, 0.1) 0%,
                  rgba(118, 75, 162, 0.1) 25%,
                  rgba(240, 147, 251, 0.1) 50%,
                  rgba(245, 87, 108, 0.1) 75%,
                  rgba(34, 197, 94, 0.1) 100%
                )
              `,
							clipPath:
								"polygon(0 100%, 100% 100%, 100% 60%, 80% 40%, 60% 60%, 40% 40%, 20% 60%, 0 40%)",
						}}
					/>
				</div>

				{/* Content */}
				<div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
					{/* Animated Badge */}
					<div
						className={`inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8 border border-gray-200/50 shadow-sm transition-all duration-1000 ${
							isVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-4"
						}`}
						style={{ transitionDelay: "0.2s" }}>
						<Sparkles className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
						<span className="text-xs md:text-sm font-medium text-gray-700">
							Where Innovation Meets Intelligence
						</span>
					</div>

					{/* Main Headline */}
					<div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
						<h1
							className={`text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight transition-all duration-1000 ${
								isVisible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-8"
							}`}
							style={{ transitionDelay: "0.4s" }}>
							<span className="block text-gray-900">Elevate Your Venture</span>
							<span className="block text-gradient-animate">
								Beyond Imagination
							</span>
						</h1>
					</div>

					{/* Subheadline */}
					<p
						className={`text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 md:mb-12 leading-relaxed transition-all duration-1000 ${
							isVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-8"
						}`}
						style={{ transitionDelay: "0.6s" }}>
						Revolutionizes venture management with intelligent applications that
						think, learn, and evolve. Transform your operations from reactive to
						predictive, from manual to autonomous, from today to tomorrow.
					</p>

					{/* CTA Buttons */}
					<div
						className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-1000 ${
							isVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-8"
						}`}
						style={{ transitionDelay: "0.8s" }}>
						<Button
							size="lg"
							onClick={() => setIsDialogOpen(true)}
							className="group relative overflow-hidden bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl">
							<span className="relative z-10 flex items-center">
								Begin Your Transformation
								<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
							</span>
						</Button>

						<Dialog>
							<DialogTrigger asChild>
								<Button
									variant="outline"
									size="lg"
									className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 group shadow-sm">
									<span className="flex items-center text-gray-700">
										<Play className="mr-2 h-5 w-5" />
										Witness the Revolution
									</span>
								</Button>
							</DialogTrigger>
							<DialogContent className="p-0 overflow-hidden max-w-2xl">
								<video controls className="w-full aspect-video">
									<source src="/video.mp4" type="video/mp4" />
								</video>
							</DialogContent>
						</Dialog>
					</div>

					{/* Scroll Indicator */}
					<div
						className={`transition-all duration-1000 ${
							isVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-4"
						}`}
						style={{ transitionDelay: "1s" }}>
						<Button
							variant="ghost"
							className="flex flex-col h-auto items-center text-gray-500 
             hover:bg-white hover:text-gray-700 
             mx-auto transform transition-all duration-200 hover:scale-105"
							onClick={() => {
								const nextSection = document.getElementById("future");
								nextSection.scrollIntoView({
									behavior: "smooth",
								});
							}}>
							<span className="text-sm font-medium mb-2">
								Scroll to explore
							</span>
							<ChevronDown className="h-5 w-5 animate-bounce" />
						</Button>
					</div>
				</div>

				{/* Floating Elements */}
				<div className="absolute top-20 left-20 w-2 h-2 bg-blue-500 rounded-full animate-pulse opacity-30" />
				<div
					className="absolute top-40 right-32 w-3 h-3 bg-purple-500 rounded-full animate-pulse opacity-30"
					style={{ animationDelay: "1s" }}
				/>
				<div
					className="absolute bottom-40 left-32 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse opacity-30"
					style={{ animationDelay: "2s" }}
				/>
				<div
					className="absolute top-60 right-20 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse opacity-30"
					style={{ animationDelay: "0.5s" }}
				/>
			</section>

			{/* Transformation Dialog */}
			<BusinessForm isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
		</>
	);
};

export default VercelHero;
