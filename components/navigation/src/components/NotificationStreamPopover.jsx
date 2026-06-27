import { useRef } from "react";
import PropTypes from "prop-types";
import { Popover } from "@rbx/core-ui/legacy/react-style-guide";
import { eventStreamService } from "@rbx/core-scripts/legacy/core-roblox-utilities";
import { formatNumber } from "@rbx/core-scripts/format/number";
import { useUnreadNotificationCount } from "../hooks/useUnreadNotificationCount";
import NotificationStreamIcon from "../containers/NotificationStreamIcon";
import NotificationStreamBase from "../containers/NotificationStreamBase";
import events from "../constants/notificationsEventStreamConstants";

function NotificationStreamPopover({ translate }) {
	const ref = useRef();
	const unreadCount = useUnreadNotificationCount();

	const formattedCount = formatNumber(unreadCount);
	const ariaLabel =
		unreadCount > 0
			? translate("Label.sNotificationsCount", {
					notificationCount: formattedCount,
				}) || `Notifications: ${formattedCount}`
			: translate("Label.sNotifications") ||
				"Notifications"; /* TODO: remove fallback once Label.sNotifications is added to CommonUI.Features */

	return (
		<li
			id="navbar-stream"
			ref={ref}
			className="navbar-icon-item navbar-stream notification-margins"
		>
			<Popover
				id="notification-stream-popover"
				trigger="click"
				placement="bottom"
				closeOnClick={false}
				button={
					<button
						type="button"
						className="btn-uiblox-common-common-notification-bell-md"
						aria-label={ariaLabel}
						aria-haspopup="true"
					>
						<NotificationStreamIcon />
					</button>
				}
				container={ref.current}
				onExit={() => {
					window.dispatchEvent(
						new Event("Roblox.NotificationStream.StreamClosed"),
					);
					eventStreamService.sendEventWithTarget(
						events.onExit.name,
						events.onExit.context,
						events.onExit.additionalProperties,
					);
				}}
				role="menu"
			>
				<NotificationStreamBase />
			</Popover>
		</li>
	);
}

NotificationStreamPopover.propTypes = {
	translate: PropTypes.func.isRequired,
};

export default NotificationStreamPopover;
