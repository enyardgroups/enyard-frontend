/**
 * Google Analytics Script Loader Component
 * Loads the GA4 script and initializes tracking
 */

import { useEffect } from "react";
import { initGA } from "@/utils/analytics";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

const GoogleAnalytics = () => {
	useEffect(() => {
		if (!GA_MEASUREMENT_ID) {
			console.warn("Google Analytics Measurement ID not configured");
			return;
		}

		// Load Google Analytics script
		const script1 = document.createElement("script");
		script1.async = true;
		script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
		document.head.appendChild(script1);

		// Initialize GA after script loads
		script1.onload = () => {
			initGA();
		};

		// Cleanup function
		return () => {
			// Note: We don't remove the script as it's needed for tracking
			// But we can clear the dataLayer if needed
			if (window.dataLayer) {
				window.dataLayer = [];
			}
		};
	}, []);

	// Return null as this component doesn't render anything
	return null;
};

export default GoogleAnalytics;

