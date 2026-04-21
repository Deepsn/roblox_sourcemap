import React, { useState } from "react";
import clsx from "clsx";
import { TranslateFunction } from "react-utilities";
import {
	Accordion,
	AccordionItem,
	AccordionItemContent,
	AccordionItemTrigger,
	Icon,
} from "@rbx/foundation-ui";
import { numberFormat } from "core-utilities";
import { translateHtml } from "@rbx/translation-utils";
import type { TranslateHtmlTag } from "@rbx/translation-utils";
import type { DiscountInformation } from "./UnifiedPurchaseModal";

export type DiscountPriceDetailProps = {
	translate: TranslateFunction;
	discountInformation: DiscountInformation;
};

type DiscountEntry = {
	discountAmount?: number;
	discountPercentage?: number;
	discountCampaign?: string;
	localizedDiscountAttribution?: string;
};

type TypedDiscountInformation = {
	totalDiscountAmount?: number;
	originalPrice?: number;
	discounts?: DiscountEntry[];
};

const RobuxAmount: React.FC<{ amount: number }> = ({ amount }) => {
	const isNegative = amount < 0;
	const absAmount = Math.abs(amount);
	const minusSign = "-";
	return (
		<React.Fragment>
			{isNegative && <span className="text-robux">{minusSign}</span>}
			<span className="icon-robux-16x16" />
			<span className="text-robux">
				{numberFormat.getNumberFormat(absAmount)}
			</span>
		</React.Fragment>
	);
};

const DiscountPriceDetail: React.FC<DiscountPriceDetailProps> = ({
	translate,
	discountInformation,
}) => {
	const {
		totalDiscountAmount,
		originalPrice: rawOriginalPrice,
		discounts,
	} = discountInformation as TypedDiscountInformation;

	const savedAmount: number = totalDiscountAmount ?? 0;
	const originalPrice: number = rawOriginalPrice ?? 0;
	const totalPrice = originalPrice - savedAmount;
	const [isOpen, setIsOpen] = useState(false);

	const isPlusBenefitDiscount = !!discounts?.some(
		(d) => d.discountCampaign === "BlackbirdSubscription",
	);

	const renderSavingsAmount = () => <RobuxAmount amount={savedAmount} />;
	const savingsTags: TranslateHtmlTag[] = [
		{
			opening: "amountStart",
			closing: "amountEnd",
			render: renderSavingsAmount,
		},
	];

	return (
		<Accordion className="text-body-medium padding-none stroke-default stroke-thick radius-medium">
			<AccordionItem isOpen={isOpen} onOpenChange={setIsOpen}>
				<AccordionItemTrigger
					className={clsx(
						"!padding-medium bg-shift-100 width-full flex flex-row items-center justify-between",
						isOpen &&
							"[border-bottom-left-radius:0] [border-bottom-right-radius:0]",
					)}
				>
					<div className="flex flex-row items-center gap-x-small content-emphasis">
						{isPlusBenefitDiscount && (
							<Icon name="icon-regular-roblox-plus" size="Medium" />
						)}
						<span>
							{isPlusBenefitDiscount
								? translateHtml(
										translate,
										"Description.SavingWithPlus",
										savingsTags,
										{
											robuxAmount: numberFormat.getNumberFormat(savedAmount),
										},
									)
								: translate("Description.SavingRobux", {
										robuxAmount: numberFormat.getNumberFormat(savedAmount),
									})}
						</span>
					</div>
				</AccordionItemTrigger>
				<AccordionItemContent className="!padding-none">
					<div
						className="padding-medium padding-bottom-small flex flex-col gap-y-small bg-shift-100 stroke-default stroke-thick"
						style={{ borderTop: "0px", borderLeft: "0px", borderRight: "0px" }}
					>
						<div className="flex flex-row items-center justify-between content-default">
							<span>{translate("Label.Subtotal")}</span>
							<span className="flex flex-row items-center">
								<RobuxAmount amount={originalPrice} />
							</span>
						</div>
						{discounts?.map((discount) => (
							<div
								key={discount.discountCampaign}
								className="flex flex-row items-center justify-between content-default"
							>
								<span>{discount.localizedDiscountAttribution}</span>
								<span className="flex flex-row items-center">
									<RobuxAmount amount={-(discount.discountAmount ?? 0)} />
								</span>
							</div>
						))}
					</div>
					{/* bottom table: total row */}
					<div className="padding-medium flex flex-row items-center justify-between text-heading-small content-default bg-shift-100">
						<span>{translate("Label.Total")}</span>
						<span className="flex flex-row items-center">
							<RobuxAmount amount={totalPrice} />
						</span>
					</div>
				</AccordionItemContent>
			</AccordionItem>
		</Accordion>
	);
};

export default DiscountPriceDetail;
