import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import environmentUrls from "@rbx/environment-urls";
import { getAbsoluteUrl } from "@rbx/core-scripts/endpoints";
import { SimpleModal } from "@rbx/core-ui/legacy/react-style-guide";
import links from "../../constants/linkConstants";
import layoutConstants from "../../constants/layoutConstants";
import LeftNavItem from "./LeftNavItem";
import navigationUtil from "../../util/navigationUtil";

const { shopEvents } = layoutConstants;

function ScrollList({ translate, ...props }) {
	const [isShopModalOpen, setShopModalOpen] = useState(false);

	const onClickShopLink = useCallback(() => {
		setShopModalOpen((isOpen) => !isOpen);
		navigationUtil.sendClickEvent(shopEvents.clickMerchandise);
	}, []);

	const closeShopModel = () => {
		setShopModalOpen(false);
	};

	const goToAmazonStop = () => {
		const decodedUrl = decodeURIComponent(environmentUrls.amazonWebStoreLink);
		window.open(decodedUrl, "_blank");
		navigationUtil.sendClickEvent(shopEvents.goToAmazonStore);
	};

	const listNavItems = Object.values(links.scrollListItems).map((item) => (
		<LeftNavItem
			key={item.name}
			{...{ translate, onClickShopLink, ...item, ...props }}
		/>
	));

	const upgradeBtn = (
		<li className="rbx-upgrade-now">
			<a
				href={getAbsoluteUrl("/plus")}
				className="btn-growth-md btn-secondary-md"
				id="upgrade-now-button"
			>
				{translate("Label.Blackbird")}
			</a>
		</li>
	);

	const modalBody = (
		<React.Fragment>
			<p className="shop-description">
				{translate("Description.RetailWebsiteRedirect")}
			</p>
			<p className="shop-warning">
				{translate("Description.PurchaseAgeWarning")}
			</p>
		</React.Fragment>
	);
	const shopModal = (
		<SimpleModal
			title={translate("Heading.LeavingRoblox")}
			body={modalBody}
			show={isShopModalOpen}
			actionButtonShow
			actionButtonText={translate("Action.Continue")}
			neutralButtonText={translate("Action.Cancel")}
			onAction={goToAmazonStop}
			onNeutral={closeShopModel}
			onClose={closeShopModel}
		/>
	);

	return (
		<ul className="left-col-list">
			{listNavItems}
			{upgradeBtn}
			{shopModal}
		</ul>
	);
}

ScrollList.propTypes = {
	translate: PropTypes.func.isRequired,
};

export default ScrollList;
