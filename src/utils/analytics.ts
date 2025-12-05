/**
 * Google Analytics 4 (GA4) Integration
 * Comprehensive tracking for all website activities
 */

// Declare gtag function for TypeScript
declare global {
	interface Window {
		gtag: (
			command: string,
			targetId: string | Date,
			config?: Record<string, any>
		) => void;
		dataLayer: any[];
	}
}

// Get GA4 Measurement ID from environment variable
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

/**
 * Initialize Google Analytics
 */
export const initGA = (): void => {
	if (!GA_MEASUREMENT_ID) {
		console.warn("Google Analytics Measurement ID not configured");
		return;
	}

	// Initialize dataLayer
	window.dataLayer = window.dataLayer || [];
	window.gtag = function () {
		window.dataLayer.push(arguments);
	};

	// Set current timestamp
	window.gtag("js", new Date());

	// Configure GA4
	window.gtag("config", GA_MEASUREMENT_ID, {
		page_path: window.location.pathname,
		send_page_view: false, // We'll handle page views manually
	});

	console.log("Google Analytics initialized:", GA_MEASUREMENT_ID);
};

/**
 * Track page view
 */
export const trackPageView = (path: string, title?: string): void => {
	if (!GA_MEASUREMENT_ID || !window.gtag) return;

	window.gtag("config", GA_MEASUREMENT_ID, {
		page_path: path,
		page_title: title || document.title,
		page_location: window.location.href,
	});
};

/**
 * Track custom events
 */
export const trackEvent = (
	eventName: string,
	eventParams?: Record<string, any>
): void => {
	if (!GA_MEASUREMENT_ID || !window.gtag) return;

	window.gtag("event", eventName, {
		...eventParams,
		timestamp: new Date().toISOString(),
	});
};

/**
 * Set user properties
 */
export const setUserProperties = (properties: Record<string, any>): void => {
	if (!GA_MEASUREMENT_ID || !window.gtag) return;

	window.gtag("set", "user_properties", properties);
};

/**
 * Set user ID for authenticated users
 */
export const setUserId = (userId: string): void => {
	if (!GA_MEASUREMENT_ID || !window.gtag) return;

	window.gtag("config", GA_MEASUREMENT_ID, {
		user_id: userId,
	});
};

/**
 * Clear user ID on logout
 */
export const clearUserId = (): void => {
	if (!GA_MEASUREMENT_ID || !window.gtag) return;

	window.gtag("config", GA_MEASUREMENT_ID, {
		user_id: null,
	});
};

/**
 * Track button clicks
 */
export const trackButtonClick = (
	buttonName: string,
	location?: string,
	additionalParams?: Record<string, any>
): void => {
	trackEvent("button_click", {
		button_name: buttonName,
		button_location: location || window.location.pathname,
		...additionalParams,
	});
};

/**
 * Track form submissions
 */
export const trackFormSubmit = (
	formName: string,
	formLocation?: string,
	success: boolean = true,
	additionalParams?: Record<string, any>
): void => {
	trackEvent("form_submit", {
		form_name: formName,
		form_location: formLocation || window.location.pathname,
		success,
		...additionalParams,
	});
};

/**
 * Track link clicks
 */
export const trackLinkClick = (
	linkText: string,
	linkUrl: string,
	linkLocation?: string
): void => {
	trackEvent("link_click", {
		link_text: linkText,
		link_url: linkUrl,
		link_location: linkLocation || window.location.pathname,
	});
};

/**
 * Track file downloads
 */
export const trackDownload = (
	fileName: string,
	fileType?: string,
	fileLocation?: string
): void => {
	trackEvent("file_download", {
		file_name: fileName,
		file_type: fileType,
		file_location: fileLocation || window.location.pathname,
	});
};

/**
 * Track search queries
 */
export const trackSearch = (
	searchTerm: string,
	searchCategory?: string,
	resultsCount?: number
): void => {
	trackEvent("search", {
		search_term: searchTerm,
		search_category: searchCategory,
		results_count: resultsCount,
	});
};

/**
 * Track video interactions
 */
export const trackVideo = (
	action: "play" | "pause" | "complete" | "progress",
	videoTitle: string,
	videoDuration?: number,
	videoCurrentTime?: number
): void => {
	trackEvent("video_interaction", {
		video_action: action,
		video_title: videoTitle,
		video_duration: videoDuration,
		video_current_time: videoCurrentTime,
	});
};

/**
 * Track authentication events
 */
export const trackAuth = (
	action: "login" | "logout" | "register" | "password_reset",
	method?: string,
	success: boolean = true
): void => {
	trackEvent("authentication", {
		auth_action: action,
		auth_method: method,
		success,
	});
};

/**
 * Track e-commerce events (if applicable)
 */
export const trackPurchase = (
	transactionId: string,
	value: number,
	currency: string = "USD",
	items?: Array<{
		item_id: string;
		item_name: string;
		price: number;
		quantity: number;
	}>
): void => {
	trackEvent("purchase", {
		transaction_id: transactionId,
		value,
		currency,
		items,
	});
};

/**
 * Track errors
 */
export const trackError = (
	errorMessage: string,
	errorLocation?: string,
	fatal: boolean = false
): void => {
	trackEvent("exception", {
		description: errorMessage,
		fatal,
		error_location: errorLocation || window.location.pathname,
	});
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (depth: number): void => {
	trackEvent("scroll", {
		scroll_depth: depth,
		scroll_percentage: Math.round((depth / document.body.scrollHeight) * 100),
	});
};

/**
 * Track time on page
 */
export const trackTimeOnPage = (timeInSeconds: number): void => {
	trackEvent("timing_complete", {
		name: "time_on_page",
		value: Math.round(timeInSeconds * 1000), // Convert to milliseconds
	});
};

/**
 * Track social media interactions
 */
export const trackSocial = (
	network: string,
	action: string,
	target?: string
): void => {
	trackEvent("social", {
		social_network: network,
		social_action: action,
		social_target: target,
	});
};

/**
 * Track product views
 */
export const trackProductView = (
	productName: string,
	productId?: string,
	category?: string
): void => {
	trackEvent("view_item", {
		item_name: productName,
		item_id: productId,
		item_category: category,
	});
};

/**
 * Track engagement time
 */
export const trackEngagement = (timeInSeconds: number): void => {
	trackEvent("user_engagement", {
		engagement_time_msec: Math.round(timeInSeconds * 1000),
	});
};

export default {
	initGA,
	trackPageView,
	trackEvent,
	setUserProperties,
	setUserId,
	clearUserId,
	trackButtonClick,
	trackFormSubmit,
	trackLinkClick,
	trackDownload,
	trackSearch,
	trackVideo,
	trackAuth,
	trackPurchase,
	trackError,
	trackScrollDepth,
	trackTimeOnPage,
	trackSocial,
	trackProductView,
	trackEngagement,
};

