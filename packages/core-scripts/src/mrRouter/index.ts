import {
	getMrRouterConfig,
	getMrRouterEnvName,
	setMrRouterEnvName,
} from "./config";
import { mergeMrRouterTracestate, TRACESTATE_HEADER } from "./tracestate";

// const MR_ROUTER_HEADER = "mrrouter-env";

const setMrRouterHeaders = (
	headers: Record<string, string | number | undefined>,
): void => {
	const { envName } = getMrRouterConfig();

	if (envName.length > 0) {
		// TODO: if we decide to NOT go with tracestate header, use this instead:
		// headers[MR_ROUTER_HEADER] = envName;

		// eslint-disable-next-line no-param-reassign
		headers[TRACESTATE_HEADER] = mergeMrRouterTracestate(
			typeof headers[TRACESTATE_HEADER] === "string"
				? headers[TRACESTATE_HEADER]
				: undefined,
			envName,
		);
	}
};

export {
	getMrRouterConfig,
	getMrRouterEnvName,
	setMrRouterEnvName,
	mergeMrRouterTracestate,
	setMrRouterHeaders,
};
