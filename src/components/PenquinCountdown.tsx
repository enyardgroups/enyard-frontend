import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Terminal,
	Bell,
} from "lucide-react";

const PenquinCountdown = () => {
	const navigate = useNavigate();
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

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

	const handleNotifyMe = () => {
		navigate("/products/penquinx");
	};

	return (
		<section className="relative py-8 bg-gradient-to-r from-gray-100 to-gray-200 border-y border-gray-300">
			{/* Subtle Grid Pattern */}
			<div
				className="absolute inset-0 opacity-5"
				style={{
					backgroundImage: `
            linear-gradient(90deg, #000 1px, transparent 1px),
            linear-gradient(0deg, #000 1px, transparent 1px)
          `,
					backgroundSize: "20px 20px",
				}}
			/>

			<div className="relative z-10 max-w-6xl mx-auto px-6">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					{/* Left Side - Info */}
					<div className="flex-1 text-center md:text-left">
						{/* Badge */}
						<div className="inline-flex items-center space-x-2 bg-gray-800 text-white rounded-full px-3 py-1 text-xs font-mono mb-3">
							<Terminal className="w-3 h-3" />
							<span>LAUNCHING_SOON</span>
						</div>

						{/* Main Content */}
						<h3 className="text-lg font-mono font-bold text-gray-800 mb-2">
							<span className="text-gray-600">const</span>{" "}
							<span className="text-blue-600">penquin</span> ={" "}
							<span className="text-green-600">"cybersecurity_platform"</span>;
						</h3>

						<p className="text-sm text-gray-600 font-mono">
							<span className="text-gray-500">//</span> Master tools, exploit
							vulnerabilities, become a security expert
						</p>
					</div>

					{/* Center - Countdown */}
					<div className="flex items-center space-x-4">
						<div className="text-center">
							<div className="text-2xl font-mono font-bold text-gray-800">
								{timeLeft.days.toString().padStart(2, "0")}
							</div>
							<div className="text-xs text-gray-500 font-mono uppercase tracking-wider">
								DAYS
							</div>
						</div>
						<div className="text-gray-400 font-mono">:</div>
						<div className="text-center">
							<div className="text-2xl font-mono font-bold text-gray-800">
								{timeLeft.hours.toString().padStart(2, "0")}
							</div>
							<div className="text-xs text-gray-500 font-mono uppercase tracking-wider">
								HRS
							</div>
						</div>
						<div className="text-gray-400 font-mono">:</div>
						<div className="text-center">
							<div className="text-2xl font-mono font-bold text-gray-800">
								{timeLeft.minutes.toString().padStart(2, "0")}
							</div>
							<div className="text-xs text-gray-500 font-mono uppercase tracking-wider">
								MIN
							</div>
						</div>
						<div className="text-gray-400 font-mono">:</div>
						<div className="text-center">
							<div className="text-2xl font-mono font-bold text-gray-800">
								{timeLeft.seconds.toString().padStart(2, "0")}
							</div>
							<div className="text-xs text-gray-500 font-mono uppercase tracking-wider">
								SEC
							</div>
						</div>
					</div>

					{/* Right Side - CTA */}
					<div className="flex-shrink-0">
						<Button
							size="sm"
							className="bg-gray-800 hover:bg-gray-900 text-white text-sm px-4 py-2 font-mono border border-gray-600 hover:border-gray-700"
							onClick={handleNotifyMe}>
							<Bell className="w-3 h-3 mr-2" />
							<span className="font-mono">notify_me()</span>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PenquinCountdown;
