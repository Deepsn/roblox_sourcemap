import React from "react";
import { Intl } from "Roblox";
import { Notification } from "@rbx/foundation-ui";
import { TestNotificationData } from "../../notificationStreamCards/test/types";
import { spacerTitle } from "./spacerTitle";

export type TestShellCardProps = {
	notificationData: TestNotificationData;
};

export const TestShellCard = ({
	notificationData,
}: TestShellCardProps): JSX.Element => {
	const detail = (notificationData.metadataCollection ?? [])
		.map((m) => m.Detail)
		.join("");
	const timestamp = notificationData.eventDate
		? new Intl()
				.getDateTimeFormatter()
				.getFullDate(new Date(notificationData.eventDate))
		: undefined;

	return (
		<Notification
			// Override the navbar <li>'s inherited text-align:center (Navigation.css).
			style={{ textAlign: "left" }}
			title={spacerTitle}
			description={detail}
			timestamp={timestamp}
			hasStatusIndicator={!notificationData.isInteracted}
		/>
	);
};

export default TestShellCard;
