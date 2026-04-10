import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@rbx/foundation-ui";
import { DeviceMeta } from "Roblox";

type SubscriptionButtonProps = {
	productType: string;
	productId: string;
	deviceMeta: ReturnType<typeof DeviceMeta>;
	isDisabled?: boolean;
	children: React.ReactNode;
};

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
	productType,
	productId,
	deviceMeta,
	isDisabled = false,
	children,
}) => {
	const [isLoading, setIsLoading] = useState(false);

	const onClick = useCallback(() => {
		if (!isDisabled) {
			setIsLoading(true);
		}
	}, [isDisabled]);

	const purchaseUrl = useMemo(() => {
		if (deviceMeta.isDesktop) {
			const url = new URL("/upgrades/paymentmethods", window.location.origin);
			url.searchParams.append("ctx", "subscription");
			url.searchParams.append("type", productType);
			url.searchParams.append("id", productId);
			return url.toString();
		}

		if (deviceMeta.isAndroidApp || deviceMeta.isIosApp) {
			const url = new URL("/mobile-app-upgrades/buy", window.location.origin);
			url.searchParams.append("ctx", "subscription");
			url.searchParams.append("type", productType);
			url.searchParams.append("id", productId);
			return url.toString();
		}

		return undefined;
	}, [
		deviceMeta.isDesktop,
		deviceMeta.isAndroidApp,
		deviceMeta.isIosApp,
		productType,
		productId,
	]);

	return (
		<Button
			as="a"
			href={purchaseUrl}
			isDisabled={isDisabled || !purchaseUrl}
			isLoading={isLoading}
			variant="Emphasis"
			onClick={onClick}
		>
			{children}
		</Button>
	);
};

export default SubscriptionButton;
