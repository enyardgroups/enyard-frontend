import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	LayoutDashboard,
	Users,
	Settings,
	LogOut,
	Menu,
	X,
	Search,
	MoreVertical,
	Eye,
	Ban,
	CheckCircle2,
	XCircle,
	Calendar,
	Mail,
	Phone,
	Shield,
	Activity,
	CreditCard,
	FileText,
	Smartphone,
	Clock,
	MapPin,
	Globe,
	Rocket,
	ChevronDown,
	ChevronRight,
	CheckSquare,
	Square,
	Send,
	Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import useApiRequest from "@/hooks/useApiRequest";
import { format } from "date-fns";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	LineChart,
	Line,
	AreaChart,
	Area,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Legend,
} from "recharts";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface User {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	email_verified: boolean;
	phone_verified: boolean;
	is_blocked: boolean;
	blocked_at: string | null;
	blocked_reason: string | null;
	created_at: string;
	last_login_at: string | null;
	last_login_ip: string | null;
	registration_ip?: string | null;
	registration_location?: any;
}

interface UserDetails {
	user: User;
	devices: any[];
	subscriptions: any[];
	invoices: any[];
	apps: any[];
	activityLogs: any[];
}

const AdminDashboard = () => {
	const { toast } = useToast();
	const navigate = useNavigate();
	const { logout } = useAuthStore();
	const { get, post, patch } = useApiRequest();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
	const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
	const [blockDialogOpen, setBlockDialogOpen] = useState(false);
	const [userToBlock, setUserToBlock] = useState<User | null>(null);
	const [blockReason, setBlockReason] = useState("");
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 50,
		total: 0,
		totalPages: 0,
	});
	const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "penquinx-waiting-list" | "send-email" | "send-sms">("dashboard");
	const [stats, setStats] = useState<any>(null);
	const [statsLoading, setStatsLoading] = useState(true);
	const [waitingList, setWaitingList] = useState<any[]>([]);
	const [waitingListLoading, setWaitingListLoading] = useState(false);
	const [penquinxMenuOpen, setPenquinxMenuOpen] = useState(false);
	
	// Analytics state
	const [timePeriod, setTimePeriod] = useState<"7d" | "15d" | "1m" | "3m" | "6m" | "1y" | "lifetime">("1m");
	const [waitingListAnalytics, setWaitingListAnalytics] = useState<any>(null);
	const [advancedAnalytics, setAdvancedAnalytics] = useState<any>(null);
	const [analyticsLoading, setAnalyticsLoading] = useState(false);
	
	// Send Email state
	const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
	const [emailSubject, setEmailSubject] = useState("");
	const [emailContent, setEmailContent] = useState("");
	const [emailType, setEmailType] = useState<"raw" | "html">("raw");
	const [isSendingEmail, setIsSendingEmail] = useState(false);
	const [emailStatus, setEmailStatus] = useState<{ success: boolean; message: string; sent?: number; failed?: number } | null>(null);
	
	// Send SMS state
	const [selectedSMSUserIds, setSelectedSMSUserIds] = useState<number[]>([]);
	const [smsMessage, setSmsMessage] = useState("");
	const [isSendingSMS, setIsSendingSMS] = useState(false);
	const [smsStatus, setSmsStatus] = useState<{ success: boolean; message: string; sent?: number; failed?: number } | null>(null);

	const fetchWaitingList = async () => {
		setWaitingListLoading(true);
		try {
			const response = await get("/penquinx/waiting-list", {
				params: {
					page: 1,
					limit: 100,
				},
			});
			if (response && response.data) {
				setWaitingList(Array.isArray(response.data) ? response.data : []);
			} else {
				setWaitingList([]);
			}
		} catch (error: any) {
			console.error("Failed to fetch waiting list:", error);
			toast({
				title: "Error",
				description: error.message || "Failed to load waiting list",
				variant: "destructive",
			});
			setWaitingList([]);
		} finally {
			setWaitingListLoading(false);
		}
	};

	useEffect(() => {
		if (activeTab === "dashboard") {
			fetchStats(timePeriod);
			fetchWaitingListAnalytics(timePeriod);
			fetchAdvancedAnalytics();
		} else if (activeTab === "users") {
			fetchUsers();
		} else if (activeTab === "penquinx-waiting-list") {
			fetchWaitingList();
		} else if (activeTab === "send-email" || activeTab === "send-sms") {
			fetchUsers(); // Fetch users for email/SMS selection
		}
	}, [activeTab, timePeriod]);

	useEffect(() => {
		if (activeTab === "users") {
			fetchUsers();
		}
	}, [pagination.page, searchTerm]);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const response = await get("/admin/users", {
				params: {
					page: pagination.page,
					limit: pagination.limit,
					search: searchTerm,
				},
			});
			// Response structure: {success: true, data: [...], pagination: {...}}
			// The hook now returns the full result object
			if (response && response.data) {
				setUsers(Array.isArray(response.data) ? response.data : []);
				if (response.pagination) {
					setPagination((prev) => ({
						...prev,
						...response.pagination,
					}));
				}
			} else if (Array.isArray(response)) {
				// Fallback: if response is directly an array
				setUsers(response);
			} else {
				setUsers([]);
			}
		} catch (error: any) {
			console.error("Failed to fetch users:", error);
			toast({
				title: "Error",
				description: error.message || "Failed to load users",
				variant: "destructive",
			});
			setUsers([]);
		} finally {
			setLoading(false);
		}
	};

	const handleViewDetails = async (userId: number) => {
		try {
			const response = await get(`/admin/users/${userId}`);
			// Response structure: {success: true, data: {...}}
			const userDetails = response && response.data ? response.data : response;
			setSelectedUser(userDetails);
			setDetailsDialogOpen(true);
		} catch (error: any) {
			console.error("Failed to fetch user details:", error);
			toast({
				title: "Error",
				description: error.message || "Failed to load user details",
				variant: "destructive",
			});
		}
	};

	const handleBlockClick = (user: User) => {
		setUserToBlock(user);
		setBlockDialogOpen(true);
	};

	const handleBlockUser = async () => {
		if (!userToBlock) return;

		try {
			// Use PATCH method and send isBlocked boolean
			await patch(`/admin/users/${userToBlock.id}/block`, {
				isBlocked: !userToBlock.is_blocked,
				reason: blockReason,
			});
			toast({
				title: userToBlock.is_blocked ? "User Unblocked" : "User Blocked",
				description: `User has been ${userToBlock.is_blocked ? "unblocked" : "blocked"} successfully`,
			});
			setBlockDialogOpen(false);
			setUserToBlock(null);
			setBlockReason("");
			fetchUsers();
		} catch (error: any) {
			console.error("Failed to block user:", error);
			toast({
				title: "Error",
				description: error.message || "Failed to update user status",
				variant: "destructive",
			});
		}
	};

	const handleLogout = () => {
		logout();
		navigate("/auth/login");
	};

	const fetchStats = async (period: string = timePeriod) => {
		setStatsLoading(true);
		try {
			const response = await get("/admin/stats", {
				params: { period },
			});
			// Response structure: {success: true, data: {...}}
			const statsData = response && response.data ? response.data : response;
			setStats(statsData);
		} catch (error: any) {
			console.error("Failed to fetch stats:", error);
			toast({
				title: "Error",
				description: error.message || "Failed to load statistics",
				variant: "destructive",
			});
		} finally {
			setStatsLoading(false);
		}
	};

	const fetchWaitingListAnalytics = async (period: string = timePeriod) => {
		setAnalyticsLoading(true);
		try {
			const response = await get("/admin/analytics/waiting-list", {
				params: { period },
			});
			if (response && response.data) {
				setWaitingListAnalytics(response.data);
			}
		} catch (error: any) {
			console.error("Failed to fetch waiting list analytics:", error);
		} finally {
			setAnalyticsLoading(false);
		}
	};

	const fetchAdvancedAnalytics = async () => {
		try {
			const response = await get("/admin/analytics/advanced");
			if (response && response.data) {
				setAdvancedAnalytics(response.data);
			}
		} catch (error: any) {
			console.error("Failed to fetch advanced analytics:", error);
		}
	};

	const sidebarItems: Array<{
		icon: any;
		label: string;
		id: string;
		submenu?: Array<{ label: string; id: string }>;
	}> = [
		{ icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
		{ icon: Users, label: "Users", id: "users" },
		{ 
			icon: Rocket, 
			label: "PenquinX", 
			id: "penquinx",
			submenu: [
				{ label: "Waiting List", id: "penquinx-waiting-list" }
			]
		},
		{ icon: Mail, label: "Send Email", id: "send-email" },
		{ icon: Phone, label: "Send SMS", id: "send-sms" },
		{ icon: Settings, label: "Settings", id: "settings" },
	];

	return (
		<div className="min-h-screen bg-gray-50 flex">
			{/* Sidebar */}
			<aside
				className={`${
					sidebarOpen ? "w-64" : "w-20"
				} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
				<div className="p-4 flex items-center justify-between border-b border-gray-200">
					{sidebarOpen && (
						<h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
					)}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setSidebarOpen(!sidebarOpen)}>
						{sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</Button>
				</div>

				<nav className="flex-1 p-4 space-y-2">
					{sidebarItems.map((item) => {
						const Icon = item.icon;
						const isActive = activeTab === item.id || (item.submenu && item.submenu.some(sub => activeTab === sub.id));
						const hasSubmenu = item.submenu && item.submenu.length > 0;
						const isSubmenuOpen = penquinxMenuOpen && item.id === "penquinx";
						
						return (
							<div key={item.id}>
								<button
									onClick={() => {
										if (hasSubmenu) {
											setPenquinxMenuOpen(!isSubmenuOpen);
										} else if (item.id !== "settings") {
											setActiveTab(item.id as "dashboard" | "users" | "penquinx-waiting-list");
										}
									}}
									className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
										isActive
											? "bg-primary text-primary-foreground"
											: "text-gray-700 hover:bg-gray-100"
									}`}>
									<div className="flex items-center gap-3">
										<Icon className="h-5 w-5" />
										{sidebarOpen && <span className="font-medium">{item.label}</span>}
									</div>
									{hasSubmenu && sidebarOpen && (
										isSubmenuOpen ? (
											<ChevronDown className="h-4 w-4" />
										) : (
											<ChevronRight className="h-4 w-4" />
										)
									)}
								</button>
								{hasSubmenu && isSubmenuOpen && sidebarOpen && (
									<div className="ml-8 mt-1 space-y-1">
										{item.submenu?.map((subItem) => {
											const isSubActive = activeTab === subItem.id;
											return (
												<button
													key={subItem.id}
													onClick={() => setActiveTab(subItem.id as "penquinx-waiting-list")}
													className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
														isSubActive
															? "bg-primary/20 text-primary font-medium"
															: "text-gray-600 hover:bg-gray-50"
													}`}>
													<span>{subItem.label}</span>
												</button>
											);
										})}
									</div>
								)}
							</div>
						);
					})}
				</nav>

				<div className="p-4 border-t border-gray-200">
					<Button
						variant="ghost"
						className="w-full justify-start"
						onClick={handleLogout}>
						<LogOut className="h-5 w-5 mr-3" />
						{sidebarOpen && <span>Logout</span>}
					</Button>
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 overflow-auto">
				<div className="p-6">
					{activeTab === "dashboard" && (
						<>
							<div className="mb-6 flex items-center justify-between">
								<div>
									<h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
									<p className="text-gray-600">
										Overview of your application statistics and analytics
									</p>
								</div>
								<Select
									value={timePeriod}
									onValueChange={(value: any) => {
										setTimePeriod(value);
										fetchStats(value);
										fetchWaitingListAnalytics(value);
									}}>
									<SelectTrigger className="w-[180px]">
										<SelectValue placeholder="Select period" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="7d">Last 7 Days</SelectItem>
										<SelectItem value="15d">Last 15 Days</SelectItem>
										<SelectItem value="1m">Last 1 Month</SelectItem>
										<SelectItem value="3m">Last 3 Months</SelectItem>
										<SelectItem value="6m">Last 6 Months</SelectItem>
										<SelectItem value="1y">Last 1 Year</SelectItem>
										<SelectItem value="lifetime">Lifetime</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{statsLoading ? (
								<div className="text-center py-12">Loading analytics...</div>
							) : stats ? (
								<div className="space-y-6">
									{/* Stats Cards */}
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
										<Card>
											<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
												<CardTitle className="text-sm font-medium">Total Users</CardTitle>
												<Users className="h-4 w-4 text-muted-foreground" />
											</CardHeader>
											<CardContent>
												<div className="text-2xl font-bold">{stats.totalUsers}</div>
												<p className="text-xs text-muted-foreground">
													All registered users
												</p>
											</CardContent>
										</Card>

										<Card>
											<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
												<CardTitle className="text-sm font-medium">Active Users</CardTitle>
												<CheckCircle2 className="h-4 w-4 text-green-600" />
											</CardHeader>
											<CardContent>
												<div className="text-2xl font-bold">{stats.activeUsers}</div>
												<p className="text-xs text-muted-foreground">
													{stats.blockedUsers} blocked
												</p>
											</CardContent>
										</Card>

										<Card>
											<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
												<CardTitle className="text-sm font-medium">New This Month</CardTitle>
												<Activity className="h-4 w-4 text-blue-600" />
											</CardHeader>
											<CardContent>
												<div className="text-2xl font-bold">{stats.newUsersThisMonth}</div>
												<p className="text-xs text-muted-foreground">
													{stats.newUsersThisWeek} this week, {stats.newUsersToday} today
												</p>
											</CardContent>
										</Card>

										<Card>
											<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
												<CardTitle className="text-sm font-medium">Verified Users</CardTitle>
												<Shield className="h-4 w-4 text-purple-600" />
											</CardHeader>
											<CardContent>
												<div className="text-2xl font-bold">{stats.verifiedUsers}</div>
												<p className="text-xs text-muted-foreground">
													{stats.recentLogins} logged in this week
												</p>
											</CardContent>
										</Card>
									</div>

									{/* User Registration Charts */}
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
										{/* Line Chart - User Registration */}
										<Card>
											<CardHeader>
												<CardTitle>Daily User Registration</CardTitle>
											</CardHeader>
											<CardContent>
												{stats?.growthData && stats.growthData.length > 0 ? (
													<ChartContainer
														config={{
															users: {
																label: "Users",
																color: "hsl(var(--chart-1))",
															},
														}}
														className="h-[300px]">
														<LineChart data={stats.growthData.map((item: any) => ({
															date: format(new Date(item.date), timePeriod === '1y' || timePeriod === 'lifetime' ? 'MMM yyyy' : timePeriod === '3m' || timePeriod === '6m' ? 'MMM dd' : 'MMM dd'),
															users: parseInt(item.count),
														}))}>
															<CartesianGrid strokeDasharray="3 3" />
															<XAxis dataKey="date" />
															<YAxis />
															<ChartTooltip content={<ChartTooltipContent />} />
															<Line
																type="monotone"
																dataKey="users"
																stroke="var(--color-users)"
																strokeWidth={2}
																dot={{ r: 4 }}
																activeDot={{ r: 6 }}
															/>
														</LineChart>
													</ChartContainer>
												) : (
													<div className="h-[300px] flex items-center justify-center text-muted-foreground">
														No data available
													</div>
												)}
											</CardContent>
										</Card>

										{/* Area Chart - User Registration */}
										<Card>
											<CardHeader>
												<CardTitle>User Registration Trend</CardTitle>
											</CardHeader>
											<CardContent>
												{stats?.growthData && stats.growthData.length > 0 ? (
													<ChartContainer
														config={{
															users: {
																label: "Users",
																color: "hsl(var(--chart-2))",
															},
														}}
														className="h-[300px]">
														<AreaChart data={stats.growthData.map((item: any) => ({
															date: format(new Date(item.date), timePeriod === '1y' || timePeriod === 'lifetime' ? 'MMM yyyy' : timePeriod === '3m' || timePeriod === '6m' ? 'MMM dd' : 'MMM dd'),
															users: parseInt(item.count),
														}))}>
															<CartesianGrid strokeDasharray="3 3" />
															<XAxis dataKey="date" />
															<YAxis />
															<ChartTooltip content={<ChartTooltipContent />} />
															<Area
																type="monotone"
																dataKey="users"
																stroke="var(--color-users)"
																fill="var(--color-users)"
																fillOpacity={0.6}
															/>
														</AreaChart>
													</ChartContainer>
												) : (
													<div className="h-[300px] flex items-center justify-center text-muted-foreground">
														No data available
													</div>
												)}
											</CardContent>
										</Card>
									</div>

									{/* Waiting List Analytics */}
									<Card>
										<CardHeader>
											<CardTitle>PenquinX Waiting List Requests</CardTitle>
										</CardHeader>
										<CardContent>
											{waitingListAnalytics?.waitingListData && waitingListAnalytics.waitingListData.length > 0 ? (
												<ChartContainer
													config={{
														requests: {
															label: "Requests",
															color: "hsl(var(--chart-3))",
														},
													}}
													className="h-[300px]">
													<BarChart data={waitingListAnalytics.waitingListData.map((item: any) => ({
														date: format(new Date(item.date), timePeriod === '1y' || timePeriod === 'lifetime' ? 'MMM yyyy' : timePeriod === '3m' || timePeriod === '6m' ? 'MMM dd' : 'MMM dd'),
														requests: parseInt(item.count),
													}))}>
														<CartesianGrid strokeDasharray="3 3" />
														<XAxis dataKey="date" />
														<YAxis />
														<ChartTooltip content={<ChartTooltipContent />} />
														<Bar dataKey="requests" fill="var(--color-requests)" radius={[4, 4, 0, 0]} />
													</BarChart>
												</ChartContainer>
											) : (
												<div className="h-[300px] flex items-center justify-center text-muted-foreground">
													No waiting list data available
												</div>
											)}
										</CardContent>
									</Card>

									{/* Advanced Analytics */}
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
										{/* Pie Chart - User Status */}
										<Card>
											<CardHeader>
												<CardTitle>User Status Distribution</CardTitle>
											</CardHeader>
											<CardContent>
												{advancedAnalytics?.userStatus && advancedAnalytics.userStatus.length > 0 ? (
													<ChartContainer
														config={{
															active: { label: "Active", color: "hsl(142, 76%, 36%)" },
															blocked: { label: "Blocked", color: "hsl(0, 84%, 60%)" },
														}}
														className="h-[300px]">
														<PieChart>
															<Pie
																data={advancedAnalytics.userStatus.map((item: any) => ({
																	name: item.status,
																	value: parseInt(item.count),
																}))}
																cx="50%"
																cy="50%"
																labelLine={false}
																label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
																outerRadius={80}
																fill="#8884d8"
																dataKey="value">
																{advancedAnalytics.userStatus.map((item: any, index: number) => (
																	<Cell key={`cell-${index}`} fill={item.status === 'Active' ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'} />
																))}
															</Pie>
															<ChartTooltip content={<ChartTooltipContent />} />
														</PieChart>
													</ChartContainer>
												) : (
													<div className="h-[300px] flex items-center justify-center text-muted-foreground">
														No data available
													</div>
												)}
											</CardContent>
										</Card>

										{/* Pie Chart - Verification Status */}
										<Card>
											<CardHeader>
												<CardTitle>Verification Status Distribution</CardTitle>
											</CardHeader>
											<CardContent>
												{advancedAnalytics?.verificationStatus && advancedAnalytics.verificationStatus.length > 0 ? (
													<ChartContainer
														config={{
															both: { label: "Both Verified", color: "hsl(142, 76%, 36%)" },
															email: { label: "Email Only", color: "hsl(217, 91%, 60%)" },
															phone: { label: "Phone Only", color: "hsl(280, 100%, 70%)" },
															none: { label: "Not Verified", color: "hsl(0, 0%, 50%)" },
														}}
														className="h-[300px]">
														<PieChart>
															<Pie
																data={advancedAnalytics.verificationStatus.map((item: any) => ({
																	name: item.status,
																	value: parseInt(item.count),
																}))}
																cx="50%"
																cy="50%"
																labelLine={false}
																label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
																outerRadius={80}
																fill="#8884d8"
																dataKey="value">
																{advancedAnalytics.verificationStatus.map((item: any, index: number) => {
																	const colors: Record<string, string> = {
																		'Both Verified': 'hsl(142, 76%, 36%)',
																		'Email Only': 'hsl(217, 91%, 60%)',
																		'Phone Only': 'hsl(280, 100%, 70%)',
																		'Not Verified': 'hsl(0, 0%, 50%)',
																	};
																	return (
																		<Cell key={`cell-${index}`} fill={colors[item.status] || '#8884d8'} />
																	);
																})}
															</Pie>
															<ChartTooltip content={<ChartTooltipContent />} />
														</PieChart>
													</ChartContainer>
												) : (
													<div className="h-[300px] flex items-center justify-center text-muted-foreground">
														No data available
													</div>
												)}
											</CardContent>
										</Card>
									</div>

									{/* Waiting List Profession Distribution */}
									{waitingListAnalytics?.professionData && waitingListAnalytics.professionData.length > 0 && (
										<Card>
											<CardHeader>
												<CardTitle>Waiting List - Profession Distribution</CardTitle>
											</CardHeader>
											<CardContent>
												<ChartContainer
													config={{
														profession: {
															label: "Profession",
															color: "hsl(var(--chart-4))",
														},
													}}
													className="h-[300px]">
													<BarChart
														data={waitingListAnalytics.professionData.map((item: any) => ({
															profession: item.profession.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
															count: parseInt(item.count),
														}))}
														layout="vertical">
														<CartesianGrid strokeDasharray="3 3" />
														<XAxis type="number" />
														<YAxis dataKey="profession" type="category" width={120} />
														<ChartTooltip content={<ChartTooltipContent />} />
														<Bar dataKey="count" fill="var(--color-profession)" radius={[0, 4, 4, 0]} />
													</BarChart>
												</ChartContainer>
											</CardContent>
										</Card>
									)}

									{/* Login Activity Chart */}
									{advancedAnalytics?.loginActivity && advancedAnalytics.loginActivity.length > 0 && (
										<Card>
											<CardHeader>
												<CardTitle>Login Activity (Last 30 Days)</CardTitle>
											</CardHeader>
											<CardContent>
												<ChartContainer
													config={{
														logins: {
															label: "Logins",
															color: "hsl(var(--chart-5))",
														},
													}}
													className="h-[300px]">
													<AreaChart data={advancedAnalytics.loginActivity.map((item: any) => ({
														date: format(new Date(item.date), 'MMM dd'),
														logins: parseInt(item.count),
													}))}>
														<CartesianGrid strokeDasharray="3 3" />
														<XAxis dataKey="date" />
														<YAxis />
														<ChartTooltip content={<ChartTooltipContent />} />
														<Area
															type="monotone"
															dataKey="logins"
															stroke="var(--color-logins)"
															fill="var(--color-logins)"
															fillOpacity={0.6}
														/>
													</AreaChart>
												</ChartContainer>
											</CardContent>
										</Card>
									)}
								</div>
							) : null}
						</>
					)}

					{activeTab === "penquinx-waiting-list" && (
						<>
							<div className="mb-6">
								<h1 className="text-3xl font-bold text-gray-900 mb-2">PenquinX Waiting List</h1>
								<p className="text-gray-600">
									View all requests to join the PenquinX early access waiting list
								</p>
							</div>

							{/* Waiting List Table */}
							<Card>
								<CardHeader>
									<CardTitle>All Waiting List Entries</CardTitle>
								</CardHeader>
								<CardContent>
									{waitingListLoading ? (
										<div className="text-center py-12">Loading waiting list...</div>
									) : waitingList.length === 0 ? (
										<div className="text-center py-12 text-gray-500">
											No waiting list entries found
										</div>
									) : (
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Name</TableHead>
													<TableHead>Email</TableHead>
													<TableHead>Mobile</TableHead>
													<TableHead>Profession</TableHead>
													<TableHead>Registered Date</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{waitingList.map((entry) => (
													<TableRow key={entry.id}>
														<TableCell className="font-medium">
															{entry.name}
														</TableCell>
														<TableCell>{entry.email}</TableCell>
														<TableCell>{entry.phone || "N/A"}</TableCell>
														<TableCell>
															<Badge variant="outline">
																{entry.profession 
																	? entry.profession.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
																	: "Not specified"}
															</Badge>
														</TableCell>
														<TableCell>
															{format(new Date(entry.created_at), "MMM dd, yyyy")}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									)}
								</CardContent>
							</Card>
						</>
					)}

					{activeTab === "send-email" && (
						<>
							<div className="mb-6">
								<h1 className="text-3xl font-bold text-gray-900 mb-2">Send Email</h1>
								<p className="text-gray-600">
									Send emails to selected users with custom content
								</p>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* User Selection */}
								<Card>
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle>Select Users</CardTitle>
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													if (selectedUserIds.length === users.length) {
														setSelectedUserIds([]);
													} else {
														setSelectedUserIds(users.map(u => u.id));
													}
												}}>
												{selectedUserIds.length === users.length ? (
													<>
														<Square className="h-4 w-4 mr-2" />
														Deselect All
													</>
												) : (
													<>
														<CheckSquare className="h-4 w-4 mr-2" />
														Select All
													</>
												)}
											</Button>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-2 max-h-96 overflow-y-auto">
											{loading ? (
												<div className="text-center py-8 text-gray-500">Loading users...</div>
											) : users.length === 0 ? (
												<div className="text-center py-8 text-gray-500">No users found</div>
											) : (
												users.map((user) => (
													<div
														key={user.id}
														className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
														onClick={() => {
															if (selectedUserIds.includes(user.id)) {
																setSelectedUserIds(selectedUserIds.filter(id => id !== user.id));
															} else {
																setSelectedUserIds([...selectedUserIds, user.id]);
															}
														}}>
														<input
															type="checkbox"
															checked={selectedUserIds.includes(user.id)}
															onChange={() => {}}
															className="h-4 w-4 text-primary focus:ring-primary"
														/>
														<div className="flex-1">
															<p className="font-medium text-sm">{user.name}</p>
															<p className="text-xs text-gray-500">{user.email}</p>
														</div>
													</div>
												))
											)}
										</div>
										{selectedUserIds.length > 0 && (
											<div className="mt-4 pt-4 border-t">
												<p className="text-sm text-gray-600">
													{selectedUserIds.length} user{selectedUserIds.length !== 1 ? 's' : ''} selected
												</p>
											</div>
										)}
									</CardContent>
								</Card>

								{/* Email Composition */}
								<Card>
									<CardHeader>
										<CardTitle>Compose Email</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										{/* Email Status Message */}
										{emailStatus && (
											<div className={`p-4 rounded-lg border ${
												emailStatus.success 
													? "bg-green-50 border-green-200 text-green-800" 
													: "bg-red-50 border-red-200 text-red-800"
											}`}>
												<div className="flex items-start space-x-2">
													{emailStatus.success ? (
														<CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
													) : (
														<XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
													)}
													<div className="flex-1">
														<p className="font-medium">
															{emailStatus.success ? "✅ Email Sent Successfully" : "❌ Email Sending Failed"}
														</p>
														<p className="text-sm mt-1">{emailStatus.message}</p>
														{emailStatus.success && emailStatus.sent !== undefined && (
															<p className="text-xs mt-1 opacity-75">
																Sent: {emailStatus.sent} | Failed: {emailStatus.failed || 0}
															</p>
														)}
													</div>
												</div>
											</div>
										)}
										<div>
											<Label htmlFor="email-subject">Subject</Label>
											<Input
												id="email-subject"
												value={emailSubject}
												onChange={(e) => setEmailSubject(e.target.value)}
												placeholder="Enter email subject"
												className="mt-1"
											/>
										</div>

										<Tabs value={emailType} onValueChange={(v) => setEmailType(v as "raw" | "html")}>
											<TabsList className="grid w-full grid-cols-2">
												<TabsTrigger value="raw">Raw Message</TabsTrigger>
												<TabsTrigger value="html">HTML Code</TabsTrigger>
											</TabsList>

											<TabsContent value="raw" className="space-y-4">
												<div>
													<Label htmlFor="raw-content">Message</Label>
													<textarea
														id="raw-content"
														value={emailContent}
														onChange={(e) => setEmailContent(e.target.value)}
														placeholder="Enter your message here..."
														className="mt-1 w-full min-h-[300px] p-3 border rounded-md resize-y"
													/>
												</div>
											</TabsContent>

											<TabsContent value="html" className="space-y-4">
												<div className="grid grid-cols-2 gap-4">
													<div>
														<Label htmlFor="html-content">HTML Code</Label>
														<textarea
															id="html-content"
															value={emailContent}
															onChange={(e) => setEmailContent(e.target.value)}
															placeholder="Enter HTML code here..."
															className="mt-1 w-full min-h-[300px] p-3 border rounded-md font-mono text-sm resize-y"
														/>
													</div>
													<div>
														<Label>Live Preview</Label>
														<div className="mt-1 w-full min-h-[300px] p-3 border rounded-md bg-white overflow-auto">
															<div dangerouslySetInnerHTML={{ __html: emailContent }} />
														</div>
													</div>
												</div>
											</TabsContent>
										</Tabs>

										<Button
											className="w-full"
											onClick={async () => {
												if (selectedUserIds.length === 0) {
													toast({
														title: "No Users Selected",
														description: "Please select at least one user to send email to",
														variant: "destructive",
													});
													return;
												}
												if (!emailSubject.trim()) {
													toast({
														title: "Subject Required",
														description: "Please enter an email subject",
														variant: "destructive",
													});
													return;
												}
												if (!emailContent.trim()) {
													toast({
														title: "Content Required",
														description: "Please enter email content",
														variant: "destructive",
													});
													return;
												}

												setIsSendingEmail(true);
												setEmailStatus(null); // Clear previous status
												try {
													const response = await post("/admin/send-emails", {
														userIds: selectedUserIds,
														subject: emailSubject,
														content: emailContent,
														isHtml: emailType === "html",
													});
													
													if (response && response.data) {
														// Set success status
														setEmailStatus({
															success: true,
															message: response.data.message || `Emails sent to ${response.data.sent || response.data.usersCount} user(s)`,
															sent: response.data.sent,
															failed: response.data.failed,
														});
														
														// Show toast notification
														toast({
															title: "✅ Emails Sent Successfully",
															description: response.data.message || `Emails sent to ${response.data.sent || response.data.usersCount} user(s)`,
														});
														
														// Reset form after successful send
														setEmailSubject("");
														setEmailContent("");
														setSelectedUserIds([]);
													}
												} catch (error: any) {
													console.error("Failed to send emails:", error);
													const errorMessage = error.response?.data?.message || error.message || "Failed to send emails";
													
													// Set error status
													setEmailStatus({
														success: false,
														message: errorMessage,
													});
													
													// Show toast notification
													toast({
														title: "Error",
														description: errorMessage,
														variant: "destructive",
													});
												} finally {
													setIsSendingEmail(false);
												}
											}}
											disabled={isSendingEmail || selectedUserIds.length === 0}>
											{isSendingEmail ? (
												<>
													<Loader2 className="h-4 w-4 mr-2 animate-spin" />
													Sending...
												</>
											) : (
												<>
													<Send className="h-4 w-4 mr-2" />
													Send Email ({selectedUserIds.length})
												</>
											)}
										</Button>
									</CardContent>
								</Card>
							</div>
						</>
					)}

					{activeTab === "send-sms" && (
						<>
							<div className="mb-6">
								<h1 className="text-3xl font-bold text-gray-900 mb-2">Send SMS</h1>
								<p className="text-gray-600">
									Send SMS messages to selected users with verified phone numbers
								</p>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* User Selection */}
								<Card>
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle>Select Users</CardTitle>
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													// Only select users with verified phone numbers
													const usersWithPhone = users.filter(u => u.phone && u.phone_verified);
													if (selectedSMSUserIds.length === usersWithPhone.length) {
														setSelectedSMSUserIds([]);
													} else {
														setSelectedSMSUserIds(usersWithPhone.map(u => u.id));
													}
												}}>
												{selectedSMSUserIds.length === users.filter(u => u.phone && u.phone_verified).length ? (
													<>
														<Square className="h-4 w-4 mr-2" />
														Deselect All
													</>
												) : (
													<>
														<CheckSquare className="h-4 w-4 mr-2" />
														Select All
													</>
												)}
											</Button>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-2 max-h-96 overflow-y-auto">
											{loading ? (
												<div className="text-center py-8 text-gray-500">Loading users...</div>
											) : users.length === 0 ? (
												<div className="text-center py-8 text-gray-500">No users found</div>
											) : (
												users
													.filter(user => user.phone && user.phone_verified)
													.map((user) => (
														<div
															key={user.id}
															className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
															onClick={() => {
																if (selectedSMSUserIds.includes(user.id)) {
																	setSelectedSMSUserIds(selectedSMSUserIds.filter(id => id !== user.id));
																} else {
																	setSelectedSMSUserIds([...selectedSMSUserIds, user.id]);
																}
															}}>
															<input
																type="checkbox"
																checked={selectedSMSUserIds.includes(user.id)}
																onChange={() => {}}
																className="h-4 w-4 text-primary focus:ring-primary"
															/>
															<div className="flex-1">
																<p className="font-medium text-sm">{user.name}</p>
																<p className="text-xs text-gray-500">{user.phone || "No phone"}</p>
															</div>
														</div>
													))
											)}
										</div>
										{selectedSMSUserIds.length > 0 && (
											<div className="mt-4 pt-4 border-t">
												<p className="text-sm text-gray-600">
													{selectedSMSUserIds.length} user{selectedSMSUserIds.length !== 1 ? 's' : ''} selected
												</p>
											</div>
										)}
										{users.filter(u => !u.phone || !u.phone_verified).length > 0 && (
											<div className="mt-2 pt-2 border-t">
												<p className="text-xs text-gray-400">
													{users.filter(u => !u.phone || !u.phone_verified).length} user{users.filter(u => !u.phone || !u.phone_verified).length !== 1 ? 's' : ''} without verified phone numbers (hidden)
												</p>
											</div>
										)}
									</CardContent>
								</Card>

								{/* SMS Composition */}
								<Card>
									<CardHeader>
										<CardTitle>Compose SMS</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										{/* SMS Status Message */}
										{smsStatus && (
											<div className={`p-4 rounded-lg border ${
												smsStatus.success 
													? "bg-green-50 border-green-200 text-green-800" 
													: "bg-red-50 border-red-200 text-red-800"
											}`}>
												<div className="flex items-start space-x-2">
													{smsStatus.success ? (
														<CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
													) : (
														<XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
													)}
													<div className="flex-1">
														<p className="font-medium">
															{smsStatus.success ? "✅ SMS Sent Successfully" : "❌ SMS Sending Failed"}
														</p>
														<p className="text-sm mt-1">{smsStatus.message}</p>
														{smsStatus.success && smsStatus.sent !== undefined && (
															<p className="text-xs mt-1 opacity-75">
																Sent: {smsStatus.sent} | Failed: {smsStatus.failed || 0}
															</p>
														)}
													</div>
												</div>
											</div>
										)}
										<div>
											<Label htmlFor="sms-message">Message</Label>
											<textarea
												id="sms-message"
												value={smsMessage}
												onChange={(e) => setSmsMessage(e.target.value)}
												placeholder="Enter your SMS message here..."
												className="mt-1 w-full min-h-[300px] p-3 border rounded-md resize-y"
												maxLength={1600}
											/>
											<p className="text-xs text-gray-500 mt-1">
												{smsMessage.length} / 1600 characters
											</p>
										</div>

										<Button
											className="w-full"
											onClick={async () => {
												if (selectedSMSUserIds.length === 0) {
													toast({
														title: "No Users Selected",
														description: "Please select at least one user to send SMS to",
														variant: "destructive",
													});
													return;
												}
												if (!smsMessage.trim()) {
													toast({
														title: "Message Required",
														description: "Please enter an SMS message",
														variant: "destructive",
													});
													return;
												}

												setIsSendingSMS(true);
												setSmsStatus(null); // Clear previous status
												try {
													const response = await post("/admin/send-sms", {
														userIds: selectedSMSUserIds,
														message: smsMessage.trim(),
													});
													
													if (response && response.data) {
														// Set success status
														setSmsStatus({
															success: true,
															message: response.data.message || `SMS sent to ${response.data.sent || response.data.usersCount} user(s)`,
															sent: response.data.sent,
															failed: response.data.failed,
														});
														
														// Show toast notification
														toast({
															title: "✅ SMS Sent Successfully",
															description: response.data.message || `SMS sent to ${response.data.sent || response.data.usersCount} user(s)`,
														});
														
														// Reset form after successful send
														setSmsMessage("");
														setSelectedSMSUserIds([]);
													}
												} catch (error: any) {
													console.error("Failed to send SMS:", error);
													const errorMessage = error.response?.data?.message || error.message || "Failed to send SMS";
													
													// Set error status
													setSmsStatus({
														success: false,
														message: errorMessage,
													});
													
													// Show toast notification
													toast({
														title: "Error",
														description: errorMessage,
														variant: "destructive",
													});
												} finally {
													setIsSendingSMS(false);
												}
											}}
											disabled={isSendingSMS || selectedSMSUserIds.length === 0}>
											{isSendingSMS ? (
												<>
													<Loader2 className="h-4 w-4 mr-2 animate-spin" />
													Sending...
												</>
											) : (
												<>
													<Phone className="h-4 w-4 mr-2" />
													Send SMS ({selectedSMSUserIds.length})
												</>
											)}
										</Button>
									</CardContent>
								</Card>
							</div>
						</>
					)}

					{activeTab === "users" && (
						<>
							<div className="mb-6">
								<h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
								<p className="text-gray-600">
									Manage users, view details, and control access
								</p>
							</div>

					{/* Search */}
					<div className="mb-6">
						<div className="relative max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search users by name, email, or phone..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>

					{/* Users Table */}
					<Card>
						<CardHeader>
							<CardTitle>All Users</CardTitle>
						</CardHeader>
						<CardContent>
							{loading ? (
								<div className="text-center py-12">Loading users...</div>
							) : users.length === 0 ? (
								<div className="text-center py-12 text-gray-500">
									No users found
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Email</TableHead>
											<TableHead>Mobile</TableHead>
											<TableHead>Registered</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{users.map((user) => (
											<TableRow key={user.id}>
												<TableCell className="font-medium">
													{user.name}
												</TableCell>
												<TableCell>{user.email}</TableCell>
												<TableCell>{user.phone || "N/A"}</TableCell>
												<TableCell>
													{format(new Date(user.created_at), "MMM dd, yyyy")}
												</TableCell>
												<TableCell>
													<Badge
														variant={
															user.is_blocked ? "destructive" : "default"
														}>
														{user.is_blocked ? "Blocked" : "Active"}
													</Badge>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleViewDetails(user.id)}>
															<Eye className="h-4 w-4 mr-2" />
															View Details
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleBlockClick(user)}
															className={
																user.is_blocked
																	? "text-green-600 hover:text-green-700"
																	: "text-red-600 hover:text-red-700"
															}>
															<Ban className="h-4 w-4 mr-2" />
															{user.is_blocked ? "Unblock" : "Block"}
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>

					{/* Pagination */}
					{pagination.totalPages > 1 && (
						<div className="mt-6 flex justify-center gap-2">
							<Button
								variant="outline"
								disabled={pagination.page === 1}
								onClick={() =>
									setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
								}>
								Previous
							</Button>
							<span className="flex items-center px-4">
								Page {pagination.page} of {pagination.totalPages}
							</span>
							<Button
								variant="outline"
								disabled={pagination.page === pagination.totalPages}
								onClick={() =>
									setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
								}>
								Next
							</Button>
						</div>
					)}
						</>
					)}
				</div>
			</main>

			{/* Block/Unblock Dialog */}
			<Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{userToBlock?.is_blocked ? "Unblock User" : "Block User"}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<p className="text-sm text-gray-600">
							Are you sure you want to {userToBlock?.is_blocked ? "unblock" : "block"}{" "}
							<strong>{userToBlock?.name}</strong>?
						</p>
						{!userToBlock?.is_blocked && (
							<div>
								<label className="text-sm font-medium">Reason (optional)</label>
								<Input
									value={blockReason}
									onChange={(e) => setBlockReason(e.target.value)}
									placeholder="Enter reason for blocking..."
									className="mt-1"
								/>
							</div>
						)}
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
								Cancel
							</Button>
							<Button
								variant={userToBlock?.is_blocked ? "default" : "destructive"}
								onClick={handleBlockUser}>
								{userToBlock?.is_blocked ? "Unblock" : "Block"} User
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* User Details Dialog */}
			<Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>User Details</DialogTitle>
					</DialogHeader>
					{selectedUser && (
						<Tabs defaultValue="personal" className="w-full">
							<TabsList className="grid w-full grid-cols-5">
								<TabsTrigger value="personal">Personal</TabsTrigger>
								<TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
								<TabsTrigger value="invoices">Invoices</TabsTrigger>
								<TabsTrigger value="apps">Apps</TabsTrigger>
								<TabsTrigger value="activity">Activity</TabsTrigger>
							</TabsList>

							{/* Personal Details */}
							<TabsContent value="personal" className="space-y-4">
								<Card>
									<CardHeader>
										<CardTitle>Personal Information</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<label className="text-sm font-medium text-gray-500">
													Name
												</label>
												<p className="text-base">{selectedUser.user.name}</p>
											</div>
											<div>
												<label className="text-sm font-medium text-gray-500">
													Email
												</label>
												<p className="text-base">{selectedUser.user.email}</p>
											</div>
											<div>
												<label className="text-sm font-medium text-gray-500">
													Phone
												</label>
												<p className="text-base">
													{selectedUser.user.phone || "N/A"}
												</p>
											</div>
											<div>
												<label className="text-sm font-medium text-gray-500">
													Status
												</label>
												<Badge
													variant={
														selectedUser.user.is_blocked
															? "destructive"
															: "default"
													}>
													{selectedUser.user.is_blocked ? "Blocked" : "Active"}
												</Badge>
											</div>
											<div>
												<label className="text-sm font-medium text-gray-500">
													Email Verified
												</label>
												<p className="text-base">
													{selectedUser.user.email_verified ? (
														<CheckCircle2 className="h-5 w-5 text-green-500 inline" />
													) : (
														<XCircle className="h-5 w-5 text-red-500 inline" />
													)}
												</p>
											</div>
											<div>
												<label className="text-sm font-medium text-gray-500">
													Phone Verified
												</label>
												<p className="text-base">
													{selectedUser.user.phone_verified ? (
														<CheckCircle2 className="h-5 w-5 text-green-500 inline" />
													) : (
														<XCircle className="h-5 w-5 text-red-500 inline" />
													)}
												</p>
											</div>
											<div>
												<label className="text-sm font-medium text-gray-500">
													Registered Date
												</label>
												<p className="text-base">
													{format(
														new Date(selectedUser.user.created_at),
														"MMM dd, yyyy HH:mm"
													)}
												</p>
											</div>
											<div>
												<label className="text-sm font-medium text-gray-500">
													Last Login
												</label>
												<p className="text-base">
													{selectedUser.user.last_login_at
														? format(
																new Date(selectedUser.user.last_login_at),
																"MMM dd, yyyy HH:mm"
														  )
														: "Never"}
												</p>
											</div>
										</div>

										{selectedUser.user.is_blocked && (
											<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
												<label className="text-sm font-medium text-red-800">
													Blocked Information
												</label>
												<p className="text-sm text-red-700 mt-1">
													Reason: {selectedUser.user.blocked_reason || "No reason provided"}
												</p>
												<p className="text-sm text-red-700">
													Blocked At:{" "}
													{selectedUser.user.blocked_at
														? format(
																new Date(selectedUser.user.blocked_at),
																"MMM dd, yyyy HH:mm"
														  )
														: "N/A"}
												</p>
											</div>
										)}

										{selectedUser.user.registration_ip && (
											<div className="pt-4 border-t">
												<h4 className="font-medium mb-2">Registration Info</h4>
												<div className="grid grid-cols-2 gap-4 text-sm">
													<div>
														<span className="text-gray-500">IP Address:</span>{" "}
														{selectedUser.user.registration_ip}
													</div>
													{selectedUser.user.registration_location && (
														<div>
															<span className="text-gray-500">Location:</span>{" "}
															{selectedUser.user.registration_location.city ||
																"N/A"}
															,{" "}
															{selectedUser.user.registration_location.country ||
																"N/A"}
														</div>
													)}
												</div>
											</div>
										)}
									</CardContent>
								</Card>

								{/* Devices */}
								{selectedUser.devices && selectedUser.devices.length > 0 && (
									<Card>
										<CardHeader>
											<CardTitle>Devices ({selectedUser.devices.length})</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-3">
												{selectedUser.devices.map((device) => (
													<div
														key={device.id}
														className="p-3 border rounded-lg">
														<div className="flex justify-between items-start">
															<div>
																<p className="font-medium">{device.device_name}</p>
																<p className="text-sm text-gray-500">
																	{device.browser} on {device.os}
																</p>
																<p className="text-xs text-gray-400 mt-1">
																	Last seen:{" "}
																	{format(
																		new Date(device.last_seen_at),
																		"MMM dd, yyyy HH:mm"
																	)}
																</p>
															</div>
															<Badge
																variant={
																	device.is_blocked
																		? "destructive"
																		: device.is_active
																		? "default"
																		: "secondary"
																}>
																{device.is_blocked
																	? "Blocked"
																	: device.is_active
																	? "Active"
																	: "Inactive"}
															</Badge>
														</div>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								)}
							</TabsContent>

							{/* Subscriptions */}
							<TabsContent value="subscriptions">
								<Card>
									<CardHeader>
										<CardTitle>
											Subscriptions ({selectedUser.subscriptions?.length || 0})
										</CardTitle>
									</CardHeader>
									<CardContent>
										{selectedUser.subscriptions && selectedUser.subscriptions.length > 0 ? (
											<div className="space-y-3">
												{selectedUser.subscriptions.map((sub) => (
													<div key={sub.id} className="p-3 border rounded-lg">
														<p className="font-medium">{sub.plan_name || "N/A"}</p>
														<p className="text-sm text-gray-500">
															Status: {sub.status || "N/A"}
														</p>
													</div>
												))}
											</div>
										) : (
											<p className="text-gray-500 text-center py-8">
												No subscriptions found
											</p>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* Invoices */}
							<TabsContent value="invoices">
								<Card>
									<CardHeader>
										<CardTitle>Invoices ({selectedUser.invoices?.length || 0})</CardTitle>
									</CardHeader>
									<CardContent>
										{selectedUser.invoices && selectedUser.invoices.length > 0 ? (
											<div className="space-y-3">
												{selectedUser.invoices.map((invoice) => (
													<div key={invoice.id} className="p-3 border rounded-lg">
														<p className="font-medium">
															Invoice #{invoice.invoice_number || invoice.id}
														</p>
														<p className="text-sm text-gray-500">
															Amount: ${invoice.amount || "N/A"}
														</p>
													</div>
												))}
											</div>
										) : (
											<p className="text-gray-500 text-center py-8">No invoices found</p>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* Apps */}
							<TabsContent value="apps">
								<Card>
									<CardHeader>
										<CardTitle>Activated Apps ({selectedUser.apps?.length || 0})</CardTitle>
									</CardHeader>
									<CardContent>
										{selectedUser.apps && selectedUser.apps.length > 0 ? (
											<div className="space-y-3">
												{selectedUser.apps.map((app) => (
													<div key={app.id} className="p-3 border rounded-lg">
														<p className="font-medium">{app.app_name || "N/A"}</p>
														<p className="text-sm text-gray-500">
															Status: {app.status || "N/A"}
														</p>
													</div>
												))}
											</div>
										) : (
											<p className="text-gray-500 text-center py-8">No apps found</p>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* Activity Logs */}
							<TabsContent value="activity">
								<Card>
									<CardHeader>
										<CardTitle>
											Activity Logs ({selectedUser.activityLogs?.length || 0})
										</CardTitle>
									</CardHeader>
									<CardContent>
										{selectedUser.activityLogs && selectedUser.activityLogs.length > 0 ? (
											<div className="space-y-3 max-h-96 overflow-y-auto">
												{selectedUser.activityLogs.map((log) => (
													<div key={log.id} className="p-3 border rounded-lg">
														<div className="flex justify-between items-start">
															<div className="flex-1">
																<p className="font-medium">{log.activity_type}</p>
																{log.activity_description && (
																	<p className="text-sm text-gray-500 mt-1">
																		{log.activity_description}
																	</p>
																)}
																<div className="flex gap-4 mt-2 text-xs text-gray-400">
																	{log.ip_address && (
																		<span>IP: {log.ip_address}</span>
																	)}
																	<span>
																		{format(
																			new Date(log.created_at),
																			"MMM dd, yyyy HH:mm:ss"
																		)}
																	</span>
																</div>
															</div>
														</div>
													</div>
												))}
											</div>
										) : (
											<p className="text-gray-500 text-center py-8">
												No activity logs found
											</p>
										)}
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AdminDashboard;

