import React, { useCallback, useState } from "react";
import { EnvironmentUrls } from "Roblox";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@rbx/core-scripts/react";
import {
	NotificationLocalizationProvider,
	useNotificationLocalization,
} from "../sendrNotificationStream/context/NotificationsLocalization";
import { NotificationStreamList } from "../notificationStreamList";
import {
	useGetRecentNotifications,
	useMarkInteracted,
	useNotificationStreamRealtime,
} from "../notificationStreamData";
import { NotificationStreamCardRouter } from "./NotificationStreamCardRouter";
import NotificationStreamModalContainer from "../sendrNotificationStream/containers/NotificationStreamModalContainer";
import { SendrTemplateContext } from "../sendrNotificationStream/context/SendrTemplateContext";
import "./notificationStreamShell.scss";

const { websiteUrl } = EnvironmentUrls;
const SETTINGS_LINK = `${websiteUrl}/my/account#!/notifications`;
const MAX_HEIGHT = 420;

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
	const markInteracted = useMarkInteracted();
	const [bannerVisible, setBannerVisible] = useState(false);

	useNotificationStreamRealtime({
		onNewNotification: () => setBannerVisible(true),
		onNotificationRevoked: () => {
			refetch();
		},
	});

	const reload = useCallback(() => {
		setBannerVisible(false);
		refetch();
	}, [refetch]);

	const renderItem = useCallback(
		(notification: (typeof notifications)[number]) => (
			<div style={{ marginBottom: 8 }}>
				<NotificationStreamCardRouter
					notification={notification}
					onInteract={(id: string) => markInteracted.mutate(id)}
				/>
			</div>
		),
		[markInteracted],
	);

	return (
		<SendrTemplateContext.Provider value>
			<div className={themeClass}>
				<div className="notification-stream-base builder-font">
					<div className="notification-stream-header">
						<span className="text-label font-caption-header">
							{translate("Label.Notifications")}
						</span>
						<a className="text-link font-caption-header" href={SETTINGS_LINK}>
							{translate("Label.Settings")}
						</a>
					</div>

					{bannerVisible && (
						<div className="small notification-stream-banner banner-new on">
							<span
								className="banner-text"
								role="button"
								tabIndex={0}
								onClick={reload}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										reload();
									}
								}}
							>
								{translate("Label.Notifications")}
							</span>
							<span
								className="icon-close-white"
								role="button"
								aria-label="Close"
								tabIndex={0}
								onClick={() => setBannerVisible(false)}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										setBannerVisible(false);
									}
								}}
							/>
						</div>
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
								fetchNextPage();
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
