import React from "react";
import { Intl, EnvironmentUrls } from "Roblox";
import { Notification } from "@rbx/foundation-ui";
import {
	Thumbnail2d,
	ThumbnailTypes,
	ThumbnailFormat,
	DefaultThumbnailSize,
} from "roblox-thumbnails";
import { useNotificationLocalization } from "../../sendrNotificationStream/context/NotificationsLocalization";
import { buildPrivateMessageDescription } from "../../notificationStreamCards/privateMessage/privateMessageDescription";
import { PrivateMessageNotificationData } from "../../notificationStreamCards/privateMessage/types";
import { spacerTitle } from "./spacerTitle";

const { websiteUrl } = EnvironmentUrls;

export type PrivateMessageShellCardProps = {
	notificationData: PrivateMessageNotificationData;
};

export const PrivateMessageShellCard = ({
	notificationData,
}: PrivateMessageShellCardProps): JSX.Element => {
	const translate = useNotificationLocalization();
	const author = notificationData.metadataCollection?.[0];

	const timestamp = notificationData.eventDate
		? new Intl()
				.getDateTimeFormatter()
				.getFullDate(new Date(notificationData.eventDate))
		: undefined;

	const media = author ? (
		<a
			href={`${websiteUrl}/users/${author.AuthorUserId}/profile`}
			onClick={(e) => e.stopPropagation()}
			style={{
				display: "block",
				width: 48,
				height: 48,
				borderRadius: "50%",
				overflow: "hidden",
			}}
		>
			<Thumbnail2d
				type={ThumbnailTypes.avatarHeadshot}
				size={DefaultThumbnailSize}
				format={ThumbnailFormat.webp}
				targetId={author.AuthorUserId}
				containerClass="notification-icon"
			/>
		</a>
	) : undefined;

	return (
		<Notification
			// Override the navbar <li>'s inherited text-align:center (Navigation.css).
			style={{ textAlign: "left" }}
			media={media}
			title={spacerTitle}
			description={buildPrivateMessageDescription(translate, notificationData)}
			timestamp={timestamp}
			hasStatusIndicator={!notificationData.isInteracted}
		/>
	);
};

export default PrivateMessageShellCard;
