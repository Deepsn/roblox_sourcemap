import React, { Fragment } from "react";
import { renderToString } from "react-dom/server";

import PropTypes from "prop-types";
import { Tooltip, Button } from "@rbx/core-ui";
import { withTranslations } from "@rbx/core-scripts/react";

import CreatePrivateGame from "./CreatePrivateGame";
import GameListSection from "../components/GameListSection";
import serverListConstants from "../constants/serverListConstants";
import serverListService from "../services/serverListService";
import translationConfig from "../translation.config";
import urlConstants from "../constants/urlConstants";
import useServerList from "./useServerList";
import { canCreatePrivateGameServer } from "../util/gameInstanceUtil";
import { serverListMetadataPropType } from "../constants/sharedPropTypes";

const { resources, serverListTypes } = serverListConstants;
const { PriceLabel } = window.RobloxItemPurchase;

function PrivateServerList({ translate, intl, serverListMetadata }) {
	const {
		canCreateServer,
		placeId,
		placeName,
		price,
		privateServerProductId,
		sellerId,
		sellerName,
		universeId,
		userCanManagePlace,
		preopenCreatePrivateGame,
		privateServerLimit,
	} = serverListMetadata;

	const {
		clearServerAtIndex,
		hasError,
		hasNext,
		isBusy,
		loadMoreServers,
		refreshServers,
		servers,
		setIsBusy,
		isReady,
		joinRestricted,
	} = useServerList(
		serverListService.getVipGameInstances,
		!!price,
		placeId,
		serverListConstants.defaultOptions,
	);

	const canCreatePrivateServer = canCreatePrivateGameServer(
		servers,
		privateServerLimit,
	);
	const doesGameSupportPrivateServers = privateServerProductId !== 0;

	const privateServerHelpLink = `<a class="text-link" href="${urlConstants.privateServerHelpUrl(
		intl.getRobloxLocale(),
	)}">${translate(resources.privateServerHeader)}</a>`;

	const playWithResource = resources.privateServerPlayWithOthers;
	const privateServerTooltipResource = resources.privateServerTooltip;

	return (
		<div id="rbx-private-servers" className="stack">
			<div className="container-header">
				<h2>{translate(resources.privateServerHeader)}</h2>

				{doesGameSupportPrivateServers && (
					<Button
						className="btn-more rbx-refresh refresh-link-icon"
						isDisabled={isBusy}
						onClick={() => refreshServers()}
						size={Button.sizes.extraSmall}
						variant={Button.variants.control}
					>
						{translate(resources.privateServerRefreshText)}
					</Button>
				)}

				<Tooltip
					content={translate(privateServerTooltipResource)}
					id="private-server-tooltip"
					placement="bottom"
				>
					<span className="icon-moreinfo" />
				</Tooltip>
			</div>
			{!doesGameSupportPrivateServers ? (
				<div
					className="section-content-off"
					dangerouslySetInnerHTML={{
						__html: translate(resources.privateServersNotSupported, {
							vipServersLink: privateServerHelpLink,
						}),
					}}
				/>
			) : (
				<Fragment>
					<div className="create-server-banner section-content remove-panel">
						<div className="create-server-banner-text text">
							{canCreateServer && (
								<span
									className="private-server-price"
									dangerouslySetInnerHTML={{
										__html: translate(resources.privateServerPrice, {
											price: renderToString(<PriceLabel {...{ price }} />),
										}),
									}}
								/>
							)}
							<span className="play-with-others-text">
								{translate(playWithResource)}
								<br />
							</span>
						</div>
						{canCreateServer && (
							<CreatePrivateGame
								privateServerTranslate={translate}
								refreshServers={refreshServers}
								disabled={!isReady}
								{...{
									placeName,
									universeId,
									price,
									canCreatePrivateServer,
									sellerId,
									sellerName,
									productId: privateServerProductId,
									preopenCreatePrivateGame,
								}}
							/>
						)}
					</div>
					<div className="section tab-server-only">
						<GameListSection
							{...{
								gameInstances: servers,
								handleGameInstanceShutdownAtIndex: clearServerAtIndex,
								isLoading: isBusy,
								loadMoreGameInstances: loadMoreServers,
								loadingError: hasError,
								placeId,
								setIsLoading: setIsBusy,
								showLoadMoreButton: hasNext,
								type: serverListTypes.Vip.key,
								userCanManagePlace,
								privateServerNewJoinsDisallowed: joinRestricted ?? false,
								placeName,
								price,
								creatorName: sellerName,
								universeId,
							}}
						/>
					</div>
				</Fragment>
			)}
		</div>
	);
}

PrivateServerList.propTypes = {
	intl: PropTypes.shape({ getRobloxLocale: PropTypes.func.isRequired })
		.isRequired,
	translate: PropTypes.func.isRequired,
	serverListMetadata: serverListMetadataPropType.isRequired,
};

export default withTranslations(
	PrivateServerList,
	translationConfig.privateServer,
);
