import React from "react";
import { EnvironmentUrls } from "Roblox";
import GroupShellCard from "./shellCards/GroupShellCard";
import PrivateMessageShellCard from "./shellCards/PrivateMessageShellCard";
import TestShellCard from "./shellCards/TestShellCard";
import SendrNotification from "../sendrNotificationStream/components/SendrNotification";
import { GroupMembershipNotificationData } from "../notificationStreamCards/groupMembership/types";
import { PrivateMessageNotificationData } from "../notificationStreamCards/privateMessage/types";
import { TestNotificationData } from "../notificationStreamCards/test/types";
import { NotificationData } from "../sendrNotificationStream/types/NotificationTemplateTypes";
import { StreamNotification } from "../notificationStreamData";

const { websiteUrl } = EnvironmentUrls;

const isStacked = (n: StreamNotification): boolean => {
	const meta = n.metadataCollection ?? [];
	return (n.eventCount ?? meta.length) > 1 || meta.length === 0;
};

export const getNotificationHref = (n: StreamNotification): string | null => {
	const meta = (n.metadataCollection ?? []) as Array<Record<string, unknown>>;
	switch (n.notificationSourceType) {
		case "GroupJoinRequestAccepted":
			return isStacked(n)
				? `${websiteUrl}/my/communities`
				: `${websiteUrl}/communities/${String(meta[0]?.AccepterGroupId ?? "")}`;
		case "PrivateMessageReceived":
			return `${websiteUrl}/my/messages/#!/inbox`;
		default:
			return null;
	}
};

export type NotificationStreamCardRouterProps = {
	notification: StreamNotification;
	onInteract: (id: string) => void;
};

export const NotificationStreamCardRouter = ({
	notification,
	onInteract,
}: NotificationStreamCardRouterProps): JSX.Element | null => {
	const href = getNotificationHref(notification);

	const handleClick = (): void => {
		if (!notification.isInteracted) {
			onInteract(notification.id);
		}
		if (href) {
			window.location.href = href;
		}
	};

	let card: JSX.Element | null = null;
	switch (notification.notificationSourceType) {
		case "GroupJoinRequestAccepted":
			card = (
				<GroupShellCard
					notificationData={
						notification as unknown as GroupMembershipNotificationData
					}
				/>
			);
			break;
		case "PrivateMessageReceived":
			card = (
				<PrivateMessageShellCard
					notificationData={
						notification as unknown as PrivateMessageNotificationData
					}
				/>
			);
			break;
		case "Test":
			card = (
				<TestShellCard
					notificationData={notification as unknown as TestNotificationData}
				/>
			);
			break;
		case "Sendr":
			return (
				<SendrNotification
					notificationData={notification as unknown as NotificationData}
				/>
			);
		default:
			return null;
	}

	if (!href) {
		return card;
	}
	return (
		<div
			role="button"
			tabIndex={0}
			style={{ cursor: "pointer" }}
			onClick={handleClick}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					handleClick();
				}
			}}
		>
			{card}
		</div>
	);
};

export default NotificationStreamCardRouter;
