import paymentFlowAnalyticsService from "@rbx/core-scripts/payments-flow";
import { useTranslation } from "@rbx/core-scripts/react";
import { Icon, SheetBody, SheetContent, SheetTitle } from "@rbx/foundation-ui";
import { usePaymentSession } from "@rbx/payments/services/paymentSession";
import { translateHtml } from "@rbx/translation-utils";
import { useCallback, useEffect, useMemo, useRef } from "react";

import BenefitList from "./BenefitList";
import BillingInfoDisplay from "./BillingInfoDisplay";
import SubscriptionButton from "../shared/SubscriptionButton";

import type { SubscriptionProductInfo } from "@rbx/client-subscriptions-api/v1";
import type { DeviceMeta } from "@rbx/core-scripts/meta/device";

const SUBSCRIPTION_TERMS_URL = "https://www.roblox.com/info/terms";

export type RobloxSubscriptionSheetProps = {
	subscriptionProductInfo: SubscriptionProductInfo;
	deviceMeta: DeviceMeta;
	redirectUrl?: string;
	assetType: string;
	onSubscribeClick?: () => void;
	/** Fired only on mobile in-app subscribe click; see SubscriptionButton. */
	onMobilePurchaseInitiated?: () => void;
	/**
	 * Externally controlled loading state for the subscribe CTA. Used by the
	 * mobile in-app flow to keep the button in a spinner state while the parent
	 * polls for the new entitlement.
	 */
	isLoading?: boolean;
};

const RobloxSubscriptionSheet = ({
	subscriptionProductInfo,
	deviceMeta,
	redirectUrl,
	assetType,
	onSubscribeClick,
	onMobilePurchaseInitiated,
	isLoading,
}: RobloxSubscriptionSheetProps) => {
	const { translate } = useTranslation();
	const { id: paymentSessionId } = usePaymentSession() ?? {};

	const { type, id } = subscriptionProductInfo.productKey;
	const { periodType, localizedPrice, eligibleOffers } =
		subscriptionProductInfo;
	const featureConfig =
		subscriptionProductInfo.productTypeDetails.robloxSubscriptionProductDetails
			?.featureConfig;

	const freeTrialOffer = useMemo(
		() => eligibleOffers.find((o) => o.offerType === "FreeTrial"),
		[eligibleOffers],
	);
	const isFreeTrial = freeTrialOffer != null;

	const plusUpsellViewMessage = useMemo(
		() =>
			isFreeTrial
				? paymentFlowAnalyticsService.ENUM_VIEW_MESSAGE.ROBLOX_PLUS_FREE_TRIAL
				: paymentFlowAnalyticsService.ENUM_VIEW_MESSAGE.ROBLOX_PLUS_SUBSCRIBE,
		[isFreeTrial],
	);

	// Defer VIEW_SHOWN (and the upsell-flow start) until `usePaymentSession`
	// resolves so the event carries the same `paymentSessionId` as downstream
	// USER_INPUT events. Use a ref to guarantee fire-once.
	const hasFiredViewShown = useRef(false);
	useEffect(() => {
		if (hasFiredViewShown.current || !paymentSessionId) {
			return;
		}
		hasFiredViewShown.current = true;
		// startRobloxPlusUpsellFlow maps assetType -> the right WEB_*_PLUS_UPSELL
		// context and stores it on the singleton. sendUserPurchaseFlowEvent emits
		// that stored context on the wire (the trigger_context arg here is only a
		// fallback initializer used when no flow has started), so the literal we
		// pass below is essentially dead once the flow is started.
		paymentFlowAnalyticsService.startRobloxPlusUpsellFlow({ assetType });
		paymentFlowAnalyticsService.sendUserPurchaseFlowEvent(
			paymentFlowAnalyticsService.ENUM_TRIGGERING_CONTEXT
				.WEB_PRIVATE_SERVER_PLUS_UPSELL,
			false,
			paymentFlowAnalyticsService.ENUM_VIEW_NAME.ROBLOX_PLUS_UPSELL_BANNER,
			paymentFlowAnalyticsService.ENUM_PURCHASE_EVENT_TYPE.VIEW_SHOWN,
			plusUpsellViewMessage,
			paymentSessionId ? { paymentSessionId } : {},
		);
	}, [paymentSessionId, assetType, plusUpsellViewMessage]);

	const sendEventAndTrackingOnClick = useCallback(() => {
		paymentFlowAnalyticsService.sendUserPurchaseFlowEvent(
			paymentFlowAnalyticsService.ENUM_TRIGGERING_CONTEXT
				.WEB_PRIVATE_SERVER_PLUS_UPSELL,
			false,
			paymentFlowAnalyticsService.ENUM_VIEW_NAME.ROBLOX_PLUS_UPSELL_BANNER,
			paymentFlowAnalyticsService.ENUM_PURCHASE_EVENT_TYPE.USER_INPUT,
			plusUpsellViewMessage,
			paymentSessionId ? { paymentSessionId } : {},
		);
		onSubscribeClick?.();
	}, [plusUpsellViewMessage, onSubscribeClick, paymentSessionId]);

	const legalKey = isFreeTrial
		? "Description.SubscriptionFreeTrialLegal"
		: "Description.SubscriptionLegal";

	const trialEndDate = useMemo(() => {
		const endDate = freeTrialOffer?.freeTrialOffer?.estimatedTrialEndDate;
		if (!endDate) return "";
		return new Date(endDate).toLocaleDateString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}, [freeTrialOffer]);

	const termsLink = [
		{
			opening: "linkStart",
			closing: "linkEnd",
			render: (children: React.ReactNode) => (
				<a
					className="underline"
					href={SUBSCRIPTION_TERMS_URL}
					rel="noopener noreferrer"
					target="_blank"
				>
					{children}
				</a>
			),
		},
	];

	return (
		<SheetContent
			centerSheetSize="Medium"
			closeLabel={translate("Action.Close")}
			largeScreenVariant="center"
		>
			<SheetTitle>
				<div className="gap-x-small flex items-center">
					<Icon className="size-1000" name="icon-regular-roblox-plus" />
					{translate("Title.GetBlackbird")}
				</div>
			</SheetTitle>
			<SheetBody>
				<div className="padding-large gap-y-xlarge flex flex-col">
					<BillingInfoDisplay
						eligibleOffers={eligibleOffers}
						periodType={periodType}
						price={localizedPrice}
					/>

					{featureConfig && (
						<BenefitList
							featureConfig={{
								...featureConfig,
								isTradingEnabled: false,
								isUgcPublishingEnabled: false,
							}}
							periodType={periodType}
						/>
					)}

					<SubscriptionButton
						deviceMeta={deviceMeta}
						isLoading={isLoading}
						paymentSessionId={paymentSessionId}
						productId={id}
						productType={type}
						redirectUrl={redirectUrl}
						trackSubscriptionButtonClick={sendEventAndTrackingOnClick}
						onMobilePurchaseInitiated={onMobilePurchaseInitiated}
					>
						{isFreeTrial
							? translate("Action.TryItForFree")
							: translate("Action.Subscribe")}
					</SubscriptionButton>

					<span className="text-caption-medium content-muted">
						{translateHtml(
							translate,
							legalKey,
							termsLink,
							isFreeTrial ? { date: trialEndDate } : undefined,
						)}
					</span>
				</div>
			</SheetBody>
		</SheetContent>
	);
};

export default RobloxSubscriptionSheet;
