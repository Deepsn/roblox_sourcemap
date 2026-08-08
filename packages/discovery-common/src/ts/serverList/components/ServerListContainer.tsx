import React from "react";
import { Loading } from "@rbx/core-ui";
import { withTranslations, TranslateFunction } from "@rbx/core-scripts/react";
import { authenticatedUser } from "@rbx/core-scripts/legacy/header-scripts";
import ErrorContainer from "../../common/components/ErrorContainer";
import useServerListMetadata from "../hooks/useServerListMetadata";
import serverListConstants from "../../../js/serverList/constants/serverListConstants";
// @ts-expect-error legacy JS module without type declarations
import PrivateServerList from "../../../js/serverList/containers/PrivateServerList";
// @ts-expect-error legacy JS module without type declarations
import RunningGameServers from "../../../js/serverList/containers/RunningGameServers";
import serverListService from "../../../js/serverList/services/serverListService";
import translationConfig from "../../../js/serverList/translation.config";

const { serverListTypes, resources } = serverListConstants;

type TServerListContainerProps = {
	translate: TranslateFunction;
	// Resolved by the parent (App) before this container mounts, so the public
	// endpoint is selected correctly on first render.
	isPublicServerListV2Enabled?: boolean;
};

const ServerListContainer = ({
	translate,
	isPublicServerListV2Enabled = false,
}: TServerListContainerProps): JSX.Element => {
	const { serverListMetadata, isLoading, hasError, refetchServerListMetadata } =
		useServerListMetadata();
	const isAuthenticated = authenticatedUser?.isAuthenticated ?? false;

	const publicGetGameServers = isPublicServerListV2Enabled
		? serverListService.getPublicGameInstancesV2
		: serverListService.getPublicGameInstances;

	if (isLoading) {
		return <Loading />;
	}

	if (hasError || !serverListMetadata) {
		return (
			<ErrorContainer
				errorSubtext={translate(resources.serversFailedToLoadText)}
				onRefresh={refetchServerListMetadata}
			/>
		);
	}

	return (
		<React.Fragment>
			<PrivateServerList
				serverListMetadata={serverListMetadata}
				// Filled in by withTranslations hook in the parent component
				translate={undefined}
				intl={undefined}
			/>
			<RunningGameServers
				type={serverListTypes.friend.key}
				getGameServers={serverListService.getFriendsGameInstances}
				headerTitleResource={resources.friendsServersTitle}
				serverListMetadata={serverListMetadata}
				// Filled in by withTranslations hook in the RunningGameServers component
				translate={undefined}
			/>
			<RunningGameServers
				type={serverListTypes.public.key}
				getGameServers={publicGetGameServers}
				headerTitleResource={resources.publicServersTitle}
				serverListMetadata={serverListMetadata}
				isAuthenticated={isAuthenticated}
				isPublicServerListV2Enabled={isPublicServerListV2Enabled}
				// Filled in by withTranslations hook in the RunningGameServers component
				translate={undefined}
			/>
		</React.Fragment>
	);
};

export default withTranslations(
	ServerListContainer,
	translationConfig.serverList,
);
