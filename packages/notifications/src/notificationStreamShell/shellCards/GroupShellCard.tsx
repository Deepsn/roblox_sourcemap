import React from "react";
import { Intl } from "Roblox";
import { Notification } from "@rbx/foundation-ui";
import {
	Thumbnail2d,
	ThumbnailTypes,
	ThumbnailFormat,
	DefaultThumbnailSize,
} from "roblox-thumbnails";
import { useNotificationLocalization } from "../../sendrNotificationStream/context/NotificationsLocalization";
import {
	buildGroupMembershipDescription,
	groupHref,
} from "../../notificationStreamCards/groupMembership/groupMembershipDescription";
import { GroupMembershipNotificationData } from "../../notificationStreamCards/groupMembership/types";
import { spacerTitle } from "./spacerTitle";

export type GroupShellCardProps = {
	notificationData: GroupMembershipNotificationData;
};

export const GroupShellCard = ({
	notificationData,
}: GroupShellCardProps): JSX.Element => {
	const translate = useNotificationLocalization();
	const firstGroup = notificationData.metadataCollection?.[0];

	const timestamp = notificationData.eventDate
		? new Intl()
				.getDateTimeFormatter()
				.getFullDate(new Date(notificationData.eventDate))
		: undefined;

	const media = firstGroup ? (
		// 48px box; the thumbnail container has no intrinsic size outside the legacy container.
		<a
			href={groupHref(firstGroup.AccepterGroupId)}
			onClick={(e) => e.stopPropagation()}
			style={{
				position: "relative",
				display: "block",
				width: 48,
				height: 48,
				flexShrink: 0,
			}}
		>
			<Thumbnail2d
				type={ThumbnailTypes.groupIcon}
				size={DefaultThumbnailSize}
				format={ThumbnailFormat.webp}
				targetId={firstGroup.AccepterGroupId}
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
			description={buildGroupMembershipDescription(translate, notificationData)}
			timestamp={timestamp}
			hasStatusIndicator={!notificationData.isInteracted}
		/>
	);
};

export default GroupShellCard;
