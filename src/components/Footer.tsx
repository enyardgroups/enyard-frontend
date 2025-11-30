import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Instagram,
  Github,
  ChevronDown,
  ChevronUp,
  Globe,
  Building2,
  BookOpen,
  Code,
  Download,
  HeadphonesIcon,
} from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const globalOffices = [
    {
      id: "india",
      country: "India",
      address: ["Karungal, Kanyakumari,", "Tamil Nadu, India -629157"],
      email: "info@enyard.in",
      phone: ["+91 91505 37718", "+91 84288 07007"],
      icon: "🏛️",
    },
    {
      id: "uae",
      country: "UAE",
      address: ["AJ Bahar Building, Office 8,", "Salah El Din Street, Deira"],
      email: "info@enyard.in",
      phone: ["+971564549360", "+971 50 298 2413"],
      icon: "🏢",
    },
    {
      id: "usa",
      country: "USA",
      address: ["13279 Bluejacket Street", "Overland Park, KS 66213"],
      email: "info@enyard.in",
      phone: ["+1 913 735 4276"],
      icon: "🗽",
    },
    {
      id: "oman",
      country: "Oman",
      address: ["Murooj Grand Al Khuwair", "Muscat"],
      email: "info@enyard.in",
      phone: ["+971564549360"],
      icon: "🕌",
    },
    {
      id: "papua-new-guinea",
      country: "Papua New Guinea",
      address: ["Sec 112, Lot 25, Bomana,", "Boroko, NCD"],
      email: "info@enyard.in",
      phone: ["+675 77342791"],
      icon: "🌴",
    },
  ];

  return (
		<footer className="bg-primary text-primary-foreground">
			<div className="max-w-7xl mx-auto px-6 py-16">
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Company Info */}
					<div className="space-y-4">
						<img
							src="/lovable-uploads/98fab40e-4f49-42c5-bf83-50cb4020d1a4.png"
							alt="ENYARD"
							className="h-8 w-auto brightness-0 invert"
						/>
						<p className="text-primary-foreground/80 text-sm leading-relaxed">
							Pioneering the future of enterprise software with AI-integrated
							solutions that transform how businesses operate in the digital
							age.
						</p>
						<div className="flex space-x-4">
							<a
								href="https://www.linkedin.com/company/enyardcorp"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
								<Linkedin className="h-5 w-5" />
							</a>
							<a
								href="https://www.instagram.com/enyardcorp/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
								<Instagram className="h-5 w-5" />
							</a>
							<a
								href="https://github.com/enyard"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
								<Github className="h-5 w-5" />
							</a>
						</div>
					</div>

					{/* Products */}
					<div className="space-y-4">
						<h4 className="font-semibold text-lg">Products</h4>
						<div className="space-y-2">
							<Link
								to="/products/timex"
								className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
								TimeX - Attendance Management
							</Link>
							<Link
								to="/products/xsafety"
								className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
								XSafety - Safety Management System
							</Link>
							<Link
								to="/products/workx365"
								className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
								WorkX 365 - Workforce Management
							</Link>
							<Link
								to="/products/gitx"
								className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
								GitX - Seamless Github to Server Deployment
							</Link>
							<Link
								to="/products/penquinx"
								className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
								PenquinX - Cybersecurity Learning Platform
							</Link>
							<span className="block text-primary-foreground/60 text-sm">
								NexorX - Advanced Technical Training (Coming Soon)
							</span>
						</div>
					</div>

					{/* Company */}
					<div className="space-y-4">
						<h4 className="font-semibold text-lg">Company</h4>
						<div className="space-y-2">
							<Link
								to="/about"
								className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
								About Us
							</Link>
							<Link
								to="/career"
								className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
								Career
							</Link>
							<Link
								to="/blog"
								className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
								Blog
							</Link>
							<Link
								to="/contact"
								className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
								Contact Us
							</Link>
						</div>
					</div>

					{/* Resources */}
					<div className="space-y-4">
						<h4 className="font-semibold text-lg">Resources</h4>
						<div className="space-y-2">
							<Link
								to="/documentation"
								className="flex items-center space-x-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
								<BookOpen className="h-4 w-4" />
								<span>Documentation</span>
							</Link>
							<Link
								to="/api"
								className="flex items-center space-x-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
								<Code className="h-4 w-4" />
								<span>API</span>
							</Link>
							<Link
								to="/downloads"
								className="flex items-center space-x-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
								<Download className="h-4 w-4" />
								<span>Downloads</span>
							</Link>
							<Link
								to="/support"
								className="flex items-center space-x-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
								<HeadphonesIcon className="h-4 w-4" />
								<span>Support</span>
							</Link>
						</div>
					</div>
				</div>

				{/* Global Offices Section */}
				<div className="border-t border-primary-foreground/20 mt-12 pt-8">
					<div className="text-center mb-8">
						<div className="flex items-center justify-center space-x-2 mb-4">
							<Globe className="h-6 w-6 text-primary-foreground/80" />
							<h3 className="text-2xl font-bold">Our Global Offices</h3>
						</div>
						<p className="text-primary-foreground/70 text-sm max-w-2xl mx-auto">
							Serving enterprises worldwide with local presence and global
							expertise
						</p>
					</div>

					{/* Offices Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
						{globalOffices.map((office, index) => (
							<div
								key={office.id}
								className="relative group h-full"
								style={{ animationDelay: `${index * 0.1}s` }}>
								<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 h-full flex flex-col transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:-translate-y-1">
									{/* Office Header */}
									<div className="flex flex-col items-center text-center mb-4 flex-shrink-0">
										<div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-2">
											<span className="text-xl">{office.icon}</span>
										</div>
										<h4 className="font-bold text-sm">{office.country}</h4>
									</div>

									{/* Address Section */}
									<div className="space-y-3 flex-1">
										<div className="space-y-1">
											<div className="flex items-start space-x-2">
												<Building2 className="h-3 w-3 mt-0.5 text-primary-foreground/60 flex-shrink-0" />
												<div className="text-xs text-primary-foreground/80">
													{office.address.map((line, index) => (
														<div key={index} className="leading-relaxed">
															{line}
														</div>
													))}
												</div>
											</div>
										</div>

										{/* Contact Section */}
										<div className="space-y-1 pt-2 border-t border-white/10 flex-shrink-0">
											<div className="flex items-center space-x-2">
												<Mail className="h-3 w-3 text-primary-foreground/60 flex-shrink-0" />
												<span className="text-xs text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">
													{office.email}
												</span>
											</div>

											<div className="space-y-1">
												{office.phone.map((phone, index) => (
													<div
														key={index}
														className="flex items-center space-x-2">
														<Phone className="h-3 w-3 text-primary-foreground/60 flex-shrink-0" />
														<span className="text-xs text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">
															{phone}
														</span>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Hover Effect Overlay */}
									<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p className="text-primary-foreground/60 text-sm">
						© 2025 ENYARD. All rights reserved.
					</p>
					<div className="flex space-x-6 mt-4 md:mt-0">
						<Link
							to="/privacy"
							className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
							Privacy Policy
						</Link>
						<Link
							to="/terms"
							className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
							Terms of Service
						</Link>
						<Link
							to="/security"
							className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
							Security
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
