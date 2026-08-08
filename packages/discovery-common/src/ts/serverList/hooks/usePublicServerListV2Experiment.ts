import { useEffect, useRef } from "react";
import ExperimentationService from "@rbx/experimentation";
import useExperimentValues from "../../common/hooks/useExperimentValues";
import {
	serverListExperimentLayer,
	isPublicServerListV2EnabledParam,
} from "../constants/experimentConstants";

type ServerListExperimentValues = {
	[isPublicServerListV2EnabledParam]: boolean;
};

// Module-level constant so the reference is stable across renders (the default
// values feed a useMemo dependency in useExperimentValues).
const defaultValues: ServerListExperimentValues = {
	[isPublicServerListV2EnabledParam]: false,
};

/**
 * Reads the IXP flag that gates the V2 public server-list flow, defaulting to
 * disabled if IXP is unavailable.
 *
 * Exposure is logged once, and only when `shouldLogExposure` is true. This hook
 * is called from every server section (public / friends / private), but only
 * the public section consumes the flag, so non-public sections pass `false` to
 * avoid inflating exposure counts. The underlying fetch is shared via the
 * react-query cache key, so passing through multiple sections is cheap.
 */
const usePublicServerListV2Experiment = (
	shouldLogExposure = true,
): {
	isPublicServerListV2Enabled: boolean;
	isLoading: boolean;
} => {
	const { ixpData, isLoading } =
		useExperimentValues<ServerListExperimentValues>(
			serverListExperimentLayer,
			defaultValues,
		);

	const hasLoggedExposure = useRef(false);
	useEffect(() => {
		if (shouldLogExposure && !isLoading && !hasLoggedExposure.current) {
			hasLoggedExposure.current = true;
			try {
				ExperimentationService.logLayerExposure(serverListExperimentLayer);
			} catch {
				// Exposure logging is best-effort and must never block rendering.
			}
		}
	}, [shouldLogExposure, isLoading]);

	return {
		isPublicServerListV2Enabled: ixpData[isPublicServerListV2EnabledParam],
		isLoading,
	};
};

export default usePublicServerListV2Experiment;
