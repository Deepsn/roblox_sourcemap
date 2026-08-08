/* eslint-disable no-void */
import { useCallback, useContext } from "react";
import { useTranslation } from "@rbx/core-scripts/react";
import { translateHtml } from "@rbx/translation-utils";
import {
	Product,
	type Section as RobuxPageSection,
} from "../../types/buyRobuxPageData";
import {
	BaseSectionProps,
	Section,
	SectionBody,
	SectionHeader,
	SectionSubHeader,
} from "../sections/Section";
import { SectionBodyProductList } from "../sections/SectionBodyProductList";
import {
	PurchaseContext,
	BuyRobuxPageSectionType,
} from "../../contexts/PurchaseContext";
import { getSectionTrackingProps } from "../../hooks/useScrollTracking";

type ProductListProps = BaseSectionProps & {
	sectionBase: RobuxPageSection;
};

export function ProductList({ isPrimary, sectionBase }: ProductListProps) {
	const { purchaseNonRedirectProduct } = useContext(PurchaseContext);

	const { translate } = useTranslation();
	const bodyTranslationKey = sectionBase.productsList?.bodyTranslationKey;

	const clickHandler = useCallback(
		(product: Product) => {
			void purchaseNonRedirectProduct(
				product,
				false,
				false,
				BuyRobuxPageSectionType.ProductsList,
			);
		},
		[purchaseNonRedirectProduct],
	);

	return (
		<Section {...getSectionTrackingProps(sectionBase)}>
			<SectionHeader>
				{translate(sectionBase.sectionHeaderTranslationKey)}
			</SectionHeader>
			{bodyTranslationKey && (
				<SectionSubHeader className="text-body-small">
					{/* This span is needed here as a wrapper because SectionSubHeader uses flex related styles which affects the spacing around <a/> tag in the below translation */}
					<span>
						{translateHtml(translate, bodyTranslationKey, [
							{
								opening: "termsLinkStart",
								closing: "termsLinkEnd",
								render: (children) => (
									<a href="/info/terms" className="text-link" target="_blank">
										{children}
									</a>
								),
							},
						])}
					</span>
				</SectionSubHeader>
			)}
			<SectionBody isPrimary={isPrimary}>
				<SectionBodyProductList
					onProductClick={clickHandler}
					products={sectionBase.products ?? []}
				/>
			</SectionBody>
		</Section>
	);
}
