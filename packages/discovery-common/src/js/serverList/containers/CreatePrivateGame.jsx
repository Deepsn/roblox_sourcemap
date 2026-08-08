import React, { useState } from "react";

import PropTypes from "prop-types";
import { Button } from "@rbx/core-ui";
import {
	Thumbnail2d,
	ThumbnailTypes,
	DefaultThumbnailSize,
	ThumbnailFormat,
} from "@rbx/thumbnails";
import { withTranslations } from "@rbx/core-scripts/react";
import getEconomicRestrictionErrorMsg from "../util/getEconomicRestrictionErrorMsg";

import createServerModalFactory from "../util/CreateServerModalFactory";
import serverListConstants from "../constants/serverListConstants";
import serverListService from "../services/serverListService";
import translationConfig from "../translation.config";
import urlConstants from "../constants/urlConstants";
import { PrivateServerEventType } from "../analytics/privateServerLogging";
import useCurrentTab from "../../gameData/hooks/useCurrentTab";

const { createItemPurchase, errorTypeIds, TransactionVerb, ASSET_TYPE_ENUM } =
	window.RobloxItemPurchase;

const { resources } = serverListConstants;
const [
	customPurchaseVerificationModal,
	customPurchaseVerificationModalService,
] = createServerModalFactory();

const [ItemPurchase, itemPurchaseService] = createItemPurchase({
	customPurchaseVerificationModal,
	customPurchaseVerificationModalService,
});

function CreatePrivateGame({
	canCreatePrivateServer,
	currency,
	placeName,
	price,
	privateServerTranslate,
	productId,
	refreshServers,
	sellerId,
	sellerName,
	translate,
	universeId,
	disabled,
	preopenCreatePrivateGame,
}) {
	const [serverName, setServerName] = useState("");

	if (preopenCreatePrivateGame) {
		itemPurchaseService.start();
	}

	const clearForm = () => {
		setServerName("");
		return true;
	};

	const createPrivateServer = ({
		handleError,
		setLoading,
		openConfirmation,
		closeAll,
	}) => {
		setLoading(true);
		serverListService.createPrivateServer(universeId, serverName, price).then(
			({ data }) => {
				setLoading(false);
				closeAll();

				if (
					data.FailureReason !== undefined &&
					data.ExpirationTimeInMinutes !== undefined
				) {
					handleError({
						title: translate(resources.economicRestrictionsErrorHeading),
						onDecline: () => {
							return true;
						},
						errorMsg: getEconomicRestrictionErrorMsg(
							translate,
							data.FailureReason,
							data.ExpirationTimeInMinutes,
						),
						showDivId: errorTypeIds.transactionFailure,
					});
					return;
				}

				const { vipServerId } = data;

				openConfirmation({
					transactionVerb: TransactionVerb.Bought,
					onAccept: () => {
						window.location.href =
							urlConstants.getPrivateServerConfigUrl(vipServerId);
					},
					onDecline: () => {
						window.EventTracker?.start(
							PrivateServerEventType.PRIVATE_SERVER_LOAD,
						);
						refreshServers({ startTime: performance.now() });
						clearForm();
						return true;
					},
				});
			},
			({ data }) => {
				setLoading(false);
				closeAll();

				const errorMsg =
					data.errors?.[0].userFacingMessage ??
					translate(resources.purchaseError);
				handleError({
					errorMsg,
					onDecline: () => {
						window.EventTracker?.start(
							PrivateServerEventType.PRIVATE_SERVER_LOAD,
						);
						refreshServers({ startTime: performance.now() });
						return true;
					},
					showDivId: errorTypeIds.transactionFailure,
					title: translate(resources.transactionFailedHeading),
				});
			},
		);
	};

	const onServerNameChange = ({ target: { value } }) => setServerName(value);

	const placeThumbnail = (
		<Thumbnail2d
			containerClass="modal-thumb"
			format={ThumbnailFormat.jpeg}
			imgClassName="original-image"
			size={DefaultThumbnailSize}
			targetId={universeId}
			type={ThumbnailTypes.gameIcon}
		/>
	);

	return (
		<span className="rbx-private-server-create">
			<Button
				className="btn-more rbx-private-server-create-button"
				isDisabled={disabled || !canCreatePrivateServer}
				onClick={itemPurchaseService.start}
				size={Button.sizes.medium}
				variant={Button.variants.secondary}
			>
				{privateServerTranslate(resources.createPrivateServerTitle)}
			</Button>
			<ItemPurchase
				{...{
					assetName: placeName,
					assetType: ASSET_TYPE_ENUM.PRIVATE_SERVER,
					customProps: {
						privateServerTranslate,
						serverName,
						onServerNameChange,
						clearForm,
					},
					expectedCurrency: currency,
					expectedPrice: price,
					expectedSellerId: sellerId,
					handlePurchase: createPrivateServer,
					productId,
					sellerName,
					thumbnail: placeThumbnail,
				}}
				isPrivateServer
			/>
			{!canCreatePrivateServer && (
				<span className="text-footer rbx-private-server-create-disabled-text">
					{translate(resources.maxFreePrivateServersText)}
				</span>
			)}
		</span>
	);
}

CreatePrivateGame.defaultProps = {
	canCreatePrivateServer: true,
	currency: 1,
	disabled: false,
	preopenCreatePrivateGame: false,
};

CreatePrivateGame.propTypes = {
	canCreatePrivateServer: PropTypes.bool,
	currency: PropTypes.number,
	placeName: PropTypes.string.isRequired,
	price: PropTypes.number.isRequired,
	privateServerTranslate: PropTypes.func.isRequired,
	productId: PropTypes.number.isRequired,
	refreshServers: PropTypes.func.isRequired,
	sellerId: PropTypes.number.isRequired,
	sellerName: PropTypes.string.isRequired,
	translate: PropTypes.func.isRequired,
	universeId: PropTypes.number.isRequired,
	disabled: PropTypes.bool,
	preopenCreatePrivateGame: PropTypes.bool,
};

export default withTranslations(
	CreatePrivateGame,
	translationConfig.vipServersResources,
);
