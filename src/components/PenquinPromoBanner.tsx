import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, Shield, X, Zap } from "lucide-react";

const PenquinPromoBanner = () => {
	const navigate = useNavigate();
	const [isVisible, setIsVisible] = useState(true);
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	// Update document class when banner visibility changes
	useEffect(() => {
		if (isVisible) {
			document.documentElement.classList.add('banner-visible');
		} else {
			document.documentElement.classList.remove('banner-visible');
		}
		return () => {
			document.documentElement.classList.remove('banner-visible');
		};
	}, [isVisible]);

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

	const handleJoinWaitingList = () => {
		navigate("/products/penquinx");
	};

	if (!isVisible) return null;

	return (
		<div className="fixed top-0 left-0 right-0 w-full z-[110] bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 overflow-hidden border-b-2 border-cyan-400/30 shadow-lg">
			{/* Animated Background Pattern */}
			<div className="absolute inset-0 opacity-20">
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] animate-pulse"></div>
			</div>

			{/* Animated Grid Lines */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute inset-0" style={{
					backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
					                  linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
					backgroundSize: '30px 30px'
				}}></div>
			</div>

			{/* Glowing Orbs with Animation */}
			<div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
			<div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-400 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
			<div className="absolute top-1/2 left-1/2 w-24 h-24 bg-blue-400 rounded-full blur-2xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

			{/* Shimmer Effect */}
			<div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{
				animation: 'shimmer 3s infinite'
			}}></div>

			{/* Content */}
			<div className="relative z-10 container mx-auto px-4 py-3">
				<div className="flex flex-col md:flex-row items-center justify-between gap-4">
					{/* Left Side - Text */}
					<div className="flex items-center gap-4 flex-1">
						<div className="flex items-center gap-2">
							<span className="text-white font-bold text-sm md:text-base">
								PenquinX
							</span>
						</div>
						<div className="hidden md:flex items-center gap-2 text-white/90">
							<Shield className="w-4 h-4 text-cyan-300" />
							<span className="text-xs md:text-sm font-medium">
								Cybersecurity Learning Platform
							</span>
						</div>
					</div>

					{/* Center - Countdown */}
					<div className="flex items-center gap-2 md:gap-4">
						<div className="hidden sm:flex items-center gap-1 text-white/70 text-xs font-medium">
							<span>Launching in</span>
						</div>
						<div className="flex items-center gap-1 md:gap-2">
							{[{ label: "D", value: timeLeft.days }, { label: "H", value: timeLeft.hours }, { label: "M", value: timeLeft.minutes }, { label: "S", value: timeLeft.seconds }].map((item, index) => (
								<div key={item.label} className="flex items-center gap-1 md:gap-2">
									<div className="text-center">
										<div className="relative bg-white/20 backdrop-blur-sm rounded-lg px-2 md:px-3 py-1 border border-white/30 shadow-lg hover:bg-white/30 transition-colors">
											<div className="text-white font-bold text-sm md:text-lg font-mono tabular-nums drop-shadow-lg">
												{String(item.value).padStart(2, "0")}
											</div>
											{/* Glow effect on hover */}
											<div className="absolute inset-0 bg-cyan-400/20 rounded-lg opacity-0 hover:opacity-100 transition-opacity blur-sm"></div>
										</div>
										<div className="text-white/90 text-[10px] md:text-xs font-semibold mt-0.5 uppercase tracking-wider drop-shadow">
											{item.label}
										</div>
									</div>
									{index < 3 && (
										<div className="text-white/70 text-lg md:text-xl font-bold mx-0.5 animate-pulse">
											:
										</div>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Right Side - CTA Button */}
					<div className="flex items-center gap-3">
						<Button
							onClick={handleJoinWaitingList}
							size="sm"
							className="bg-white text-cyan-600 hover:bg-cyan-50 font-semibold text-xs md:text-sm px-4 md:px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
						>
							<Rocket className="w-3 h-3 md:w-4 md:h-4 mr-2 group-hover:animate-bounce" />
							Join Waiting List
							<Zap className="w-3 h-3 md:w-4 md:h-4 ml-2 group-hover:animate-pulse" />
						</Button>
						<button
							onClick={() => setIsVisible(false)}
							className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
							aria-label="Close banner"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			{/* Bottom Border Glow */}
			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

			{/* CSS Animation for Shimmer */}
			<style>{`
				@keyframes shimmer {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(100%);
					}
				}
			`}</style>
		</div>
	);
};

export default PenquinPromoBanner;

