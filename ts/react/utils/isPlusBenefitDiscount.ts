import type { DiscountInformation } from "../components/UnifiedPurchaseModal";

const PLUS_BENEFIT_DISCOUNT_CAMPAIGN = "BlackbirdSubscription";

export default function isPlusBenefitDiscount(
	discountInformation?: DiscountInformation | null,
): boolean {
	return !!discountInformation?.discounts?.some(
		(d) => d.discountCampaign === PLUS_BENEFIT_DISCOUNT_CAMPAIGN,
	);
}
