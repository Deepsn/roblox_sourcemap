import { Fragment, useEffect, useState } from "react";
import type { ElementType } from "react";
import { GameDetailsTabs } from "../gameData/constants/gameDetailConstants";
import useCurrentTab from "../gameData/hooks/useCurrentTab";
import { isEnabled as isPlusEnabled } from "@rbx/core-scripts/meta/subscription";
import MigrationServerListContainer from "../../ts/serverList/components/MigrationServerListContainer";
import ServerListContainerV1 from "../../ts/serverList/components/ServerListContainer";

// withTranslations HOC injects `translate` but its generic types don't strip it from P
// @ts-expect-error TODO(SUBS-4712): fix withTranslations return type to omit injected props
const LegacyServerList: React.ComponentType = ServerListContainerV1;

type AppProps = {
	sheetComponent?: ElementType;
};

function App({ sheetComponent }: AppProps) {
	const [shouldRender, setShouldRender] = useState(false);
	const currentTab = useCurrentTab();

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

	return isPlusEnabled() ? (
		<MigrationServerListContainer sheetComponent={sheetComponent} />
	) : (
		<LegacyServerList />
	);
}

export default App;
