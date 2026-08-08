import React, { useContext, useMemo } from "react";
import { useTranslation } from "@rbx/core-scripts/react";
import { SectionBase, SectionRedirect } from "../../types/buyRobuxPageData";
import {
	BaseSectionProps,
	Section,
	SectionBody,
	SectionHeader,
	SectionSubHeader,
} from "../sections/Section";
import { SectionBodyProductList } from "../sections/SectionBodyProductList";
import { ProductItemDefaultProps } from "../ProductItem/ProductItemDefault";
import { BuyRobuxPageContext } from "../../contexts/BuyRobuxPageContext";
import {
	BuyRobuxPageSectionType,
	PurchaseContext,
} from "../../contexts/PurchaseContext";
import { withRedirectProductItem } from "../ProductItem/WithRedirectProductItem";
import { getSectionTrackingProps } from "../../hooks/useScrollTracking";

type ProductListProps = BaseSectionProps & {
	sectionBase: SectionBase;
	ProductItemComponent?: React.ComponentType<ProductItemDefaultProps>;
	redirectOptions: SectionRedirect;
};

// TODO: we don't need this separate RedirectProductList section and instead this can be combined with the ProductList section
export function RedirectProductList({
	isPrimary,
	sectionBase,
	redirectOptions,
}: ProductListProps) {
	const { translate } = useTranslation();
	const { purchaseProduct } = useContext(PurchaseContext);
	const { redirect } = useContext(BuyRobuxPageContext);

	const handleProductClick: ProductItemDefaultProps["onProductClick"] = (
		product,
		event,
	) => {
		purchaseProduct({
			product,
			event,
			isRedirect: true,
			isSubscription: false,
			isBonus: false,
			sectionType: BuyRobuxPageSectionType.RedirectProductList,
		});
	};

	const ProductItemComponent = useMemo(
		() => withRedirectProductItem(redirect?.url ?? ""),
		[redirect?.url],
	);

	return (
		<Section {...getSectionTrackingProps(sectionBase)}>
			<div>
				<SectionHeader>
					{translate(redirectOptions.titleTranslationKey)}
				</SectionHeader>
				{redirectOptions.bodyTranslationKey && (
					<SectionSubHeader>
						{translate(redirectOptions.bodyTranslationKey)}
					</SectionSubHeader>
				)}
			</div>
			<SectionBody isPrimary={isPrimary}>
				<SectionBodyProductList
					onProductClick={handleProductClick}
					products={sectionBase.products ?? []}
					OverrideProductItemComponent={ProductItemComponent}
				/>
			</SectionBody>
		</Section>
	);
}
