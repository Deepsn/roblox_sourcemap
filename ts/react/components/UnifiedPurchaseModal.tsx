import React, { useCallback } from "react";
import { withTranslations, TranslateFunction } from "react-utilities";
import {
	Button,
	Dialog,
	DialogBody,
	DialogContent,
	DialogFooter,
} from "@rbx/foundation-ui";
import type { SubscriptionProductInfo } from "@rbx/client-subscriptions-api/v1";
import { paymentFlowAnalyticsService } from "core-roblox-utilities";
import translationConfig from "../../../js/react/itemPurchase/translation.config";
import SubscriptionUpsellBanner from "./Subscriptions/SubscriptionUpsellBanner";
import UnifiedProductDetails from "./UnifiedProductDetails";
import UnifiedPurchaseHeading from "./UnifiedPurchaseHeading";
import useModalShownTracking from "../hooks/useModalShownTracking";
import DiscountPriceDetail from "./DiscountPriceDetail";
import isPlusBenefitDiscount from "../utils/isPlusBenefitDiscount";

export type DiscountInformation = {
	originalPrice?: number;
	totalDiscountAmount?: number;
	totalDiscountPercentage?: number;
	discounts?: Array<{
		discountAmount?: number;
		discountPercentage?: number;
		discountCampaign?: string;
		localizedDiscountAttribution?: string;
	}>;
};

export type UnifiedPurchaseModalProps = {
	translate: TranslateFunction;
	expectedPrice: number;
	displayPrice?: string;
	thumbnail: React.ReactNode;
	assetName: string;
	assetType: string;
	assetTypeDisplayName?: string;
	sellerName: string;
	onAction: () => void;
	onSecondaryAction?: () => void;
	secondaryActionButtonText?: string;
	footerDisclaimerText?: React.ReactNode;
	priceSuffix?: string;
	onCancel?: () => void;
	loading?: boolean;
	currentRobuxBalance?: number;
	rentalOptionDays?: number | null;
	open?: boolean;
	titleText: string;
	actionButtonText: string;
	subscriptionProductInfo?: SubscriptionProductInfo;
	discountInformation?: DiscountInformation | null;
};

const UnifiedPurchaseModalComponent: React.FC<UnifiedPurchaseModalProps> = ({
	translate,
	titleText,
	actionButtonText,
	expectedPrice,
	displayPrice,
	thumbnail,
	assetName,
	assetType,
	assetTypeDisplayName,
	sellerName,
	onAction,
	onSecondaryAction,
	secondaryActionButtonText,
	footerDisclaimerText,
	priceSuffix,
	onCancel,
	loading = false,
	currentRobuxBalance,
	rentalOptionDays = null,
	open = false,
	subscriptionProductInfo,
	discountInformation,
}) => {
	const sendAnalyticsEvent = (isFreeTrial: boolean) => {
		paymentFlowAnalyticsService.startRobloxPlusUpsellFlow({
			assetType,
			isReseller: false,
			isPrivateServer: false,
			isPlace: false,
		});

		const viewMessage = isFreeTrial
			? paymentFlowAnalyticsService.ENUM_VIEW_MESSAGE.ROBLOX_PLUS_FREE_TRIAL
			: paymentFlowAnalyticsService.ENUM_VIEW_MESSAGE.ROBLOX_PLUS_SUBSCRIBE;
		paymentFlowAnalyticsService.sendUserPurchaseFlowEvent(
			paymentFlowAnalyticsService.ENUM_TRIGGERING_CONTEXT
				.WEB_CATALOG_SINGLE_ITEM_PLUS_UPSELL,
			false,
			paymentFlowAnalyticsService.ENUM_VIEW_NAME.ROBLOX_PLUS_UPSELL_BANNER,
			paymentFlowAnalyticsService.ENUM_PURCHASE_EVENT_TYPE.USER_INPUT,
			viewMessage,
		);
	};

	useModalShownTracking("UnifiedPurchaseModal", open);
	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen: boolean) => {
				if (!nextOpen && onCancel) {
					onCancel();
				}
			}}
			isModal
			size="Large"
			type="Default"
			closeLabel={translate("Action.Close") || "Close"}
			hasCloseAffordance
		>
			<DialogContent className="relative unified-purchase-dialog-content">
				<DialogBody className="gap-xlarge flex flex-col">
					<div style={{ marginTop: 2 }}>
						<UnifiedPurchaseHeading
							translate={translate}
							titleText={titleText}
							currentRobuxBalance={
								displayPrice ? undefined : currentRobuxBalance
							}
						/>
					</div>
					<UnifiedProductDetails
						translate={translate}
						thumbnail={thumbnail}
						assetName={assetName}
						expectedPrice={expectedPrice}
						displayPrice={displayPrice}
						priceSuffix={priceSuffix}
						rentalOptionDays={rentalOptionDays}
						discountInformation={discountInformation}
					/>
					{discountInformation && (
						<DiscountPriceDetail
							translate={translate}
							discountInformation={discountInformation}
						/>
					)}
				</DialogBody>

				<DialogFooter className="flex flex-col mt-[40px]">
					<div className="gap-small flex flex-col">
						<div className="flex flex-row-reverse">
							<Button
								variant="Emphasis"
								className="fill basis-0"
								onClick={onAction}
								isDisabled={loading}
								data-testid="purchase-confirm-button"
							>
								{actionButtonText}
							</Button>
						</div>
						{onSecondaryAction && secondaryActionButtonText && (
							<div className="flex flex-row-reverse">
								<Button
									variant="Standard"
									className="fill basis-0"
									onClick={onSecondaryAction}
									isDisabled={loading}
									data-testid="purchase-secondary-button"
								>
									{secondaryActionButtonText}
								</Button>
							</div>
						)}
					</div>
					{!isPlusBenefitDiscount(discountInformation) && (
						<SubscriptionUpsellBanner
							translate={translate}
							subscriptionProductInfo={subscriptionProductInfo}
							onSubscriptionButtonClick={sendAnalyticsEvent}
						/>
					)}
					{footerDisclaimerText && (
						<p
							className="text-body-small content-default"
							style={{ marginTop: 12 }}
						>
							{footerDisclaimerText}
						</p>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default withTranslations(
	UnifiedPurchaseModalComponent,
	translationConfig.purchasingResources,
);
