import React from "react";
import { TranslateFunction } from "react-utilities";
import {
	SheetRoot,
	SheetContent,
	SheetTitle,
	SheetBody,
} from "@rbx/foundation-ui";
import type { SubscriptionProductInfo } from "@rbx/client-subscriptions-api/v1";
import { DeviceMeta } from "Roblox";
import BlackbirdHeading from "./BlackbirdHeading";
import BillingInfoDisplay from "./BillingInfoDisplay";
import BenefitList from "./BenefitList";
import SubscriptionButton from "./SubscriptionButton";

type RobloxSubscriptionSheetProps = {
	translate: TranslateFunction;
	subscriptionProductInfo: SubscriptionProductInfo;
	isFreeTrial: boolean;
	deviceMeta: ReturnType<typeof DeviceMeta>;
	open: boolean;
	onClose: () => void;
	isDisabled?: boolean;
	upsellUuid?: string;
	redirectUrl?: string;
	trackSubscriptionButtonClick?: () => void;
};

const RobloxSubscriptionSheet: React.FC<RobloxSubscriptionSheetProps> = ({
	translate,
	subscriptionProductInfo,
	isFreeTrial,
	deviceMeta,
	open,
	onClose,
	isDisabled = false,
	upsellUuid,
	redirectUrl,
	trackSubscriptionButtonClick,
}) => {
	const { type, id } = subscriptionProductInfo.productKey;
	const { periodType, localizedPrice, eligibleOffers } =
		subscriptionProductInfo;
	const featureConfig =
		subscriptionProductInfo.productTypeDetails.robloxSubscriptionProductDetails
			?.featureConfig;

	return (
		<SheetRoot
			open={open}
			onOpenChange={(nextOpen: boolean) => {
				if (!nextOpen) onClose();
			}}
		>
			<SheetContent
				centerSheetSize="Medium"
				largeScreenVariant="center"
				closeLabel={translate("Action.Close")}
			>
				<SheetTitle>{translate("Label.Blackbird")}</SheetTitle>
				<SheetBody>
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
							upsellUuid={upsellUuid}
							redirectUrl={redirectUrl}
							trackSubscriptionButtonClick={trackSubscriptionButtonClick}
						>
							{translate(
								isFreeTrial ? "Action.TryItForFree" : "Action.Subscribe",
							)}
						</SubscriptionButton>
					</div>
				</SheetBody>
			</SheetContent>
		</SheetRoot>
	);
};

export default RobloxSubscriptionSheet;
