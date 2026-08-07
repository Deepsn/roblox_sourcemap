import React from "react";
import { Intl } from "Roblox";
import { Button, Notification } from "@rbx/foundation-ui";
import {
	ButtonStyle,
	NotificationTemplateProps,
	VisualItemButton,
	VisualItemMetaAction,
	VisualItemText,
	VisualItemThumbnail,
	VisualItemType,
} from "../../types/NotificationTemplateTypes";
import FoundationSendrMedia from "../FoundationSendrMedia";
import FoundationSendrKebab from "../FoundationSendrKebab";
import isVisualItemAbuseReport from "../../utils/isVisualItemAbuseReport";
import { formatText } from "../../utils/labelUtils";
import { openNotificationStreamAbuseReport } from "../../utils/notificationStreamWindowHost";
import eventConstants from "../../constants/eventConstants";

const spacerTitle = (
	<span aria-hidden style={{ display: "block", width: "100%" }} />
);

const isEmphasis = (button: VisualItemButton): boolean =>
	button.buttonStyle === ButtonStyle.Growth ||
	button.buttonStyle === ButtonStyle.Primary;

export const FoundationNotificationTemplate = ({
	currentState,
	eventTime,
	handleActions,
	handleEventStreamClickEvent,
	isReadOnly,
	notificationData,
}: NotificationTemplateProps): JSX.Element => {
	const { visualItems } = currentState;
	const thumbnailItem: VisualItemThumbnail | undefined =
		visualItems[VisualItemType.Thumbnail]?.[0];
	const textBody: VisualItemText | undefined =
		visualItems[VisualItemType.TextBody]?.[0];
	const buttons: Array<VisualItemButton> =
		visualItems[VisualItemType.Button] ?? [];
	const metaActions: Array<VisualItemMetaAction> =
		visualItems[VisualItemType.MetaAction] ?? [];

	const eventTimeString = eventTime
		? new Intl().getDateTimeFormatter().getFullDate(new Date(eventTime))
		: undefined;

	const showKebab = metaActions.length > 0 && !isReadOnly;
	const showButtons = buttons.length > 0 && !isReadOnly;
	const cardClickable =
		Boolean(textBody?.actions?.length) && !isReadOnly && Boolean(handleActions);

	const onMetaSelect = (action: VisualItemMetaAction): void => {
		if (isVisualItemAbuseReport(action) && notificationData) {
			handleEventStreamClickEvent(
				eventConstants.ReportNotificationOpen,
				action.visualItemType,
				action.clientEventsPayload,
				action.visualItemName,
				notificationData.bundleIndex,
				notificationData.bundleId,
			);
			openNotificationStreamAbuseReport(notificationData);
		} else if (handleActions) {
			handleActions(action);
		}
	};

	const description = (
		<React.Fragment>
			{showKebab && (
				<FoundationSendrKebab
					actions={metaActions}
					onSelect={onMetaSelect}
					ariaLabel="Notification options"
				/>
			)}
			{textBody?.label && formatText(textBody.label)}
			{showButtons && (
				<span style={{ display: "flex", gap: 8, marginTop: 12, width: "100%" }}>
					{buttons.map((button) => (
						<Button
							key={button.label.text}
							className="fill basis-0"
							variant={isEmphasis(button) ? "Emphasis" : "Standard"}
							onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
								event.stopPropagation();
								handleActions?.(button);
							}}
						>
							{button.label.text}
						</Button>
					))}
				</span>
			)}
		</React.Fragment>
	);

	return (
		<Notification
			style={{ textAlign: "left" }}
			media={
				thumbnailItem ? (
					<FoundationSendrMedia thumbnailItem={thumbnailItem} />
				) : undefined
			}
			title={
				textBody?.title ? (
					<React.Fragment>{formatText(textBody.title)}</React.Fragment>
				) : (
					spacerTitle
				)
			}
			description={description}
			timestamp={eventTimeString}
			onClick={
				cardClickable && textBody ? () => handleActions?.(textBody) : undefined
			}
		/>
	);
};

export default FoundationNotificationTemplate;
