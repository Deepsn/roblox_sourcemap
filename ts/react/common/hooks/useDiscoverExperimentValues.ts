import { useEffect, useState } from "react";
import experimentConstants from "../constants/experimentConstants";
import bedev2Services from "../services/bedev2Services";

const useDiscoverExperimentValues = (): {
	isMusicChartsCarouselEnabled: boolean;
} => {
	const [isMusicChartsCarouselEnabled, setIsMusicChartsCarouselEnabled] =
		useState(false);

	useEffect(() => {
		const { layerNames, defaultValues } = experimentConstants;

		bedev2Services
			.getExperimentationValues(
				layerNames.discoverPage,
				defaultValues.discoverPage,
			)
			.then((data) => {
				setIsMusicChartsCarouselEnabled(!!data?.IsMusicChartsCarouselEnabled);
			})
			.catch(() => {
				setIsMusicChartsCarouselEnabled(
					defaultValues.discoverPage.IsMusicChartsCarouselEnabled,
				);
			});
	}, []);

	return {
		isMusicChartsCarouselEnabled,
	};
};

export default useDiscoverExperimentValues;
