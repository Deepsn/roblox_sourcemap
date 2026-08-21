import React, { useCallback, useEffect, useState } from "react";
import environmentUrls from "@rbx/environment-urls";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@rbx/core-scripts/react";
import NotificationStreamBanner from "./NotificationStreamBanner";
import {
	NotificationLocalizationProvider,
	useNotificationLocalization,
} from "../sendrNotificationStream/context/NotificationsLocalization";
import { NotificationStreamList } from "../notificationStreamList";
import {
	useGetRecentNotifications,
	useMarkInteracted,
	useRemoveNotification,
	useNotificationStreamRealtime,
	useNotificationStreamConnection,
	sendUnreadCta,
	sendStreamEvent,
	streamEvents,
	streamContexts,
} from "../notificationStreamData";
import { NotificationStreamCardRouter } from "./NotificationStreamCardRouter";
import { reportNotificationStreamError } from "../notificationStreamData/notificationStreamObservability";
import NotificationStreamModalContainer from "../sendrNotificationStream/containers/NotificationStreamModalContainer";
import { SendrTemplateContext } from "../sendrNotificationStream/context/SendrTemplateContext";
import "./notificationStreamShell.scss";

const { websiteUrl } = environmentUrls;
const SETTINGS_LINK = `${websiteUrl}/my/account#!/notifications`;
const MAX_HEIGHT = 600;

export type NotificationStreamShellProps = {
	themeClass?: string;
};

const NotificationStreamShellInner = ({
	themeClass,
}: NotificationStreamShellProps): JSX.Element => {
	const translate = useNotificationLocalization();
	const {
		notifications,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		refetch,
	} = useGetRecentNotifications();
	const { isConnectionLost } = useNotificationStreamConnection();
	const markInteracted = useMarkInteracted();
	const removeNotification = useRemoveNotification();
	const [bannerVisible, setBannerVisible] = useState(false);
	const [newCount, setNewCount] = useState(0);
	const [errorDismissed, setErrorDismissed] = useState(false);

	const fireAndReport = useCallback(
		(run: () => Promise<unknown>, scope: string) => {
			try {
				Promise.resolve(run()).catch((error: unknown) =>
					reportNotificationStreamError(scope, error),
				);
			} catch (error) {
				reportNotificationStreamError(scope, error);
			}
		},
		[],
	);

	useNotificationStreamRealtime({
		onNewNotification: () => {
			setNewCount((count) => {
				const next = count + 1;
				sendUnreadCta(next, true);
				return next;
			});
			setBannerVisible(true);
		},
		onNotificationRevoked: () => {
			fireAndReport(refetch, "streamRevokedRefetch");
		},
	});

	const dismissBanner = useCallback(() => {
		setBannerVisible(false);
		setNewCount(0);
	}, []);

	const reload = useCallback(() => {
		dismissBanner();
		fireAndReport(refetch, "streamBannerReload");
	}, [dismissBanner, refetch, fireAndReport]);

	// A dismissed error banner must reappear on the next disconnect, so reset once reconnected.
	useEffect(() => {
		if (!isConnectionLost) {
			setErrorDismissed(false);
		}
	}, [isConnectionLost]);

	const renderItem = useCallback(
		(notification: (typeof notifications)[number]) => (
			<div style={{ marginBottom: 8 }}>
				<NotificationStreamCardRouter
					notification={notification}
					onInteract={(id: string) => markInteracted.mutate(id)}
					onRemove={removeNotification}
					onActionFailed={() => {
						fireAndReport(refetch, "streamActionFailedRefetch");
					}}
				/>
			</div>
		),
		[markInteracted, removeNotification, refetch, fireAndReport],
	);

	return (
		<SendrTemplateContext.Provider value>
			<div className={themeClass}>
				<div className="notification-stream-base builder-font">
					<div className="notification-stream-header">
						<span className="text-label font-caption-header">
							{translate("Label.Notifications")}
						</span>
						<a
							className="text-link font-caption-header"
							href={SETTINGS_LINK}
							onClick={() =>
								sendStreamEvent(
									streamEvents.goToSettingPage,
									streamContexts.click,
									{
										sendrVersion: 0,
									},
								)
							}
						>
							{translate("Label.Settings")}
						</a>
					</div>

					{bannerVisible && (
						<NotificationStreamBanner
							variant="new"
							message={translate("Message.NumberofNewNotifications", {
								notificationCount: newCount,
							})}
							onClick={reload}
							onDismiss={dismissBanner}
						/>
					)}

					{isConnectionLost && !errorDismissed && (
						<NotificationStreamBanner
							variant="error"
							message={translate("Label.NoNetworkConnectionText")}
							onDismiss={() => setErrorDismissed(true)}
						/>
					)}

					<div style={{ position: "relative" }}>
						<NotificationStreamList
							className="notification-stream-scroll"
							items={notifications}
							getKey={(notification) => notification.id}
							renderItem={renderItem}
							hasMore={Boolean(hasNextPage)}
							isLoading={isLoading || isFetchingNextPage}
							onLoadMore={() => {
								fireAndReport(fetchNextPage, "streamFetchNextPage");
							}}
							loadingIndicator={<span className="spinner spinner-sm" />}
							emptyState={
								<span className="text">{translate("Label.AllCaughtUp")}</span>
							}
							maxHeight={MAX_HEIGHT}
							ariaLabel={translate("Label.Notifications")}
						/>
						<NotificationStreamModalContainer />
					</div>
				</div>
			</div>
		</SendrTemplateContext.Provider>
	);
};

export const NotificationStreamShell = ({
	themeClass,
}: NotificationStreamShellProps): JSX.Element => (
	<QueryClientProvider client={queryClient}>
		<NotificationLocalizationProvider>
			<NotificationStreamShellInner themeClass={themeClass} />
		</NotificationLocalizationProvider>
	</QueryClientProvider>
);

export default NotificationStreamShell;
