import { ClientsLogo } from "@/assets";
import { useEffect, useState } from "react";
import Slider from "react-infinite-logo-slider";

export interface Logo {
	src: string;
	alt: string;
}
const InfiniteLogoScroll = () => {
	const clients: Logo[] = [
		{
			src: ClientsLogo.adarsh,
			alt: "Adarsh Logo",
		},
		{
			src: ClientsLogo.dssc,
			alt: "DSSC Logo",
		},
		{
			src: ClientsLogo.lgconstruction,
			alt: "LG Construction Logo",
		},
		{
			src: ClientsLogo.ramakrishnaclg,
			alt: "Ramakrishna College Logo",
		},
		{
			src: ClientsLogo.rojavanam,
			alt: "Rojavanam International School Logo",
		},
		{
			src: ClientsLogo.sidone,
			alt: "Sidone Logo",
		},
		{
			src: ClientsLogo.fcfleet,
			alt: "Fc Fleet Logo",
		},
		{
			src: ClientsLogo.chicago,
			alt: "chicago Logo",
		},
		{
			src: ClientsLogo.rapidinfo,
			alt: "Rapid-info Logo",
		},
	];
	const [sliderWidth, setSliderWidth] = useState("280px");
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) {
				// Mobile
				setSliderWidth("100px");
			} else if (window.innerWidth < 1024) {
				// Tablet
				setSliderWidth("150px");
			} else {
				// Desktop
				setSliderWidth("150px");
			}
		};

		handleResize(); // set initial
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	return (
		<div className="w-full py-12  shadow-inner items-center overflow-hidden">
			<h1 className="w-full flex items-center justify-center gap-5 text-4xl sm:text-2xl md:text-4xl lg:text-6xl  font-bold mb-10">
				<span className="text-2xl md:text-4xl font-bold mb-4 text-black">
					Our Clients
				</span>
			</h1>
			<Slider
				width={sliderWidth}
				duration={25}
				pauseOnHover={false}
				blurBorders={false}>
				{clients.map((logo, index) => {
					// Make fcfleet and chicago logos bigger
					const isLargeLogo = logo.alt.toLowerCase().includes("fleet") || logo.alt.toLowerCase().includes("chicago");
					return (
						<Slider.Slide key={index}>
							<div className="group relative">
								<div className="flex items-center justify-center px-8 transition-transform duration-500 group-hover:scale-110">
									<img
										src={logo.src}
										alt={logo.alt}
										className={`
									
              object-contain
              transition-all duration-500
              grayscale
              group-hover:grayscale-0
            "
								 ${isLargeLogo ? "scale-150" : ""}
            `}
									/>
								</div>
							</div>
						</Slider.Slide>
					);
				})}
			</Slider>
		</div>
	);
};

export default InfiniteLogoScroll;
