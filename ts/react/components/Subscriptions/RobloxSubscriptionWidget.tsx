import React from "react";
import { TranslateFunction } from "react-utilities";
import type { SubscriptionProductInfo } from "@rbx/client-subscriptions-api/v1";
import { DeviceMeta } from "Roblox";
import BlackbirdHeading from "./BlackbirdHeading";
import BillingInfoDisplay from "./BillingInfoDisplay";
import BenefitList from "./BenefitList";
import SubscriptionButton from "./SubscriptionButton";

type RobloxSubscriptionWidgetProps = {
	translate: TranslateFunction;
	subscriptionProductInfo: SubscriptionProductInfo;
	deviceMeta: ReturnType<typeof DeviceMeta>;
	isDisabled?: boolean;
};

const RobloxSubscriptionWidget: React.FC<RobloxSubscriptionWidgetProps> = ({
	translate,
	subscriptionProductInfo,
	deviceMeta,
	isDisabled = false,
}) => {
	const { type, id } = subscriptionProductInfo.productKey;
	const { periodType, localizedPrice, eligibleOffers } =
		subscriptionProductInfo;
	const featureConfig =
		subscriptionProductInfo.productTypeDetails.robloxSubscriptionProductDetails
			?.featureConfig;

	return (
		<div className="padding-large gap-y-xlarge bg-surface-100 radius-medium stroke-standard stroke-default flex flex-col">
			<BlackbirdHeading translate={translate} size="small" />
			<BillingInfoDisplay
				translate={translate}
				eligibleOffers={eligibleOffers}
				periodType={periodType}
				price={localizedPrice}
			/>
			{featureConfig && (
				<BenefitList
					translate={translate}
					featureConfig={featureConfig}
					periodType={periodType}
				/>
			)}
			<SubscriptionButton
				deviceMeta={deviceMeta}
				isDisabled={isDisabled}
				productId={id}
				productType={type}
			>
				{translate("Action.Subscribe")}
			</SubscriptionButton>
		</div>
	);
};

export default RobloxSubscriptionWidget;
