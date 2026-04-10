import React, { useMemo } from "react";
import { TranslateFunction } from "react-utilities";
import { Icon } from "@rbx/foundation-ui";
import type {
	PeriodType,
	RobloxSubscriptionProductFeatureConfig,
	SubscriptionTenureDiscount,
} from "@rbx/client-subscriptions-api/v1";
import type { TTailwindIconClass } from "@rbx/foundation-tailwind/classes";

type BenefitItemProps = {
	iconName: TTailwindIconClass;
	label: React.ReactNode;
};

const BenefitItem: React.FC<BenefitItemProps> = ({ iconName, label }) => (
	<div className="gap-x-large align-items-center flex flex-row">
		<Icon name={iconName} size="Large" />
		<span className="text-body-large">{label}</span>
	</div>
);

export type BenefitListProps = {
	translate: TranslateFunction;
	featureConfig: RobloxSubscriptionProductFeatureConfig;
	periodType: PeriodType;
};

const formatPercent = (value: number): string =>
	new Intl.NumberFormat(undefined, { style: "percent" }).format(value);

const BenefitList: React.FC<BenefitListProps> = ({
	translate,
	featureConfig,
	periodType,
}) => {
	const baseDiscount = useMemo(
		() =>
			featureConfig.virtualTransactionDiscounts?.find(
				(d: SubscriptionTenureDiscount) => d.periodIndex === 0,
			),
		[featureConfig],
	);

	const nextDiscount = useMemo(
		() =>
			featureConfig.virtualTransactionDiscounts
				?.filter((d: SubscriptionTenureDiscount) => d.periodIndex > 0)
				.reduce<SubscriptionTenureDiscount | null>(
					(
						min: SubscriptionTenureDiscount | null,
						d: SubscriptionTenureDiscount,
					) => (min === null || d.periodIndex < min.periodIndex ? d : min),
					null,
				),
		[featureConfig],
	);

	return (
		<div className="gap-y-xlarge flex flex-col">
			{baseDiscount && (
				<BenefitItem
					iconName="icon-regular-tag-sparkle"
					label={translate("Description.Benefit.DiscountBase", {
						discountPercent: formatPercent(baseDiscount.discountPercent * 0.01),
					})}
				/>
			)}
			{nextDiscount && (
				<BenefitItem
					iconName="icon-regular-calendar-star"
					label={translate("Description.Benefit.DiscountNext", {
						productName: translate("Label.Blackbird"),
						discountPercent: formatPercent(nextDiscount.discountPercent * 0.01),
						discountPeriodCount: String(nextDiscount.periodIndex),
						discountPeriodUnit: periodType,
					})}
				/>
			)}
			{featureConfig.isRobuxTransferEnabled && (
				<BenefitItem
					iconName="icon-regular-robux"
					label={translate("Description.Benefit.RobuxTransfers")}
				/>
			)}
			{featureConfig.isTradingEnabled && (
				<BenefitItem
					iconName="icon-regular-hand-two-arrows-horizontal"
					label={translate("Description.Benefit.TradeResellItems")}
				/>
			)}
			{featureConfig.isUgcPublishingEnabled && (
				<BenefitItem
					iconName="icon-regular-arrow-up-from-landscape-rectangle"
					label={translate("Description.Benefit.PublishItems")}
				/>
			)}
		</div>
	);
};

export default BenefitList;
