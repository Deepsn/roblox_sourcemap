import { Fragment, useEffect, useState } from "react";
import type { ElementType } from "react";
import { Loading } from "@rbx/core-ui";
import { GameDetailsTabs } from "../gameData/constants/gameDetailConstants";
import useCurrentTab from "../gameData/hooks/useCurrentTab";
import { isEnabled as isPlusEnabled } from "@rbx/core-scripts/meta/subscription";
import MigrationServerListContainer from "../../ts/serverList/components/MigrationServerListContainer";
import ServerListContainerV1 from "../../ts/serverList/components/ServerListContainer";
import usePublicServerListV2Experiment from "../../ts/serverList/hooks/usePublicServerListV2Experiment";

// withTranslations HOC injects `translate` but its generic types don't strip it from P
// @ts-expect-error TODO(SUBS-4712): fix withTranslations return type to omit injected props
const LegacyServerList: React.ComponentType<{
	isPublicServerListV2Enabled: boolean;
}> = ServerListContainerV1;

type AppProps = {
	sheetComponent?: ElementType;
};

function App({ sheetComponent }: AppProps) {
	const [shouldRender, setShouldRender] = useState(false);
	const currentTab = useCurrentTab();

	// Read the V2 experiment once here, at the common parent of both server-list
	// containers. The resolved flag is threaded down as a prop so the containers
	// pick the correct public endpoint on their very first render — otherwise each
	// container would default to `false` while the flag loads and fire the legacy
	// fetch before the flag resolves (a race that surfaces on slow networks).
	// Exposure is only logged when the list is actually rendered.
	const willRenderList = !currentTab || shouldRender;
	const { isPublicServerListV2Enabled, isLoading: isExperimentLoading } =
		usePublicServerListV2Experiment(willRenderList);

	// The mobile page for server list doesn't have a horizontal tab bar.
	// We should ensure we are allowing these to display if no tabs are found.
	useEffect(() => {
		// Once we render once, render forever — no need to un-mount when the page hash changes.
		if (!shouldRender) {
			if (currentTab === GameDetailsTabs.GameInstances) {
				setShouldRender(true);
			}
		}
	}, [currentTab, shouldRender]);

	// Conditional rendering / mounting only happens in a tabbed view.
	// If there is not a current tab, we should render the page.
	if (currentTab && !shouldRender) {
		return <Fragment />;
	}

	// Hold render until the experiment resolves so the containers never fetch the
	// public list with a not-yet-loaded (default) flag value.
	if (isExperimentLoading) {
		return <Loading />;
	}

	return isPlusEnabled() ? (
		<MigrationServerListContainer
			sheetComponent={sheetComponent}
			isPublicServerListV2Enabled={isPublicServerListV2Enabled}
		/>
	) : (
		<LegacyServerList
			isPublicServerListV2Enabled={isPublicServerListV2Enabled}
		/>
	);
}

export default App;
