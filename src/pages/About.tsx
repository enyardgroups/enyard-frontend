import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Target, Award, Lightbulb, Rocket, Heart } from "lucide-react";
import { Companies, Brands, Leaders, Social } from "@/assets";
import EnhancedCTA from "@/components/EnhancedCTA";
import BusinessForm from "@/components/BusinessForm";
import { PAGE_PATHS } from "@/seo/routeMeta";
import { SeoMeta } from "@/components/SeoMeta";

const About = () => {
	const [scrollY, setScrollY] = useState(0);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [typedCode, setTypedCode] = useState("");

	const fullCode = `class ENYARDInnovation {
  constructor() {
    this.philosophy = 'Innovation-First';
    this.approach = 'Research-Driven';
    this.execution = 'Practical-Implementation';
  }

  async createFuture() {
    const research = await this.deepAnalysis();
    const innovation = this.breakthrough(research);
    return this.implement(innovation);
  }
}

// Building tomorrow, today
const enyard = new ENYARDInnovation();
enyard.createFuture();`;

	// Helper function to render code with syntax highlighting
	const renderCodeLine = (line: string, lineNum: number) => {
		const parts: JSX.Element[] = [];
		let currentIndex = 0;
		
		// Match keywords
		const keywords = ['class', 'constructor', 'async', 'await', 'const', 'return', 'new'];
		const classNames = ['ENYARDInnovation', 'createFuture'];
		const properties = ['philosophy', 'approach', 'execution', 'research', 'innovation', 'deepAnalysis', 'breakthrough', 'implement', 'enyard'];
		
		// Check for comment
		if (line.trim().startsWith('//')) {
			return (
				<div key={lineNum} className="flex">
					<span className="text-gray-600 mr-4 w-8">{lineNum}</span>
					<span className="text-gray-400">//</span>{" "}
					<span className="text-green-400">{line.replace('//', '').trim()}</span>
				</div>
			);
		}
		
		// Simple tokenization
		const tokens = line.match(/(\w+|[{}();=.'\s]+)/g) || [];
		
		return (
			<div key={lineNum} className="flex">
				<span className="text-gray-600 mr-4 w-8">{lineNum}</span>
				<span>
					{tokens.map((token, idx) => {
						if (keywords.includes(token.trim())) {
							return <span key={idx} className="text-purple-400">{token}</span>;
						}
						if (classNames.includes(token.trim())) {
							return <span key={idx} className="text-yellow-400">{token}</span>;
						}
						if (properties.includes(token.trim())) {
							return <span key={idx} className="text-green-400">{token}</span>;
						}
						if (token.includes("'") && token.match(/'[^']*'/)) {
							return <span key={idx} className="text-orange-400">{token}</span>;
						}
						if (['{', '}', '(', ')', '=', ';', '.', ' '].some(c => token.includes(c))) {
							return <span key={idx} className="text-gray-400">{token}</span>;
						}
						return <span key={idx} className="text-gray-300">{token}</span>;
					})}
				</span>
			</div>
		);
	};

	useEffect(() => {
		const handleScroll = () => setScrollY(window.scrollY);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		let currentIndex = 0;
		const typingInterval = setInterval(() => {
			if (currentIndex < fullCode.length) {
				setTypedCode(fullCode.slice(0, currentIndex + 1));
				currentIndex++;
			} else {
				clearInterval(typingInterval);
			}
		}, 30); // Adjust speed here (lower = faster)

		return () => clearInterval(typingInterval);
	}, [fullCode]);

	// // SEO Meta Tags
	// useEffect(() => {
	// 	// Update document title
	// 	document.title =
	// 		"About ENYARD - Global Holding Company | Multi-Industry Innovation Hub";

	// 	// Update meta description
	// 	const metaDescription = document.querySelector('meta[name="description"]');
	// 	if (metaDescription) {
	// 		metaDescription.setAttribute(
	// 			"content",
	// 			"ENYARD is a premier global holding company operating across 5+ countries with 10+ subsidiaries spanning IT, transportation, tourism, IoT, EduTech, and social media platforms. Discover our portfolio including Lagoon Technologies, Boobazhop, UAE Chauffeur, and more."
	// 		);
	// 	}

	// 	// Update meta keywords
	// 	const metaKeywords = document.querySelector('meta[name="keywords"]');
	// 	if (metaKeywords) {
	// 		metaKeywords.setAttribute(
	// 			"content",
	// 			"ENYARD, global holding company, Lagoon Technologies, Boobazhop, UAE Chauffeur, JezX, NexorX, Azra Martin, Enyard Media, Ricspace, IT companies, transportation companies, tourism companies, IoT companies, EduTech companies, social media platforms, multi-industry company, international business, Jinu Martin, Shabin, Pooja, Vino Stalin, Jibisha"
	// 		);
	// 	}

	// 	// Update Open Graph tags
	// 	const ogTitle = document.querySelector('meta[property="og:title"]');
	// 	if (ogTitle) {
	// 		ogTitle.setAttribute(
	// 			"content",
	// 			"About ENYARD - Global Holding Company | Multi-Industry Innovation Hub"
	// 		);
	// 	}

	// 	const ogDescription = document.querySelector(
	// 		'meta[property="og:description"]'
	// 	);
	// 	if (ogDescription) {
	// 		ogDescription.setAttribute(
	// 			"content",
	// 			"ENYARD is a premier global holding company operating across 5+ countries with 10+ subsidiaries spanning IT, transportation, tourism, IoT, EduTech, and social media platforms."
	// 		);
	// 	}

	// 	const ogUrl = document.querySelector('meta[property="og:url"]');
	// 	if (ogUrl) {
	// 		ogUrl.setAttribute("content", window.location.href);
	// 	}

	// 	// Update Twitter Card tags
	// 	const twitterTitle = document.querySelector('meta[name="twitter:title"]');
	// 	if (twitterTitle) {
	// 		twitterTitle.setAttribute(
	// 			"content",
	// 			"About ENYARD - Global Holding Company | Multi-Industry Innovation Hub"
	// 		);
	// 	}

	// 	const twitterDescription = document.querySelector(
	// 		'meta[name="twitter:description"]'
	// 	);
	// 	if (twitterDescription) {
	// 		twitterDescription.setAttribute(
	// 			"content",
	// 			"ENYARD is a premier global holding company operating across 5+ countries with 10+ subsidiaries spanning IT, transportation, tourism, IoT, EduTech, and social media platforms."
	// 		);
	// 	}

	// 	// Add structured data for Organization
	// 	const structuredData = {
	// 		"@context": "https://schema.org",
	// 		"@type": "Organization",
	// 		name: "ENYARD",
	// 		description:
	// 			"Global holding company operating across multiple industries including IT, transportation, tourism, IoT, EduTech, and social media platforms",
	// 		url: "https://enyard.in",
	// 		logo: "https://enyard.in/logo.png",
	// 		sameAs: [
	// 			"https://www.linkedin.com/company/enyardcorp",
	// 			"https://www.instagram.com/enyardcorp/",
	// 		],
	// 		address: {
	// 			"@type": "PostalAddress",
	// 			addressLocality: "Karungal",
	// 			addressRegion: "Kanyakumari",
	// 			addressCountry: "India",
	// 		},
	// 		contactPoint: {
	// 			"@type": "ContactPoint",
	// 			telephone: "+91-91505-37718",
	// 			contactType: "customer service",
	// 			email: "info@enyard.in",
	// 		},
	// 		foundingDate: "2015",
	// 		numberOfEmployees: "500+",
	// 		subOrganization: [
	// 			{
	// 				"@type": "Organization",
	// 				name: "Lagoon Technologies LLC",
	// 				description: "IT & Software Development company in USA",
	// 			},
	// 			{
	// 				"@type": "Organization",
	// 				name: "Lagoon Technologies Private Limited",
	// 				description: "IT & Software Development company in India",
	// 			},
	// 			{
	// 				"@type": "Organization",
	// 				name: "UAE Chauffeur",
	// 				description: "Luxury Transportation services in UAE",
	// 			},
	// 			{
	// 				"@type": "Organization",
	// 				name: "First Class Fleet",
	// 				description: "Premium Fleet Management services",
	// 			},
	// 			{
	// 				"@type": "Organization",
	// 				name: "First Lagoon Technology",
	// 				description: "Technology Solutions provider",
	// 			},
	// 			{
	// 				"@type": "Organization",
	// 				name: "Goyaka Tours & Travels",
	// 				description: "Travel & Tourism services in India",
	// 			},
	// 		],
	// 		brand: [
	// 			"Boobazhop",
	// 			"Booba Taxi",
	// 			"JezX",
	// 			"NexorX",
	// 			"Azra Martin",
	// 			"Enyard Media",
	// 			"Ricspace",
	// 		],
	// 	};

	// 	// Remove existing structured data script if any
	// 	const existingScript = document.querySelector(
	// 		'script[type="application/ld+json"]'
	// 	);
	// 	if (existingScript) {
	// 		existingScript.remove();
	// 	}

	// 	// Add new structured data script
	// 	const script = document.createElement("script");
	// 	script.type = "application/ld+json";
	// 	script.text = JSON.stringify(structuredData);
	// 	document.head.appendChild(script);

	// 	// Cleanup function
	// 	return () => {
	// 		if (script.parentNode) {
	// 			script.parentNode.removeChild(script);
	// 		}
	// 	};
	// }, []);

	const stats = [
		{ label: "Global Companies", value: "10+", icon: Users },
		{ label: "Countries Operating", value: "5+", icon: Target },
		{ label: "Industry Sectors", value: "7+", icon: Award },
		{ label: "Years of Excellence", value: "10+", icon: Lightbulb },
	];

	const subsidiaries = [
		{
			name: "Lagoon Technologies LLC",
			industry: "IT & Software Development",
			location: "UAE",
			logo: Companies.lagoontech,
		},
		{
			name: "Lagoon Technologies Private Limited",
			industry: "IT & Software Development",
			location: "India",
			logo: Companies.lagoontech,
		},
		{
			name: "UAE Chauffeur",
			industry: "Luxury Transportation",
			location: "UAE",
			logo: Companies.chauffeuruae,
		},
		{
			name: "First Class Fleet",
			industry: "Premium Fleet Management",
			location: "International",
			logo: Companies.fcfleet,
		},
		{
			name: "Goyaka Tours & Travels",
			industry: "Travel & Tourism",
			location: "UAE",
			logo: Companies.goyaka,
		},
	];

	const brands = [
		{
			name: "Boobazhop",
			category: "E-commerce Platform",
			description: "Innovative online shopping experience",
			logo: Brands.boobazhop,
			color: "from-white-100 to-pink-200",
		},
		{
			name: "Booba Taxi",
			category: "Transportation App",
			description: "Smart taxi booking platform",
			logo: Brands.boobataxi,
			color: "from-yellow-400 to-red-600",
		},
		{
			name: "Azra Martin",
			category: "Event Management Partner",
			description: "Event management and planning",
			logo: Brands.azra,
			color: "from-red-500 to-pink-600",
		},
		{
			name: "JezX",
			category: "Iot and Hosting Provider",
			description: "Connected device management",
			logo: Brands.jezx,
			color: "from-blue-400 to-cyan-200",
		},
		{
			name: "NexorX",
			category: "EduTech Platform",
			description: "Educational technology solutions",
			logo: Brands.nexora,
			color: "from-green-500 to-emerald-600",
		},

		{
			name: "Enyard Media",
			category: "Digital Media",
			description: "Content creation and distribution",
			logo: Brands.enyard,
			color: "from-indigo-500 to-purple-600",
		},
		{
			name: "Ricspace",
			category: "Social Media Platform",
			description: "Social media marketing and engagement",
			logo: Brands.ricspace,
			color: "from-cyan-200 to-blue-100",
		},
		{
			name: "Secure Worldz",
			category: "Cyber Security Provider",
			description: "Advanced cybersecurity solutions and protection",
			logo: Brands.secureworldz,
			color: "from-slate-600 to-gray-800",
		},
	];

	const team = [
		{
			name: "Jinu Martin",
			position: "Investor",
			description: "Strategic leadership and corporate governance",
			profile: Leaders.jinumartin,
			linkedin:
				"https://www.linkedin.com/in/jinu-martin-64512269/?originalSubdomain=ae",
		},
		{
			name: "Shabin",
			position: "Chief Executive Officer",
			description: "Executive leadership and business development",
			profile: Leaders.shabin,
			linkedin: "https://www.linkedin.com/in/shabin-jezh",
		},
		{
			name: "Jibisha",
			position: "Chief Operating Officer",
			description: "Executive leadership and business development",
			profile: Leaders.jibisha,
			linkedin: "https://www.linkedin.com/in/jibisha-xavier-825689273/",
		},
	];

	const values = [
		{
			title: "Innovation-First Excellence",
			description:
				"Every solution begins with breakthrough thinking, pushing boundaries and setting new industry standards through creative problem-solving.",
			icon: Rocket,
			gradient: "from-blue-500 to-purple-600",
		},
		{
			title: "Research-Driven Precision",
			description:
				"Deep market analysis and systematic validation ensure our solutions are not just innovative, but perfectly aligned with real-world needs.",
			icon: Heart,
			gradient: "from-pink-500 to-red-500",
		},
		{
			title: "Practical Implementation Mastery",
			description:
				"From concept to deployment, we excel at turning visionary ideas into robust, scalable solutions that deliver measurable results.",
			icon: Award,
			gradient: "from-yellow-500 to-orange-500",
		},
	];

	return (
		<>
			<SeoMeta path={PAGE_PATHS.ABOUT} />
			<div className="min-h-screen bg-background">
				<Navigation />

				{/* Hero Section */}
				<section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
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
							className="absolute bottom-32 left-1/3 w-40 h-40 opacity-[0.07] animate-pulse"
							style={{
								background:
									"linear-gradient(225deg, #f3e8ff 0%, #e9d5ff 50%, #c084fc 100%)",
								borderRadius: "63% 37% 54% 46% / 55% 48% 52% 45%",
								animationDuration: "10s",
								animationDelay: "4s",
								filter: "blur(1px)",
							}}
						/>

						{/* Subtle gradient overlays */}
						<div
							className="absolute inset-0 opacity-[0.15]"
							style={{
								background: `
                radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 40%)
              `,
							}}
						/>

						{/* Animated mesh gradient */}
						<div
							className="absolute inset-0 opacity-[0.12]"
							style={{
								background: `
                conic-gradient(from 0deg at 50% 50%,
                  rgba(59, 130, 246, 0.1) 0deg,
                  rgba(168, 85, 247, 0.1) 72deg,
                  rgba(236, 72, 153, 0.1) 144deg,
                  rgba(34, 197, 94, 0.1) 216deg,
                  rgba(59, 130, 246, 0.1) 288deg,
                  rgba(59, 130, 246, 0.1) 360deg)
              `,
								animation: "rotate 20s linear infinite",
							}}
						/>

						{/* Subtle noise texture */}
						<div
							className="absolute inset-0 opacity-[0.02]"
							style={{
								backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
							}}
						/>

						{/* Floating particles */}
						<div className="absolute inset-0">
							<div
								className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-30"
								style={{ animationDelay: "0s" }}
							/>
							<div
								className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-30"
								style={{ animationDelay: "1s" }}
							/>
							<div
								className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-30"
								style={{ animationDelay: "2s" }}
							/>
							<div
								className="absolute top-1/2 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-30"
								style={{ animationDelay: "3s" }}
							/>
							<div
								className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-30"
								style={{ animationDelay: "4s" }}
							/>
						</div>

						{/* Subtle wave effect at bottom */}
						<div
							className="absolute bottom-0 left-0 w-full h-32 opacity-[0.08]"
							style={{
								background: `
                linear-gradient(135deg,
                  rgba(59, 130, 246, 0.1) 0%,
                  rgba(168, 85, 247, 0.1) 25%,
                  rgba(236, 72, 153, 0.1) 50%,
                  rgba(34, 197, 94, 0.1) 75%,
                  rgba(59, 130, 246, 0.1) 100%
                )
              `,
								clipPath:
									"polygon(0 100%, 100% 100%, 100% 60%, 80% 40%, 60% 60%, 40% 40%, 20% 60%, 0 40%)",
							}}
						/>
					</div>

					{/* Content */}
					<div className="relative z-10 max-w-5xl mx-auto px-6 py-4 text-center">
						{/* Animated Badge */}
						<div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-gray-200/50 shadow-sm">
							<span className="text-sm font-medium text-gray-700">
								Global Holding Company
							</span>
						</div>

						{/* Main Headline */}
						<div className="space-y-6 mb-8">
							<h1 className="text-6xl md:text-8xl font-bold tracking-tight">
								<span className="block text-gray-900">ENYARD</span>
								<span className="block text-gradient-animate">
									Global Innovation Hub
								</span>
							</h1>
						</div>

						{/* Subheadline */}
						<p className="text-lg md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
							ENYARD is a premier global holding company operating across 5+
							countries with 10+ subsidiaries spanning IT, transportation,
							tourism, IoT, EduTech, and social media platforms.
							<br />
							<br />
							From Lagoon Technologies to Boobazhop, UAE Chauffeur to JezX—we're
							building the future across multiple industries with innovative
							solutions that transform how people live, work, and connect.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
							<Button
								size="lg"
								className="group relative overflow-hidden bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl"
								onClick={() => {
									const section = document.getElementById("companies-section");
									if (section) {
										section.scrollIntoView({ behavior: "smooth" });
									}
								}}>
								<span className="relative z-10 flex items-center">
									Explore Our Companies
									<Rocket className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
								</span>
							</Button>

							<Button
								variant="outline"
								size="lg"
								className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 group shadow-sm"
								onClick={() => {
									const section = document.getElementById("leaders-section");
									if (section) {
										section.scrollIntoView({ behavior: "smooth" });
									}
								}}>
								<span className="flex items-center text-gray-700">
									Meet Our Leadership
								</span>
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

				{/* Stats Section */}
				<section className="py-24 relative">
					<div className="container">
						<div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
							{stats.map((stat, index) => (
								<Card
									key={index}
									className="p-8 text-center magnetic-card glass">
									<stat.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
									<div className="text-4xl font-bold text-black mb-2">
										{stat.value}
									</div>
									<div className="text-muted-foreground">{stat.label}</div>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* Mission Section */}
				<section className="md:py-24 relative overflow-hidden">
					<div className="absolute grid-line opacity-20" />
					<div className="container relative z-10">
						<div className="flex flex-col lg:flex-row gap-8 md:gap-16 items-center">
							<div className="lg:basis-1/2">
								<h2 className="text-5xl font-bold mb-8 text-black text-wrap">
									Our Mission & Vision
								</h2>
								<p className="text-xl text-muted-foreground mb-8 leading-relaxed">
									To pioneer the future through{" "}
									<strong>innovation-first</strong> approach, combining deep
									research with practical implementation to create solutions
									that set industry standards. We believe in transforming ideas
									into reality through systematic innovation, rigorous
									development, and real-world validation.
								</p>
								<div className="space-y-4">
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 rounded-full bg-gradient-primary" />
										<span>
											<strong>Innovation-First Philosophy</strong> - Every
											solution starts with breakthrough thinking
										</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 rounded-full bg-gradient-primary" />
										<span>
											<strong>Deep Research Integration</strong> - Systematic
											analysis and market validation
										</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 rounded-full bg-gradient-primary" />
										<span>
											<strong>Practical Implementation</strong> - Real-world
											deployment and continuous optimization
										</span>
									</div>
								</div>
							</div>

							<div className="relative lg:basis-1/2">
								<div className="glass-strong rounded-3xl p-3 md:p-6 magnetic-card overflow-hidden">
									{/* Innovative Code Editor Display */}
									<div
										className="
    bg-gray-900
    rounded-2xl
    w-[60vw]             
    sm:w-[70vw]          
    md:w-[50vw]          
    lg:w-[40vw]          
    xl:w-[35vw]          
    max-w-[600px]        
    min-w-[320px]        
    transition-all
    duration-300
  ">
										{/* Editor Header */}
										<div className="flex items-center space-x-2 px-4 py-2">
											<div className="flex space-x-1.5">
												<div className="w-3 h-3 rounded-full bg-red-500"></div>
												<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
												<div className="w-3 h-3 rounded-full bg-green-500"></div>
											</div>
											<div className="flex-1 text-center">
												<span className="text-gray-400 text-sm font-mono">
													innovation.js
												</span>
											</div>
										</div>
										<hr className="border-gray-700" />
										{/* Code Content */}
										<div className="font-mono p-4 text-sm text-gray-300 space-y-2 h-80 overflow-auto">
											{fullCode.split('\n').map((line, lineIndex) => {
												const linesBefore = fullCode.split('\n').slice(0, lineIndex).join('\n').length + lineIndex;
												const lineStart = linesBefore;
												const lineEnd = lineStart + line.length + 1; // +1 for newline
												const isLineComplete = typedCode.length >= lineEnd;
												const visibleChars = Math.max(0, typedCode.length - lineStart);
												const visibleLine = isLineComplete ? line : line.substring(0, Math.min(visibleChars, line.length));
												
												if (visibleLine.length === 0 && !isLineComplete) return null;
												
												return (
													<div key={lineIndex} className="flex">
														<span className="text-gray-600 mr-4 w-8">{lineIndex + 1}</span>
														<span>
															{visibleLine.split(/(\w+|[{}();=.'\s]+)/g).map((token, tokenIdx) => {
																if (!token) return null;
																const trimmed = token.trim();
																
																if (['class', 'constructor', 'async', 'await', 'const', 'return', 'new'].includes(trimmed)) {
																	return <span key={tokenIdx} className="text-purple-400">{token}</span>;
																}
																if (['ENYARDInnovation', 'createFuture'].includes(trimmed)) {
																	return <span key={tokenIdx} className="text-yellow-400">{token}</span>;
																}
																if (['philosophy', 'approach', 'execution', 'research', 'innovation', 'deepAnalysis', 'breakthrough', 'implement', 'enyard'].includes(trimmed)) {
																	return <span key={tokenIdx} className="text-green-400">{token}</span>;
																}
																if (token.match(/'[^']*'/)) {
																	return <span key={tokenIdx} className="text-orange-400">{token}</span>;
																}
																if (line.trim().startsWith('//')) {
																	return <span key={tokenIdx} className="text-green-400">{token}</span>;
																}
																if (['{', '}', '(', ')', '=', ';', '.'].some(c => token.includes(c))) {
																	return <span key={tokenIdx} className="text-gray-400">{token}</span>;
																}
																return <span key={tokenIdx} className="text-gray-300">{token}</span>;
															})}
														</span>
													</div>
												);
											})}
											{typedCode.length < fullCode.length && (
												<span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
											)}
										</div>

										{/* Animated Cursor */}
										<div className="absolute bottom-4 left-4 w-2 h-5 bg-green-400 animate-pulse"></div>

										{/* Floating Code Elements */}
										<div className="absolute top-20 right-6 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
										<div
											className="absolute bottom-20 right-8 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-60"
											style={{ animationDelay: "1s" }}></div>
										<div
											className="absolute top-32 right-4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping opacity-60"
											style={{ animationDelay: "2s" }}></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Values Section */}
				<section className="py-24 relative">
					<div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30" />
					<div className="container relative z-10">
						<div className="text-center mb-16">
							<h2 className="text-5xl font-bold mb-8 text-black">
								Our Core Values
							</h2>
							<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
								The fundamental principles that drive our innovation-first
								approach and shape every solution we create.
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
							{values.map((value, index) => (
								<Card
									key={index}
									className="p-8 magnetic-card glass relative overflow-hidden group hover:scale-105 transition-all duration-500">
									<div
										className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}
									/>
									<div className="relative z-10">
										<div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-white group-hover:to-gray-50 transition-all duration-500 shadow-lg">
											<value.icon className="h-8 w-8 text-primary" />
										</div>
										<h3 className="text-2xl font-bold mb-4 text-center">
											{value.title}
										</h3>
										<p className="text-muted-foreground leading-relaxed text-center">
											{value.description}
										</p>
									</div>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* Subsidiaries Section */}
				<section id="companies-section" className="py-24 relative">
					<div className="absolute inset-0 mesh-background opacity-10" />
					<div className="container relative z-10">
						<div className="text-center mb-16">
							<h2 className="text-5xl font-bold mb-8 text-black">
								Our Subsidiaries
							</h2>
							<p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
								A diverse portfolio of companies operating across multiple
								industries and geographies, each delivering exceptional value in
								their respective markets.
							</p>
						</div>

						<div className="flex flex-wrap justify-center gap-6">
							{subsidiaries.map((company, index) => (
								<Card
									key={index}
									className="
				p-4 sm:p-6 md:p-8 
				m-2 
				w-[90%] sm:w-[300px] md:w-[340px] 
				magnetic-card glass 
				relative overflow-hidden group 
				hover:shadow-xl hover:scale-105 
				transition-all duration-500
			">
									<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
									<div className="relative z-10 text-center">
										<div className="flex items-center justify-center w-[80px] h-[80px] mx-auto mb-6 rounded-2xl bg-white transition-all duration-500">
											<img
												src={company.logo}
												alt={company.name}
												className="w-[80px] h-[80px] object-contain"
											/>
										</div>

										<h3 className="text-xl font-bold mb-3 text-black">
											{company.name}
										</h3>
										<p className="text-sm text-blue-600 font-medium mb-2">
											{company.industry}
										</p>
										<p className="text-sm text-muted-foreground">
											{company.location}
										</p>
									</div>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* Brands Section */}
				<section className="py-24 relative">
					<div className="absolute inset-0 bg-gradient-to-br from-pink-50/20 to-purple-50/20" />
					<div className="container relative z-10">
						<div className="text-center mb-16">
							<h2 className="text-5xl font-bold mb-8 text-black">
								Our Innovative Brands
							</h2>
							<p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
								Revolutionary digital platforms and lifestyle brands that
								connect, entertain, and enhance the lives of millions of users
								worldwide.
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{brands.map((brand, index) => (
								<Card
									key={index}
									className="p-6 magnetic-card glass relative overflow-hidden group hover:shadow-2xl hover:scale-110 transition-all duration-500">
									<div
										className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
									/>
									<div className="flex flex-col items-center justify-center text-center">
										<img 
											src={brand.logo} 
											alt={brand.name + " logo"} 
											className="max-w-[120px] max-h-[80px] object-contain mb-4"
										/>

										<h3 className="text-lg font-bold mb-2 text-black group-hover:text-gray-800 transition-colors">
											{brand.name}
										</h3>
										<p className="text-xs text-blue-600 font-medium mb-2">
											{brand.category}
										</p>
										<p className="text-xs text-muted-foreground leading-relaxed">
											{brand.description}
										</p>
									</div>

									{/* Floating Elements */}
									<div
										className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60 group-hover:opacity-100 transition-opacity duration-500"
										style={{ animationDelay: `${index * 0.2}s` }}></div>
									<div
										className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-60 group-hover:opacity-100 transition-opacity duration-500"
										style={{ animationDelay: `${index * 0.3}s` }}></div>
								</Card>
							))}
						</div>

						{/* Decorative Elements */}
						<div className="absolute top-20 left-10 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse opacity-30"></div>
						<div
							className="absolute top-40 right-20 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse opacity-30"
							style={{ animationDelay: "1s" }}></div>
						<div
							className="absolute bottom-20 left-1/4 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse opacity-30"
							style={{ animationDelay: "2s" }}></div>
					</div>
				</section>

				{/* Team Section */}
				<section id="leaders-section" className="py-24 relative">
					<div className="absolute inset-0 mesh-background opacity-10" />
					<div className="container relative z-10">
						<div className="text-center mb-16">
							<h2 className="text-5xl font-bold mb-8 text-black">
								Meet Our Leadership
							</h2>
							<p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
								Experienced leaders driving innovation and growth across our
								global portfolio of companies, with expertise spanning multiple
								industries and markets.
							</p>
						</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
						{team.map((member, index) => (
								<Card
									key={index}
									className="p-6 magnetic-card glass relative overflow-hidden group hover:shadow-lg transition-all duration-300">
									<div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
									<a href={member.linkedin} target="blank">
										<img
											src={Social.linkedin}
											alt="LinkedIn logo"
											className="absolute top-2 right-2 w-5 h-5 md:w-6 md:h-6"
										/>
									</a>
									<div className="relative z-10 text-center">
										<img
											src={member.profile}
											alt={member.name}
											className={`w-[150px] h-[150px] object-cover rounded-full mx-auto mb-4 shadow-md border border-gray-200 ${
												member.name === "Jibisha" ? "object-top" : ""
											}`}
										/>

										<h3 className="text-xl font-bold mb-2 text-black">
											{member.name}
										</h3>
										<p className="text-sm text-green-600 font-medium mb-2">
											{member.position}
										</p>
										<p className="text-sm text-muted-foreground">
											{member.description}
										</p>
									</div>
								</Card>
							))}
						</div>
					</div>
				</section>
				{/* Enhanced Bottom CTA */}
				<EnhancedCTA
					visible={true}
					onStartTrial={() => setIsDialogOpen(true)}
					onBookDemo={() => console.log("Book Demo Clicked")}
				/>

				<BusinessForm isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />

				<Footer />
			</div>
		</>
	);
};

export default About;
