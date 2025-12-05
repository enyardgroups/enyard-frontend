/**
 * Page Tracking Component
 * Tracks page views and user engagement metrics
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { trackPageView, setUserId, clearUserId, trackEngagement } from "@/utils/analytics";

const PageTracking = () => {
	const location = useLocation();
	const { user, isAuthenticated } = useAuthStore();
	const engagementStartTime = useRef<number>(Date.now());
	const engagementInterval = useRef<NodeJS.Timeout | null>(null);

	// Track page view on route change
	useEffect(() => {
		trackPageView(location.pathname + location.search);
		engagementStartTime.current = Date.now();

		// Track engagement time every 30 seconds
		if (engagementInterval.current) {
			clearInterval(engagementInterval.current);
		}

		engagementInterval.current = setInterval(() => {
			const timeSpent = (Date.now() - engagementStartTime.current) / 1000;
			trackEngagement(timeSpent);
		}, 30000); // Track every 30 seconds

		// Track final engagement time when leaving page
		return () => {
			if (engagementInterval.current) {
				clearInterval(engagementInterval.current);
			}
			const timeSpent = (Date.now() - engagementStartTime.current) / 1000;
			if (timeSpent > 1) {
				// Only track if user spent more than 1 second
				trackEngagement(timeSpent);
			}
		};
	}, [location]);

	// Set/clear user ID based on authentication status
	useEffect(() => {
		if (isAuthenticated && user?.id) {
			setUserId(user.id);
		} else {
			clearUserId();
		}
	}, [isAuthenticated, user]);

	// Track scroll depth
	useEffect(() => {
		let maxScroll = 0;
		let scrollTracked = false;

		const handleScroll = () => {
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			const scrollHeight = document.documentElement.scrollHeight;
			const clientHeight = document.documentElement.clientHeight;
			const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

			if (scrollPercentage > maxScroll) {
				maxScroll = scrollPercentage;
			}

			// Track at 25%, 50%, 75%, and 100% scroll depth
			if (!scrollTracked) {
				if (maxScroll >= 25 && maxScroll < 50) {
					trackEngagement(0); // Trigger engagement tracking
					scrollTracked = true;
				} else if (maxScroll >= 50 && maxScroll < 75) {
					trackEngagement(0);
					scrollTracked = true;
				} else if (maxScroll >= 75 && maxScroll < 100) {
					trackEngagement(0);
					scrollTracked = true;
				} else if (maxScroll >= 100) {
					trackEngagement(0);
					scrollTracked = true;
				}
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [location]);

	return null;
};

export default PageTracking;

