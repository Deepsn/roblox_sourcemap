import { useEffect, useState } from "react";
import experimentConstants from "../constants/experimentConstants";
import bedev2Services from "../services/bedev2Services";

const useDiscoverExperimentValues = (): {
	isMusicChartsCarouselEnabled: boolean;
	isNewScrollArrowsAndHeaderEnabled: boolean;
} => {
	const [isMusicChartsCarouselEnabled, setIsMusicChartsCarouselEnabled] =
		useState(false);
	const [
		isNewScrollArrowsAndHeaderEnabled,
		setIsNewScrollArrowsAndHeaderEnabled,
	] = useState(false);

	useEffect(() => {
		const { layerNames, defaultValues } = experimentConstants;

		bedev2Services
			.getExperimentationValues(
				layerNames.discoverPage,
				defaultValues.discoverPage,
			)
			.then((data) => {
				setIsMusicChartsCarouselEnabled(!!data?.IsMusicChartsCarouselEnabled);
				setIsNewScrollArrowsAndHeaderEnabled(
					!!data?.IsNewScrollArrowsAndHeaderEnabled,
				);
			})
			.catch(() => {
				setIsMusicChartsCarouselEnabled(
					defaultValues.discoverPage.IsMusicChartsCarouselEnabled,
				);
				setIsNewScrollArrowsAndHeaderEnabled(
					defaultValues.discoverPage.IsNewScrollArrowsAndHeaderEnabled,
				);
			});
	}, []);

	return {
		isMusicChartsCarouselEnabled,
		isNewScrollArrowsAndHeaderEnabled,
	};
};

export default useDiscoverExperimentValues;
