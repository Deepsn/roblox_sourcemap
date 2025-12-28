import { useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { eventStreamService } from "core-roblox-utilities";
import { TEvent, EventStreamMetadata } from "../constants/eventStreamConstants";
import sessionStorageUtils from "../utils/sessionStorageUtils";
import parsingUtils from "../utils/parsingUtils";
import {
	TAppsFlyerRefParams,
	getAppsFlyerReferralParams,
} from "../utils/appsFlyerReferralUtils";

type TReactRouterDOMHistory = ReturnType<typeof useHistory>;
type TReactRouterDOMLocation = ReturnType<typeof useLocation>;
type TEventMetadataOverrideKeys =
	| EventStreamMetadata.UniverseId
	| EventStreamMetadata.PlaceId
	| EventStreamMetadata.ShareLinkId
	| EventStreamMetadata.ShareLinkType;
type TEventMetadataOverrides = Record<
	TEventMetadataOverrideKeys,
	string | number | boolean
>;
export type PartialEventMetadataOverrides = Partial<TEventMetadataOverrides>;
const { parseQueryString, composeQueryString } = parsingUtils;

export const usePageReferralTracker = <T extends Record<string, unknown>>(
	eventParamsGenerator: (params?: T) => TEvent,
	eventParams: Array<keyof T>,
	queryParams: string[],
	eventMetadataOverrides: PartialEventMetadataOverrides = {},
	location: Location | TReactRouterDOMLocation = window.location,
	history: History | TReactRouterDOMHistory = window.history,
): {
	referralParams: T;
	appsFlyerReferralParams: Partial<TAppsFlyerRefParams>;
} => {
	const [referralParams, setReferralParams] = useState<T>(
		parseQueryString(location.search) as unknown as T,
	);
	const appsFlyerReferralParams = useMemo<Partial<TAppsFlyerRefParams>>(
		() => getAppsFlyerReferralParams(location),
		[location],
	);

	const isTReactRouterDOMHistory = (
		historyObject: TReactRouterDOMHistory | History,
	): historyObject is TReactRouterDOMHistory => {
		return (<TReactRouterDOMHistory>historyObject).replace !== undefined;
	};

	const isHistory = (
		historyObject: TReactRouterDOMHistory | History,
	): historyObject is History => {
		return (<History>historyObject).replaceState !== undefined;
	};

	const sendEvent = () => {
		// Building Event / Query object
		const params = parseQueryString(location.search);
		const parsedEventParams = eventParams.reduce(
			(acc, curr) => {
				if (
					params[curr as string] !== undefined ||
					params[curr as string] !== null
				) {
					acc[curr] = params[curr as string];
				}
				return acc;
			},
			{} as Record<keyof T, unknown>,
		) as T;

		const parsedQueryParams = queryParams.reduce(
			(acc, curr) => {
				if (params[curr] !== undefined || params[curr] !== null) {
					acc[curr] = params[curr];
				}
				return acc;
			},
			{} as Record<string, unknown>,
		);
		// Do not want to expose placeId other than the case with launchData
		if (!parsedQueryParams.launchData && parsedQueryParams.placeId) {
			delete parsedQueryParams.placeId;
		}
		setReferralParams(parsedEventParams);
		sessionStorageUtils.setPerTabEventProperties(parsedEventParams);
		// Handling both react router and regular route pages
		if (isTReactRouterDOMHistory(history)) {
			history.replace(
				`${location.pathname}${composeQueryString(parsedQueryParams)}`,
			);
		}
		if (isHistory(history)) {
			history.replaceState(
				undefined,
				"",
				`${location.pathname}${location.hash}${composeQueryString(parsedQueryParams)}`,
			);
		}

		// Trigger Event
		eventStreamService.sendEvent(
			...eventParamsGenerator({
				...parsedEventParams,
				...eventMetadataOverrides,
			}),
		);
	};

	useEffect(() => {
		sendEvent();
	}, []);

	return { referralParams, appsFlyerReferralParams };
};

export default usePageReferralTracker;
