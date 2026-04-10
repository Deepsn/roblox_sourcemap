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
import RobloxSubscriptionWidget from "./RobloxSubscriptionWidget";

type RobloxSubscriptionSheetProps = {
	translate: TranslateFunction;
	subscriptionProductInfo: SubscriptionProductInfo;
	deviceMeta: ReturnType<typeof DeviceMeta>;
	open: boolean;
	onClose: () => void;
	isDisabled?: boolean;
};

const RobloxSubscriptionSheet: React.FC<RobloxSubscriptionSheetProps> = ({
	translate,
	subscriptionProductInfo,
	deviceMeta,
	open,
	onClose,
	isDisabled = false,
}) => (
	<SheetRoot
		open={open}
		onOpenChange={(nextOpen: boolean) => {
			if (!nextOpen) onClose();
		}}
	>
		<SheetContent
			centerSheetSize="Medium"
			largeScreenVariant="center"
			closeLabel={translate("Action.Close") || "Close"}
		>
			<SheetTitle>{translate("Label.Blackbird")}</SheetTitle>
			<SheetBody>
				<RobloxSubscriptionWidget
					translate={translate}
					deviceMeta={deviceMeta}
					isDisabled={isDisabled}
					subscriptionProductInfo={subscriptionProductInfo}
				/>
			</SheetBody>
		</SheetContent>
	</SheetRoot>
);

export default RobloxSubscriptionSheet;
