import React, { useCallback, useState } from "react";
import { TranslateFunction } from "react-utilities";
import { Icon } from "@rbx/foundation-ui";
import type {
	SubscriptionProductInfo,
	SubscriptionOffer,
} from "@rbx/client-subscriptions-api/v1";
import { DeviceMeta } from "Roblox";
import { paymentFlowAnalyticsService } from "core-roblox-utilities";
import RobloxSubscriptionSheet from "./RobloxSubscriptionSheet";

type SubscriptionUpsellBannerProps = {
	translate: TranslateFunction;
	subscriptionProductInfo?: SubscriptionProductInfo;
	onSubscriptionButtonClick?: (isFreeTrial: boolean) => void;
};

const SubscriptionUpsellBanner: React.FC<SubscriptionUpsellBannerProps> = ({
	translate,
	subscriptionProductInfo,
	onSubscriptionButtonClick,
}) => {
	const [sheetOpen, setSheetOpen] = useState(false);
	const [upsellUuid, setUpsellUuid] = useState<string>();
	const [redirectUrl, setRedirectUrl] = useState<string>();
	const deviceMeta = DeviceMeta();

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

	const onSubscribeClick = () => {
		const newUuid = paymentFlowAnalyticsService.purchaseFlowUuid;
		setRedirectUrl(window.location.pathname + window.location.hash);
		setUpsellUuid(newUuid);
		setSheetOpen(true);
	};

	const onSubscriptionButtonAction = () => {
		onSubscriptionButtonClick?.(isFreeTrial);
	};

	const onSheetClose = useCallback(() => {
		setSheetOpen(false);
	}, []);

	const actionText = isFreeTrial
		? translate("Action.TrialSubscription")
		: translate("Action.Subscribe");

	return subscriptionProductInfo ? (
		<React.Fragment>
			<button
				type="button"
				className="gap-y-medium flex flex-row justify-between padding-medium bg-shift-100 stroke-default stroke-thick radius-medium cursor-pointer text-body-medium margin-top-[12px]"
				onClick={onSubscribeClick}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onSubscribeClick();
					}
				}}
			>
				<div className="gap-x-small flex items-center">
					<Icon name="icon-regular-roblox-plus" size="Small" />
					<span>{bannerText}</span>
				</div>
				<span className="content-default underline">{actionText}</span>
			</button>
			{deviceMeta && (
				<RobloxSubscriptionSheet
					translate={translate}
					open={sheetOpen}
					onClose={onSheetClose}
					deviceMeta={deviceMeta}
					subscriptionProductInfo={subscriptionProductInfo}
					isFreeTrial={isFreeTrial}
					upsellUuid={upsellUuid}
					redirectUrl={redirectUrl}
					trackSubscriptionButtonClick={onSubscriptionButtonAction}
				/>
			)}
		</React.Fragment>
	) : null;
};

export default SubscriptionUpsellBanner;
