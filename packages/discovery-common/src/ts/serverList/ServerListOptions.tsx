import React from "react";
import {
	sendEventWithTarget,
	targetTypes,
} from "@rbx/core-scripts/event-stream";
import {
	withTranslations,
	WithTranslationsProps,
} from "@rbx/core-scripts/react";
import translationConfig from "../../js/serverList/translation.config";
import { getPlaceIdFromUrl } from "../../js/serverList/util/gameInstanceUtil";
import serverListConstants from "../../js/serverList/constants/serverListConstants";

const { resources, sortOrders, orderByOptions } = serverListConstants;

// When an order-by option is chosen we still send a legacy `sortOrder` so the
// occupancy ordering keeps working before the backend honors `orderBy`
// (and so pre-reroute games-api, which ignores `orderBy`, behaves sensibly).
const ORDER_BY_TO_SORT_ORDER: Record<string, string> = {
	[orderByOptions.occupancyDesc]: sortOrders.descending,
	[orderByOptions.occupancyAsc]: sortOrders.ascending,
	[orderByOptions.recommended]: sortOrders.descending,
	[orderByOptions.bestLatency]: sortOrders.descending,
};

export type TServerListOptions = {
	sortOrder: string;
	excludeFullGames: boolean;
	orderBy?: string;
};

export type TServerListOptionsProps = {
	options: TServerListOptions;
	setOptions: React.Dispatch<React.SetStateAction<TServerListOptions>>;
	isLoading?: boolean;
	// Gated by the IsPublicServerListV2Enabled IXP flag; when true this public
	// server list flow uses the V2 endpoint and expanded order-by options.
	isPublicServerListV2Enabled?: boolean;
	isAuthenticated?: boolean;
};

function ServerListOptions({
	translate,
	options,
	setOptions,
	isLoading = false,
	isPublicServerListV2Enabled = false,
	isAuthenticated = false,
}: TServerListOptionsProps & WithTranslationsProps) {
	const fireSortDropdownFocus = () => {
		sendEventWithTarget(
			"serverListOptionsInteraction",
			"sortDropdown",
			{
				pid: getPlaceIdFromUrl() ?? undefined,
			},
			targetTypes.WWW,
		);
	};

	const fireSortSelect = (sort: string) => {
		sendEventWithTarget(
			"serverListOptionsInteraction",
			"sortSelect",
			{
				pid: getPlaceIdFromUrl() ?? undefined,
				sort,
			},
			targetTypes.WWW,
		);
	};

	return (
		<div className="server-list-options">
			<div className="select-group">
				<label className="select-label text-label" htmlFor="sort-select">
					{isPublicServerListV2Enabled
						? translate(resources.sortByLabel) || "Sort by"
						: translate(resources.numberOfPlayers) || "Number of Players"}
				</label>
				<div className="rbx-select-group select-group">
					{isPublicServerListV2Enabled ? (
						<select
							onChange={(e) => {
								const orderBy = e.currentTarget.value;
								fireSortSelect(orderBy);
								setOptions((prevState) => ({
									...prevState,
									orderBy,
									sortOrder:
										ORDER_BY_TO_SORT_ORDER[orderBy] ?? prevState.sortOrder,
								}));
							}}
							onFocus={fireSortDropdownFocus}
							disabled={isLoading}
							value={options.orderBy ?? orderByOptions.recommended}
							id="sort-select"
							data-testid="sort-select"
							className="input-field rbx-select select-option"
						>
							{isAuthenticated && (
								<option value={orderByOptions.recommended}>
									{translate(resources.recommendedForYou) ||
										"Recommended for you"}
								</option>
							)}
							{isAuthenticated && (
								<option value={orderByOptions.bestLatency}>
									{translate(resources.bestLatency) || "Best latency"}
								</option>
							)}
							<option value={orderByOptions.occupancyDesc}>
								{translate(resources.occupancyDescending) ||
									"Occupancy descending"}
							</option>
							<option value={orderByOptions.occupancyAsc}>
								{translate(resources.occupancyAscending) ||
									"Occupancy ascending"}
							</option>
						</select>
					) : (
						<select
							onChange={(e) => {
								fireSortSelect(e.currentTarget.value);
								setOptions((prevState) => ({
									...prevState,
									sortOrder: e.currentTarget.value,
								}));
							}}
							onFocus={fireSortDropdownFocus}
							disabled={isLoading}
							value={options.sortOrder}
							id="sort-select"
							data-testid="sort-select"
							className="input-field rbx-select select-option"
						>
							<option value={sortOrders.descending}>
								{translate(resources.descending) || "Descending"}
							</option>
							<option value={sortOrders.ascending}>
								{translate(resources.ascending) || "Ascending"}
							</option>
						</select>
					)}
					<span className="icon-arrow icon-down-16x16" />
				</div>
			</div>
			<div className="checkbox">
				<input
					onChange={(e) => {
						sendEventWithTarget(
							"serverListOptionsInteraction",
							"filterSelect",
							{
								pid: getPlaceIdFromUrl() ?? undefined,
								checked: e.currentTarget.checked,
							},
							targetTypes.WWW,
						);
						setOptions((prevState) => ({
							...prevState,
							excludeFullGames: e.currentTarget.checked,
						}));
					}}
					disabled={isLoading}
					type="checkbox"
					id="filter-checkbox"
					data-testid="filter-checkbox"
					checked={options.excludeFullGames}
				/>
				{/* The linter throws a false positive unless the input element is a child of label.
        However, doing that breaks the :before CSS attributes.
        The label still has the correct htmlFor prop, so it's safe. */}
				{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
				<label className="checkbox-label text-label" htmlFor="filter-checkbox">
					{translate(resources.hideFullServers) || "Hide Full Servers"}
				</label>
			</div>
		</div>
	);
}

export default withTranslations(
	ServerListOptions,
	translationConfig.serverList,
);
