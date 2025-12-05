/**
 * Custom hook for Google Analytics tracking
 * Provides easy access to tracking functions
 */

import { useCallback } from "react";
import {
	trackEvent,
	trackButtonClick,
	trackFormSubmit,
	trackLinkClick,
	trackDownload,
	trackSearch,
	trackAuth,
	trackError,
	trackProductView,
	setUserId,
	clearUserId,
	setUserProperties,
} from "@/utils/analytics";

export const useAnalytics = () => {
	const trackButton = useCallback(
		(buttonName: string, location?: string, additionalParams?: Record<string, any>) => {
			trackButtonClick(buttonName, location, additionalParams);
		},
		[]
	);

	const trackForm = useCallback(
		(
			formName: string,
			formLocation?: string,
			success: boolean = true,
			additionalParams?: Record<string, any>
		) => {
			trackFormSubmit(formName, formLocation, success, additionalParams);
		},
		[]
	);

	const trackLink = useCallback(
		(linkText: string, linkUrl: string, linkLocation?: string) => {
			trackLinkClick(linkText, linkUrl, linkLocation);
		},
		[]
	);

	const trackFileDownload = useCallback(
		(fileName: string, fileType?: string, fileLocation?: string) => {
			trackDownload(fileName, fileType, fileLocation);
		},
		[]
	);

	const trackSearchQuery = useCallback(
		(searchTerm: string, searchCategory?: string, resultsCount?: number) => {
			trackSearch(searchTerm, searchCategory, resultsCount);
		},
		[]
	);

	const trackAuthEvent = useCallback(
		(action: "login" | "logout" | "register" | "password_reset", method?: string, success: boolean = true) => {
			trackAuth(action, method, success);
		},
		[]
	);

	const trackErrorEvent = useCallback(
		(errorMessage: string, errorLocation?: string, fatal: boolean = false) => {
			trackError(errorMessage, errorLocation, fatal);
		},
		[]
	);

	const trackProduct = useCallback(
		(productName: string, productId?: string, category?: string) => {
			trackProductView(productName, productId, category);
		},
		[]
	);

	const trackCustomEvent = useCallback((eventName: string, eventParams?: Record<string, any>) => {
		trackEvent(eventName, eventParams);
	}, []);

	const setUser = useCallback((userId: string) => {
		setUserId(userId);
	}, []);

	const clearUser = useCallback(() => {
		clearUserId();
	}, []);

	const setProperties = useCallback((properties: Record<string, any>) => {
		setUserProperties(properties);
	}, []);

	return {
		trackButton,
		trackForm,
		trackLink,
		trackFileDownload,
		trackSearchQuery,
		trackAuthEvent,
		trackErrorEvent,
		trackProduct,
		trackCustomEvent,
		setUser,
		clearUser,
		setProperties,
	};
};

export default useAnalytics;

