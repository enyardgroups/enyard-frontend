import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Clock,
	Building2,
	Truck,
	Church,
	Heart,
	CreditCard,
	Settings,
	LogOut,
	CheckCircle,
	AlertCircle,
	Calendar,
	DollarSign,
	User,
	Edit,
	MapPin,
	GraduationCap,
	School,
	Cake,
	Users as VenusMars,
	Linkedin,
	Twitter,
	Github,
	Facebook,
	Instagram,
	Globe,
	FileText,
	Package,
	Sparkles,
	Loader2,
	ExternalLink,
	Gift,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import useApiRequest from "@/hooks/useApiRequest";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { format } from "date-fns";

interface UserProfile {
	id: string;
	name: string;
	email: string;
	phone?: string;
	address?: string;
	college?: string;
	school?: string;
	date_of_birth?: string;
	gender?: string;
	linkedin_url?: string;
	twitter_url?: string;
	github_url?: string;
	facebook_url?: string;
	instagram_url?: string;
	website_url?: string;
}

interface Subscription {
	id: number;
	plan_name: string;
	status: string;
	start_date?: string;
	end_date?: string;
	amount?: number;
	billing_cycle?: string;
}

interface Invoice {
	id: number;
	invoice_number: string;
	amount: number;
	status: string;
	due_date?: string;
	paid_date?: string;
	payment_method?: string;
	created_at: string;
}

interface UserApp {
	id: number;
	app_name: string;
	app_slug: string;
	status: string;
	activated_at: string;
	last_accessed?: string;
}

const ClientDashboard = () => {
	const { user, logout } = useAuthStore();
	const { get, post, put } = useApiRequest();
	const { toast } = useToast();

	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [apps, setApps] = useState<UserApp[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
	const [isSavingProfile, setIsSavingProfile] = useState(false);

	// Profile form state
	const [profileForm, setProfileForm] = useState({
		address: "",
		college: "",
		school: "",
		date_of_birth: "",
		gender: "",
		linkedin_url: "",
		twitter_url: "",
		github_url: "",
		facebook_url: "",
		instagram_url: "",
		website_url: "",
	});

	// Available apps in ENYARD
	const availableApps = [
		{ name: "TimeX", slug: "timex", icon: Clock, description: "Attendance Management System" },
		{ name: "CoreX", slug: "corex", icon: Building2, description: "ERP Solution" },
		{ name: "FleetX", slug: "fleetx", icon: Truck, description: "Fleet Management" },
		{ name: "XSafety", slug: "xsafety", icon: Heart, description: "Safety Management" },
		{ name: "MedzorX", slug: "medzorx", icon: Church, description: "Medical Management" },
	];

	// Load dashboard data
	useEffect(() => {
		const loadDashboardData = async () => {
			setIsLoading(true);
			try {
				// Load user profile
				const userData = await get("/auth/me");
				if (userData) {
					setProfile(userData);
					setProfileForm({
						address: userData.address || "",
						college: userData.college || "",
						school: userData.school || "",
						date_of_birth: userData.date_of_birth || "",
						gender: userData.gender || "",
						linkedin_url: userData.linkedin_url || "",
						twitter_url: userData.twitter_url || "",
						github_url: userData.github_url || "",
						facebook_url: userData.facebook_url || "",
						instagram_url: userData.instagram_url || "",
						website_url: userData.website_url || "",
					});
				}

				// Load subscriptions
				try {
					const subsData = await get("/dashboard/subscriptions");
					if (subsData) {
						setSubscriptions(Array.isArray(subsData) ? subsData : []);
					}
				} catch (err) {
					console.error("Failed to load subscriptions:", err);
					setSubscriptions([]);
				}

				// Load invoices
				try {
					const invData = await get("/dashboard/invoices");
					if (invData) {
						setInvoices(Array.isArray(invData) ? invData : []);
					}
				} catch (err) {
					console.error("Failed to load invoices:", err);
					setInvoices([]);
				}

				// Load apps
				try {
					const appsData = await get("/dashboard/apps");
					if (appsData) {
						setApps(Array.isArray(appsData) ? appsData : []);
					}
				} catch (err) {
					console.error("Failed to load apps:", err);
					setApps([]);
				}
			} catch (error: any) {
				console.error("Failed to load dashboard data:", error);
				toast({
					title: "Error",
					description: "Failed to load dashboard data",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		loadDashboardData();
	}, [get, toast]);

	const handleSaveProfile = async () => {
		setIsSavingProfile(true);
		try {
			const updatedProfile = await put("/auth/profile", profileForm);
			if (updatedProfile) {
				setProfile(updatedProfile);
				toast({
					title: "Success",
					description: "Profile updated successfully",
				});
				setIsProfileEditOpen(false);
			}
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message || "Failed to update profile",
				variant: "destructive",
			});
		} finally {
			setIsSavingProfile(false);
		}
	};

	const activeSubscription = subscriptions.find((sub) => sub.status === "active");
	const activeApps = apps.filter((app) => app.status === "active");

	const getUserDisplayName = () => {
		if (profile?.name) {
			return profile.name;
		}
		if (user?.firstName && user?.lastName) {
			return `${user.firstName} ${user.lastName}`;
		}
		if (user?.firstName) {
			return user.firstName;
		}
		return user?.email || "User";
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-muted/30 flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-muted/30">
			<Navigation />
			{/* Header - Add top padding to account for fixed navigation (h-20 = 80px) */}
			<div className="bg-primary text-primary-foreground p-6 pt-24">
				<div className="max-w-7xl mx-auto flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold">Welcome back, {getUserDisplayName()}</h1>
						<p className="text-primary-foreground/80">Manage your ENYARD account and services</p>
					</div>
					<div className="flex items-center space-x-4">
						<Button
							variant="outline"
							size="sm"
							className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
							onClick={() => setIsProfileEditOpen(true)}>
							<Settings className="h-4 w-4 mr-2" />
							Settings
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
							onClick={logout}>
							<LogOut className="h-4 w-4 mr-2" />
							Logout
						</Button>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto p-6 space-y-6">
				{/* Quick Stats */}
				<div className="grid md:grid-cols-4 gap-6">
					<Card className="glass border-0 shadow-enyard">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">Subscription</p>
									<p className="text-2xl font-bold">
										{activeSubscription ? activeSubscription.plan_name : "None"}
									</p>
								</div>
								<Badge variant={activeSubscription ? "default" : "secondary"}>
									{activeSubscription ? "Active" : "Inactive"}
								</Badge>
							</div>
						</CardContent>
					</Card>

					<Card className="glass border-0 shadow-enyard">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">Active Apps</p>
									<p className="text-2xl font-bold">{activeApps.length}</p>
								</div>
								<CheckCircle className="h-8 w-8 text-green-500" />
							</div>
						</CardContent>
					</Card>

					<Card className="glass border-0 shadow-enyard">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">Invoices</p>
									<p className="text-2xl font-bold">{invoices.length}</p>
								</div>
								<FileText className="h-8 w-8 text-blue-500" />
							</div>
						</CardContent>
					</Card>

					<Card className="glass border-0 shadow-enyard">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">Profile</p>
									<p className="text-lg font-semibold">
										{profile?.address || profile?.college ? "Complete" : "Incomplete"}
									</p>
								</div>
								<User className="h-8 w-8 text-purple-500" />
							</div>
						</CardContent>
					</Card>
				</div>

				<Tabs defaultValue="profile" className="space-y-6">
					<TabsList className="glass">
						<TabsTrigger value="profile">My Profile</TabsTrigger>
						<TabsTrigger value="subscription">Subscription</TabsTrigger>
						<TabsTrigger value="invoices">Invoices</TabsTrigger>
						<TabsTrigger value="apps">My Apps</TabsTrigger>
						<TabsTrigger value="promotions">Promotions</TabsTrigger>
					</TabsList>

					{/* Profile Tab */}
					<TabsContent value="profile" className="space-y-6">
						<Card className="glass border-0 shadow-enyard">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>Personal Information</CardTitle>
										<CardDescription>Your account details and personal information</CardDescription>
									</div>
									<Dialog open={isProfileEditOpen} onOpenChange={setIsProfileEditOpen}>
										<DialogTrigger asChild>
											<Button variant="outline" size="sm">
												<Edit className="h-4 w-4 mr-2" />
												Edit Profile
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
											<DialogHeader>
												<DialogTitle>Edit Profile</DialogTitle>
												<DialogDescription>
													Update your personal information. All fields are optional.
												</DialogDescription>
											</DialogHeader>
											<div className="space-y-4 mt-4">
												<div>
													<Label htmlFor="address">Address</Label>
													<Textarea
														id="address"
														placeholder="Enter your address"
														value={profileForm.address}
														onChange={(e) =>
															setProfileForm({ ...profileForm, address: e.target.value })
														}
													/>
												</div>
												<div className="grid md:grid-cols-2 gap-4">
													<div>
														<Label htmlFor="college">College/University</Label>
														<Input
															id="college"
															placeholder="Enter your college or university"
															value={profileForm.college}
															onChange={(e) =>
																setProfileForm({ ...profileForm, college: e.target.value })
															}
														/>
													</div>
													<div>
														<Label htmlFor="school">School</Label>
														<Input
															id="school"
															placeholder="Enter your school"
															value={profileForm.school}
															onChange={(e) =>
																setProfileForm({ ...profileForm, school: e.target.value })
															}
														/>
													</div>
												</div>
												<div className="grid md:grid-cols-2 gap-4">
													<div>
														<Label htmlFor="date_of_birth">Date of Birth</Label>
														<Input
															id="date_of_birth"
															type="date"
															value={profileForm.date_of_birth}
															onChange={(e) =>
																setProfileForm({ ...profileForm, date_of_birth: e.target.value })
															}
														/>
													</div>
													<div>
														<Label htmlFor="gender">Gender</Label>
														<Select
															value={profileForm.gender}
															onValueChange={(value) =>
																setProfileForm({ ...profileForm, gender: value })
															}>
															<SelectTrigger>
																<SelectValue placeholder="Select gender" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="male">Male</SelectItem>
																<SelectItem value="female">Female</SelectItem>
																<SelectItem value="other">Other</SelectItem>
																<SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
															</SelectContent>
														</Select>
													</div>
												</div>
												<div className="space-y-4">
													<Label>Social Media & Links</Label>
													<div className="grid md:grid-cols-2 gap-4">
														<div>
															<Label htmlFor="linkedin_url">LinkedIn URL</Label>
															<Input
																id="linkedin_url"
																type="url"
																placeholder="https://linkedin.com/in/yourprofile"
																value={profileForm.linkedin_url}
																onChange={(e) =>
																	setProfileForm({ ...profileForm, linkedin_url: e.target.value })
																}
															/>
														</div>
														<div>
															<Label htmlFor="twitter_url">Twitter URL</Label>
															<Input
																id="twitter_url"
																type="url"
																placeholder="https://twitter.com/yourprofile"
																value={profileForm.twitter_url}
																onChange={(e) =>
																	setProfileForm({ ...profileForm, twitter_url: e.target.value })
																}
															/>
														</div>
														<div>
															<Label htmlFor="github_url">GitHub URL</Label>
															<Input
																id="github_url"
																type="url"
																placeholder="https://github.com/yourprofile"
																value={profileForm.github_url}
																onChange={(e) =>
																	setProfileForm({ ...profileForm, github_url: e.target.value })
																}
															/>
														</div>
														<div>
															<Label htmlFor="facebook_url">Facebook URL</Label>
															<Input
																id="facebook_url"
																type="url"
																placeholder="https://facebook.com/yourprofile"
																value={profileForm.facebook_url}
																onChange={(e) =>
																	setProfileForm({ ...profileForm, facebook_url: e.target.value })
																}
															/>
														</div>
														<div>
															<Label htmlFor="instagram_url">Instagram URL</Label>
															<Input
																id="instagram_url"
																type="url"
																placeholder="https://instagram.com/yourprofile"
																value={profileForm.instagram_url}
																onChange={(e) =>
																	setProfileForm({ ...profileForm, instagram_url: e.target.value })
																}
															/>
														</div>
														<div>
															<Label htmlFor="website_url">Website URL</Label>
															<Input
																id="website_url"
																type="url"
																placeholder="https://yourwebsite.com"
																value={profileForm.website_url}
																onChange={(e) =>
																	setProfileForm({ ...profileForm, website_url: e.target.value })
																}
															/>
														</div>
													</div>
												</div>
												<div className="flex justify-end space-x-2 pt-4">
													<Button
														variant="outline"
														onClick={() => setIsProfileEditOpen(false)}
														disabled={isSavingProfile}>
														Cancel
													</Button>
													<Button onClick={handleSaveProfile} disabled={isSavingProfile}>
														{isSavingProfile ? (
															<>
																<Loader2 className="h-4 w-4 mr-2 animate-spin" />
																Saving...
															</>
														) : (
															"Save Changes"
														)}
													</Button>
												</div>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<Label className="text-muted-foreground">Email</Label>
										<p className="font-medium">{profile?.email || user?.email || "N/A"}</p>
									</div>
									<div>
										<Label className="text-muted-foreground">Phone</Label>
										<p className="font-medium">{profile?.phone || user?.phone || "Not provided"}</p>
									</div>
									{profile?.address && (
										<div className="md:col-span-2">
											<Label className="text-muted-foreground flex items-center gap-2">
												<MapPin className="h-4 w-4" />
												Address
											</Label>
											<p className="font-medium">{profile.address}</p>
										</div>
									)}
									{profile?.college && (
										<div>
											<Label className="text-muted-foreground flex items-center gap-2">
												<GraduationCap className="h-4 w-4" />
												College/University
											</Label>
											<p className="font-medium">{profile.college}</p>
										</div>
									)}
									{profile?.school && (
										<div>
											<Label className="text-muted-foreground flex items-center gap-2">
												<School className="h-4 w-4" />
												School
											</Label>
											<p className="font-medium">{profile.school}</p>
										</div>
									)}
									{profile?.date_of_birth && (
										<div>
											<Label className="text-muted-foreground flex items-center gap-2">
												<Cake className="h-4 w-4" />
												Date of Birth
											</Label>
											<p className="font-medium">
												{format(new Date(profile.date_of_birth), "MMMM dd, yyyy")}
											</p>
										</div>
									)}
									{profile?.gender && (
										<div>
											<Label className="text-muted-foreground flex items-center gap-2">
												<VenusMars className="h-4 w-4" />
												Gender
											</Label>
											<p className="font-medium capitalize">{profile.gender}</p>
										</div>
									)}
								</div>
								{(profile?.linkedin_url ||
									profile?.twitter_url ||
									profile?.github_url ||
									profile?.facebook_url ||
									profile?.instagram_url ||
									profile?.website_url) && (
									<div>
										<Label className="text-muted-foreground mb-4 block">Social Media & Links</Label>
										<div className="flex flex-wrap gap-4">
											{profile.linkedin_url && (
												<a
													href={profile.linkedin_url}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-2 text-primary hover:underline">
													<Linkedin className="h-5 w-5" />
													LinkedIn
													<ExternalLink className="h-3 w-3" />
												</a>
											)}
											{profile.twitter_url && (
												<a
													href={profile.twitter_url}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-2 text-primary hover:underline">
													<Twitter className="h-5 w-5" />
													Twitter
													<ExternalLink className="h-3 w-3" />
												</a>
											)}
											{profile.github_url && (
												<a
													href={profile.github_url}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-2 text-primary hover:underline">
													<Github className="h-5 w-5" />
													GitHub
													<ExternalLink className="h-3 w-3" />
												</a>
											)}
											{profile.facebook_url && (
												<a
													href={profile.facebook_url}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-2 text-primary hover:underline">
													<Facebook className="h-5 w-5" />
													Facebook
													<ExternalLink className="h-3 w-3" />
												</a>
											)}
											{profile.instagram_url && (
												<a
													href={profile.instagram_url}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-2 text-primary hover:underline">
													<Instagram className="h-5 w-5" />
													Instagram
													<ExternalLink className="h-3 w-3" />
												</a>
											)}
											{profile.website_url && (
												<a
													href={profile.website_url}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-2 text-primary hover:underline">
													<Globe className="h-5 w-5" />
													Website
													<ExternalLink className="h-3 w-3" />
												</a>
											)}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Subscription Tab */}
					<TabsContent value="subscription" className="space-y-6">
						<Card className="glass border-0 shadow-enyard">
							<CardHeader>
								<CardTitle>Active Subscription</CardTitle>
								<CardDescription>Your current subscription plan and billing information</CardDescription>
							</CardHeader>
							<CardContent>
								{activeSubscription ? (
									<div className="space-y-4">
										<div className="flex justify-between items-center">
											<span className="text-muted-foreground">Plan</span>
											<Badge variant="default" className="text-lg px-3 py-1">
												{activeSubscription.plan_name}
											</Badge>
										</div>
										{activeSubscription.amount && (
											<div className="flex justify-between items-center">
												<span className="text-muted-foreground">Amount</span>
												<span className="font-semibold">
													${activeSubscription.amount}
													{activeSubscription.billing_cycle && `/${activeSubscription.billing_cycle}`}
												</span>
											</div>
										)}
										{activeSubscription.start_date && (
											<div className="flex justify-between items-center">
												<span className="text-muted-foreground">Start Date</span>
												<span>
													{format(new Date(activeSubscription.start_date), "MMMM dd, yyyy")}
												</span>
											</div>
										)}
										{activeSubscription.end_date && (
											<div className="flex justify-between items-center">
												<span className="text-muted-foreground">End Date</span>
												<span>
													{format(new Date(activeSubscription.end_date), "MMMM dd, yyyy")}
												</span>
											</div>
										)}
										<div className="flex justify-between items-center">
											<span className="text-muted-foreground">Status</span>
											<Badge variant="default">Active</Badge>
										</div>
									</div>
								) : (
									<div className="text-center py-8">
										<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
										<p className="text-lg font-semibold mb-2">No Active Subscription</p>
										<p className="text-muted-foreground mb-4">
											You don't have an active subscription at the moment.
										</p>
										<Button>View Plans</Button>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Invoices Tab */}
					<TabsContent value="invoices" className="space-y-6">
						<Card className="glass border-0 shadow-enyard">
							<CardHeader>
								<CardTitle>Invoices</CardTitle>
								<CardDescription>Your billing history and invoices</CardDescription>
							</CardHeader>
							<CardContent>
								{invoices.length > 0 ? (
									<div className="space-y-4">
										{invoices.map((invoice) => (
											<div
												key={invoice.id}
												className="flex justify-between items-center py-4 border-b last:border-b-0">
												<div>
													<p className="font-medium">{invoice.invoice_number}</p>
													<p className="text-sm text-muted-foreground">
														{format(new Date(invoice.created_at), "MMMM dd, yyyy")}
													</p>
													{invoice.due_date && (
														<p className="text-xs text-muted-foreground">
															Due: {format(new Date(invoice.due_date), "MMMM dd, yyyy")}
														</p>
													)}
												</div>
												<div className="text-right">
													<p className="font-medium">${invoice.amount.toFixed(2)}</p>
													<Badge
														variant={
															invoice.status === "paid"
																? "default"
																: invoice.status === "pending"
																	? "secondary"
																	: "destructive"
														}
														className="text-xs">
														{invoice.status}
													</Badge>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-8">
										<FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
										<p className="text-lg font-semibold mb-2">No Invoices Available</p>
										<p className="text-muted-foreground">
											You don't have any invoices yet. Invoices will appear here once you have
											active subscriptions.
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Apps Tab */}
					<TabsContent value="apps" className="space-y-6">
						<Card className="glass border-0 shadow-enyard">
							<CardHeader>
								<CardTitle>My Apps</CardTitle>
								<CardDescription>Apps activated in your ENYARD account</CardDescription>
							</CardHeader>
							<CardContent>
								{activeApps.length > 0 ? (
									<div className="grid md:grid-cols-2 gap-6">
										{activeApps.map((app) => {
											const appInfo = availableApps.find((a) => a.slug === app.app_slug);
											const IconComponent = appInfo?.icon || Package;
											return (
												<Card key={app.id} className="border">
													<CardHeader>
														<div className="flex items-center justify-between">
															<div className="flex items-center space-x-3">
																<div className="p-2 bg-primary/10 rounded-lg">
																	<IconComponent className="h-6 w-6 text-primary" />
																</div>
																<div>
																	<CardTitle>{app.app_name}</CardTitle>
																	<CardDescription>
																		{appInfo?.description || "ENYARD Application"}
																	</CardDescription>
																</div>
															</div>
															<Badge variant="default">Active</Badge>
														</div>
													</CardHeader>
													<CardContent>
														<div className="space-y-2">
															<div className="flex justify-between text-sm text-muted-foreground">
																<span>Activated:</span>
																<span>
																	{format(new Date(app.activated_at), "MMMM dd, yyyy")}
																</span>
															</div>
															{app.last_accessed && (
																<div className="flex justify-between text-sm text-muted-foreground">
																	<span>Last accessed:</span>
																	<span>
																		{format(new Date(app.last_accessed), "MMMM dd, yyyy")}
																	</span>
																</div>
															)}
															<Button className="w-full mt-4" size="sm">
																Launch App
															</Button>
														</div>
													</CardContent>
												</Card>
											);
										})}
									</div>
								) : (
									<div className="text-center py-8">
										<Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
										<p className="text-lg font-semibold mb-2">No Apps Activated</p>
										<p className="text-muted-foreground mb-4">
											You haven't activated any apps yet. Browse our available apps and activate
											them to get started.
										</p>
										<Button>Activate Now</Button>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Promotions Tab */}
					<TabsContent value="promotions" className="space-y-6">
						<div className="grid md:grid-cols-2 gap-6">
							<Card className="glass border-0 shadow-enyard bg-gradient-to-br from-primary/10 to-primary/5">
								<CardHeader>
									<div className="flex items-center gap-2">
										<Sparkles className="h-5 w-5 text-primary" />
										<CardTitle>Special Offer</CardTitle>
									</div>
									<CardDescription>Limited time promotion</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-lg font-semibold mb-2">Get 20% Off Annual Plans</p>
									<p className="text-sm text-muted-foreground mb-4">
										Upgrade to an annual subscription and save 20% on your first year. Offer valid
										until the end of this month.
									</p>
									<Button>Claim Offer</Button>
								</CardContent>
							</Card>

							<Card className="glass border-0 shadow-enyard bg-gradient-to-br from-green-500/10 to-green-500/5">
								<CardHeader>
									<div className="flex items-center gap-2">
										<Gift className="h-5 w-5 text-green-600" />
										<CardTitle>Referral Bonus</CardTitle>
									</div>
									<CardDescription>Invite friends and earn rewards</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-lg font-semibold mb-2">Refer & Earn</p>
									<p className="text-sm text-muted-foreground mb-4">
										Refer a friend and both of you get $50 in credits. Share your referral link
										today!
									</p>
									<Button variant="outline">Get Referral Link</Button>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default ClientDashboard;
