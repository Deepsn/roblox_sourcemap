import React from "react";
import { TranslateFunction } from "react-utilities";
import { Icon } from "@rbx/foundation-ui";
import type {
	SubscriptionProductInfo,
	SubscriptionOffer,
} from "@rbx/client-subscriptions-api/v1";
import useUpsellTracking from "../../hooks/useUpsellTracking";

type SubscriptionUpsellBannerProps = {
	translate: TranslateFunction;
	assetType: string;
	subscriptionProductInfo?: SubscriptionProductInfo;
	onBannerClick: () => void;
};

const SubscriptionUpsellBanner: React.FC<SubscriptionUpsellBannerProps> = ({
	translate,
	assetType,
	subscriptionProductInfo,
	onBannerClick,
}) => {
	const featureConfig =
		subscriptionProductInfo?.productTypeDetails.robloxSubscriptionProductDetails
			?.featureConfig;
	const initDiscount = featureConfig?.virtualTransactionDiscounts?.find(
		(d) => d.periodIndex === 0,
	);

	const bannerText = translate("Label.BlackbirdUpsellBanner", {
		discountPercentage: initDiscount?.discountPercent?.toFixed(0),
	});

	const isFreeTrial =
		subscriptionProductInfo?.eligibleOffers?.some(
			(o: SubscriptionOffer) => o.offerType === "FreeTrial",
		) ?? false;

	useUpsellTracking(
		"UnifiedPurchaseModalUpsellBanner",
		assetType,
		Boolean(subscriptionProductInfo),
	);

	const actionText = isFreeTrial
		? translate("Action.TrialSubscription")
		: translate("Action.Subscribe");

	return subscriptionProductInfo ? (
		<button
			type="button"
			className="gap-y-medium flex flex-row justify-between padding-medium bg-shift-100 stroke-default stroke-thick radius-medium cursor-pointer text-body-medium margin-top-[12px]"
			onClick={onBannerClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onBannerClick();
				}
			}}
		>
			<div className="gap-x-small flex items-center">
				<Icon name="icon-regular-roblox-plus" size="Small" />
				<span>{bannerText}</span>
			</div>
			<span className="content-default underline">{actionText}</span>
		</button>
	) : null;
};

export default SubscriptionUpsellBanner;
