import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import VercelHero from "@/components/VercelHero";
import InfiniteMarquee from "@/components/InfiniteMarquee";
import ProductsGrid from "@/components/ProductsGrid";
import PenquinCountdown from "@/components/PenquinCountdown";
import InnovativeFeatures from "@/components/InnovativeFeatures";
import ParallaxSection from "@/components/ParallaxSection";
import InfiniteLogoScroll from "../components/InfiniteLogoScroll";
import PenquinPromoBanner from "@/components/PenquinPromoBanner";
import { PAGE_PATHS } from "@/seo/routeMeta";
import { SeoMeta } from "@/components/SeoMeta";

const Index = () => {
	return (
		<>
			<SeoMeta path={PAGE_PATHS.HOME} />
			<style>{`
				.banner-visible .home-page-nav nav {
					top: 60px !important;
				}
				@media (min-width: 768px) {
					.banner-visible .home-page-nav nav {
						top: 70px !important;
					}
				}
				.banner-visible .home-hero-padding {
					padding-top: 140px !important;
				}
				@media (min-width: 768px) {
					.banner-visible .home-hero-padding {
						padding-top: 150px !important;
					}
				}
			`}</style>
			<div className="min-h-screen home-page-nav">
				<PenquinPromoBanner />
				<Navigation />
				<main>
					<VercelHero />
					<PenquinCountdown />
					<InnovativeFeatures />
					<InfiniteMarquee />
					<ProductsGrid />
					<InfiniteLogoScroll />
					<ParallaxSection />
				</main>
				<Footer />
			</div>
		</>
	);
};

export default Index;
