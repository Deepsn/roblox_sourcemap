import React, { useCallback, useState } from "react";
import { TranslateFunction } from "react-utilities";
import { Icon } from "@rbx/foundation-ui";
import type {
	SubscriptionProductInfo,
	SubscriptionOffer,
} from "@rbx/client-subscriptions-api/v1";
import { DeviceMeta } from "Roblox";
import RobloxSubscriptionSheet from "./RobloxSubscriptionSheet";

type SubscriptionUpsellBannerProps = {
	translate: TranslateFunction;
	subscriptionProductInfo: SubscriptionProductInfo | null;
};

const SubscriptionUpsellBanner: React.FC<SubscriptionUpsellBannerProps> = ({
	translate,
	subscriptionProductInfo,
}) => {
	const [sheetOpen, setSheetOpen] = useState(false);
	const deviceMeta = DeviceMeta();

	const onSubscribeClick = useCallback(() => {
		setSheetOpen(true);
	}, []);

	const onSheetClose = useCallback(() => {
		setSheetOpen(false);
	}, []);

	const bannerText = translate("Description.ExclusiveBenefits", {
		product: translate("Label.Blackbird"),
	});

	const isFreeTrial =
		subscriptionProductInfo?.eligibleOffers?.some(
			(o: SubscriptionOffer) => o.offerType === "FreeTrial",
		) ?? false;

	const actionText = isFreeTrial
		? translate("Feature.RobloxSubscription.Action.TrialSubscription")
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
					<Icon name="icon-regular-paper-airplane" size="Small" />
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
				/>
			)}
		</React.Fragment>
	) : null;
};

export default SubscriptionUpsellBanner;
