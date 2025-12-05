import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
	ChevronDown,
	Menu,
	X,
	Clock,
	Building2,
	Truck,
	Heart,
	BookOpen,
	Download,
	FileText,
	Users,
	Briefcase,
	Shield,
	Terminal,
	LogOut,
	LayoutDashboard,
	FileCode,
	GitGraph,
	MonitorCog,
	User,
	Grid3x3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";

const Navigation = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
	const location = useLocation();
	const { isAuthenticated, logout, user } = useAuthStore();
	
	// Auth check happens in App.tsx in background - no need to wait here
	// Navigation shows buttons immediately based on optimistic auth state from localStorage

	// Note: checkAuth is called in App.tsx on mount, so we don't need to call it here
	// This prevents duplicate calls and ensures user data is loaded before Navigation renders

	const companyItems = [
		{
			label: "About Us",
			href: "/about",
			icon: Users,
			description: "Learn about our mission and values",
		},
		{
			label: "Career",
			href: "/career",
			icon: Briefcase,
			description: "Join our innovative team",
		},
	];

	const productCategories = [
		{
			title: "Business Solutions",
			items: [
				{
					label: "TimeX",
					href: "/products/timex",
					icon: Clock,
					description:
						"AI-powered attendance management with camera integration",
				},
				{
					label: "XSafety",
					href: "/products/xsafety",
					icon: Shield,
					description: "Advanced safety management system for airlines",
				},
			],
		},
		{
			title: "Specialized Solutions",
			items: [
				{
					label: "PenquinX",
					href: "/products/penquinx",
					icon: Terminal,
					description: "Cybersecurity learning platform for enthusiasts",
				},
			],
		},
		{
			title: "Plug-in Solutions",
			items: [
				{
					label: "WorkX 365",
					href: "/products/workx365",
					icon: MonitorCog,
					description:
						"Simplified workforce management and productivity tracking",
				},
				{
					label: "GitX",
					href: "/products/gitx",
					icon: GitGraph,
					description: "Seamless GitHub-to-server deployment without CI/CD",
				},
			],
		},
	];

	const resourceItems = [
		{
			label: "Blog",
			href: "/blog",
			icon: FileText,
			description: "Latest insights and updates",
		},
		{
			label: "Documentation",
			href: "/documentation",
			icon: BookOpen,
			description: "Comprehensive guides and API docs",
		},
		{
			label: "Downloads",
			href: "/downloads",
			icon: Download,
			description: "Software downloads and resources",
		},
	];

	const isActive = (path: string) => location.pathname === path;

	const handleMouseEnter = (dropdown: string) => {
		setActiveDropdown(dropdown);
	};

	const handleMouseLeave = () => {
		setActiveDropdown(null);
	};

	return (
		<nav className="fixed top-0 left-0 right-0 z-[100] glass border-b backdrop-blur-sm bg-background/95">
			<div className="max-w-7xl mx-auto px-6">
				<div className="flex items-center justify-between h-20">
					{/* Logo */}
					<Link
						to="/"
						className="flex items-center space-x-3 hover:scale-105 transition-transform">
						<img
							src="/lovable-uploads/98fab40e-4f49-42c5-bf83-50cb4020d1a4.png"
							alt="ENYARD"
							className="h-8 w-auto"
						/>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden lg:flex items-center space-x-8">
						<Link
							to="/"
							className={`text-sm font-medium transition-all duration-200 hover:text-primary relative group ${
								isActive("/") ? "text-primary" : "text-muted-foreground"
							}`}>
							Home
							<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
						</Link>
						{/* Company Dropdown */}
						<div
							className="relative"
							onMouseEnter={() => handleMouseEnter("company")}
							onMouseLeave={handleMouseLeave}>
							<button className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 group">
								<span>Company</span>
								<ChevronDown
									className={`h-3 w-3 transition-transform duration-200 ${
										activeDropdown === "company" ? "rotate-180" : ""
									}`}
								/>
							</button>

							{activeDropdown === "company" && (
								<>
									<div className="absolute top-full h-2 w-full" />
									<div className="absolute top-full left-0 mt-2 w-80 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl animate-fade-in z-50">
										<div className="p-6">
											<div className="space-y-4">
												{companyItems.map((item) => {
													const IconComponent = item.icon;
													return (
														<Link
															key={item.href}
															to={item.href}
															className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group">
															<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
																<IconComponent className="w-5 h-5 text-primary" />
															</div>
															<div>
																<h3 className="font-semibold text-sm">
																	{item.label}
																</h3>
																<p className="text-xs text-muted-foreground">
																	{item.description}
																</p>
															</div>
														</Link>
													);
												})}
											</div>
										</div>
									</div>
								</>
							)}
						</div>
						{/* Products Mega Menu */}
						<div
							className="relative"
							onMouseEnter={() => handleMouseEnter("products")}
							onMouseLeave={handleMouseLeave}>
							<button className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 group">
								<span>Products</span>
								<ChevronDown
									className={`h-3 w-3 transition-transform duration-200 ${
										activeDropdown === "products" ? "rotate-180" : ""
									}`}
								/>
							</button>

							{activeDropdown === "products" && (
								<>
									<div className="absolute top-full h-2 w-full" />
									<div className="absolute top-full left-0 mt-2 w-[800px] bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl animate-fade-in z-50">
										<div className="p-8">
											<div className="grid grid-cols-3 gap-8">
												{productCategories.map((category) => (
													<div key={category.title}>
														<h3 className="font-semibold text-sm text-muted-foreground mb-4 uppercase tracking-wide">
															{category.title}
														</h3>
														<div className="space-y-3">
															{category.items.map((item) => {
																const IconComponent = item.icon;
																return (
																	<Link
																		key={item.href}
																		to={item.href}
																		className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group">
																		<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform mt-1">
																			<IconComponent className="w-5 h-5 text-primary" />
																		</div>
																		<div className="flex-1">
																			<h4 className="font-semibold text-sm mb-1">
																				{item.label}
																			</h4>
																			<p className="text-xs text-muted-foreground leading-relaxed">
																				{item.description}
																			</p>
																		</div>
																	</Link>
																);
															})}
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								</>
							)}
						</div>
						{/* Resources Dropdown */}
						<div
							className="relative"
							onMouseEnter={() => handleMouseEnter("resources")}
							onMouseLeave={handleMouseLeave}>
							<button className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 group">
								<span>Resources</span>
								<ChevronDown
									className={`h-3 w-3 transition-transform duration-200 ${
										activeDropdown === "resources" ? "rotate-180" : ""
									}`}
								/>
							</button>

							{activeDropdown === "resources" && (
								<>
									<div className="absolute top-full h-2 w-full" />
									<div className="absolute top-full left-0 mt-2 w-80 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl animate-fade-in z-50">
										<div className="p-6">
											<div className="space-y-4">
												{resourceItems.map((item) => {
													const IconComponent = item.icon;
													return (
														<Link
															key={item.href}
															to={item.href}
															className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group">
															<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
																<IconComponent className="w-5 h-5 text-primary" />
															</div>
															<div>
																<h3 className="font-semibold text-sm">
																	{item.label}
																</h3>
																<p className="text-xs text-muted-foreground">
																	{item.description}
																</p>
															</div>
														</Link>
													);
												})}
											</div>
										</div>
									</div>
								</>
							)}
						</div>

						<Link
							to="/contact"
							className={`text-sm font-medium transition-all duration-200 hover:text-primary relative group ${
								isActive("/contact") ? "text-primary" : "text-muted-foreground"
							}`}>
							Contact Us
							<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
						</Link>
					</div>

					{/* Auth Buttons - Show immediately, no loading state */}
					<div className="hidden lg:flex items-center space-x-4">
						{isAuthenticated && user ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="relative h-10 w-10 rounded-full hover:scale-105 transition-transform">
										<Avatar className="h-10 w-10">
											<AvatarFallback className="bg-primary text-primary-foreground">
												{user?.name
													? user.name
															.split(" ")
															.map((n) => n[0])
															.join("")
															.toUpperCase()
															.slice(0, 2)
													: user?.firstName && user?.lastName
													? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
													: user?.email
													? user.email[0].toUpperCase()
													: "U"}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56 z-[110]">
									<DropdownMenuLabel>
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">
												{user?.name || 
												 (user?.firstName && user?.lastName 
													? `${user.firstName} ${user.lastName}` 
													: user?.firstName || "User")}
											</p>
											<p className="text-xs leading-none text-muted-foreground">
												{user?.email || ""}
											</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link
											to="/dashboard"
											className="flex items-center cursor-pointer">
											<LayoutDashboard className="mr-2 h-4 w-4" />
											Dashboard
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link
											to="/dashboard/apps"
											className="flex items-center cursor-pointer">
											<Grid3x3 className="mr-2 h-4 w-4" />
											My Apps
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={logout}
										className="text-destructive focus:text-destructive cursor-pointer">
										<LogOut className="mr-2 h-4 w-4" />
										Logout
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<>
								<Link to="/auth/login">
									<Button
										variant="ghost"
										size="sm"
										className="hover:scale-105 transition-transform">
										Login
									</Button>
								</Link>
								<Link to="/auth/register">
									<Button
										size="sm"
										className="hover:scale-105 transition-transform">
										Register
									</Button>
								</Link>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<Button
						variant="ghost"
						size="sm"
						className="lg:hidden hover:scale-105 transition-transform"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
						{isMobileMenuOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
					</Button>
				</div>

				{/* Mobile Menu */}
				{isMobileMenuOpen && (
					<div className="lg:hidden py-6 border-t animate-fade-in">
						<div className="space-y-4">
							<Link
								to="/"
								className="block text-sm font-medium hover:text-primary transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}>
								Home
							</Link>

							<div className="space-y-2">
								<p className="text-sm font-semibold text-muted-foreground">
									Company
								</p>
								{companyItems.map((item) => (
									<Link
										key={item.href}
										to={item.href}
										className="block text-sm ml-4 hover:text-primary transition-colors"
										onClick={() => setIsMobileMenuOpen(false)}>
										{item.label}
									</Link>
								))}
							</div>

							<div className="space-y-2">
								<p className="text-sm font-semibold text-muted-foreground">
									Products
								</p>
								{productCategories
									.flatMap((cat) => cat.items)
									.map((item) => (
										<Link
											key={item.href}
											to={item.href}
											className="block text-sm ml-4 hover:text-primary transition-colors"
											onClick={() => setIsMobileMenuOpen(false)}>
											{item.label}
										</Link>
									))}
							</div>

							<div className="space-y-2">
								<p className="text-sm font-semibold text-muted-foreground">
									Resources
								</p>
								{resourceItems.map((item) => (
									<Link
										key={item.href}
										to={item.href}
										className="block text-sm ml-4 hover:text-primary transition-colors"
										onClick={() => setIsMobileMenuOpen(false)}>
										{item.label}
									</Link>
								))}
							</div>

							<Link
								to="/contact"
								className="block text-sm font-medium hover:text-primary transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}>
								Contact Us
							</Link>

							<div className="flex space-x-4 pt-4">
								{isAuthenticated && user ? (
									<>
										<Link to="/dashboard">
											<Button variant="outline" size="sm">
												<LayoutDashboard className="mr-2 h-4 w-4" />
												Dashboard
											</Button>
										</Link>
										<Link to="/dashboard/apps">
											<Button variant="outline" size="sm">
												<Grid3x3 className="mr-2 h-4 w-4" />
												My Apps
											</Button>
										</Link>
										<Button size="sm" onClick={logout}>
											<LogOut className="mr-2 h-4 w-4" />
											Logout
										</Button>
									</>
								) : (
									<>
										<Link to="/auth/login">
											<Button variant="ghost" size="sm">
												Login
											</Button>
										</Link>
										<Link to="/auth/register">
											<Button size="sm">Register</Button>
										</Link>
									</>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navigation;
