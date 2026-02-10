import { useEffect, useState } from "react";
import experimentConstants from "../../common/constants/experimentConstants";
import bedev2Services from "../../common/services/bedev2Services";

const useIsSearchQueryPillsEnabled = (): {
	isSearchQueryPillsEnabled: boolean;
	isIxpLoading: boolean;
} => {
	const [isSearchQueryPillsEnabled, setIsSearchQueryPillsEnabled] =
		useState(false);
	const [isIxpLoading, setIsIxpLoading] = useState(true);

	useEffect(() => {
		const { layerNames, defaultValues } = experimentConstants;

		bedev2Services
			.getExperimentationValues(
				layerNames.searchLandingPage,
				defaultValues.searchLandingPage,
			)
			.then((data) => {
				setIsSearchQueryPillsEnabled(!!data?.IsSearchQueryPillsEnabled);
			})
			.catch(() => {
				setIsSearchQueryPillsEnabled(
					defaultValues.searchLandingPage.IsSearchQueryPillsEnabled,
				);
			})
			.finally(() => {
				setIsIxpLoading(false);
			});
	}, []);

	return { isSearchQueryPillsEnabled, isIxpLoading };
};

export default useIsSearchQueryPillsEnabled;
