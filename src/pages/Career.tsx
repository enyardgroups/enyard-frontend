import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
	MapPin,
	Clock,
	DollarSign,
	Users,
	Briefcase,
	GraduationCap,
	Coffee,
	Gamepad2,
	Upload,
	X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Social } from "@/assets";
import { PAGE_PATHS } from "@/seo/routeMeta";
import { SeoMeta } from "@/components/SeoMeta";

const Career = () => {
	const navigate = useNavigate();

	const [scrollY, setScrollY] = useState(0);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedRole, setSelectedRole] = useState<string>("");
	const [formData, setFormData] = useState({
		name: "",
		gender: "",
		email: "",
		mobile: "",
		resume: null as File | null,
		workType: "",
		employmentType: "",
		role: "",
	});
	const [typedCulture, setTypedCulture] = useState("");

	const cultureCode = `const ENYARDCulture = {
  values: {
    innovation: 'Continuous learning and experimentation',
    collaboration: 'Transparent communication across teams',
    balance: 'Work-life harmony and mental wellness',
    diversity: 'Inclusive environment for all talents'
  },
  
  practices: {
    remoteFirst: true,
    innovationTime: '20% of time for passion projects',
    transparentCommunication: true,
    flexibleHours: true
  },
  
  benefits: [
    'Remote-first culture',
    'Transparent communication',
    'Innovation time (20% projects)',
    'Diversity and inclusion'
  ]
};

// Building tomorrow, together
const team = new ENYARDCulture();`;

	useEffect(() => {
		const handleScroll = () => setScrollY(window.scrollY);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		let currentIndex = 0;
		const typingInterval = setInterval(() => {
			if (currentIndex < cultureCode.length) {
				setTypedCulture(cultureCode.slice(0, currentIndex + 1));
				currentIndex++;
			} else {
				clearInterval(typingInterval);
			}
		}, 30);

		return () => clearInterval(typingInterval);
	}, [cultureCode]);

	const positions = [
		{
			title: "Business Development Executive",
			department: "Business Development",
			location: "On-site / Remote",
			type: "Full-time",
			salary: "3LPA - 8LPA",
			tags: ["Sales", "Business Development", "Client Relations"],
			description:
				"Drive business growth through strategic partnerships and client acquisition.",
		},
		{
			title: "Sales Executive",
			department: "Sales",
			location: "On-site / Remote",
			type: "Full-time",
			salary: "3LPA - 10LPA",
			tags: ["Sales", "Customer Relations", "Negotiation"],
			description:
				"Build relationships with clients and drive revenue growth.",
		},
		{
			title: "Digital Marketing",
			department: "Marketing",
			location: "On-site / Remote",
			type: "Full-time",
			salary: "4LPA - 12LPA",
			tags: ["SEO", "Social Media", "Content Marketing"],
			description:
				"Create and execute digital marketing strategies to enhance brand presence.",
		},
		{
			title: "Graphic Designer",
			department: "Design",
			location: "On-site / Remote",
			type: "Full-time",
			salary: "3LPA - 10LPA",
			tags: ["Adobe Creative Suite", "UI/UX", "Branding"],
			description:
				"Create visually compelling designs for digital and print media.",
		},
		{
			title: "Video Editor",
			department: "Content",
			location: "On-site / Remote",
			type: "Full-time",
			salary: "4LPA - 12LPA",
			tags: ["Premiere Pro", "After Effects", "Video Production"],
			description:
				"Edit and produce high-quality video content for marketing and branding.",
		},
		{
			title: "Content Creator",
			department: "Content",
			location: "On-site / Remote",
			type: "Full-time",
			salary: "3LPA - 8LPA",
			tags: ["Content Writing", "Social Media", "SEO"],
			description:
				"Create engaging content across various platforms and formats.",
		},
		{
			title: "Senior Full Stack Developer",
			department: "Engineering",
			location: "On-site / Remote",
			type: "Full-time",
			salary: "12LPA - 25LPA",
			tags: ["React", "Node.js", "TypeScript", "Full Stack"],
			description:
				"Lead development of full-stack applications and mentor junior developers.",
		},
		{
			title: "Junior Full Stack Developer",
			department: "Engineering",
			location: "On-site / Remote",
			type: "Full-time",
			salary: "5LPA - 12LPA",
			tags: ["React", "Node.js", "JavaScript", "Learning"],
			description:
				"Build and maintain web applications with mentorship and growth opportunities.",
		},
		{
			title: "AI/ML Engineer",
			department: "Engineering",
			location: "On-site / Remote",
			type: "Full-time",
			salary: "10LPA - 20LPA",
			tags: ["Python", "TensorFlow", "PyTorch", "Machine Learning"],
			description:
				"Design and implement AI/ML solutions that power our innovative products.",
		},
		{
			title: "DevOps Engineer",
			department: "Infrastructure",
			location: "On-site / Remote",
			type: "Full-time",
			salary: "8LPA - 18LPA",
			tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
			description:
				"Build and maintain scalable cloud infrastructure for our applications.",
		},
		{
			title: "Research Intern",
			department: "Research",
			location: "On-site / Remote",
			type: "Internship",
			salary: "Rs 25,000 - Rs 75,000/month",
			tags: ["Research", "Analysis", "Learning"],
			description:
				"Conduct research and analysis to support innovation and product development.",
		},
	];

	const benefits = [
		{
			icon: Coffee,
			title: "Flexible Work",
			description:
				"Work from anywhere with flexible hours that suit your lifestyle.",
		},
		{
			icon: GraduationCap,
			title: "Learning & Growth",
			description:
				"Continuous learning opportunities and conference attendance.",
		},
		{
			icon: Users,
			title: "Great Team",
			description:
				"Work with passionate, talented people who care about excellence.",
		},
		{
			icon: Gamepad2,
			title: "Work-Life Balance",
			description: "Enjoy unlimited PTO and company-wide mental health days.",
		},
	];

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission here
		console.log("Form submitted:", formData);
		alert("Application submitted successfully! We'll get back to you soon.");
		setIsFormOpen(false);
		setFormData({
			name: "",
			gender: "",
			email: "",
			mobile: "",
			resume: null,
			workType: "",
			employmentType: "",
			role: selectedRole || "",
		});
		setSelectedRole("");
	};

	const openForm = (role?: string) => {
		if (role) {
			setSelectedRole(role);
			setFormData((prev) => ({ ...prev, role }));
		}
		setIsFormOpen(true);
	};

	return (
		<>
			<SeoMeta path={PAGE_PATHS.CAREER} />
			<div className="min-h-screen bg-background">
				<Navigation />

				{/* Hero Section */}
				<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
					<div
						className="absolute inset-0 opacity-30"
						style={{ transform: `translateY(${scrollY * 0.3}px)` }}
					/>

					<div className="container relative z-10 text-center">
						<div className="stagger-item" style={{ animationDelay: "0.1s" }}>
							<h1 className="text-7xl md:text-9xl font-bold mb-8 text-black">
								Join ENYARD
							</h1>
						</div>

						<div className="stagger-item" style={{ animationDelay: "0.2s" }}>
							<p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12">
								Shape the future of AI-powered software development. Work with
								cutting-edge technology and brilliant minds to create solutions
								that change the world.
							</p>
						</div>

						<div className="stagger-item" style={{ animationDelay: "0.3s" }}>
							<Button
								onClick={() => {
									const section = document.getElementById("open-positions");
									if (section) {
										section.scrollIntoView({ behavior: "smooth" });
									}
								}}
								size="lg"
								className="group">
								View Open Positions
								<Briefcase className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
							</Button>
						</div>
					</div>

					<div className="floating-orb w-72 h-72 top-10 right-10 bg-gradient-to-br from-green-400 to-blue-600 opacity-20" />
					<div className="floating-orb w-56 h-56 bottom-10 left-10 bg-gradient-to-br from-yellow-400 to-pink-600 opacity-20" />
				</section>

				{/* Benefits Section */}
				<section className="py-24 relative">
					<div className="container">
						<div className="text-center mb-16">
							<h2 className="text-5xl font-bold mb-8 text-black">
								Why Join Us?
							</h2>
							<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
								We believe in creating an environment where innovation thrives
								and people grow.
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
							{benefits.map((benefit, index) => (
								<Card
									key={index}
									className="p-8 text-center magnetic-card glass">
									<benefit.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
									<h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
									<p className="text-muted-foreground text-sm">
										{benefit.description}
									</p>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* Open Positions */}
				<section id="open-positions" className="py-24 relative overflow-hidden">
					<div className="absolute inset-0 grid-lines opacity-20" />
					<div className="container relative z-10">
						<div className="text-center mb-16">
							<h2 className="text-5xl font-bold mb-8 text-black">
								Open Positions
							</h2>
							<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
								Find your next challenge and help us build the future of
								software.
							</p>
						</div>

						<div className="grid lg:grid-cols-2 gap-8">
							{positions.map((position, index) => (
								<Card
									key={index}
									className="p-8 magnetic-card glass group hover:shadow-2xl transition-all duration-300">
									<div className="flex justify-between items-start mb-6">
										<div>
											<h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
												{position.title}
											</h3>
											<Badge variant="secondary" className="mb-2">
												{position.department}
											</Badge>
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() => openForm(position.title)}
											className="opacity-0 group-hover:opacity-100 transition-opacity">
											Apply Now
										</Button>
									</div>

									<p className="text-muted-foreground mb-6 leading-relaxed">
										{position.description}
									</p>

									<div className="space-y-3 mb-6">
										<div className="flex items-center text-sm text-muted-foreground">
											<MapPin className="h-4 w-4 mr-2" />
											{position.location}
										</div>
										<div className="flex items-center text-sm text-muted-foreground">
											<Clock className="h-4 w-4 mr-2" />
											{position.type}
										</div>
										<div className="flex items-center text-sm text-muted-foreground">
											<DollarSign className="h-4 w-4 mr-2" />
											{position.salary}
										</div>
									</div>

									<div className="flex flex-wrap gap-2">
										{position.tags.map((tag, tagIndex) => (
											<Badge
												key={tagIndex}
												variant="outline"
												className="text-xs">
												{tag}
											</Badge>
										))}
									</div>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* Culture Section */}
				<section className="py-24 relative">
					<div className="absolute inset-0 mesh-background opacity-10" />
					<div className="container relative z-10">
						<div className="grid lg:grid-cols-2 gap-16 items-center">
							<div>
								<h2 className="text-5xl font-bold mb-8 text-black">
									Our Culture
								</h2>
								<p className="text-xl text-muted-foreground mb-8 leading-relaxed">
									We foster a culture of innovation, collaboration, and
									continuous learning. Our team is passionate about technology
									and committed to delivering exceptional results while
									maintaining work-life balance.
								</p>
								<div className="space-y-4">
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 rounded-full bg-gradient-primary" />
										<span>Remote-first culture</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 rounded-full bg-gradient-primary" />
										<span>Transparent communication</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 rounded-full bg-gradient-primary" />
										<span>Innovation time (20% projects)</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 rounded-full bg-gradient-primary" />
										<span>Diversity and inclusion</span>
									</div>
								</div>
							</div>

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
											Office.js
										</span>
									</div>
								</div>
								<hr className="border-gray-700" />
								<div className="font-mono p-4 text-sm text-gray-300 space-y-2 h-80 overflow-auto">
									<pre className="whitespace-pre-wrap">
										{typedCulture}
										{typedCulture.length < cultureCode.length && (
											<span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
										)}
									</pre>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-24">
					<div className="container text-center">
						<h2 className="text-5xl font-bold mb-8 text-black">
							Ready to Start?
						</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
							Don't see the perfect role? We're always looking for exceptional
							talent. Send us your resume and let's start a conversation.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button size="lg" onClick={() => openForm()}>
								Submit Your Resume
							</Button>
							<Button
								onClick={() => navigate("/about")}
								size="lg"
								variant="outline">
								Learn More About Us
							</Button>
						</div>
					</div>
				</section>

				{/* Application Form Dialog */}
				<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
					<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle className="text-2xl font-bold">
								Job Application Form
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-6 mt-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="name">Full Name *</Label>
									<Input
										id="name"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										required
										placeholder="Enter your full name"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="gender">Gender *</Label>
									<Select
										value={formData.gender}
										onValueChange={(value) =>
											setFormData((prev) => ({ ...prev, gender: value }))
										}
										required>
										<SelectTrigger>
											<SelectValue placeholder="Select gender" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="male">Male</SelectItem>
											<SelectItem value="female">Female</SelectItem>
											<SelectItem value="other">Other</SelectItem>
											<SelectItem value="prefer-not-to-say">
												Prefer not to say
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email *</Label>
									<Input
										id="email"
										name="email"
										type="email"
										value={formData.email}
										onChange={handleInputChange}
										required
										placeholder="your.email@example.com"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="mobile">Mobile Number *</Label>
									<Input
										id="mobile"
										name="mobile"
										type="tel"
										value={formData.mobile}
										onChange={handleInputChange}
										required
										placeholder="+91 1234567890"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="role">Applying For *</Label>
								<Select
									value={formData.role || selectedRole}
									onValueChange={(value) => {
										setFormData((prev) => ({ ...prev, role: value }));
										setSelectedRole(value);
									}}
									required>
									<SelectTrigger>
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
									<SelectContent>
										{positions.map((pos) => (
											<SelectItem key={pos.title} value={pos.title}>
												{pos.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="workType">Work Type *</Label>
									<Select
										value={formData.workType}
										onValueChange={(value) =>
											setFormData((prev) => ({ ...prev, workType: value }))
										}
										required>
										<SelectTrigger>
											<SelectValue placeholder="Select work type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="onsite">On-site</SelectItem>
											<SelectItem value="remote">Remote</SelectItem>
											<SelectItem value="hybrid">Hybrid</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="employmentType">Employment Type *</Label>
									<Select
										value={formData.employmentType}
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												employmentType: value,
											}))
										}
										required>
										<SelectTrigger>
											<SelectValue placeholder="Select employment type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="full-time">Full-time</SelectItem>
											<SelectItem value="intern">Intern</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="resume">Upload Resume *</Label>
								<div className="flex items-center gap-4">
									<Input
										id="resume"
										name="resume"
										type="file"
										accept=".pdf,.doc,.docx"
										onChange={handleFileChange}
										required
										className="cursor-pointer"
									/>
									{formData.resume && (
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<span>{formData.resume.name}</span>
											<button
												type="button"
												onClick={() =>
													setFormData((prev) => ({ ...prev, resume: null }))
												}
												className="text-red-500 hover:text-red-700">
												<X className="h-4 w-4" />
											</button>
										</div>
									)}
								</div>
								<p className="text-xs text-muted-foreground">
									Accepted formats: PDF, DOC, DOCX (Max 5MB)
								</p>
							</div>

							<div className="flex justify-end gap-4 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsFormOpen(false)}>
									Cancel
								</Button>
								<Button type="submit">Submit Application</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>

				<Footer />
			</div>
		</>
	);
};

export default Career;
